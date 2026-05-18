// AI-powered EOD price lookup.
//
// Vercel serverless function that calls the Anthropic Messages API with web
// search enabled and asks Claude for the most recent end-of-day closing
// prices for the futures contracts shown on the main page.
//
// Requires the ANTHROPIC_API_KEY env var to be set in the Vercel project.
// Without it, returns 503 and the front-end falls back to seed prices with
// status "OFFLINE".

const SYMBOLS = [
  { sym: 'ES',  name: 'S&P 500 e-mini front month' },
  { sym: 'NQ',  name: 'NASDAQ 100 e-mini front month' },
  { sym: 'YM',  name: 'Dow Jones e-mini front month' },
  { sym: 'RTY', name: 'Russell 2000 e-mini front month' },
  { sym: 'GC',  name: 'COMEX Gold front month' },
  { sym: 'MGC', name: 'Micro Gold front month' },
  { sym: 'CL',  name: 'WTI Crude Oil front month' },
  { sym: 'SI',  name: 'COMEX Silver front month' },
  { sym: 'VX',  name: 'CBOE VIX front month' }
];

const ANTHROPIC_MODEL = 'claude-opus-4-7';
const REQUEST_TIMEOUT_MS = 50_000;

module.exports = async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({
      error: 'ai eod lookup not configured',
      hint: 'set ANTHROPIC_API_KEY in the vercel project environment'
    });
  }

  // EOD prices are stable for hours after the session close. Edge-cache the
  // response so we're not paying for a Claude call on every page load.
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=43200');

  const symList = SYMBOLS.map((s) => s.sym + ' (' + s.name + ')').join(', ');
  const exampleShape = SYMBOLS.reduce(function (acc, s) {
    acc[s.sym] = 0;
    return acc;
  }, {});

  const prompt =
    'Use web search to find the most recent end-of-day (EOD) settlement / ' +
    'closing prices for these CME front-month futures contracts. ' +
    'Symbols: ' + symList + '. ' +
    'Search authoritative sources (CME, Barchart, Investing.com, Reuters, ' +
    'TradingView). Use the most recent close you can find. ' +
    'Respond with ONLY a strict JSON object keyed by symbol — no prose, ' +
    'no markdown fences, no commentary, no explanation. ' +
    'Use plain numbers without commas or units. ' +
    'Example shape (zeros are placeholders, replace with real values): ' +
    JSON.stringify(exampleShape);

  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        system:
          'You look up market data via web search and return strict JSON. ' +
          'Never include prose, markdown fences, or commentary — only the ' +
          'JSON object itself.',
        tools: [
          { type: 'web_search_20260209', name: 'web_search', max_uses: 5 }
        ],
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(function () { return ''; });
      console.warn('anthropic api error', upstream.status, errText.slice(0, 500));
      return res.status(502).json({
        error: 'upstream error',
        status: upstream.status
      });
    }

    const data = await upstream.json();
    let text = '';
    if (Array.isArray(data.content)) {
      for (let i = 0; i < data.content.length; i++) {
        if (data.content[i].type === 'text') text += data.content[i].text;
      }
    }

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(502).json({
        error: 'no JSON object in model response',
        raw_preview: text.slice(0, 200)
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch (e) {
      return res.status(502).json({ error: 'invalid JSON in model response' });
    }

    const prices = {};
    SYMBOLS.forEach(function (s) {
      const v = parsed[s.sym];
      if (typeof v === 'number' && isFinite(v)) {
        prices[s.sym] = v;
      } else if (typeof v === 'string') {
        const cleaned = Number(v.replace(/[, $]/g, ''));
        if (isFinite(cleaned)) prices[s.sym] = cleaned;
      }
    });

    return res.status(200).json({
      prices: prices,
      fetched_at: new Date().toISOString(),
      model: ANTHROPIC_MODEL
    });
  } catch (e) {
    const aborted = e && (e.name === 'AbortError' || e.code === 'ABORT_ERR');
    console.warn('eod lookup failed', aborted ? 'timeout' : (e && e.message));
    return res.status(aborted ? 504 : 500).json({
      error: aborted ? 'upstream timeout' : 'eod lookup failed'
    });
  } finally {
    clearTimeout(timer);
  }
};

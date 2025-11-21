// api/log-chat.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res
      .status(405)
      .json({ ok: false, message: 'Method not allowed. Use POST.' });
  }

  // Lấy URL Apps Script từ biến môi trường
  const SCRIPT_URL = process.env.SCRIPT_URL;

  if (!SCRIPT_URL) {
    return res.status(500).json({
      ok: false,
      message: 'Missing SCRIPT_URL environment variable'
    });
  }

  let body = req.body;

  // Nếu body là string, parse lại JSON
  if (!body || typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (_) {
      body = {};
    }
  }

  const { prompt, response, model } = body || {};

  if (!prompt || !response || !model) {
    return res.status(400).json({
      ok: false,
      message: 'prompt, response, model are required'
    });
  }

  try {
    // Forward sang Apps Script Web App
    const gsRes = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, response, model })
    });

    const raw = await gsRes.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch (_) {
      data = { raw };
    }

    return res.status(gsRes.status).json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({
      ok: false,
      message: 'Proxy error when calling Apps Script',
      error: String(err)
    });
  }
};

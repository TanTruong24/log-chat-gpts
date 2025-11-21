// api/log-chat.js

// URL Apps Script Web App của bạn (đã có /exec ở cuối)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKCOACX3MnZVQA3R1-mcJLnTRs-_nv91VE3BxWaIn1aRPJX1U7d9Tqy1tv1jXzq_QXJA/exec';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res
      .status(405)
      .json({ ok: false, message: 'Method not allowed. Use POST.' });
  }

  let body = req.body;

  // Trường hợp body là string (tùy môi trường), parse lại JSON
  if (!body || typeof body === 'string') {
    try {
      body = body ? JSON.parse(body) : {};
    } catch (e) {
      body = {};
    }
  }

  const { prompt, response, model } = body || {};

  if (!prompt || !response || !model) {
    return res.status(400).json({
      ok: false,
      message: 'prompt, response, model are required',
    });
  }

  try {
    // Gửi sang Apps Script
    const gsRes = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, response, model }),
    });

    const text = await gsRes.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }

    return res.status(gsRes.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({
      ok: false,
      message: 'Proxy error when calling Apps Script',
      error: String(err),
    });
  }
};

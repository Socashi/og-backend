const ogs = require('open-graph-scraper');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 👈 CORS erlauben
  res.setHeader('Access-Control-Allow-Methods', 'GET'); // optional, sicherer

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL fehlt' });
  }

  try {
    const { error, result } = await ogs({ url });

    if (error || !result.success) {
      return res.status(500).json({ error: 'Fehler beim Abrufen der OG-Daten' });
    }

    res.status(200).json({
      title: result.ogTitle || '',
      image: result.ogImage?.url || '',
    });
  } catch (e) {
    console.error('Fehler bei OG:', e);
    res.status(500).json({ error: 'Interner Fehler beim Abrufen der OG-Daten' });
  }
};

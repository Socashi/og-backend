module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL fehlt' });
  }

  try {
    const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    const result = await response.json();

    if (result.status !== 'success' || !result.data) {
      return res.status(500).json({ error: 'Fehler beim Abrufen der OG-Daten' });
    }

    const { title, image } = result.data;

    res.status(200).json({
      title: title || 'Kein Titel gefunden',
      image: image?.url || '',
    });
  } catch (e) {
    console.error('Microlink-Fehler:', e);
    res.status(500).json({ error: 'Interner Fehler beim Abrufen der OG-Daten' });
  }
};

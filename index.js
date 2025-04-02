const ogs = require('open-graph-scraper');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL fehlt' });
  }

  try {
    const options = {
      url,
      followAllRedirects: true,
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    };

    const { error, result } = await ogs(options);

    if (error || !result.success) {
      return res.status(500).json({ error: 'Fehler beim Abrufen der OG-Daten' });
    }

    res.status(200).json({
      title: result.ogTitle || '',
      image: result.ogImage?.url || '',
    });
  } catch (e) {
    console.error('Fehler:', e.message);
    res.status(500).json({ error: 'Interner Fehler beim Abrufen der OG-Daten' });
  }
};

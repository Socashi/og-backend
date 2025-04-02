const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/preview', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL fehlt' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const title =
      $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const image = $('meta[property="og:image"]').attr('content') || '';

    if (!title && !image) {
      return res.status(404).json({ error: 'Keine OG-Daten gefunden' });
    }

    res.json({ title, image });
  } catch (error) {
    console.error('❌ Scraping Fehler:', error.message);
    res.status(500).json({ error: 'Interner Fehler beim Abrufen der OG-Daten' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Eigenes OG-Backend läuft auf http://localhost:${PORT}`);
});

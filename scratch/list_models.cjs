const https = require('https');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const apiKey = env.match(/GEMINI_API_KEY="?([^"\s]+)"?/)[1];

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.models) {
        parsed.models.forEach(m => console.log(m.name));
      } else {
        console.log(data);
      }
    } catch (e) { console.log(data); }
  });
});

const https = require('https');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const apiKey = env.match(/GEMINI_API_KEY="?([^"\s]+)"?/)[1];

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(JSON.stringify(JSON.parse(data), null, 2));
  });
}).on('error', (err) => {
  console.error("Error: " + err.message);
});

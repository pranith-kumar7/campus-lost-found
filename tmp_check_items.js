const http = require('http');
const url = 'http://localhost:5000/api/items';

http.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log('TYPE', Array.isArray(parsed) ? 'array' : typeof parsed);
      if (Array.isArray(parsed)) console.log('LENGTH', parsed.length);
      else console.log(parsed);
    } catch (err) {
      console.error('PARSE ERROR', err.message);
      console.log(data);
    }
  });
}).on('error', (err) => {
  console.error('ERROR', err.message);
});

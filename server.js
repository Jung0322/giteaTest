
const express = require('express');

const PORT = 8888;
const HOST = '0.0.0.0';

const app = express();
app.use('/', express.static(__dirname + '/dist'));

// app.get('/api/my/ip', (req, res) => {
//   res.send(req.ip);
// });

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(PORT, HOST);
// console.log(`Running on http ${HOST}:${PORT}`);
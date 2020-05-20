const express = require('express');
const app = express();
const path = require('path')
const port = 5999;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/500-error', function(req, res) {
  res.sendFile(__dirname + '/public/500-error/index.html');
});

app.listen(port);
console.log ('listening on port ' + port);
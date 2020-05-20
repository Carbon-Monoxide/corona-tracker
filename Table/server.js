const express = require('express');
const app = express();
let port = 5999;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(port);
console.log ('listening on port ' + port);
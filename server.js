var http = require('http');

var url = 'http://google.com';

var body = '<p>Redirecting to <a href="' + url + '">' + url + '</a></p>';

var server = http.createServer(function(req, res) {
  // res.write('Hello world');
  res.setHeader('Location', url);
  res.setHeader('Content-Length', body.length);
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 302;
  res.end(body);
});

server.listen(3000);
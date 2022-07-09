const http = require('http');
const host = '127.0.0.1';
const port = 8000;

const server = http.createServer((req,res) => {
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World!');
});

server.listen(port,host,() => {
	console.log(`http://${host}:${port}/`);
});
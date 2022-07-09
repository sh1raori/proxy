const cluster = require('cluster');
const http = require('http');
const fs = require('fs');
const numCPU = 2; //na moem noyte
var url = require("url");
const host = '127.0.0.1';
const port = 8000;


if (cluster.isMaster) {
  for (let i = 0; i < numCPU; i++) cluster.fork();
  cluster.on('exit', (worker, code) => {
    console.log( `Worker ${worker.id} finished. Exit code: ${code}`);
  });
} else {
	http.createServer(onRequest).listen(8000);

  function onRequest(client_req, client_res) {

        var ip = client_req.connection.remoteAddress;
        var url_info  = url.parse(client_req.url);

        var options = {
        hostname: url_info.hostname,
        port: url_info.port,
        path: url_info.path,
        method: client_req.method,
        headers: client_req.headers
        };

    var proxy = http.request(options, function (res) {
      client_res.writeHead(res.statusCode, res.headers)
      res.pipe(client_res, {
        end: true
      });
    });

    client_req.pipe(proxy, {
      end: true
    });

        var date = new Date();
        var curren_date = date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' + (date.getDate());
        var current_time = (date.getHours()) + ':' +
        (date.getMinutes()) + ':' + (date.getSeconds());
        var inf = '[' + curren_date + ' ' + current_time + '] ' + ip + ' ' + ` ${client_req.method}` + ' ' + client_req.url;
         fs.appendFile('log.txt', inf + '\n', function(err) {
      if (err) {
        return console.log(err);
      } else {
        console.log(`${inf} saved!`);
      }
	});

}
}

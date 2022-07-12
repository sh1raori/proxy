const cluster = require('cluster');
const http = require('http');
const fs = require('fs');
// const numCPU = 2; //na moem noyte
var url = require("url");
var os = require("os");
const host = '127.0.0.1';
const port = 8000;


if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
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
        var date1 = date.getDate();
        if (date1 < 10){date1 = '0' + date1;}
        var curren_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date1);
        var hour1 = date.getHours();
        if (hour1 < 10){hour1 = '0' + hour1;}
        var min1 = date.getMinutes();
        if (min1 < 10){min1 = '0' + min1;}
        var sec1 = date.getSeconds();
        if (sec1 < 10){sec1 = '0' + sec1;}
        var current_time = (hour1) + ':' + (min1) + ':' + (sec1);
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

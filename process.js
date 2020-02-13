const util = require('util');
const execFile = require('child_process').execFile;

let currentPort = 38105;
const httpPort = 80;

const ssArr = [];
function getAnotherInstance() {
  if (ssArr.length){
    console.log("ssArr.length:" + ssArr.length);
    ssArr.shift().kill('SIGHUP');
  }
   let ab = execFile('ssserver', ['-c', 'ss.json', '-p', ++currentPort], (error, stdout, stderr) => {
    if (error) {
      console.log("killed:", error.killed);
      if (!error.killed){
        setTimeout(() => {
          getAnotherInstance();
        }, 100);
      }
      return;
    }
  });
  // ab.on('close', (code) => {
  //   console.log(`child process close all stdio with code ${code}`);
  // });
  ssArr.push(ab);
}
getAnotherInstance();

const http = require('http');

// Create an HTTP server
const srv = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  if (req.url == '/change') {
    getAnotherInstance();
  }
  res.end(":"+currentPort);
});
srv.listen(httpPort);
console.log("server listen at port " + httpPort);

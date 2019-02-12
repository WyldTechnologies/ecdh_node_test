var http = require("http");

var sleep = require('system-sleep');

var crypto = require('crypto');
const CURVE = 'secp384r1';

const userauth = crypto.createECDH(CURVE);
userauth.setPrivateKey('EcZd/eOE2KxbJ0ZZuigms5HIp7PRxNsa4CAhACcZX2cvO57vyxFT6f/cSAits/7G','base64');

const svrauth = crypto.createECDH(CURVE);
svrauth.setPrivateKey('heh3i2C0vLjtY/t7Z0/LJsRMM0La9QDFdLqCxd3fuewJ/KmBBRZ3EDp+qpof9x/e','base64');


let port = 5081;
let ipport = (port == 80)?'':":"+port;
let hostName = '127.0.0.1'
let hostport = hostName + ipport;
let urlPath  = '/player';
const data = JSON.stringify({
  todo: 'Buy the milk'
});


//console.log("Signed Headers: ", headers)
//var headers = ['x-wtl-ts','credential'];
var dicHeaders = {'x-wtl-ts': Date.now(),
  'credential': 'myers.gene@gmail.com'};

var verb = 'POST';
var protocol = 'http';

// var SvrPubKey = svrauth.getPublicKey('base64','compressed');
// const shared_secret = userauth.computeSecret(Buffer.from(SvrPubKey, 'base64'), 'base64', 'base64');
// console.log("Shared Secret: " + shared_secret + " Length: " + shared_secret.length);

var shared_secret = 'xJl3ooJMjzKDvbNDU2ZTBNwlGxL7PRHSfS0LgJUJyTQWXtRmwHaH+8g+M7s/ZIDv';

var opts = createHMACHeader(shared_secret,dicHeaders,verb,protocol,data);

var req = http.request(opts, function(res) {

  console.log('Status: ' + res.statusCode);
  console.log('Headers: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');


  res.on('data', function (body) {
    console.log('Body: ' + body);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
//req.writeHead(200,options)
req.write(data); // ("");
req.end();


function createHMACHeader(shared_secret,dicHeaders,verb,protocol,data) {

  var headers = Object.keys(dicHeaders);
  verb = verb.toUpperCase();
  protocol = protocol.toLowerCase();
  //var h = dicHeaders.keys();

  var headerString="";
  headers.forEach(function(header) {
    //console.log(header + ": '" + req.headers['x-wtl-ts'] +"'");
    if (!headerString=="") headerString += ', ' ;
    headerString += ("'" + header + "': '" + dicHeaders[header] + "'");
    //console.log(headerString);
  });

  //let headerString = "";
  let body = JSON.stringify(data);//JSON.stringify(data);
  //this is the core logic- how the digest is formed
  var msgdigest = verb + " /\nhost: " + protocol + "://" + hostport + " /\nuri: '" + urlPath +
                 "'/\nheaders: " + headerString  + "/\nbody: " + body;
  console.log("msgdigest: \n" + msgdigest);
  console.log("msgdigest length: ", msgdigest.length)

  let hmac = crypto.createHmac('sha256', shared_secret).update(msgdigest).digest('hex')
  console.log("Auth Signature: ",hmac);

  //sleep (1000*60*10); //10 mins

  return options = {
    hostname: hostName,
    port: port,
    path: urlPath,
    method: verb,
    headers: {
        'content-type': 'application/json',
        'authorization' : 'WTL1-HMAC-SHA256',   //REQUIRED- this method has an accompanying method that sets up the data- this versions the methods
        'credential' : dicHeaders['credential'],  //REQUIRED- the email address in the Web portal, the DIUID on the mobile- used to retrieve the (SharedSecret)PubKey
        'x-wtl-ts' : dicHeaders['x-wtl-ts'], //REQUIRED - Timestamp- NOW
        'signedheaders' : headers.join(';'), //REQUIRED - semi-colon delimited - minimum x-wtl-ts, 'host' is assumed &  credential
        "signature" : hmac  //REQUIRED - the hmac to compare
    }
  };
}

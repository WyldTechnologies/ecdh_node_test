const http = require('http');
var crypto = require('crypto');

var dicHeaders = {'x-wtl-ts': Date.now(),
  'credential': 'myers.gene@gmail.com'};

let port = 5081;
let ipport = (port == 80)?'':":"+port;
let hostName = '127.0.0.1'
let hostport = hostName + ipport;
let urlPath  = '/test';

var verb = 'GET';
var protocol = 'http';

var shared_secret = 'xJl3ooJMjzKDvbNDU2ZTBNwlGxL7PRHSfS0LgJUJyTQWXtRmwHaH+8g+M7s/ZIDv';

var opts = createHMACHeader(shared_secret,dicHeaders,verb,protocol,"");
//console.log("HERE");
//http.request(opts, (resp) => {
var req = http.request(opts, function(res) {

  //console.log("HERE TOO");
  let data = '';

  // A chunk of data has been recieved.
  res.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  res.on('end', () => {
    //console.log("HERE THREE");
    //console.log(">>>" + JSON.parse(data).explanation);


  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

req.write("");
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

// function createHMACHeader(shared_secret,dicHeaders,verb,protocol,data) {
//
//   var headers = Object.keys(dicHeaders);
//   verb = verb.toUpperCase();
//   protocol = protocol.toLowerCase();
//   //var h = dicHeaders.keys();
//
//   var headerString="";
//   headers.forEach(function(header) {
//     //console.log(header + ": '" + req.headers['x-wtl-ts'] +"'");
//     if (!headerString=="") headerString += ', ' ;
//     headerString += ("'" + header + "': '" + dicHeaders[header] + "'");
//     //console.log(headerString);
//   });
//
//   //let headerString = "";
//   let body = JSON.stringify(data);//JSON.stringify(data);
//   //this is the core logic- how the digest is formed
//   var msgdigest = verb + " /\nhost: " + protocol + "://" + hostport + " /\nuri: '" + urlPath +
//                  "'/\nheaders: " + headerString  + "/\nbody: " + body;
//   console.log("msgdigest: \n'" + msgdigest + "'");
//   console.log("msgdigest length: ", msgdigest.length)
//
//   let hmac = crypto.createHmac('sha256', shared_secret).update(msgdigest).digest('hex')
//   console.log("Auth Signature: ",hmac);
//
//   return options = {
//     hostname: hostName,
//     port: port,
//     path: urlPath,
//     method: verb,
//     headers: {
//         'content-type': 'application/json',
//         'authorization' : 'WTL1-HMAC-SHA256',   //REQUIRED- this method has an accompanying method that sets up the data- this versions the methods
//         'credential' : dicHeaders['credential'],  //REQUIRED- the email address in the Web portal, the DIUID on the mobile- used to retrieve the (SharedSecret)PubKey
//         'x-wtl-ts' : dicHeaders['x-wtl-ts'], //REQUIRED - Timestamp- NOW
//         'signedheaders' : headers.join(';'), //REQUIRED - semi-colon delimited - minimum x-wtl-ts, 'host' is assumed &  credential
//         "signature" : hmac  //REQUIRED - the hmac to compare
//     }
//   };
// }

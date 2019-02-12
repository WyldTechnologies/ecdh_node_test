//https://stackoverflow.com/questions/33096654/aes-256-produces-different-ciphertexts-in-ios-and-node-js-with-same-password
var crypto = require('crypto');
// var password = "1234567890123456";
// var salt = "gettingsaltyfoo!";
//
// var sha256 = crypto.createHash("sha256");
// sha256.update(salt);
// var hash = sha256.digest();
//
// var key = crypto.pbkdf2Sync(password, hash, 1000, 32, "sha1");

const CURVE = 'secp384r1';
var ALGORITHM = 'aes-256-cbc';

 //ecdh
 const beck = crypto.createECDH(CURVE);
 const alex = crypto.createECDH(CURVE);

 //beck.generateKeys()
 beck.setPrivateKey('EcZd/eOE2KxbJ0ZZuigms5HIp7PRxNsa4CAhACcZX2cvO57vyxFT6f/cSAits/7G','base64');
 var BeckPriKey = beck.getPrivateKey('base64') //this what you'll store
 var BeckPubKey = beck.getPublicKey('base64','compressed')
 //beck.setPrivateKey('EcZd/eOE2KxbJ0ZZuigms5HIp7PRxNsa4CAhACcZX2cvO57vyxFT6f/cSAits/7G','base64');
 console.log("Beck Pri: " + BeckPriKey)
 //console.log("Beck Pub: " + beck.getPublicKey('base64'))
 console.log("Beck CompPub: " + BeckPubKey)

 //alex.generateKeys()
 alex.setPrivateKey('heh3i2C0vLjtY/t7Z0/LJsRMM0La9QDFdLqCxd3fuewJ/KmBBRZ3EDp+qpof9x/e','base64');
 var AlexPriKey = alex.getPrivateKey('base64') //this what you'll store
 var AlexPubKey = alex.getPublicKey('base64','compressed')
 //beck.setPrivateKey('EcZd/eOE2KxbJ0ZZuigms5HIp7PRxNsa4CAhACcZX2cvO57vyxFT6f/cSAits/7G','base64');
 console.log("Alex Pri: " + AlexPriKey)
 //console.log("Beck Pub: " + beck.getPublicKey('base64'))
 console.log("Alex CompPub: " + AlexPubKey)

 const alex_pub = Buffer.from(AlexPubKey, 'base64')
 const beck_pub = Buffer.from(BeckPubKey, 'base64')
 //const alex_pub = Buffer.from('AvLynsdtAt4QTZXNSwkN1W70d6qJ9PQNge7sgJhE/hMGNWvyUkrkzy3NiOd486104w==', 'base64');//Ao8Tueo0xhvruXy+olp+j3eL7zNfaVkfoHAkhpRVA92UUCjF7gWSqLOXPqv909e8fg==', 'base64');




 const beck_secret = beck.computeSecret(alex_pub, 'base64', 'base64')
 console.log("Beck secret: " + beck_secret);
 const beck_secret_hex = beck.computeSecret(alex_pub, 'base64', 'hex')
 console.log("Beck secret HEX: " + beck_secret_hex);

 const alex_secret = alex.computeSecret(beck_pub, 'base64', 'base64')
 console.log("Alex secret: " + alex_secret);
 const alex_secret_hex = alex.computeSecret(beck_pub, 'base64', 'hex')
 console.log("Alex secret HEX: " + alex_secret_hex);

  //CHAINING THE KEY
 // we use our shared secret as our password, then hash it
 //we generate this on the client side in the same way
//let hexKey = crypto.createHash('SHA256').update(beck_secret, 'base64').digest('hex').substring(0,32);
//let password_hash = "1234567890abcdefghijklmnopqrstuv";
//console.log('hexKey=', hexKey); // 098F6BCD4621D373CADE4E832627B4F6


// let iv = new Buffer(16);
// iv.fill(0);

let hexIV = Buffer.from("c60c9f3fcd4c7e6d25215ffa62dcc892", "hex");
console.log('iv=', hexIV.toString('hex'));



let message = "https://www.wyldmesh.net/v1/events/676C655DA4"

let cipher = encrypt(message,beck_secret_hex.substring(0,32),hexIV);
console.log("cipher:", cipher);

let hmac = crypto.createHmac('sha256', beck_secret).update(message).digest('hex')
console.log("signature: ",hmac);

console.log("");
console.log("plainText:", decrypt(cipher,alex_secret_hex.substring(0,32),hexIV));
let hmac2 = crypto.createHmac('sha256', alex_secret).update(message).digest('hex')
console.log("signature: ",hmac2);


function encrypt(_text, _key, _iv){
  var cipher = crypto.createCipheriv(ALGORITHM, _key, _iv);
  var crypted = cipher.update(_text,'utf8','base64');
  crypted += cipher.final('base64');
  return crypted;
}

function decrypt(_text, _key, _iv){
  var decipher = crypto.createDecipheriv(ALGORITHM, _key, _iv);
  var dec = decipher.update(_text,'base64','utf8');
  dec += decipher.final('utf8');
  return dec;
}

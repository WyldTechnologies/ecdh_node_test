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

 // beck.generateKeys()
 beck.setPrivateKey('EcZd/eOE2KxbJ0ZZuigms5HIp7PRxNsa4CAhACcZX2cvO57vyxFT6f/cSAits/7G','base64');

 console.log("Beck Pri: " + beck.getPrivateKey('base64'))
 //console.log("Beck Pub: " + beck.getPublicKey('base64'))
 console.log("Beck CompPub: " + beck.getPublicKey('base64','compressed'))

 const alex_pub = Buffer.from('Ao8Tueo0xhvruXy+olp+j3eL7zNfaVkfoHAkhpRVA92UUCjF7gWSqLOXPqv909e8fg==', 'base64');
 const shared_secret = beck.computeSecret(alex_pub, 'base64', 'base64')
 console.log("Beck secret: " + shared_secret);

 // we use our shared secret as our password, then hash it
 //we generate this on the client side in the same way
let password_hash = crypto.createHash('SHA256').update(shared_secret, 'base64').digest('hex').substring(0,32);//.toUpperCase();
//let password_hash = "1234567890abcdefghijklmnopqrstuv";
console.log('key=', password_hash); // 098F6BCD4621D373CADE4E832627B4F6

var iv = new Buffer(16);
iv.fill(0);



console.log(encrypt("Hello World",password_hash,iv));

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

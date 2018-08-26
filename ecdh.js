"use strict"
const crypto = require('crypto')
const util = require('util')
// Nodejs encryption with CTR
// const aes = require('crypto'),
//     algorithm = 'aes-256-cbc',
//     password = 'd6F3Efeq',
//     iv;

const CURVE = 'secp384r1';
const ALGORITHM = 'AES-256-CBC';

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


// our data to encrypt
let data = "This is the thing that's unnamed";
console.log('data=', data);

// generate initialization vector- Now filled with Zeros
//Should be a random string buffer unique for EVERY bit of info
//we send this with the Encrypted data
//let initVector = new Buffer('RanDoMUniqueValF') //a 32 Char string //RanDoMUniqueValF
let initVector = new Buffer(16);
initVector.fill(0);//"RanDoMUniqueValF";
console.log('iv=', initVector); // 64 char HEX Encoded buffer

// encrypt data
// let cipher = crypto.createCipheriv('aes-256-cbc', password_hash, iv);
// let encryptedData = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
// console.log('encrypted data=', encryptedData.toUpperCase());

//takes text as a UTF8 string but the IV MUST be a HexEncoded buffer
// outenc is the Output Encoding, and can be either 'utf8' or 'hex'
function encrypt(text, outenc, ivin){
  // if (!util.isBuffer(ivin))
  //   throw Error('encrypt method- IV is not a Buffer');
  //console.log('key-enc:',password_hash);
  var cipher = crypto.createCipheriv(ALGORITHM,password_hash, ivin);
  outenc = outenc || "binary";
  var crypted = cipher.update(text,'utf8',outenc)
  crypted += cipher.final(outenc);
  return crypted;
}

//test needs to be a Hex Encoded string, IV is optional(?)
// inenc is the Input Encoding, and can be either 'utf8' or 'hex'
function decrypt(text, inenc, ivin){
  // if (!util.isBuffer(ivin))
  //   throw Error('decrypt method- IV is not a Buffer');
  var decipher = crypto.createDecipheriv(ALGORITHM,password_hash,ivin);
  inenc = inenc || "binary";
  var dec = decipher.update(text,inenc,'utf8')
  dec += decipher.final('utf8');
  return dec;
}

var cipherText = encrypt(data,'hex',initVector);
console.log("cipherText(HEX): " + cipherText);
console.log("cipherText(base64): " + Buffer.from(cipherText, 'hex').toString('base64'));

console.log("Decrypted msg: " + decrypt(cipherText,'hex',initVector));

//Decript from cipher
var test = "427rn3J9M6vxzRUnoAg5d+RGRAEAVwS1TEo8Os9x3R7AAAyvfR93kdoLfWj/2gMR";
//var testiv = "gMc+ALIxmuQ+/3gX";

console.log("Decrypted Node CipherText: " + decrypt(test,'base64',initVector));


 var iosTest = "vtJnnhfSasaJA+vGXMrNcOMBRF1K2gI4ICOcXSNR5DpTADZPHq6GPxXb2XytgzMQ4IV/ynRZbQEAqa7gON9Sgg=="
 var iosiv = "vpd7uXqlQh0ZxYl9";
 console.log("Decrypted iOS CipherText: " + decrypt(iosTest,'base64',initVector));

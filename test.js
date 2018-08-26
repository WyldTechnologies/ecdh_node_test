var crypto = require('crypto');
var password = "1234567890123456";
var salt = "gettingsaltyfoo!";

var sha256 = crypto.createHash("sha256");
sha256.update(salt);
var hash = sha256.digest();

var key = crypto.pbkdf2Sync(password, hash, 1000, 32, "sha1");

var iv = new Buffer(16);
iv.fill(0);

var algorithm = 'aes-256-cbc';

function encrypt(text){
  var cipher = crypto.createCipheriv(algorithm, key, iv);
  var crypted = cipher.update(text,'utf8','base64');
  crypted += cipher.final('base64');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipheriv(algorithm, key, iv);
  var dec = decipher.update(text,'base64','utf8');
  dec += decipher.final('utf8');
  return dec;
}

console.log(encrypt("Hello World"));

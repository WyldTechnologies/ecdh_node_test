//https://stackoverflow.com/questions/33096654/aes-256-produces-different-ciphertexts-in-ios-and-node-js-with-same-password
https://developer.android.com/guide/topics/security/cryptography
var crypto = require('crypto');
var stdin = process.openStdin();
var util = require('util');

const CURVE = 'secp384r1';
var ALGORITHM = 'aes-256-cbc';

console.log("Paste the Public Key here: ");

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    let sInput = d.toString().trim();
    console.log("you entered: [" + sInput + "]");

        //creates the bob's ecdh keys
        const bob = crypto.createECDH(CURVE);
        bob.setPrivateKey('EcZd/eOE2KxbJ0ZZuigms5HIp7PRxNsa4CAhACcZX2cvO57vyxFT6f/cSAits/7G','base64');
        var BobPriKey = bob.getPrivateKey('base64') //this what you'll store
        var BobPubKey = bob.getPublicKey('base64','compressed')
        var BobPubKeyUncomp = bob.getPublicKey('base64')
        console.log("Bob Pri: " + BobPriKey)
        console.log("Bob UnCompressed Pub: " + BobPubKeyUncomp)
        console.log("Bob Compressed Pub: " + BobPubKey)
       //const alice_pub = "A3dStT/g71ZF6br/mM1iJsR1Ud8azwHUlp6WuHxcn3ebTPIxoGma9qNW8crIQLTuZA==";
       //the result would be (SharedSecret): m2NMr4JehjQpw171DI+s8xK1IRrkVudwv+9eJzyftZr/JgQt0qcLpN0tvNlVXfCE
       //)(SharedsecretHex-64 chars): 9b634caf825e863429c35ef50c8facf312b5211ae456e770bfef5e273c9fb59aff26042dd2a70ba4dd2dbcd9555df084
       const alice_pub = sInput;
       //use the above instead of generating a pub/pri keypair for alice
       //alex.generateKeys()
       // alice.setPrivateKey('heh3i2C0vLjtY/t7Z0/LJsRMM0La9QDFdLqCxd3fuewJ/KmBBRZ3EDp+qpof9x/e','base64');
       // var AlicePriKey = alice.getPrivateKey('base64') //this what you'll store
       // var AlicePubKey = alice.getPublicKey('base64','compressed')
       // console.log("Alice Pri: " + AlicePriKey)
       // console.log("Alex CompPub: " + AlexPubKey)
       //
       // const beck_pub = Buffer.from(BeckPubKey, 'base64')


       //KeyExchange
        const bob_secret = bob.computeSecret(alice_pub, 'base64', 'base64')
        console.log("Shared Secret Long: " + bob_secret);
        //console.log("Shared Secret Short: " + bob_secret.slice(0, 32));

        const bob_secret_hex = crypto.createHash('SHA256').update(bob_secret, 'base64').digest('hex').slice(0, 32);
        console.log("Shared Secret HEX: " + bob_secret_hex);

        const bob_secret_hex2 = crypto.createHash('SHA256').update(bob_secret).digest('hex').slice(0, 32);
        console.log("Shared Secret HEX2: " + bob_secret_hex2);

        //const bob_digest = crypto.createHash('SHA256').update(bob_secret, 'base64').digest('base64');
        //console.log("DIGEST: " + util.inspect(bob_digest));
        //const bob_hex = bob_digest.digest('hex');
        //console.log("Shared Secret HEX2: " + bob_hex);
        //const bob_ss = bob_hex.slice(0, 32);
        //console.log("DIGEST: " + util.inspect(bob_digest) + " HEX: " + bob_hex + " SS: " + bob_ss);



       // let iv = new Buffer(16);
       // iv.fill(0);

       let hexIV = Buffer.from("c60c9f3fcd4c7e6d25215ffa62dcc892", "hex");
       console.log('iv=', hexIV.toString('hex'));



       let message = "https://www.wyldmesh.net/v1/events/676C655DA4"

       let cipher = encrypt(message,bob_secret_hex.substring(0,32),hexIV);
       console.log("cipher:", cipher);



        console.log("");
        console.log("plainText:", decrypt(cipher,bob_secret_hex.substring(0,32),hexIV));

        //if plainText == message ....OK
        console.log("Paste the Public Key here: ");
  });



//AES CBC 256bit
function encrypt(_text, _key, _iv){
  var cipher = crypto.createCipheriv(ALGORITHM, _key, _iv);
  var crypted = cipher.update(_text,'utf8','base64');
  crypted += cipher.final('base64');
  return crypted;
}

//AES CBC 256bit
function decrypt(_text, _key, _iv){
  var decipher = crypto.createDecipheriv(ALGORITHM, _key, _iv);
  var dec = decipher.update(_text,'base64','utf8');
  dec += decipher.final('utf8');
  return dec;
}

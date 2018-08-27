
ecdh_node_test
----------------------------------
This example illustrates generating an ECDH shared secret,
hashing it with SHA256 to create a key for encrypting with
AES symmetric encryption, and then using an
Initialization Vector (IV) to make sure that the resulting cipher
text is not the same each time, if the data encrypted is the same.

In this example we are using AES 256-bit Encryption. 256-bit refers to
the length of the key. A key of 16 characters is 128 bits, and
32 chars is 256 bits.

The IV doesn't need to remain secret. In fact, it MUST be generated
new every time data is encrypted, and sent along with the cipher text
so it can be decrypted.


Note- one of the anomalies between our AES and NODE implementations is that
the iOS version requires the IV to be passed in as a hex encoded string.
A hex encode string is twice as long as its UTF8 counterpart. When we
generate the SHA256 hash string, its actually 64 bits instead of 32, so we
just use the first 32 characters of the generated 256-bit hash.
See line 31 in test.js
```
let hexKey = crypto.createHash('SHA256').update(shared_secret, 'base64').digest('hex').substring(0,32);
```
It is important that we only use substring here to truncate the 64 character
hash to 32 characters.

const EC = require('elliptic').ec;

// You can use any elliptic curve you want
const ec = new EC('secp256k1');

// Generate a new key pair and convert them to hex-strings
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

// Print the keys to the console
console.log();
console.log('La clave pública (también su dirección de cartera, libremente compartible)\n', publicKey);

console.log();
console.log('Su clave privada (mantenga este secreto! Para firmar transacciones)\n', privateKey);

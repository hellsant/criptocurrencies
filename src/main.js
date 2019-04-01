const { Blockchain } = require('./blockChains/Blockchain');
const { Transaction } = require('./transanctions/Transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Your private key goes here
const llavePrivadaPepe = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');
const llavePrivadaJuan = ec.keyFromPrivate('1010101');
const llavePrivadaCoco = ec.keyFromPrivate('12345frfffccc00012');

// From that we can calculate your public key (which doubles as your wallet address)
const pepeCartera = llavePrivadaPepe.getPublic('hex');
const juanCartera = llavePrivadaJuan.getPublic('hex');
const cocoCartera = llavePrivadaCoco.getPublic('hex');

// Create new instance of Blockchain class
const savjeeCoin = new Blockchain();

// Create a transaction & sign it with your key
const transaction1 = new Transaction(pepeCartera, juanCartera, 10);

transaction1.signTransaction(llavePrivadaPepe);
savjeeCoin.addTransaction(transaction1);
// Mine block
savjeeCoin.minePendingTransactions(pepeCartera);

// Create second transaction
const transaction2 = new Transaction(pepeCartera, juanCartera, 20);
transaction2.signTransaction(llavePrivadaPepe);
savjeeCoin.addTransaction(transaction2);

// Mine block
savjeeCoin.minePendingTransactions(pepeCartera);

const transaction3 = new Transaction(cocoCartera, juanCartera, 50);
transaction3.signTransaction(llavePrivadaCoco);
savjeeCoin.addTransaction(transaction3);
savjeeCoin.minePendingTransactions(cocoCartera);



savjeeCoin.print();

console.log();
console.log(`Balance of pepe is ${savjeeCoin.getBalanceOfAddress(pepeCartera)}\n`);
console.log(`Balance of juan is ${savjeeCoin.getBalanceOfAddress(juanCartera)}\n`);
console.log(`Balance of coco is ${savjeeCoin.getBalanceOfAddress(cocoCartera)}\n`);

// Check if the chain is valid
console.log();
console.log('¿Blockchain es valido?', savjeeCoin.isChainValid() ? 'si' : 'no');
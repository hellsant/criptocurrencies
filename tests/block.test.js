const assert = require('assert');
const { Block } = require('../src/blockChains/Block');
const { createSignedTx } = require('./helpers');

let blockObj = null;

beforeEach(function() {
    blockObj = new Block(1, 1000, [createSignedTx()], 'a1');
});

describe('Block class', function() {
    describe('Constructor', function() {
        it('should correctly save parameters', function() {
            assert.equal(blockObj.previousHash, 'a1');
            assert.equal(blockObj.timestamp, 1000);
            assert.deepEqual(blockObj.transactions, [createSignedTx()]);
            assert.equal(blockObj.nonce, 0);
        });
    });

    describe('Calculate hash', function() {
        it('should correct calculate the SHA256', function() {
            blockObj.timestamp = 1;
            blockObj.mineBlock(3);

            assert.equal(
                blockObj.hash,
                '000e45d9b4159ca89f9ab2a9a736a564769fc90e7a032d7dd1ad3edb27e7d271aaaead092efe472b8f30150f554caf36887e1bbaf33f1836e93d988e78b989e9'
            );
        });

        it('should change when we tamper with the tx', function(){
            const origHash = blockObj.calculateHash();
            blockObj.timestamp = 100;

            assert.notEqual(
                blockObj.calculateHash(),
                origHash
            );
        });
    });

    describe('has valid transactions', function(){
        it('should return true with all valid tx', function(){
            blockObj.transactions = [
                createSignedTx(),
                createSignedTx(),
                createSignedTx(),
            ];

            assert(blockObj.hasValidTransactions());
        });

        it('should return false when a single tx is bad', function(){
            const badTx = createSignedTx();
            badTx.amount = 1337;

            blockObj.transactions = [
                createSignedTx(),
                badTx
            ];

            assert(!blockObj.hasValidTransactions());
        });
    });

});

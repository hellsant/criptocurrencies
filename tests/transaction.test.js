const assert = require('assert');
const { Transaction } = require('../src/transanctions/Transaction');
const { createSignedTx, signingKey } = require('./helpers');

let txObject = null;

beforeEach(function() {
    txObject = new Transaction('fromAddress', 'toAddress', 9999);
});

describe('Transaction class', function() {
    describe('Constructor', function() {
        it('should automatically set the current date', function() {
            const actual = txObject.timestamp;
            const minTime = Date.now() - 1000;
            const maxTime = Date.now() + 1000;

            assert(actual > minTime && actual < maxTime, 'Tx does not have a good timestamp');
        });


        it('should correctly save from, to and amount', function() {
            txObject = new Transaction('a1', 'b1', 10);

            assert.equal(txObject.fromAddress, 'a1');
            assert.equal(txObject.toAddress, 'b1');
            assert.equal(txObject.amount, 10);
        });
    });

    describe('Calculate hash', function() {
        it('should correct calculate the SHA256', function() {
            txObject = new Transaction('a1', 'b1', 10);
            txObject.timestamp = 1;

            assert.equal(
                txObject.calculateHash(),

                // Output of SHA-3 512(a1b1101)
                '5c5e8a9aee22b7a0aef598c20ee2ba6e14861e3620b1bfe2db16a634e54eb9e8287ae34122867baafecddc59d591eccf27a21160cfa2af5a948151dc95af6054'
            );
        });

        it('should change when we tamper with the tx', function(){
        	txObject = new Transaction('a1', 'b1', 10);

        	const originalHash = txObject.calculateHash();
            txObject.amount = 100;

            assert.notEqual(
            	txObject.calculateHash(),
            	originalHash
            );
        });
    });

    describe('isValid', function() {
        it('should throw error without signature', function() {
            assert.throws(() => { txObject.isValid() }, Error);
        });

        it('should correctly sign transactions', function(){
        	txObject = createSignedTx();

        	assert.equal(
        		txObject.signature,
        		'3044022040ebd5a33722a19bc225a4223b27837f268f1d2ad8c69298c50f1ea57194f67202204a3fa9f0fbde3d309397e54505f76f1429ed7cf8d0401b6500504c0b6a11e75a'
        	);
        });

        it('should not sign transactions for other wallets', function(){
        	txObject = new Transaction('not a correct wallet key', 'wallet2', 10);
        	txObject.timestamp = 1;

        	assert.throws(() => {
        		txObject.signTransaction(signingKey);
        	}, Error);
        });

        it('should detect badly signed transactions', function(){
        	txObject = createSignedTx();

        	// Tamper with it & it should be invalid!
        	txObject.amount = 100;
        	assert(!txObject.isValid());
        });

        it('should return true with correctly signed tx', function(){
        	txObject = createSignedTx();
        	assert(txObject.isValid());
        });

        it('should fail when signature is empty string', function(){
        	txObject.signature = '';
        	assert.throws(() => {txObject.isValid()}, Error);
        });

        it('should return true for mining rewards', function(){
        	txObject.fromAddress = null;
        	assert(txObject.isValid());
        })
    });

});
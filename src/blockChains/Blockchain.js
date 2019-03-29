const { Transaction } = require("../transanctions/Transaction");
const { Block } = require("./Block");

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100; //recompensa
  }
  
  /**
   * @returns {Block}
   */
  createGenesisBlock() {
    return new Block(0, Date.parse('2019-01-01'), "nodo genesis", '0');
  }

  /**
   * Returns the latest block on our chain. Useful when you want to create a
   * new Block and you need the hash of the previous Block.
   *
   * @returns {Block[]}
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Takes all the pending transactions, puts them in a Block and starts the
   * mining process. It also adds a transaction to send the mining reward to
   * the given address.
   *
   * @param {string} miningRewardAddress
   */
  minePendingTransactions(miningRewardAddress) {
    let rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    let block = new Block(this.getLatestBlock().index + 1, Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);
    
    console.log('se minaron las transacciones correctamente');

    this.chain.push(block);
    this.pendingTransactions = [];
  }

  /**
   * Add a new transaction to the list of pending transactions (to be added
   * next time the mining process starts). This verifies that the given
   * transaction is properly signed.
   *
   * @param {Transaction} transaction
   */
  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('La transacción debe incluir desde y hacia la dirección de envio');
    }
    // Verify the transactiion
    if (!transaction.isValid()) {
      throw new Error('No se puede agregar una transacción no valida a la Blockchain');
    }
    this.pendingTransactions.push(transaction);
  }

  /**
   * Returns the balance of a given wallet address.
   *
   * @param {string} address
   * @returns {number} The balance of the wallet
   */
  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }
  
  /**
   * Returns a list of all transactions that happened
   * to and from the given wallet address.
   *
   * @param  {string} address
   * @return {Transaction[]}
   */
  getAllTransactionsForWallet(address) {
    const txs = [];
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address || tx.toAddress === address) {
          txs.push(tx);
        }
      }
    }
    return txs;
  }

  /**
   * Loops over all the blocks in the chain and verify if they are properly
   * linked together and nobody has tampered with the hashes. By checking
   * the blocks it also verifies the (signed) transactions inside of them.
   *
   * @returns {boolean}
   */
  isChainValid() {
    // Check if the Genesis block hasn't been tampered with by comparing
    // the output of createGenesisBlock with the first block on our chain
    const realGenesis = JSON.stringify(this.createGenesisBlock());
    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }
    // Check the remaining blocks on the chain to see if there hashes and
    // signatures are correct
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (!currentBlock.hasValidTransactions()) {
        return false;
      }
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.calculateHash()) {
        console.log('El codigo Hash no corresponde al bloque anterior de la blockchain');
        return false;
      }
    }
    console.log('Se mino correctamente');
    return true;
  }

  print() {
    this.chain.forEach((block) => console.log(block));
  }
}

module.exports.Blockchain = Blockchain;
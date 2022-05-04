const Bank = artifacts.require("Bank.sol");

module.exports = async function(callback) {
    let bank = await Bank.deployed()
    await bank.reward()
    console.log("Interest paid")
    callback()
}
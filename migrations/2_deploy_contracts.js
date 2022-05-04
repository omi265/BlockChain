const Bank = artifacts.require("Bank.sol");
const DaiToken = artifacts.require("DaiToken.sol");
const OmniToken = artifacts.require("OmniToken.sol");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(DaiToken)
    const dai = await DaiToken.deployed()

    await deployer.deploy(OmniToken)
    const omni = await OmniToken.deployed()

    await deployer.deploy(Bank, dai.address, omni.address)
    const bank = await Bank.deployed()

    await omni.transfer(bank.address, '1000000000000000000000')

    await dai.transfer(accounts[1], '1000000000000000000000')

}

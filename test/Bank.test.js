const { assert } = require("chai");
const { default: web3 } = require("web3");

const Bank = artifacts.require("Bank.sol");
const DaiToken = artifacts.require("DaiToken.sol");
const OmniToken = artifacts.require("OmniToken.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function convert(n) {
  return web3.utils.toWei(n, "ether");
}

contract("Bank", ([owner, investor]) => {
  let dai, omni, bank;

  before(async () => {
    dai = await DaiToken.new();
    omni = await OmniToken.new();
    bank = await Bank.new(dai.address, omni.address);

    await omni.transfer(bank.address, "1000000000000000000000");

    await dai.transfer(investor, "10000000000000000000", { from: owner });
  });

  describe("Dai deployement", async () => {
    it("has a name", async () => {
      const name = await dai.name();
      console.log(name);
      assert.equal(name, "DAI Token", name);
    });
  });

  describe("Omni deployement", async () => {
    it("has a name", async () => {
      const name = await omni.name();
      console.log(name);
      assert.equal(name, "Omni Token");
    });
  });
  describe("Bank deployement", async () => {
    it("has a name", async () => {
      const name = await bank.name();
      console.log(name);
      assert.equal(name, "Bank");
    });

    it("contract has tokens", async () => {
      let balance = await omni.balanceOf(bank.address);
      console.log(balance.toString());
      assert.equal(balance.toString(), "1000000000000000000000");
    });
  });

  describe("Staking tokens", async () => {
    it("rewards investors for staking", async () => {
      let result;
      result = await dai.balanceOf(investor);
      console.log(result.toString());
      assert.equal(result.toString(), "10000000000000000000", "1");

      await dai.approve(bank.address, "10000000000000000000", {
        from: investor,
      });
      await bank.stake("10000000000000000000", { from: investor });

      result = await dai.balanceOf(investor);
      console.log(result.toString());
      assert.equal(result.toString(), "0");

      result = await dai.balanceOf(bank.address);
      console.log(result.toString());
      assert.equal(result.toString(), "10000000000000000000");

      result = await bank.stakeBalance(investor);
      console.log(result.toString());
      assert.equal(result.toString(), "10000000000000000000");

      result = await bank.isStaked(investor);
      console.log(result.toString());
      assert.equal(result.toString(), "true", "2");

      await bank.reward({ from: owner });

      result = await omni.balanceOf(investor);
      console.log(result.toString());
      assert.equal(result.toString(), "10000000000000000000");

      await bank.reward({ from: investor }).should.be.rejected;

      await bank.withdraw({ from: investor });

      result = await dai.balanceOf(investor);
      console.log(result.toString());
      assert.equal(result.toString(), "10000000000000000000");

      result = await dai.balanceOf(bank.address);
      console.log(result.toString());
      assert.equal(result.toString(), "0");

      result = await bank.stakeBalance(investor);
      console.log(result.toString());
      assert.equal(result.toString(), "0");

      result = await bank.isStaked(investor);
      console.log(result.toString());
      assert.equal(result.toString(), "false", "2");
    });

    it("verifying", async () => {
      let result;
        // await omni.approve( bank.address , '1000000000000000000', { from: investor })
      //   await bank.verify("0xA5c9fd70F011447401F066510079BB7290B1dD34");

    //   result = await Bank.address(
    //   );
    //   console.log(result);

      await bank.verify("0xA5c9fd70F011447401F066510079BB7290B1dD34");
    //   console.log(result.toString());
      //   assert.equal(result.toString(), "1000000000000000000");

      result = await omni.balanceOf(
        "0xA5c9fd70F011447401F066510079BB7290B1dD34"
      );
      console.log(result.toString());

      result = await omni.balanceOf(
        bank.address
      );
      console.log(result.toString());

      result = await omni.balanceOf(
        investor
      );
      console.log(result.toString());

      result = await bank.hasAttended(investor)
      console.log(result.toString())
    });
  });
});

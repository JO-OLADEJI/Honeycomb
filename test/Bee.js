const { expect } = require("chai");
const { ethers } = require("hardhat");


describe('BEE (ERC-20)', () => {
  let deployer;
  let BeeToken;
  beforeEach(async () => {
    [deployer] = await ethers.getSigners();
    const Bee = await ethers.getContractFactory('Bee');
    BeeToken = await Bee.deploy('Bee', 'BEE');
  });


  describe('Constructor', () => {

    it('should mint 21,000,000 BEE tokens to deployer', async () => {
      const amount = ethers.utils.parseEther('21000000');
      const deployerBalance = await BeeToken.balanceOf(deployer['address']);
      expect(amount).to.equal(deployerBalance);
    });

  });

});
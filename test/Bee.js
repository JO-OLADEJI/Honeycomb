const { expect } = require("chai");
const { ethers } = require("hardhat");


describe('BEE (ERC-20)', () => {
  let deployer;
  let Bee;
  beforeEach(async () => {
    [deployer] = await ethers.getSigners();
    const bee = await ethers.getContractFactory('Bee');
    Bee = await bee.deploy('Bee', 'BEE');
  });


  describe('Constructor', () => {

    it('should mint 21,000,000 BEE tokens to deployer', async () => {
      const amount = ethers.utils.parseEther('21000000');
      const deployerBalance = await Bee.balanceOf(deployer['address']);
      expect(amount).to.equal(deployerBalance);
    });

  });

});
const { expect } = require("chai");
const { ethers } = require("hardhat");


describe('Honeycomb', () => {
  let deployer;
  let addr1;
  let addr2;
  let Bee; // ERC-20 token
  let Honeycomb;
  const epoch = 15 * 60; // 15 seconds (testing)
  const reward = ethers.utils.parseEther('100');

  const init = async () => {
    [deployer, addr1, addr2] = await ethers.getSigners();
    const bee = await ethers.getContractFactory('Bee');
    Bee = await bee.deploy('Bee', 'BEE');
  }

  /**
   * function to cause an artificial delay for simulation of epochs
   * @param {Number} time amount of delay in seconds
   * @returns {Promise}
   */
  const delay = (time) => new Promise((resolve, reject) => setTimeout(resolve, time * 1000));
  
  beforeEach(async () => {
    await init();
    const honeycomb = await ethers.getContractFactory('Honeycomb');
    Honeycomb = await honeycomb.deploy(epoch, Bee['address']);
  });


  describe('Constructor', () => {
    
    it('should assign deployer as admin', async () => {
      const admin = await Honeycomb.admin();
      expect(deployer['address']).to.equal(admin);
    });

    it('should assign epoch to the time period constant T passed at deployment', async () => {
      const constantT = await Honeycomb.epoch();
      expect(epoch).to.equal(constantT);
    });

    it('should initialize pool token with the address passed', async () => {
      const tokenAddress = await Honeycomb.poolToken();
      expect(tokenAddress).to.equal(Bee['address']);
    });

  });


  describe('Admin functions', () => {
    beforeEach(async () => {
      await Bee.approve(Honeycomb['address'], reward);
      await Honeycomb.lockReward(reward);
    });


    it('should assign t0 (deploy time) to the timestamp of the block', async () => {
      const deployTime = await Honeycomb.deployTime();
      expect(/^[0-9]{10,}$/.test(deployTime.toString())).to.equal(true);
    });

    it('should transfer ERC-20 tokens worth of reward into the contract', async () => {
      const rewardInContract = await Bee.balanceOf(Honeycomb['address']);
      expect(rewardInContract).to.equal(reward);
    });

    it('should have equal number of reward sent at deployment and remaining reward', async () => {
      const rewardRemaining = await Honeycomb.rewardRemaining();
      expect(reward).to.equal(rewardRemaining);
    });

    it('should assign 20% of total reward to reward-pool-1 (R1)', async () => {
      const reward01 = await Honeycomb.reward01();
      expect(reward.mul(2).div(10)).to.equal(reward01);
    });

    it('should assign 30% of total reward to reward-pool-2 (R2)', async () => {
      const reward02 = await Honeycomb.reward02();
      expect(reward.mul(3).div(10)).to.equal(reward02);
    });

    it('should assign 50% of total reward to reward-pool-3 (R3)', async () => {
      const reward03 = await Honeycomb.reward03();
      expect(reward.mul(5).div(10)).to.equal(reward03);
    });

    it('should revert if admin tries to lock reward more than once', async () => {
      await expect(
        Honeycomb.lockReward(reward)
      ).to.be.reverted;
    });

  });


  describe('Staking', () => {
    //
  });


  describe('Harvesting', () => {
    //
  });


  describe('Helper functions', () => {
    //
  });

});
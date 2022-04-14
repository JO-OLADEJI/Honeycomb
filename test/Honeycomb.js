const { expect } = require("chai");
const { ethers } = require("hardhat");


describe('Honeycomb', () => {
  let deployer;
  let addr1;
  let addr2;
  let Bee; // ERC-20 token
  let Honeycomb;
  const epoch = 15; // 15 seconds (testing)
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
    const addr1Stake = ethers.utils.parseEther('100');
    const addr2Stake = ethers.utils.parseEther('400');
    beforeEach(async () => {
      await Bee.transfer(addr1['address'], addr1Stake);
      await Bee.transfer(addr2['address'], addr2Stake);
    });


    it('should stake the amount of ERC-2O tokens an address specifies if sent within the first epoch', async () => {
      await Bee.approve(Honeycomb['address'], reward);
      await Honeycomb.lockReward(reward);
      await Bee.connect(addr1).approve(Honeycomb['address'], addr1Stake);
      await Honeycomb.connect(addr1).stake(addr1Stake);

      expect(await Bee.balanceOf(Honeycomb['address'])).to.equal(reward.add(addr1Stake));
      expect(await Bee.balanceOf(addr1['address'])).to.equal(addr1Stake.sub(addr1Stake));
      expect(await Honeycomb.amountStaked(addr1['address'])).to.equal(addr1Stake);
      expect(await Honeycomb.stakingPool()).to.equal(addr1Stake);
    });

    it('should revert when the contract does not have allowance on the amount the address specifies', async () => {
      await Bee.approve(Honeycomb['address'], reward);
      await Honeycomb.lockReward(reward);

      await expect(
        Honeycomb.connect(addr1).stake(addr1Stake)
      ).to.be.revertedWith('Honeycomb: insufficient erc-20 allowance!');
    });

    it('should revert when stake() is called after one epoch from rewards', async () => {
      await Bee.approve(Honeycomb['address'], reward);
      await Honeycomb.lockReward(reward);
      await Bee.connect(addr1).approve(Honeycomb['address'], addr1Stake);
      await delay(epoch);

      await expect(
        Honeycomb.connect(addr1).stake(addr1Stake)
      ).to.be.revertedWith('Honeycomb: staking epoch has elapsed!');
    });

    it('should revert if stake() is called before reward is locked-in by deployer', async () => {
      await Bee.connect(addr1).approve(Honeycomb['address'], addr1Stake);
      await delay(epoch);

      await expect(
        Honeycomb.connect(addr1).stake(addr1Stake)
      ).to.be.revertedWith('Honeycomb: reward not locked-in!');
    });

  });


  describe('Harvesting', () => {
    //
  });


  describe('Helper functions', () => {
    //
  });

});
const { expect } = require("chai");
const { ethers } = require("hardhat");

/*
 * TERMS USED
 * - epoch: refers to the timespan elapsed for time period constant T, e.g first epoch means the time between contract deployment and T (t0 - T)
 * - reward: the amount of ERC-20 tokens deposited by contract owner to be given out proportionally to stakers
 * - Bee: the ERC-20 token used for testing
 * - Honeycomb: the smart contract that acts as a bank / yield farm
*/


describe('Honeycomb', () => {
  let deployer;
  let addr1;
  let addr2;
  let addr3;
  let Bee; // ERC-20 token
  let Honeycomb;
  const epoch = 15; // 15 seconds (testing)
  const reward = ethers.utils.parseEther('100');

  const init = async () => {
    [deployer, addr1, addr2, addr3] = await ethers.getSigners();
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
    const addr1Stake = ethers.utils.parseEther('100');
    const addr2Stake = ethers.utils.parseEther('400');
    const addr3Stake = ethers.utils.parseEther('500');

    beforeEach(async () => {
      await Bee.approve(Honeycomb['address'], reward);
      await Honeycomb.lockReward(reward);
      await Bee.transfer(addr1['address'], addr1Stake);
      await Bee.transfer(addr2['address'], addr2Stake);
      await Bee.transfer(addr3['address'], addr3Stake);
    });
    
    it('should revert when an address calls harvest() without owning a share of the staking pool', async () => {
      await expect(
        Honeycomb.connect(addr1).harvest()
      ).to.be.revertedWith('Honeycomb: no liquidity share in pool!');
      await expect(
        Honeycomb.withdraw()
      ).to.be.reverted;
    });

    it('should revert when an address calls harvest() within the timespan of the first 2 epochs', async () => {
      await Bee.connect(addr1).approve(Honeycomb['address'], addr1Stake);
      await Honeycomb.connect(addr1).stake(addr1Stake);
      await expect(
        Honeycomb.connect(addr1).harvest()
      ).to.be.revertedWith('Honeycomb: liquidity locked-in for first 2 epochs!');
      await expect(
        Honeycomb.withdraw()
      ).to.be.reverted;
    });

    it('should send an address\' pool stake, plus proportional reward of reward-pool-1 (R1) when harvest() is called in the third epoch', async () => {
      await Bee.connect(addr1).approve(Honeycomb['address'], addr1Stake);
      await Bee.connect(addr2).approve(Honeycomb['address'], addr2Stake);
      await Honeycomb.connect(addr1).stake(addr1Stake);
      await Honeycomb.connect(addr2).stake(addr2Stake);
      await delay(epoch * 2);

      const stakingPool = await Honeycomb.stakingPool();
      const R1 = await Honeycomb.reward01();
      const stake = await Honeycomb.amountStaked(addr1['address']);
      const proportionalEpochReward = stake.mul(R1).div(stakingPool);
      await Honeycomb.connect(addr1).harvest();

      expect(await Bee.balanceOf(addr1['address'])).to.equal(stake.add(proportionalEpochReward));
      expect(await Bee.balanceOf(Honeycomb['address'])).to.equal(reward.add(stakingPool).sub(stake).sub(proportionalEpochReward));
      expect(await Honeycomb.reward01()).to.equal(R1.sub(proportionalEpochReward));
      expect(await Honeycomb.amountStaked(addr1['address'])).to.equal(addr1Stake.sub(stake));
      await expect(
        Honeycomb.withdraw()
      ).to.be.reverted;
    });

    it('should send an address\' pool stake, plus proportional reward of the sum of reward-pool-2 (R2) and reward-pool-1 (R1) remainder when harvest() is called in the fourth epoch', async () => {
      await Bee.connect(addr1).approve(Honeycomb['address'], addr1Stake);
      await Bee.connect(addr2).approve(Honeycomb['address'], addr2Stake);
      await Honeycomb.connect(addr1).stake(addr1Stake);
      await Honeycomb.connect(addr2).stake(addr2Stake);

      const stakingPool = await Honeycomb.stakingPool();
      const R1 = await Honeycomb.reward01();
      const stake01 = await Honeycomb.amountStaked(addr1['address']);
      const proportionalEpochReward01 = stake01.mul(R1).div(stakingPool);
      await delay(epoch * 2);
      await Honeycomb.connect(addr1).harvest();

      const currentStakingPool = await Honeycomb.stakingPool();
      const remainingR1 = await Honeycomb.reward01();
      const R2 = await Honeycomb.reward02();
      const stake02 = await Honeycomb.amountStaked(addr2['address']);
      const proportionalEpochReward02 = stake02.mul(remainingR1.add(R2)).div(currentStakingPool);
      await delay(epoch);
      await Honeycomb.connect(addr2).harvest();

      expect(await Bee.balanceOf(addr2['address'])).to.equal(remainingR1.add(R2).add(stake02));
      expect(await Bee.balanceOf(Honeycomb['address'])).to.equal(reward.add(stakingPool).sub(stake01).sub(proportionalEpochReward01).sub(stake02).sub(proportionalEpochReward02));
      expect(await Honeycomb.rewardRemaining()).to.equal(reward.sub(proportionalEpochReward01).sub(proportionalEpochReward02));
      expect(await Honeycomb.amountStaked(addr2['address'])).to.equal(addr2Stake.sub(stake02));
      await expect(
        Honeycomb.withdraw()
      ).to.be.revertedWith('Honeycomb: rewards locked-in till 5th epochs!');
    });

    it('should send an address\' pool stake, plus proportional reward of the total-pool-reward (R3 + R2 + R1) when harvest() is called in the fifth epoch and beyond', async () => {
      await Bee.connect(addr1).approve(Honeycomb['address'], addr1Stake);
      await Bee.connect(addr2).approve(Honeycomb['address'], addr2Stake);
      await Bee.connect(addr3).approve(Honeycomb['address'], addr3Stake);
      await Honeycomb.connect(addr1).stake(addr1Stake);
      await Honeycomb.connect(addr2).stake(addr2Stake);
      await Honeycomb.connect(addr3).stake(addr3Stake);

      await delay(epoch * 2);
      await Honeycomb.connect(addr1).harvest();
      const remainingR1 = await Honeycomb.reward01();

      await delay(epoch);
      await Honeycomb.connect(addr2).harvest();
      const remainingR2 = await Honeycomb.reward02();

      const R3 = await Honeycomb.reward03();
      const stake03 = await Honeycomb.amountStaked(addr3['address']);
      await delay(epoch);
      await Honeycomb.connect(addr3).harvest();
      const addr3Balance = await Bee.balanceOf(addr3['address']);

      expect(
        Number(ethers.utils.formatEther(remainingR1.add(remainingR2).add(R3).add(stake03)))
        >= // (greaterThanOrEqual) -> because of solidity's lack of floating point numbers
        Number(ethers.utils.formatEther(addr3Balance))
      ).to.equal(true);
    });

    it('should allow admin to withdraw reward remaining if all accounts withdraw before the fifth epoch', async () => {
      await Bee.connect(addr1).approve(Honeycomb['address'], addr1Stake);
      await Bee.connect(addr2).approve(Honeycomb['address'], addr2Stake);
      await Honeycomb.connect(addr1).stake(addr1Stake);
      await Honeycomb.connect(addr2).stake(addr2Stake);

      await delay(epoch * 2);
      await Honeycomb.connect(addr1).harvest();

      await delay(epoch);
      await Honeycomb.connect(addr2).harvest();

      const adminBalance = await Bee.balanceOf(deployer['address']);
      const remainingReward = await Honeycomb.rewardRemaining();

      await delay(epoch);
      await Honeycomb.withdraw();

      expect(await Bee.balanceOf(deployer['address'])).to.equal(adminBalance.add(remainingReward));
    });

  });


  describe('Helper functions', () => {
    beforeEach(async () => {
      await Bee.approve(Honeycomb['address'], reward);
      await Honeycomb.lockReward(reward);
    });


    it('should return the timestamp in which the third epoch starts', async () => {
      // Third epoch refers to the timespan between t0+2T to t0+3T
      const thirdEpochStart = await Honeycomb.thirdEpochStart();
      const deployTime = await Honeycomb.deployTime();
      const difference = thirdEpochStart.sub(deployTime);
      expect(difference).to.equal(epoch * 2);
    });

    it('should return the timestamp in which the forth epoch starts', async () => {
      // Fourth epoch refers to the timespan between t0+3T to t0+4T
      const fourthEpochStart = await Honeycomb.fourthEpochStart();
      const deployTime = await Honeycomb.deployTime();
      const difference = fourthEpochStart.sub(deployTime);
      expect(difference).to.equal(epoch * 3);
    });

    it('should return the timestamp in which the fifth epoch starts', async () => {
      // Fifth epoch refers to anytime after 4T
      const fifthEpochStart = await Honeycomb.fifthEpochStart();
      const deployTime = await Honeycomb.deployTime();
      const difference = fifthEpochStart.sub(deployTime);
      expect(difference).to.equal(epoch * 4);
    });

    it('should return the address\' balance of the given ERC-20 token', async () => {
      const amount = ethers.utils.parseEther('1');
      await Bee.transfer(addr1['address'], amount);
      const balance = await Honeycomb.getAddressBalance(Bee['address'], addr1['address']);
      expect(await Bee.balanceOf(addr1['address'])).to.equal(balance);
    });

    it('should return an address\' allowance for Honeycomb contract', async () => {
      await Bee.approve(Honeycomb['address'], reward); // approve is called here again because the approval in `beforeEach()` has been reset when lockReward() was called -> which internally calls `transferFrom()`
      const allowance = await Honeycomb.getAddressAllowance(Bee['address'], deployer['address']);
      expect(allowance).to.equal(reward);
    });

  });

});
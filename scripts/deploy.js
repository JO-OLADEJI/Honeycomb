require('dotenv').config();
const { ethers } = require('hardhat');

/**
 * function to deploy ERC-2O token, Honeycomb bank contract and lock rewards by admin
 * @param {Number} timeInterval amount of time in seconds used for reward calculation (constant T)
 */
const deploy = async (timeInterval) => {
  try {
    const [deployer] = await ethers.getSigners();
    // const ERC20Token = process.env.ERC20_TOKEN;

    // deploy ERC-20 token
    const bee = await ethers.getContractFactory('Bee');
    const Bee = await bee.deploy('Bee', 'BEE');
    console.log({ 'Bee': Bee.address });

    // deploy bank contract
    const honeycomb = await ethers.getContractFactory('Honeycomb');
    const Honeycomb = await honeycomb.deploy(timeInterval, Bee.address);
    console.log({ 'Honeycomb': Honeycomb.address });

    // set reward for pool
    const reward = ethers.utils.parseEther('1000');
    await Bee.connect(deployer).approve(Honeycomb.address, reward);
    await Honeycomb.connect(deployer).lockReward(reward);
    console.log({ 'method': `Locked-in ${ethers.utils.formatEther(await Honeycomb.rewardRemaining())} $BEE for rewards` });

    process.exit(0);
  }
  catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}


const T = 5 * 60; // 5 minutes
deploy(T);
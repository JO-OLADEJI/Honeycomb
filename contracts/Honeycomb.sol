// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Honeycomb {

	uint public rewardRemaining;
	uint public stakingPool;
	uint public immutable epoch;
	uint public deployTime;
	uint public reward01;
	uint public reward02;
	uint public reward03;
	mapping (address => uint) public amountStaked;
	address public immutable admin;
	IERC20 public poolToken;
    bool rewardLocked;


	/**
	 * @param _timeInterval - amount of time in seconds used for reward calculation
	 */
	constructor(uint _timeInterval, address _poolToken) {
		admin = msg.sender;
		epoch = _timeInterval;
		poolToken = IERC20(_poolToken);
	}

	modifier onlyAdmin {
		require(msg.sender == admin, "Honeycomb: unauthorized!");
		_;
	}


	/**
	 * @dev function for address to approve the spending of ERC-20 tokens by contract
	 * @param _amount number of tokens to approve
	 */
	function permit(uint _amount) external {
		poolToken.approve(address(this), _amount);
	}


    /**
     * @dev function for admin to lock-in rewards after contract has been deployed
     * - users cannot deposit till rewards have been locked-in
     * - requires ERC-20 token approval of reward
     * - cannot lock-in rewards in constructor() because approve() has to be called first
     * - can only be called successfully ONCE
     * @param _reward amount of ERC-20 tokens to be given out as rewards
     */
    function lockReward(uint _reward) onlyAdmin external {
        require(poolToken.allowance(msg.sender, address(this)) >= _reward, "Honeycomb: insufficient erc-20 allowance!");
        require(!rewardLocked, "Honeycomb: reward can only be locked-in once!");
        deployTime = block.timestamp; // initialize deploytime only when admin has locked in reward
        poolToken.transferFrom(msg.sender, address(this), _reward);
		rewardRemaining += _reward;
		reward01 = rewardRemaining * uint(2) / uint(10);
		reward02 = rewardRemaining * uint(3) / uint(10);
		reward03 = rewardRemaining * uint(5) / uint(10);
        rewardLocked = true;
    }


	/**
	 * @dev function for address to add to the staking pool (lock in their investment for at least)
	 * @param _amount number of tokens to add to pool
	 */
	function stake(uint _amount) external {
        require(rewardLocked, "Honeycomb: reward not locked-in!");
		require(block.timestamp < deployTime + epoch, "Honeycomb: staking epoch has elapsed!");
		require(poolToken.allowance(msg.sender, address(this)) >= _amount, "Honeycomb: insufficient erc-20 allowance!");

		poolToken.transferFrom(msg.sender, address(this), _amount);
		amountStaked[msg.sender] += _amount;
		stakingPool += _amount;
	}


	/**
	 * @dev function for users to withdraw their stake and accrued profit
	 */
	function harvest() external {
		require(block.timestamp >= thirdEpochStart(), "Honeycomb: liquidity locked-in for first 2 epochs!");
		require(amountStaked[msg.sender] > 0, "Honeycomb: no liquidity share in pool!");
		uint reward;

		if (block.timestamp >= fifthEpochStart()) {
			reward = (reward03 + reward02 + reward01) * uint(amountStaked[msg.sender]) / uint(stakingPool);
			poolToken.transferFrom(address(this), msg.sender, reward + amountStaked[msg.sender]);
			reward03 -= reward;
		}
		else if (block.timestamp >= fourthEpochStart()) {
			reward = (reward02 + reward01) * uint(amountStaked[msg.sender]) / uint(stakingPool);
			poolToken.transferFrom(address(this), msg.sender, reward + amountStaked[msg.sender]);
			reward02 -= reward;
		}
		else if (block.timestamp >= thirdEpochStart()) {
			reward = reward01 * uint(amountStaked[msg.sender]) / uint(stakingPool);
			poolToken.transferFrom(address(this), msg.sender, reward + amountStaked[msg.sender]);
			reward01 -= reward;
		}

		stakingPool -= amountStaked[msg.sender];
		rewardRemaining -= reward;
		delete amountStaked[msg.sender];
	}


	/**
	 * @dev function for contract owner to remove remaining rewards if no user waits for the 5th epoch
	 */
	function withdraw() external {
		require(block.timestamp >= fifthEpochStart(), "Honeycomb: rewards locked-in till 5th epochs!");
		require(stakingPool == 0, "Honeycomb: liquidity available in pool!");
		poolToken.transferFrom(address(this), msg.sender, rewardRemaining);
	}


	/*************************** helper functions ***************************/
	/**
	 * @dev returns the time from which withdrawals and rewards can commence 
	 * - 20% of pool reward by proportion
	 * - time of deployment + 2 epochs
	 */
	function thirdEpochStart() public view returns(uint) {
		return deployTime + (2 * epoch);
	}


	/**
	 * @dev returns the time from which second level rewards can be processed
	 * - (30% + 20%) of pool reward by proportion
	 * - time of deployment + 3 epochs
	 */
	function fourthEpochStart() public view returns(uint) {
		return deployTime + (3 * epoch);
	}


	/**
	 * @dev returns the time from which third level rewards can be processed
	 * - (50% + 30% + 20%) of pool reward by proportion
	 * - time of deployment + 4 epochs
	 */
	function fifthEpochStart() public view returns(uint) {
		return deployTime + (4 * epoch);
	}


	/**
	 * @dev returns the current stake of a given address
	 */
	function getAmountStaked(address _account) external view returns(uint) {
		return amountStaked[_account];
	}


	/**
	 * @dev returns the allowance of the contract on the sender's tokens
	 */
	function getPermit() external view returns(uint) {
		return poolToken.allowance(msg.sender, address(this));
	}

}
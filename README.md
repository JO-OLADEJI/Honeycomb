# Honeycomb
Pool for users to stake an ERC-20 token and receive a share of the total reward pool in due time
<br />
<br />

### Setup
After cloning repository,

- Install all dependencies by running 
```
npm install
```

- Compile contracts using
```
npx hardhat compile
```

- Assign the private key of deployer address to the `DEPLOYER` variable in `.env.example` file

- Rename `.env.example` to `.env`

- Deploy contract to rinkeby testnet by running
```
npx hardhat run scripts/deploy.js --network rinkeby
```
Note that the contract is deployed using an epoch of 10 minutes. To change this, modify the T variable in `scripts/deploy.js` file before deploying

- Copy the address of the BEE token and paste it in `app/src/utils/erc20.json` file, as the value of the `address` key

- Copy the address of the HONEYCOMB and paste it in `app/src/utils/honeycomb.json` file, as the value of the `address` key

- Run the dApp using 
```
cd app
npm start
```
<br />

### To run tests 🧪
After cloning repository,

- Install all dependencies by running 
```
npm install
```

- Compile contracts using
```
npx hardhat compile
```

- Spin up a ganache instance and add the the private keys of 4 signers(addresses) to their variables in `.env.example` file

- Rename `.env.example` to `.env`

- Run tests using
```
npx hardhat test
```

# Honeycomb
Pool for users to stake an ERC-20 token and receive a share of the total reward pool in due time
<br />
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

import Web3 from "web3";
import fs from 'fs';
import {scan, send} from './helper/Web3Helper.cjs'

const NODE_ADDRESS = 'HTTP://127.0.0.1:7545'; //Ganache
const PRIVATE_KEY = '0x8a09c7c36a5d8c74047aa4116d5f459ebe41168748b7cd0f1739eacff2b32810';
const CONTRACT_ADDRESS = '0xc37CC82B593FA8B651ba8c17818A23F5ca1636d4'
const newOwnerAddress = '0x0B082a48b7Bcf72BCb0923B9bfc28e01ddaED71b';

async function runNewPokemon() {
    const pokemon = JSON.parse(fs.readFileSync('../build/contracts/Pokemon.json'));
    const web3 = new Web3(NODE_ADDRESS);
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

    const name = await scan('New Pokemon Name: ');
    const level = await scan('New Pokemon Level: ');
    const price = await scan('New Pokemon Price: ');
    const contract = new web3.eth.Contract(pokemon.abi);

    const transaction = contract.deploy({
        data: pokemon.bytecode,
        arguments: [name, level, price]
    })
    const receipt = await send(web3, account, transaction);
    console.log(JSON.stringify(receipt, null, 4));

    const createdContract = new web3.eth.Contract(pokemon.abi, receipt.contractAddress);
    const createdTransaction = createdContract.methods.transferOwnership(newOwnerAddress);
    const createdReceipt = await send(web3, account, createdTransaction);
    console.log(JSON.stringify(createdReceipt, null, 4));

    const changedContract = new web3.eth.Contract(pokemon.abi, receipt.contractAddress);
    const changedTransaction = changedContract.methods.getPokemon();
    const changedReceipt = await send(web3, account, changedTransaction);
    console.log(JSON.stringify(changedReceipt, null, 4));

    if (web3.currentProvider.constructor.name === "WebsocketProvider")
        web3.currentProvider.connection.close();
}

async function runChangePokemonOwner() {
    const pokemon = JSON.parse(fs.readFileSync('../build/contracts/Pokemon.json'));
    const web3 = new Web3(NODE_ADDRESS);
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

    const createdContract = new web3.eth.Contract(pokemon.abi, CONTRACT_ADDRESS);
    const createdTransaction = createdContract.methods.transferOwnership(newOwnerAddress);
    const createdReceipt = await send(web3, account, createdTransaction);
    console.log(JSON.stringify(createdReceipt, null, 4));
}

// runNewPokemon().then(() => console.log('Completed: runNewPokemon()'));
runChangePokemonOwner().then(() => console.log('Completed: runChangePokemonOwner()'));
import Web3 from "web3";
import fs from 'fs';
import {scan, send} from './helper/Web3Helper.cjs'

const NODE_ADDRESS = 'HTTP://127.0.0.1:7545'; //Ganache

const OWNER_PRIVATE_KEY = '0x5c470b93cb2ee0a284782c813d595f0dd382db326878058ca8764993d7978d7e';
const OPPONENT_PRIVATE_KEY = '0x9d9d9f8bc824f20e20e36a428fecb7e3bf6d2876cd05dc169aad941c653482f3';

const OWNER_CONTRACT_ADDRESS = '0xf42d44e598EC43FEF33f740A6aDbFe4081f6D126'

const NEW_OWNER_ADDRESS = '0x0B082a48b7Bcf72BCb0923B9bfc28e01ddaED71b';

async function runNewPokemonAndBattle() {
    const pokemon = JSON.parse(fs.readFileSync('../build/contracts/Pokemon.json'));
    const web3 = new Web3(NODE_ADDRESS);
    // const ownerAccount = web3.eth.accounts.privateKeyToAccount(OWNER_PRIVATE_KEY);
    const opponentAccount = web3.eth.accounts.privateKeyToAccount(OPPONENT_PRIVATE_KEY);

    const name = await scan('New Pokemon Name: ');
    const level = await scan('New Pokemon Level: ');
    const price = await scan('New Pokemon Price: ');
    const contract = new web3.eth.Contract(pokemon.abi);

    const transaction = contract.deploy({
        data: pokemon.bytecode,
        arguments: [name, level, 100, opponentAccount.address, price]
    })
    const receipt = await send(web3, opponentAccount, transaction);
    console.log(JSON.stringify(receipt, null, 4));

    // const createdContract = new web3.eth.Contract(pokemon.abi, receipt.contractAddress);
    // const createdTransaction = createdContract.methods.transferOwnership(NEW_OWNER_ADDRESS);
    // const createdReceipt = await send(web3, opponentAccount, createdTransaction);
    // console.log(JSON.stringify(createdReceipt, null, 4));

    // const changedContract = new web3.eth.Contract(pokemon.abi, receipt.contractAddress);
    // const changedTransaction = changedContract.methods.getPokemon();
    // const changedReceipt = await send(web3, account, changedTransaction);
    // console.log(JSON.stringify(changedReceipt, null, 4));

    const battleContract = new web3.eth.Contract(pokemon.abi, receipt.contractAddress);
    const battleTransaction = battleContract.methods.battle();
    const battleReceipt = await send(web3, opponentAccount, battleTransaction);
    console.log(JSON.stringify(battleReceipt, null, 4));

    if (web3.currentProvider.constructor.name === "WebsocketProvider")
        web3.currentProvider.connection.close();
}

async function runChangePokemonOwner() {
    const pokemon = JSON.parse(fs.readFileSync('../build/contracts/Pokemon.json'));
    const web3 = new Web3(NODE_ADDRESS);
    const account = web3.eth.accounts.privateKeyToAccount(OWNER_PRIVATE_KEY);

    const createdContract = new web3.eth.Contract(pokemon.abi, OWNER_CONTRACT_ADDRESS);
    const createdTransaction = createdContract.methods.transferOwnership(NEW_OWNER_ADDRESS);
    const createdReceipt = await send(web3, account, createdTransaction);
    console.log(JSON.stringify(createdReceipt, null, 4));
}

runNewPokemonAndBattle().then(() => console.log('Completed: runNewPokemon()'));
// runChangePokemonOwner().then(() => console.log('Completed: runChangePokemonOwner()'));
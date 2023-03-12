import Web3 from "web3";
import fs from 'fs';
import {scan, send} from './helper/Web3Helper.cjs'

const NODE_ADDRESS = 'HTTP://127.0.0.1:7545'; //Ganache

const OWNER_PRIVATE_KEY = '0xee24e32c896da547d9861d4d55e36dd777dbc704c33609d629491b3eb368679c';
const OPPONENT_PRIVATE_KEY = '0x37404fc0470e97ca8a573cc63f7a356215e260b0980071db5b10178b0628aa48';

const OWNER_CONTRACT_ADDRESS = '0xD4A5587bcb6de60Aa79730eA9cEC316be5A119dC'

const NEW_OWNER_ADDRESS = '0x5427f72E9868AC0e0dFA31117DD619ee3098c3c4';

async function runSetOpponentAndBattle() {
    const pokemon = JSON.parse(fs.readFileSync('../build/contracts/Pokemon.json'));
    const web3 = new Web3(NODE_ADDRESS);
    const ownerAccount = web3.eth.accounts.privateKeyToAccount(OWNER_PRIVATE_KEY);
    const opponentAccount = web3.eth.accounts.privateKeyToAccount(OPPONENT_PRIVATE_KEY);

    const contract = new web3.eth.Contract(pokemon.abi, OWNER_CONTRACT_ADDRESS);
    const transaction = contract.methods.fightOrFlight(opponentAccount.address);
    const receipt = await send(web3, ownerAccount, transaction);
    console.log(JSON.stringify(receipt, null, 4));

    const opponentLevel = await scan('Opponent Level: ');
    const battleTransaction = contract.methods.battle(opponentLevel);
    const battleReceipt = await send(web3, opponentAccount, battleTransaction);
    console.log(JSON.stringify(battleReceipt, null, 4));

    if (web3.currentProvider.constructor.name === "WebsocketProvider")
        web3.currentProvider.connection.close();
}

async function runCreateNewPokemon() {
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

runSetOpponentAndBattle().then(() => console.log('Completed: runSetOpponentAndBattle()'));
// runCreateNewPokemon().then(() => console.log('Completed: runCreateNewPokemon()'));
// runChangePokemonOwner().then(() => console.log('Completed: runChangePokemonOwner()'));
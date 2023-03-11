import Web3 from "web3";
import fs from 'fs';
import {send, scan} from './helper/Web3Helper.cjs'


const NODE_ADDRESS = 'HTTP://127.0.0.1:7545'; //Ganache
const PRIVATE_KEY = '0x4951b9225a2292d944fab009888f2bd94b6c3a571318e2ef09f81936b1b09c36';
const CONTRACT_ADDRESS = '0x5a4E12a6a6414ee215916a0A5b8534B6BB4196D4'

async function run() {
    const hello = JSON.parse(fs.readFileSync('../build/contracts/Hello.json'));
    const web3 = new Web3(NODE_ADDRESS);
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    const contract = new web3.eth.Contract(hello.abi, CONTRACT_ADDRESS);
    const place = await scan('Where would you like to greet: ');
    const transaction = contract.methods.setMessage('Hello ' + place + '!');
    const receipt = await send(web3, account, transaction);
    console.log(JSON.stringify(receipt, null, 4));
    if (web3.currentProvider.constructor.name === "WebsocketProvider")
        web3.currentProvider.connection.close();
}

run().then(() => console.log('Completed'));

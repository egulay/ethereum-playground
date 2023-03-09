import Web3 from "web3";
import {sendEth,scan} from './helper/Web3Helper.cjs'


const NODE_ADDRESS = 'HTTP://127.0.0.1:7545'; //Ganache
const PRIVATE_KEY = '0x5a528508a2128216598f0d0eb8b4f94db9b90c223c4d07869359485ffad1c570';

async function run() {
    const web3 = new Web3(NODE_ADDRESS);
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    const toAddress = await scan('To Address: ');
    const amount = await scan('Amount To Send: ')
    const receipt = await sendEth(web3, account, toAddress, amount);
    console.log(JSON.stringify(receipt, null, 4));
    if (web3.currentProvider.constructor.name === "WebsocketProvider")
        web3.currentProvider.connection.close();
}

run();
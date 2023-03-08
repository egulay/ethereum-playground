import Web3 from "web3";
import fs from 'fs';

const NODE_ADDRESS = 'HTTP://127.0.0.1:7545'; //Ganache
const PRIVATE_KEY = '0x338a5b90c09a4b1e7f9956345410691ab320f098a315a42560d3b4855f18fd1f';
const CONTRACT_ADDRESS = '0x3259490c38D51A2d252A8db2B7ccC80B01121a46'

async function scan(message) {
    process.stdout.write(message);
    return await new Promise(function (resolve) {
        process.stdin.resume();
        process.stdin.once("data", function (data) {
            process.stdin.pause();
            resolve(data.toString().trim());
        });
    });
}

async function getGasPrice(web3) {
    while (true) {
        const nodeGasPrice = await web3.eth.getGasPrice();
        const userGasPrice = await scan(`Enter gas-price or leave empty to use ${nodeGasPrice}: `);
        if (/^\d+$/.test(userGasPrice))
            return userGasPrice;
        if (userGasPrice === "")
            return nodeGasPrice;
        console.log("Illegal gas-price");
    }
}

async function getTransactionReceipt(web3) {
    while (true) {
        const hash = await scan("Enter transaction-hash or leave empty to retry: ");
        if (/^0x([0-9A-Fa-f]{64})$/.test(hash)) {
            const receipt = await web3.eth.getTransactionReceipt(hash);
            if (receipt)
                return receipt;
            console.log("Invalid transaction-hash");
        } else if (hash) {
            console.log("Illegal transaction-hash");
        } else {
            return null;
        }
    }
}

async function send(web3, account, transaction) {
    while (true) {
        try {
            const options = {
                to: transaction._parent._address,
                data: transaction.encodeABI(),
                gas: await transaction.estimateGas({from: account.address}),
                gasPrice: await getGasPrice(web3),
            };
            const signed = await web3.eth.accounts.signTransaction(options, account.privateKey);
            return await web3.eth.sendSignedTransaction(signed.rawTransaction);
        } catch (error) {
            console.log(error.message);
            const receipt = await getTransactionReceipt(web3);
            if (receipt)
                return receipt;
        }
    }
}

async function run() {
    const hello = JSON.parse(fs.readFileSync('build/contracts/Hello.json'));
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

run();

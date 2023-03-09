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

async function sendEth(web3, from, to, value) {
    while (true) {
        try {
            let nonce = await web3.eth.getTransactionCount(from.address, 'latest');
            const options = {
                to: to,
                value: value,
                nonce: nonce,
                gas: await getGasPrice(web3),
            };
            const signed = await web3.eth.accounts.signTransaction(options, from.privateKey);
            return await web3.eth.sendSignedTransaction(signed.rawTransaction);
        } catch (error) {
            console.log(error.message);
            const receipt = await getTransactionReceipt(web3);
            if (receipt)
                return receipt;
        }
    }
}

module.exports = {send, sendEth, scan};
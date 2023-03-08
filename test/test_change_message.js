// reference for our contract's logic
var Hello = artifacts.require("Hello")

// get access to all the accounts of our current environment
contract("Hello", function(accounts) {

    const newMessage = "Hello test!";
    var contractInstance;

    // unit test name
    it("Ops..", function() {
        // the contract will be deployed from the 1st account (accounts[0])
        // i.e. that account will pay the deployment gas fee
        return Hello.deployed().then(function(instance) {
            contractInstance = instance;
            // call the update method, "charging" accounts[1]
            return instance.setMessage(newMessage, {from: accounts[1]});
        }).then(function() {
            return contractInstance.getMessage();
        }).then(function(result) {
            // ...and assert the result
            assert.equal(result, newMessage);
        });
    });
});
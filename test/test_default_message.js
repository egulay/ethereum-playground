// reference for our contract's logic
var Hello = artifacts.require("Hello")

// get access to all the accounts of our current environment
contract("Hello", function(accounts) {

    // unit test name
    it("No wai!", function() {
        // the contract will be deployed from the 1st account (accounts[0])
        // i.e. that account will pay the deployment gas fee
        return Hello.deployed().then(function(instance) {
            // we can now invoke methods
            return instance.getMessage();
        }).then(function(result) {
            // ...and assert the result
            assert.equal(result, "Hello, World!");
        });
    });
});
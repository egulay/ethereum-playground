var Student = artifacts.require("Student")

contract("Student", function (accounts) {

    var contractInstance;

    // unit test name
    it("Problems, problems...", function () {
        // the contract will be deployed from the 1st account (accounts[0])
        // i.e. that account will pay the deployment gas fee
        return Student.deployed().then(function (instance) {
            contractInstance = instance;
            // call the update method, "charging" accounts[1]
            return instance.addStudent({from: accounts[1]});
        }).then(function () {
            return contractInstance.getLength();
        }).then(function (result) {
            // ...and assert the result
            assert.equal(result, 2);
        });
    });
});
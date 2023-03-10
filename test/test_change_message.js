var Hello = artifacts.require('Hello')

contract('Hello', function (accounts) {

    const newMessage = 'Hello test!';
    var contractInstance;

    it('Change Hello Message', function () {
        return Hello.deployed().then(function (instance) {
            contractInstance = instance;
            return instance.setMessage(newMessage, {from: accounts[1]});
        }).then(function () {
            return contractInstance.getMessage();
        }).then(function (result) {
            assert.equal(result, newMessage);
        });
    });
});
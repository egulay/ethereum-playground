var Hello = artifacts.require('Hello')

contract('Hello', function (accounts) {

    it('Default Message', function () {
        return Hello.deployed().then(function (instance) {
            return instance.getMessage({from: accounts[1]});
        }).then(function (result) {
            assert.equal(result, 'Hello, World!');
        });
    });
});
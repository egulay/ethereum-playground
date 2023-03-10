var Pokemon = artifacts.require('Pokemon')

contract('Pokemon', function (accounts) {

    var contractInstance;

    it('New Pokemon', function () {
        return Pokemon.deployed().then(function (instance) {
            contractInstance = instance;
            return contractInstance.getPokemon();
        }).then(function (result) {
            assert.equal(result[1], 'Pikachu');
            return contractInstance.getPrice({from: accounts[1]});
        }).then(function (result) {
            assert.equal(JSON.parse(result), 88888);
        });
    });
});
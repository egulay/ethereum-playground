const Hello = artifacts.require('Hello');
const Pokemon = artifacts.require('Pokemon')

module.exports = function (deployer) {
    deployer.deploy(Hello);
    deployer.deploy(Pokemon, 'Pikachu', 1, 100, '0xc6D75a79927aDbceD152820872C69e6D77dE1DcC', 888888);
};

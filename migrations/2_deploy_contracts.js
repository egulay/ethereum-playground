const Hello = artifacts.require('Hello');
const Pokemon = artifacts.require('Pokemon')

module.exports = function (deployer) {
    deployer.deploy(Hello);
    deployer.deploy(Pokemon, 'Pikachu', 5);
};

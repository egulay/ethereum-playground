// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Pokemon {
    string public name;
    uint256 public level;
    address public owner;
    address public opponent;
    uint256 public health;
    uint256 public price;

    event Battle(string winner, string loser, uint256 health);
    event OwnerChanged(address newOwner);
    event PriceChanged(uint256 newPrice);
    event Sold(address oldOwner, address newOwner, uint256 price);

    constructor(string memory _name, uint256 _level, uint256 _health, address _opponent, uint256 _price) {
        name = _name;
        level = _level;
        owner = msg.sender;
        opponent = _opponent;
        health = _health;
        price = _price;
    }

    function setLevel(uint256 _newLevel) public {
        require(msg.sender == owner, "Only the owner can set the level");
        level = _newLevel;
    }

    function transferOwnership(address _newOwner) public {
        require(msg.sender == owner, "Only the owner can transfer ownership");
        owner = _newOwner;
        emit OwnerChanged(_newOwner);
    }

    function fightOrFlight(address _opponent) public {
        require(msg.sender == owner, "Only the owner can initiate a battle");
        opponent = _opponent;
        health = level * 10;
    }

    function battle() public returns (string memory) {
        require(msg.sender == opponent, "You are not the opponent");
        uint256 opponentHealth = level * 10;
        if (health > opponentHealth) {
            emit Battle(name, "Opponent", health);
            return "You won the battle!";
        }
        else if (health < opponentHealth) {
            emit Battle("Opponent", name, opponentHealth);
            return "You lost the battle :(";
        }
        else {
            emit Battle("Tie", "Tie", health);
            return "The battle ended in a tie.";
        }
    }

    function setPrice(uint256 _newPrice) public {
        require(msg.sender == owner, "Only the owner can set the price");
        price = _newPrice;
        emit PriceChanged(_newPrice);
    }

    function getPokemon() public view returns (address, string memory, uint256, uint256) {
        return (owner, name, level, price);
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function buyPokemon() public payable {
        require(msg.sender != owner, "You already own this Pokemon");
        require(msg.value == price, "The price does not match the value sent");
        address payable oldOwner = payable(owner);
        owner = msg.sender;
        oldOwner.transfer(msg.value);
        emit Sold(oldOwner, msg.sender, msg.value);
    }
}
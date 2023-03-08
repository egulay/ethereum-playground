// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Hello {
    string message;

    event messageChanged(address indexed _from, uint _value);
    constructor() {
        message = "Hello, World!";
    }

    function setMessage(string memory _message) public payable returns (string memory) {
        message = _message;
        emit messageChanged(msg.sender, msg.value);
        return message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}
pragma solidity ^0.5.0;

import './DaiToken.sol';
import './OmniToken.sol';

contract Bank {
    string  public name = "Bank";
    DaiToken public dai;
    OmniToken public omni;
    address public owner;

    address[] public users;
    mapping(address => uint) public stakeBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;
    mapping(address => bool) public hasAttended;

    constructor(DaiToken dai_token, OmniToken omni_token) public {
        dai = dai_token;
        omni = omni_token;
        owner = msg.sender;
    }

    function verify(address std) public{
        // require(std == address('0xA5c9fd70F011447401F066510079BB7290B1dD34'), "Address Problem");
        omni.transfer(std, 1000000000000000000);
        hasAttended[std] = true;
    }


    function stake(uint amount) public{

        require(amount > 0, 'Ammount canot be 0');

        dai.transferFrom(msg.sender, address(this), amount);
        stakeBalance[msg.sender] = stakeBalance[msg.sender] + amount;

        if (!hasStaked[msg.sender]){
            users.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaked[msg.sender] = true;
        hasAttended[msg.sender] = false;
    }

    function reward() public{
        require(msg.sender == owner, 'You dont have access');
        for (uint i=0; i<users.length; i++){
            address recipient = users[i];
            uint balance = stakeBalance[recipient];
            if(balance>0){
                omni.transfer(recipient, balance);
            }
            
        }

    }

    function withdraw() public{
        uint balance = stakeBalance[msg.sender];
        require(balance > 0, 'balance cannot be 0');
        dai.transfer(msg.sender, balance);
        stakeBalance[msg.sender] = 0;
        isStaked[msg.sender] = false;
    }
}
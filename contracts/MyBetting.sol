pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

contract Betting{
    uint256 minimumBet;
    uint256 public maxAmountOfBet;
    uint256 constant public numberOfDice = 3;

    address payable[] public players;
    
    struct Player{
        uint256 amountBet;
        BetType betTypeSelected;
    }
    
    struct BetType{
        bytes32 typeSelected;
        Dice[numberOfDice] diceSelected;
    }
    
    struct Result{
        Dice[numberOfDice] resultDices;
    }
    
    struct Dice{
        bytes32 symbol;
        bytes32 color;
    }
    
    mapping(address => Player) public playerInfo;
    
    constructor() public {
    // 0.0001 ether
      minimumBet = 100000000000000;
   }
   
   function checkPlayerExists(address player) public view returns(bool){
      for(uint256 i = 0; i < players.length; i++){
         if(players[i] == player) return true;
      }
      return false;
   }
   
   function bet(BetType memory playerBetType) public payable{
      require(!checkPlayerExists(msg.sender));
      require(msg.value >= minimumBet);
      playerInfo[msg.sender].amountBet = msg.value;
      playerInfo[msg.sender].betTypeSelected = playerBetType;
      players.push(msg.sender);
   }
   
   function distributePrize(Result memory result) public{
       address payable playerAddress;
       
       for(uint256 i = 0; i < players.length; i++){
           playerAddress = players[i];
       }

   }

   function singleSymbolWinner(address payable playerAddress, Result memory result) public{
        BetType memory pType = playerInfo[playerAddress].betTypeSelected;
        uint256 count = 0;
        uint256 bet = 0;
        
        for(uint256 i = 0; i < pType.diceSelected.length; i++){
            for(uint256 j = 0; j < pType.diceSelected.length; j++){
                if(pType.diceSelected[i].symbol == result.resultDices[j].symbol){
                    count++;
                    delete pType.diceSelected[i].symbol;
                    delete result.resultDices[j].symbol;
                    break;
                }
            }
        }
        
        bet = playerInfo[playerAddress].amountBet;
        playerAddress.transfer(bet+(bet*count));
   }
}

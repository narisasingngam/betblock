pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

contract Betting{
    uint256 private minimumBet;
    uint256 constant private numberOfDice = 3;
    address payable[] public players;
    
    struct Player{
        uint256 amountBet;
        bytes32 typeSelected;
        Dice[] faceSelected;
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
   
   //bet the money
   function bet(bytes32 _typeSelected, bytes32[] memory symbols, bytes32[] memory colors) public payable{
      require(!checkPlayerExists(msg.sender));
      require(msg.value >= minimumBet);
      playerInfo[msg.sender].amountBet = msg.value;
      playerInfo[msg.sender].typeSelected = _typeSelected;
      for(uint256 i = 0; i < 3; i++){
          playerInfo[msg.sender].faceSelected.push(Dice({
              symbol: symbols[i],
              color: colors[i]
          }));
      }
      players.push(msg.sender);
   }
   
   //distribute the prizes for each player following the type of bet.
   function distributePrize(Result memory result) public{
       address payable playerAddress;
       uint256 bet = 0;
       uint256 times = 0;

       for(uint256 i = 0; i < players.length; i++){
           playerAddress = players[i];
           if(playerInfo[playerAddress].typeSelected == "singleSymbol")times = singleSymbolWinner(playerAddress,result);
           
           bet = playerInfo[playerAddress].amountBet;
           playerAddress.transfer(bet+(bet*times));
       }

   }

   /**bet with single symbol selected. 
    * if match 1 die get 1 time of bet, if 2 dice get 2 time of bet, if 3 dice get 3 time of bet.*/
   function singleSymbolWinner(address payable playerAddress, Result memory result) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < p.faceSelected.length; j++){
                if(p.faceSelected[i].symbol == result.resultDices[j].symbol){
                    count++;
                    delete p.faceSelected[i].symbol;
                    delete result.resultDices[j].symbol;
                    break;
                }
            }
        }
        
        times = count;
        return times;
   }
   
}

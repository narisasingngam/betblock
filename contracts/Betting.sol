pragma solidity >0.4.99 <0.6.0;

contract Betting{
    address payable public owner;
    uint256 private minBet;
    uint256 private maxBet;
    uint8 constant private numberOfDice = 3;
    uint8 private numberOfFace = 6;
    uint256 private randomFactor;

    enum Symbol {Apple, Tomato, Brocoli, Cucumber, Carrot, Pineapple}
    enum Color {Red, Green, Orange}
    
    struct Player{
        uint256 amountBet;
        uint8 typeSelected;
        DiceFace[] faceSelected;
        bool isBetSet;
    }
    
    struct DiceFace{
        Symbol symbol;
        Color color;
    }
    
    DiceFace[numberOfDice] resultDices;
    mapping(address => Player) public playerInfo;
    function() external payable {}
    
    constructor() public{
      owner = msg.sender;
    // min is 0.0001 ether and max is 0.01 ether
      minBet = 100000000000000;
      maxBet = 10000000000000000;
      randomFactor = 0;
   }
   
   event Sent(address from, address to, uint amount );
   
   function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
    }
    
   //bet the money
   function bet(uint8 _typeSelected, Symbol[] memory _symbols, Color[] memory _colors) public payable{
      require(playerInfo[msg.sender].isBetSet == false, "You already bet.");
      playerInfo[msg.sender].amountBet = msg.value;
      playerInfo[msg.sender].typeSelected = _typeSelected;
      playerInfo[msg.sender].isBetSet = true;
      randomFactor += playerInfo[msg.sender].amountBet;
      for(uint8 i = 0; i < _symbols.length; i++){
          playerInfo[msg.sender].faceSelected.push(DiceFace({
              symbol: _symbols[i],
              color: _colors[i]
          }));
      }
   }
   
   function setResult(uint256 diceNo, Symbol _symbol, Color _color) public{
       resultDices[diceNo].symbol = _symbol;
       resultDices[diceNo].color = _color;
   }
   
   //distribute the prizes for each player following the type of bet.
   function distributePrize() public{
       address payable player = msg.sender;
       uint256 bet = playerInfo[player].amountBet;
       uint256 times = 0;

           if(playerInfo[player].typeSelected == 1)times = singleDiceSymbolWinner(player);
           else if(playerInfo[player].typeSelected == 2)times = pairDiceSymbolWinner(player);
           else if(playerInfo[player].typeSelected == 3)times = tripleDiceSymbolWinner(player);
           else if(playerInfo[player].typeSelected == 4)times = singleDiceColorWinner(player);
           else if(playerInfo[player].typeSelected == 5)times = pairDiceColorWinner(player);
           else if(playerInfo[player].typeSelected == 6)times = tripleDiceColorWinner(player);
           else if(playerInfo[player].typeSelected == 7)times = tripleColorWinner(player);

           if(times != 0){
                player.transfer(bet+(bet*times));
                emit Sent(owner, player, bet+(bet*times));
           }else{
                owner.transfer(bet);
                emit Sent(player, owner, bet);
           }
    }
   
    // function random() public view returns (uint8) {
    //     uint256 blockValue = uint256(blockhash(block.number-1 + block.timestamp));
    //     blockValue = blockValue + uint256(randomFactor);
    //     return uint8(blockValue % 5) + 1;
    // }
 
    function getDiceSymbol(uint idx) public view returns (Symbol){
        return resultDices[idx].symbol;
    }
    
    function getDiceColor(uint idx) public view returns (Color){
        return resultDices[idx].color;
    }
   
   
   /**bet with single symbol selected. 
    * if match 1 die get 1 time of bet, if 2 dice get 2 time of bet, if 3 dice get 3 time of bet.*/
   function singleDiceSymbolWinner(address payable playerAddress) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < resultDices.length; j++){
                if(p.faceSelected[i].symbol == resultDices[j].symbol){
                    count++;
                }
            }
        }
        
        times = count;
        return times;
   }
   
   function pairDiceSymbolWinner(address payable playerAddress) public returns (uint256 times){
       Player memory p = playerInfo[playerAddress];
       uint256 count = 0;
       
       for(uint256 i = 0; i < p.faceSelected.length; i++){
           for(uint256 j = 0; j < resultDices.length; j++){
               if(p.faceSelected[i].symbol == resultDices[j].symbol){
                   count++;
                   delete p.faceSelected[i];
                   delete p.faceSelected[j];
                   break;
               }
           }
       }
       
       if(count == 2){
           times = 5;
       }else{
           times = 0;
       }
       return times;
   }
   
   function tripleDiceSymbolWinner(address payable playerAddress) public returns (uint256 times){
       Player memory p = playerInfo[playerAddress];
       uint256 count = 0;
       
       for(uint256 i = 0; i < p.faceSelected.length; i++){
           for(uint256 j = 0; j < resultDices.length; j++){
               if(p.faceSelected[i].symbol == resultDices[j].symbol){
                   count++;
                   delete p.faceSelected[i];
                   delete p.faceSelected[j];
                   break;
               }
           }
       }
       
       if(count == 3){
           times = count;
       }else{
           times = 0;
       }
       return times;
   }
   
   function singleDiceColorWinner(address payable playerAddress) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < resultDices.length; j++){
                if(p.faceSelected[i].color == resultDices[j].color){
                    if(count == 1)continue;
                    count++;
                    delete p.faceSelected[i];
                    delete resultDices[j];
                    break;
                }
            }
        }
        
        times = count;
        return times;
   }
   
   function pairDiceColorWinner(address payable playerAddress) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < resultDices.length; j++){
                if(p.faceSelected[i].color == resultDices[j].color){
                    count++;
                    delete p.faceSelected[i];
                    delete resultDices[j];
                    break;
                }
            }
        }
        
        if(count == 2){
            times = 3;
        }else{
            times = 0;
        }
        return times;
   }
   
   function tripleDiceColorWinner(address payable playerAddress) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < resultDices.length; j++){
                if(p.faceSelected[i].color == resultDices[j].color){
                    count++;
                    delete p.faceSelected[i];
                    delete resultDices[j];
                    break;
                }
            }
        }
        
        if(count == 3){
            times = 7;
        }else{
            times = 0;
        }
        return times;
   }
   
   function tripleColorWinner(address payable playerAddress) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < resultDices.length; j++){
                if(p.faceSelected[i].color == resultDices[j].color && p.faceSelected[i].symbol == resultDices[j].symbol){
                    count++;
                    delete p.faceSelected[i];
                    delete resultDices[j];
                    break;
                }
            }
        }
        
        if(count == 3){
            times = 20;
        }else{
            times = 0;
        }
        return times;
   }
}



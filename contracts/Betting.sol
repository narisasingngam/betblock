pragma solidity >=0.5.0 <0.6.0;

contract Betting{
    address payable public owner;
    uint256 private minBet;
    uint256 private maxBet;
    uint8 constant private numberOfDice = 3;
    uint8 private numberOfFace = 6;
    
    enum Symbol {Apple, Tomato, Brocoli, Cucumber, Carrot, Pineapple}
    enum Color {Red, Green, Orange}
    
    struct Player{
        uint256 amountBet;
        uint8 typeSelected;
        DiceFace[] faceSelected;
        bool isBetSet;
        DiceFace[] resultDices;
        uint256 prize;
        uint256 monetToPay;
    }
    
    struct DiceFace{
        Symbol symbol;
        Color color;
    }
    
    // DiceFace[numberOfDice] resultDices;
    mapping(address => Player) public playerInfo;
    function() external payable {}
    
    constructor() public{
      owner = msg.sender;
    // min is 0.0001 ether and max is 0.01 ether
      minBet = 100000000000000;
      maxBet = 10000000000000000;
   }
   
   //event to log if the ether is sent
   event Sent(address from, address to, uint amount );
   
   //kill contract
   function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
    }
    
   //bet the money
   function bet(uint8 _typeSelected, Symbol[] memory _symbols, Color[] memory _colors) public payable{
      require(playerInfo[msg.sender].isBetSet == false, "You already bet.");
      require(msg.value >= minBet && msg.value <= maxBet, "You must bet between 0.0001 and 0.01 ether.");
      playerInfo[msg.sender].amountBet = msg.value;
      playerInfo[msg.sender].typeSelected = _typeSelected;
      playerInfo[msg.sender].isBetSet = true;
      for(uint8 i = 0; i < _symbols.length; i++){
          playerInfo[msg.sender].faceSelected.push(DiceFace({
              symbol: _symbols[i],
              color: _colors[i]
          }));
      }
   }
    
    //set result of dice No. that come from front-end 
   function setResult(Symbol[] memory _symbol, Color[] memory _color) public{
       require(playerInfo[msg.sender].isBetSet == true, "You need to bet first.");
       
       for(uint256 i = 0; i < 3; i++){
           playerInfo[msg.sender].resultDices[i].symbol = _symbol[i];
           playerInfo[msg.sender].resultDices[i].color = _color[i];
       }
   }
   
   //distribute the prizes for each player following the type of bet.
   function distributePrize() public{
       address payable player = msg.sender;
       uint256 bet = playerInfo[player].amountBet;
       uint256 prize = 0;
       uint256 times = 0;

           if(playerInfo[player].typeSelected == 1)times = singleDiceSymbolWinner(player);
           else if(playerInfo[player].typeSelected == 2)times = pairDiceSymbolWinner(player);
           else if(playerInfo[player].typeSelected == 3)times = tripleDiceSymbolWinner(player);
           else if(playerInfo[player].typeSelected == 4)times = singleDiceColorWinner(player);
           else if(playerInfo[player].typeSelected == 5)times = pairDiceColorWinner(player);
           else if(playerInfo[player].typeSelected == 6)times = tripleDiceColorWinner(player);
           else if(playerInfo[player].typeSelected == 7)times = tripleColorWinner(player);

           if(times != 0){
                playerInfo[player].prize = bet*times;
           }else{
                playerInfo[player].prize = 0;
           }
    }
    
    //pay to player if prize != 0 or pay to owner if = 0
    function cashOut() public{
        uint256 bet = playerInfo[msg.sender].amountBet;

        if(playerInfo[msg.sender].prize != 0){
                msg.sender.transfer(bet+playerInfo[msg.sender].prize);
                emit Sent(owner, msg.sender, bet+playerInfo[msg.sender].prize);
           }else{
                owner.transfer(bet);
                emit Sent(msg.sender, owner, bet);
           }
    }
    
    //reset the round
    function reset() public{
        delete playerInfo[msg.sender];
    }
 
    //get symbol of dice No.
    function getDiceSymbol(uint diceNo) public view returns (Symbol){
        return playerInfo[msg.sender].resultDices[diceNo].symbol;
    }
    
    //get color of dice No.
    function getDiceColor(uint diceNo) public view returns (Color){
        return playerInfo[msg.sender].resultDices[diceNo].color;
    }
    
    function getBetStatus() public view returns (bool){
        return playerInfo[msg.sender].isBetSet;
    }
   
    //get balance of this contract
    function getContractBalance() public view returns (uint){
        return address(this).balance;
    }
    
    //get amount to pay 
    function getAmountToPay() public view returns (uint){
        return playerInfo[msg.sender].prize;
    }
    
    //pay by dealer following amount to pay.
    function paybyDealer() public payable{
        require(msg.sender == owner);
        require(address(msg.sender).balance >= msg.value);
        playerInfo[msg.sender].monetToPay += msg.value;
    }
    
   /**bet with single symbol selected. 
    * if match 1 die get 1 times of bet, if 2 dice get 2 time of bet, if 3 dice get 3 time of bet.*/
   function singleDiceSymbolWinner(address payable playerAddress) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        DiceFace[] memory temp = p.resultDices;
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < temp.length; j++){
                if(p.faceSelected[i].symbol == temp[j].symbol){
                    count++;
                }
            }
        }
        
        times = count;
        return times;
   }
   
    /**bet with pair symbol selected. 
    * if match 2 dice get 5 times of bet */
   function pairDiceSymbolWinner(address payable playerAddress) public returns (uint256 times){
       Player memory p = playerInfo[playerAddress];
       DiceFace[] memory temp = p.resultDices;

       uint256 count = 0;

       for(uint256 i = 0; i < p.faceSelected.length; i++){
           for(uint256 j = 0; j < temp.length; j++){
               if(p.faceSelected[i].symbol == temp[j].symbol){
                   count++;
                   delete p.faceSelected[i];
                   delete temp[j];
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
   
   /**bet with single symbol selected. 
    * if match 3 dice get 3 times of bet */
   function tripleDiceSymbolWinner(address payable playerAddress) public returns (uint256 times){
       Player memory p = playerInfo[playerAddress];
       DiceFace[] memory temp = p.resultDices;
       uint256 count = 0;
       
       for(uint256 i = 0; i < p.faceSelected.length; i++){
           for(uint256 j = 0; j < temp.length; j++){
               if(p.faceSelected[i].symbol == temp[j].symbol){
                   count++;
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
   
    /**bet with single color of the symbol selected. 
    * if match 1 of 3 dice get 1 time of bet */
   function singleDiceColorWinner(address payable playerAddress) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        DiceFace[] memory temp = p.resultDices;
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < temp.length; j++){
                if(p.faceSelected[i].color == temp[j].color){
                    if(count == 1)break;
                    count++;
                    delete p.faceSelected[i];
                    delete temp[j];
                    break;
                }
            }
        }
        
        times = count;
        return times;
   }
   
   /**bet with pair color of the symbol selected. 
    * if match 1 pair get 3 times of bet */
   function pairDiceColorWinner(address payable playerAddress) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        DiceFace[] memory temp = p.resultDices;
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < temp.length; j++){
                if(p.faceSelected[i].color == temp[j].color){
                    count++;
                    delete p.faceSelected[i];
                    delete temp[j];
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
   
   /**bet with 3 symbol with the same color is selected. 
    * if match all get 7 times of bet */
   function tripleDiceColorWinner(address payable playerAddress) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        DiceFace[] memory temp = p.resultDices;
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < temp.length; j++){
                if(p.faceSelected[i].color == temp[j].color){
                    count++;
                    delete p.faceSelected[i];
                    delete temp[j];
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
   
   /**bet with 3 symbol with the same color is selected. 
    * it must match all the symbol that player selected
    * if match all get 20 times of bet */
   function tripleColorWinner(address payable playerAddress) public returns (uint256 times){
        Player memory p = playerInfo[playerAddress];
        DiceFace[] memory temp = p.resultDices;
        uint256 count = 0;

        for(uint256 i = 0; i < p.faceSelected.length; i++){
            for(uint256 j = 0; j < temp.length; j++){
                if(p.faceSelected[i].color == temp[j].color && p.faceSelected[i].symbol == temp[j].symbol){
                    count++;
                    delete p.faceSelected[i];
                    delete temp[j];
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



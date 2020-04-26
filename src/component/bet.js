import Cookies from 'universal-cookie';
import React, { Component } from 'react'
import { Row } from 'react-bootstrap';
import { Button, Card, Modal } from 'react-bootstrap';
import './../styles/bet.css';
import Web3 from 'web3'
import DropdownChoice from './../component/DropdownChoice'
import getWeb3 from './../utils/getWeb3'
import BettingContract from './../contracts/Betting.json'
import RollingItem from './RollingItems'

export class Bet extends Component {

  constructor(props) {
    super(props)
    const cookies = new Cookies();
    this.state = {
      username: cookies.get('username'),
      address: cookies.get('address'),
      balance: '',
      start: false,
      reset: false,
      disable: false,
      bettype: "Colour",
      betnum: '1',
      show: false,
      betItem1: "Choose",
      betItem2: "Choose",
      betItem3: "Choose",
      item: ["Apple", "Broccoli", "Carrot", "Tomato", "Cucumber", "Pie apple"],
      colour: ["Red", "Green", "Orange"],
      list: ["Red", "Green", "Orange"],
      web3: '',
      Amount: '',
      InputAmount: '',
      weiConversion: 1000000000000000000,
      resultItem: [],
      array: Array().fill("")
    }
    this.onClick = this.onClick.bind(this)
    this.onClickReset = this.onClickReset.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.loadBlockChain = this.loadBlockChain.bind(this)
    this.changeType = this.changeType.bind(this)
    this.changeValue = this.changeValue.bind(this)
    this.getItem1 = this.getItem1.bind(this)
    this.getItem2 = this.getItem2.bind(this)
    this.getItem3 = this.getItem3.bind(this)
    this.bet = this.bet.bind(this);
    this.confirm = this.confirm.bind(this)
    this.getResultItem = this.getResultItem.bind(this)
  }

  async loadBlockChain() {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8080')
    const network = await web3.eth.net.getNetworkType();
    console.log(network) // should give you main if you're connected to the main network via metamask...

    await web3.eth.getBalance(this.state.address, function (error, wei) {
      if (!error) {
        const balance = web3.utils.fromWei(wei, 'ether');
        console.log(balance + " ETH");
        this.setState({ balance: balance })
      }
    }.bind(this));
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  web3() {
    getWeb3.then(results => {
      /*After getting web3, we save the informations of the web3 user by
      editing the state variables of the component */
      results.web3.eth.getAccounts((error, acc) => {
        //this.setState is used to edit the state variables
        this.setState({
          web3: results.web3
        })
      });
      //At the end of the first promise, we return the loaded web3
      return results.web3
    }).then(results => {
      //In the next promise, we pass web3 (in results) to the getAmount function
      this.getAmount(results)
      console.log("Dai")
    }).catch(() => {
      //If no web3 provider was found, log it in the console
      console.log('Error finding web3.')
    })
  }

  async getContract(){
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    const contract = new web3.eth.Contract(BettingContract.abi, '0x68afA40a306B8712dA0befe1184090b64416Aa37')
    return contract
  }

  async bet() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    const contract = new web3.eth.Contract(BettingContract.abi, '0x68afA40a306B8712dA0befe1184090b64416Aa37')
    contract.methods.bet(1,[1],[1]).send({ from: this.state.address,value: 100000000000000 })
    .then(contract.methods.getBetStatus().call({from: this.state.address})
    .then((isBet) => {console.log(isBet)})
    )
  }

  async setResult() {
    const contract = await this.getContract()
    contract.methods.setResult(0,1,0);
    contract.methods.setResult(1,2,1);
    contract.methods.setResult(2,4,2);
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockChain()
    await this.web3()
  }

  changeType(val) {
    this.setState({ bettype: val })
    if (val === "Colour") {
      this.setState({ list: this.state.colour })
    } else if (val === "Figure") {
      this.setState({ list: this.state.item })
    }
  }

  changeValue(val) {
    this.setState({ betnum: val })
  }

  getItem1(val) {
    this.setState({ betItem1: val })
    var index = 0;
    var data = this.state.list.indexOf(val);
    this.setState(
      ({ array }) => ({ array: [...array.slice(0, index), data, ...array.slice(index+1)] })
    )
  }

  getItem2(val) {
    this.setState({ betItem2: val })
    var index = 1;
    var data = this.state.list.indexOf(val);
    this.setState(
      ({ array }) => ({ array: [...array.slice(0, index), data, ...array.slice(index+1)] })
    )
  }

  getItem3(val) {
    this.setState({ betItem3: val })
    var index = 2;
    var data = this.state.list.indexOf(val);
    this.setState(
      ({ array }) => ({ array: [...array.slice(0, index), data, ...array.slice(index+1)] })
    )
  }

  getResultItem(val){
    this.setState({ resultItem: val})
    console.log(this.state.resultItem)
  }

  onClick(e) {
    this.setState({ start: !this.state.start }, () => {
      setTimeout(() => {
        this.setState({ start: !this.state.start });
        this.setState({ disable: !this.state.disable });
      }, 1500);
    });
    console.log(this.state.array)
  }

  onClickReset(e) {
    this.setState({ reset: true }, () => {
      this.setState({ reset: false });
      this.setState({ disable: !this.state.disable });
    });
    this.setState({resultItem: []})
  }

  handleShow() {
    this.setState({ show: true })
  }

  handleClose() {
    this.setState({ show: false })
  }

  async confirm(){
    this.setState({ show: false })
    await this.bet()
    await this.loadWeb3()
  }

  render() {

    const btype = ["Colour", "Figure"]
    const bnumber = [1, 2, 3]

    return (
      <div>
        <div className="card-bet">
          <div className="card-detail">
            <Card border="light" style={{ width: '25rem', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' }}>
              <Card.Header>Balance wallet: {this.state.balance} ETH</Card.Header>
              <Card.Body>
                <Card.Title>Hello {this.state.username}</Card.Title>
                Bet: <input></input>
                <Button variant="primary" style={{ marginLeft: '25px' }} onClick={this.handleShow}>
                  Enter
                </Button>

                <Modal show={this.state.show} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={this.confirm}>
                      Confirm
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Card.Body>
            </Card>
          </div>
          <RollingItem start={this.state.start} reset={this.state.reset} sendResultItem={this.getResultItem} />
        </div>
        <Button variant="outline-info" className="start-roll" onClick={this.onClick} disabled={this.state.disable}>
          ROLL
        </Button>
        <Button variant="outline-info" className="reset-btn" onClick={this.onClickReset}>RESET</Button>
        <Row className="row-bet">
          <div className="word">Bet type:</div>
          <DropdownChoice item={btype} theme={"info"} title={this.state.bettype} sendData={this.changeType} />

          <div className="word">Bet number:</div>
          <DropdownChoice item={bnumber} theme={"info"} title={this.state.betnum} sendData={this.changeValue} />

          {(() => {
            const num = this.state.betnum
            const list_item = this.state.list

            if (num === '1') {
              return <div>
                <DropdownChoice item={list_item} theme={"outline-secondary"} title={this.state.betItem1} sendData={this.getItem1} />
              </div>;
            } else if (num === '2') {
              return <div style={{ display: 'flex' }} >
                <DropdownChoice item={list_item} theme={"outline-secondary"} title={this.state.betItem1} sendData={this.getItem1} />
                <DropdownChoice item={list_item} theme={"outline-secondary"} title={this.state.betItem2} sendData={this.getItem2} />
              </div>;
            } else {
              return <div style={{ display: 'flex' }} >
                <DropdownChoice item={list_item} theme={"outline-secondary"} title={this.state.betItem1} sendData={this.getItem1} />
                <DropdownChoice item={list_item} theme={"outline-secondary"} title={this.state.betItem2} sendData={this.getItem2} />
                <DropdownChoice item={list_item} theme={"outline-secondary"} title={this.state.betItem3} sendData={this.getItem3} />
              </div>;
            }
          })()}
        </Row>
      </div>
    )
  }
}


export default Bet
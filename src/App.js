import React from 'react';
import './App.css';
import MetaMaskLoginButton from 'react-metamask-login-button';
import Web3 from 'web3'
import history from "./history";
import { Button,Card } from 'react-bootstrap';

export default class App extends React.Component {
  state = 
  {
    account: '',
  }

  async loadBlockChain() {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8080')
    const network = await web3.eth.net.getNetworkType();
    console.log(network) // should give you main if you're connected to the main network via metamask...
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    
  }

  componentDidMount() {
    this.loadBlockChain()
  }
  render() {

    const renderAuthButton = () =>{
      if(this.state.account !== undefined){
        return <div className="adress">
                <Card body className="card-ad">Account address: {this.state.account}</Card>
                <Button variant="success" className="start-btn" onClick={()=> history.push('/Home')}>Start</Button>
              </div>
      } else{
        return <p></p>
      }
    }
  
    return (
      <div>
        <div className="signin-btn">
        <MetaMaskLoginButton/>
        </div>
          {renderAuthButton()}
      </div>
    );
  }
}



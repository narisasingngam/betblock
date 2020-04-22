import React from 'react';
import './App.css';
import MetaMaskLoginButton from 'react-metamask-login-button';
import Web3 from 'web3'
import history from "./history";
import { Button, Card, InputGroup, FormControl } from 'react-bootstrap';
import Cookies from 'universal-cookie';

export default class App extends React.Component {

  constructor(props){
    super(props)
    this.state = 
                {
                  account: '',
                  name: ''
                }
   this.handleChange = this.handleChange.bind(this);

  }
  

  async loadBlockChain() {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8080')
    const network = await web3.eth.net.getNetworkType();
    console.log(network) // should give you main if you're connected to the main network via metamask...
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

  }

  handleChange(event){
      this.setState({name: event.target.value})
  }

  componentDidMount() {
    this.loadBlockChain()
  }
  render() {
    const cookies = new Cookies();
    cookies.set('username', this.state.name , { path: '/' });
    console.log(cookies.get('username'));

    const renderAuthButton = () => {
      if (this.state.account !== undefined) {
        return <div className="adress">
          <Card body className="card-ad">Account address: {this.state.account}</Card>
          <Card body className="card-input">Create Name :
          <InputGroup className="mb-3">
              <FormControl
                placeholder="Name"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                onChange={this.handleChange}
                value={this.state.name}
              />
            </InputGroup></Card>
          <Button variant="success" className="start-btn" onClick={() => history.push('/home')}>Start</Button>
        </div>
      } else {
        return <p></p>
      }
    }

    return (
      <div>
        <div className="signin-btn">
          <MetaMaskLoginButton />
        </div>
        {renderAuthButton()}
      </div>
    );
  }
}



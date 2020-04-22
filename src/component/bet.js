import { Row } from 'react-bootstrap';
import { Image , Button} from 'react-bootstrap';
// import logo from './logo.svg';
import './../styles/bet.css';
import Cookies from 'universal-cookie';

import React, { Component } from 'react'

export class Bet extends Component {

  constructor(props){
    super(props)
    const cookies = new Cookies();
    this.state = {
      username: cookies.get('username')
    }
  }

  render() {
    return (
      <div>
        <div className="username">
           Hello {this.state.username}
        </div>
        <Row>
            <Image className="pic" src="https://i.pinimg.com/originals/04/98/65/0498659455374a06c7db95f3a55222bd.jpg"  rounded/>
            <Image className="pic" src="https://i.pinimg.com/originals/04/98/65/0498659455374a06c7db95f3a55222bd.jpg"  rounded/>
            <Image className="pic" src="https://i.pinimg.com/originals/04/98/65/0498659455374a06c7db95f3a55222bd.jpg"  rounded/>
        </Row>
        <Button className="button">roll </Button>
        <Row>
        </Row>
      </div>
    )
  }
}

export default Bet
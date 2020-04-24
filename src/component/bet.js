import Cookies from 'universal-cookie';
import React, { Component,useState } from 'react'
import ReactDOM from 'react-dom'
import { Row, Col } from 'react-bootstrap';
import { Button, Dropdown, DropdownButton, Card, Modal } from 'react-bootstrap';
import RollingItem from 'react-rolling-item';
import './../styles/bet.css';
import img from '../pic/bg-fruit.png'

export class Bet extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: cookies.get('username'),
      start: false,
      reset: false,
      disable: false,
      bettype: "Colour",
      betnum: "1",
      show: false,
      betItem: "Apple",
    }
    this.onClick = this.onClick.bind(this)
    this.onClickReset = this.onClickReset.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleShow = this.handleShow.bind(this)
  }

  changeType(text) {
    this.setState({ bettype: text })
  }

  changeValue(text) {
    this.setState({ betnum: text })
  }

  onClick(e) {
    this.setState({ start: !this.state.start }, () => {
      setTimeout(() => {
        this.setState({ start: !this.state.start });
        this.setState({ disable: !this.state.disable });
      }, 1500);
    });
  }

  onClickReset(e) {
    this.setState({ reset: true }, () => {
      this.setState({ reset: false });
      this.setState({ disable: !this.state.disable });
    });
  }

  handleShow(){
    this.setState({show: true})
  }

  handleClose(){
    this.setState({show: false})
  }

  render() {

    const  item = ["Apple","Broccoli","Carrot","Tomato","Cucumber","Pie apple"];


    return (
      <div>
        <div className="card-bet">
          <div className="card-detail">
            <Card border="light" style={{ width: '25rem' }}>
              <Card.Header>Balance wallet: 50000</Card.Header>
              <Card.Body>
                <Card.Title>Hello {this.state.username}</Card.Title>
                Bet: <input></input>
                <Button variant="primary" style={{ marginLeft: '25px' }} onClick={this.handleShow}>
                  Confirm
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
                    <Button variant="primary" onClick={this.handleClose}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Card.Body>
            </Card>
          </div>
          <div className="roll">
            <RollingItem
              on={this.state.start}
              column={3}
              backgroundImage={img}
              backgroundSize="600px 564px"
              introItemInfo={{ x: -437, y: -406 }}
              itemInfo={
                [
                  { x: -39, y: -217, id: 'item_1', probability: 0 },
                  { x: -39, y: -406, id: 'item_2', probability: 0 },
                  { x: -241, y: -28, id: 'item_3', probability: 0 },
                  { x: -241, y: -217, id: 'item_4', probability: 0 },
                  { x: -241, y: -406, id: 'item_5', probability: 0 },
                  { x: -39, y: -28, id: 'item_1', probability: 0 },
                  // { x: -437, y: -28, id: 'item_6', probability: 0 },
                  //   { x: -437, y: -217, id: 'item_7', probability: 0 },
                  //  { x: -437, y: -406, id: 'item_8', probability: 0 },
                ]
              }
              width={177}
              height={181}
              startDelay={1000}
              fixedIds={[3, 4, 7]}
              reset={this.state.reset}
              completionAnimation={true}
              onProgress={(isProgress, result) => { console.log(result); }}
            />
          </div>
        </div>
        <Button variant="outline-primary" className="start-roll" onClick={this.onClick} disabled={this.state.disable}>
          ROLL
        </Button>
        <Button variant="outline-primary" className="reset-btn" onClick={this.onClickReset}>RESET</Button>
        <Row className="row-bet">
          <div className="word">Bet type:</div>
          <DropdownButton className="dropdown" id={"dropdown-bet"} variant="info" size="lg" title={this.state.bettype}>
            <Dropdown.Item>
              <div onClick={(e) => this.changeType(e.target.textContent)}>Colour</div>
            </Dropdown.Item>
            <Dropdown.Item>
              <div onClick={(e) => this.changeType(e.target.textContent)}>Figure</div>
            </Dropdown.Item>
          </DropdownButton>
          <div className="word">Bet number:</div>
          <DropdownButton className="dropdown" id={"dropdown-number"} variant="outline-secondary" size="lg" title={this.state.betnum}>
            <Dropdown.Item>
              <div onClick={(e) => this.changeValue(e.target.textContent)}>1</div>
            </Dropdown.Item>
            <Dropdown.Item>
              <div onClick={(e) => this.changeValue(e.target.textContent)}>2</div>
            </Dropdown.Item>
            <Dropdown.Item>
              <div onClick={(e) => this.changeValue(e.target.textContent)}>3</div>
            </Dropdown.Item>
          </DropdownButton>
          <DropdownButton className="dropdown" id={"dropdown-number"} variant="outline-secondary" size="lg" title={this.state.betItem}>
            { item.map(function(object, i){
               return <Dropdown.Item>
               <div onClick={(e) => this.changeValue(e.target.textContent)}>{object}</div>
             </Dropdown.Item>;
               })}
          </DropdownButton>
        </Row>
      </div>
    )
  }
}

export default Bet
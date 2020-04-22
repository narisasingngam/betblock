import React, { Component } from 'react'
import { Row } from 'react-bootstrap';
import { Image , Button} from 'react-bootstrap';
import RollingItem from 'react-rolling-item';
import './../styles/bet.css';
import img from '../pic/bg-fruit.png'



export class Bet extends Component {

  constructor(props){
    super(props)
    this.state = {
      username: this.props.location.state.name, 
      start: false,
      reset: false,
    }
    this.onClick = this.onClick.bind(this)
    this.onClickReset = this.onClickReset.bind(this)
  }

  onClick(e) {
    this.setState({ start: !this.state.start }, () => {
      setTimeout(() => {
        this.setState({ start: !this.state.start });
      }, 1500);
    });
  }

  onClickReset(e) {
    this.setState({ reset: true }, () => {
      this.setState({ reset: false });
    });
  }

  render() {
    return (
      <div>
        <div>
           Hello {this.state.username}
        </div>
          <div className="roll">
          <RollingItem
            on={this.state.start}
            column={3}
            backgroundImage={img}
            backgroundSize="600px 564px"
            introItemInfo={{x: -39, y: -28}}
            itemInfo={
              [
                { x: -39, y: -217, id: 'item_1', probability: 0 },
                { x: -39, y: -406, id: 'item_2', probability: 0 },
                { x: -241, y: -28, id: 'item_3', probability: 0 },
                { x: -241, y: -217, id: 'item_4', probability: 0 },
                { x: -241, y: -406, id: 'item_5', probability: 0 },
                { x: -437, y: -28, id: 'item_6', probability: 0 },
                { x: -437, y: -217, id: 'item_7', probability: 0 },
               { x: -437, y: -406, id: 'item_8', probability: 0 },
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
        <Button variant="outline-primary" className="start-roll" onClick={this.onClick}>
          {!this.state.start ? 'START' : 'STOP'}
        </Button>
        <Button variant="outline-primary" className="reset-btn" onClick={this.onClickReset}>RESET</Button>
      </div>
    )
  }
}

export default Bet

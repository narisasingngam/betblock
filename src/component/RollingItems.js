import React, { Component } from 'react'
import img from '../pic/bg-fruit.png'
import RollingItem from 'react-rolling-item';

export class RollingItems extends Component {

    getItem(object){
      this.props.sendResultItem(object)
    }

    render() {
        return (
            <div className="roll">
            <RollingItem
              on={this.props.start}
              column={3}
              backgroundImage={img}
              backgroundSize="600px 564px"
              introItemInfo={{ x: -437, y: -406 }}
              itemInfo={
                [
                  { x: -39, y: -28, id: 0, probability: 0 },
                  { x: -241, y: -28, id: 1, probability: 0 },
                  { x: -39, y: -217, id: 2, probability: 0 },
                  { x: -241, y: -217, id: 3, probability: 0 },
                  { x: -39, y: -406, id: 4, probability: 0 },
                  { x: -241, y: -406, id: 5, probability: 0 },
                  // { x: -437, y: -28, id: 'item_6', probability: 0 },
                  //   { x: -437, y: -217, id: 'item_7', probability: 0 },
                  //  { x: -437, y: -406, id: 'item_8', probability: 0 },
                ]
              }
              width={177}
              height={181}
              startDelay={1000}
              fixedIds={[3, 4, 7]}
              reset={this.props.reset}
              completionAnimation={true}
              onProgress={(isProgress, result) => {this.getItem(result)}}
            />
          </div>
        )
    }
}

export default RollingItems

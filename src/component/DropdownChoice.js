import React, { Component } from 'react'
import { DropdownButton, Dropdown} from 'react-bootstrap'

export class DropdownChoice extends Component {


    changeItem(object) {
        console.log(object)
        this.props.sendData(object);
    }
    
    render() {
        return (
                <DropdownButton className="dropdown" id={"dropdown-number"} variant="outline-secondary" size="lg" title={this.props.title}>
                    {this.props.item.map((object, i) => {
                        return (<Dropdown.Item >
                            <div onClick={(e) => this.changeItem(e.target.textContent)}>{object}</div>
                        </Dropdown.Item>
                        )
                    })}
                </DropdownButton>
        )
    }
}

export default DropdownChoice
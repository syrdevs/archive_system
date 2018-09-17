import React, { Component, PropTypes } from 'react';

class Book extends Component {

  static propTypes = {
    modules: PropTypes.object.isRequired,
    handleMouseEnter: PropTypes.func.isRequired
  };

  render() {
    const {name, description, front, left, back} = this.props.modules;
    return (
      <div className="bk-book" onMouseEnter={() => {this.props.handleMouseEnter(name, description)} }>
        <div className="bk-front"> <p> {front} </p> </div>
        <div className="bk-back"> {back} </div>
        <div className="bk-left"> <p>{left}</p> </div>
        <div className="bk-top"> </div>
      </div>
    );
  }
}

export default Book;

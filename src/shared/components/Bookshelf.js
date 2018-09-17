import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Book from './Book';


class Bookshelf extends Component {

  constructor(props) {
    super(props);

    this.state = {
      title: 'title',
      description: 'desc',
      modules: [
        {
          name: 'test1',
          description: 'test-description1',
          front: 'test-front',
          left: 'test-left',
          back: 'test-back',
          top: 'test-top'
        },
        {
          name: 'test2',
          description: 'test-description2',
          front: 'test-front',
          left: 'test-left',
          back: 'test-back',
          top: 'test-top'
        },
        {
          name: 'test3',
          description: 'test-description3',
          front: 'test-front',
          left: 'test-left',
          back: 'test-back',
          top: 'test-top'
        },
        {
          name: 'test4',
          description: 'test-description4',
          front: 'test-front',
          left: 'test-left',
          back: 'test-back',
          top: 'test-top'
        },
        {
          name: 'test5',
          description: 'test-description5',
          front: 'test-front',
          left: 'test-left',
          back: 'test-back',
          top: 'test-top'
        },
        {
          name: 'test1',
          description: 'test-description1',
          front: 'test-front',
          left: 'test-left',
          back: 'test-back',
          top: 'test-top'
        },
        {
          name: 'test2',
          description: 'test-description2',
          front: 'test-front',
          left: 'test-left',
          back: 'test-back',
          top: 'test-top'
        },
        {
          name: 'test3',
          description: 'test-description3',
          front: 'test-front',
          left: 'test-left',
          back: 'test-back',
          top: 'test-top'
        },
        {
          name: 'test4',
          description: 'test-description4',
          front: 'test-front',
          left: 'test-left',
          back: 'test-back',
          top: 'test-top'
        },
        {
          name: 'test5',
          description: 'test-description5',
          front: 'test-front',
          left: 'test-left',
          back: 'test-back',
          top: 'test-top'
        }
      ],
      lang: 'ru'
    };

  }

  handleMouseEnter = (name, desc) => {
    this.setState({
      title: name,
      description: desc
    });
  };

  renderModules = (item, idx) => {
    return (
      <li key={ idx } style={ {zIndex: 10/2 - Math.abs(10/2 - (idx+1))} }> {/*10 - количество книг*/}
        <Link to="/main"> <Book modules={ item } handleMouseEnter={this.handleMouseEnter}/> </Link>
      </li>
    );
  };

  render() {
    return (
      <div className="bookshelf">
        <h2 className="title"> {this.state.title} </h2>
        <ul className='bk-list clearfix'>
          { this.state.modules.map(this.renderModules) }
        </ul>
        <p className="desc"> {this.state.description} </p>
      </div>
    );
  }
}

export default Bookshelf;

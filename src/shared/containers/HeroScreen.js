import React, { Component } from 'react';
// import { Link, Route, Switch } from 'react-router-dom';
// import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


/*function SampleNextArrow(props) {
  const {className, style, onClick} = props;
  return (
    <button
      className={className}
      style={{...style, display: 'block'}}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const {className, style, onClick} = props;
  return (
    <button
      className={className}
      style={{...style, display: 'block'}}
      onClick={onClick}
    />
  );
}*/

class HeroScreen extends Component {

  render() {
    /*var settings = {
      accessibility: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };*/
    return (
      <div className="hero">
        {/*<Slider {...settings}>
          <div>
            <i className="hero-box__img logo" />
            <Link to="/collections" className="hero-box__title">Провозглашение государственной независимости Республики Казахстан (16.12.1991)</Link>
          </div>
          <div>
            <i className="hero-box__img logo" />
            <Link to="/collections" className="hero-box__title">Казахстан стал членом ОБСЕ (02.01.1992)</Link>
          </div>
          <div>
            <i className="hero-box__img logo" />
            <Link to="/collections" className="hero-box__title">Введение национальной валюты (15.11.1993)</Link>
          </div>
          <div>
            <i className="hero-box__img logo" />
            <Link to="/collections" className="hero-box__title">Первые выборы в Парламент Казахстана (7.03.1994)</Link>
          </div>
          <div>
            <i className="hero-box__img logo" />
            <Link to="/collections" className="hero-box__title">Голод 1930-х гг</Link>
          </div>
          <div>
            <i className="hero-box__img logo" />
            <Link to="/collections" className="hero-box__title">Революция и Гражданская война</Link>
          </div>
        </Slider>*/}
        <div className="hero-content">
          <span className="hero-content__title">Путеводитель по фондам</span>
        </div>
      </div>
    );
  }
}

export default HeroScreen;

import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaQuestionCircle, FaShoppingCart, FaSignIn, FaPlusCircle }  from 'react-icons/lib/fa';
import { MdLanguage, MdHome } from 'react-icons/lib/md';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Badge } from 'antd';
import moment from 'moment';
import { Basket } from './Basket'

import gerb from '../assets/img/Gerb.png';

import {addCaseToBasket, logout, removeCaseFromBasket} from '../actions/actions';

const LoggedInNav = props => {
  const { basket, basketState, basketIsShown, showBasket, hideBasket, router, t, removeCaseFromBasket, addCaseToBasket } = props;
  const handleListItemClick = item => {
    if(basket.some(el => el.key === item.key)) removeCaseFromBasket(item);
      else addCaseToBasket(item);
  };

  return (
    <div className="nav-wrapper">
      <Link className="nav-wrapper__link" to="/"> <span title={t('MAIN')}><MdHome size={20} /></span> </Link>
      {router.pathname === '/readingRoom'
        &&
        <div className="nav-wrapper__basket" tabIndex={0}>
          <Badge count={basket.length} onClick={showBasket}><FaShoppingCart size={20}/></Badge>
          <Basket 
              show={basketIsShown} 
              title={'Корзина'}
              t={t}
              onOk={()=>{console.log('ok click')}}
              onCancel={hideBasket}
              basketState={basketState} 
              handleListItemClick={handleListItemClick}
              basket={basket}
              width={900}
              />
        </div>
      }
      <div className="nav-wrapper__lang">
        <Badge count={localStorage.getItem('i18nextLng')}><MdLanguage size={20} /></Badge>
        <ul className="langDropdown">
          <li className="langDropdown__list" onClick={() => {props.changeLanguage('kz')}}>kz</li>
          <li className="langDropdown__list" onClick={() => {props.changeLanguage('ru')}}>ru</li>
          <li className="langDropdown__list" onClick={() => {props.changeLanguage('en')}}>en</li>
        </ul>
      </div>
      <Link className="nav-wrapper__link" to="/help"> <span title={t('HELP')}><FaQuestionCircle size={20}/></span> </Link>
      <div className="nav-wrapper__profile">
        <div> <FaUser size={20}/> </div>
        <ul className="profileDropdown">
          <li className="profileDropdown__list"><Link to='/profile'> Мой профиль </Link></li>
          <li className="profileDropdown__list"><Link to="/" onClick={props.handleLogout}> Выйти </Link></li>
        </ul>
      </div>
    </div>
    );
};

const LoggedOutNav = (props) => {

  const { t } = props;

  return (
    <div className="nav-wrapper">
      <Link className="nav-wrapper__link" to="/"> <span title={t('MAIN')}><MdHome size={20} /></span> </Link>
      <div className="nav-wrapper__lang">
        <Badge count={localStorage.getItem('i18nextLng')}><MdLanguage size={20} /></Badge>
        <ul className="langDropdown">
          <li className="langDropdown__list" onClick={() => {props.changeLanguage('kz')}}>kz</li>
          <li className="langDropdown__list" onClick={() => {props.changeLanguage('ru')}}>ru</li>
          <li className="langDropdown__list" onClick={() => {props.changeLanguage('en')}}>en</li>
        </ul>
      </div>
      <Link className="nav-wrapper__link" to="/login"><span title={t('LOGIN')}><FaSignIn size={20}/></span></Link>
      <Link className="nav-wrapper__link" to="/signup"><span title={t('SIGNUP')}><FaPlusCircle size={20}/></span></Link>
      <Link className="nav-wrapper__link" to="/help"> <span title={t('HELP')}><FaQuestionCircle size={20}/></span> </Link>
    </div>
  );
};


class Header extends React.Component{
  state = {
    showBasket: false,
    basketState: []
  };

  changeLanguage = (lng) => {
    this.props.i18n.changeLanguage(lng);
    switch (lng) {
      case 'en': moment.locale('en-gb'); break;
      case 'ru': moment.locale('ru'); break;
      case 'kz': moment.locale('kz'); break;
      default: moment.locale('kz'); break;
    }
  };

  showBasket = () => {
    this.setState({ showBasket: true, basketState: this.props.basket.slice() });
  };

  focusInCurrentTarget = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget === null) return false;

    let node = relatedTarget.parentNode;

    while (node !== null) {
      if (node === currentTarget) return true;
      node = node.parentNode;
    }

    return false;
  };

  hideBasket = e => {
    // if(this.focusInCurrentTarget(e)) return;
    this.setState({showBasket: false});
  };

  render() {
    const { t, router, logout, removeCaseFromBasket, basket, addCaseToBasket } = this.props;
    const { basketState, showBasket } = this.state;

    return (
      <header className="header">
        {this.props.children}
        <div className="header__logo" >
          <div className="header__logo__name">
            <h3>{t('TITLE_1_1')}</h3>
            <h3>{t('TITLE_1_2')}</h3>
          </div>
            <img src={gerb} alt="logo"/>
          <div className="header__logo__system">
            <h3>{t('TITLE_2_1')}</h3>
            <h3>{t('TITLE_2_2')}</h3>
          </div>
        </div>
        { this.props.user ?
          <LoggedInNav
            basket={basket}
            basketState={basketState}
            changeLanguage={this.changeLanguage}
            handleLogout={logout}
            t ={ t }
            showBasket={this.showBasket}
            hideBasket={this.hideBasket}
            basketIsShown={ showBasket }
            router={router}
            removeCaseFromBasket={removeCaseFromBasket}
            addCaseToBasket={addCaseToBasket}
          />
          :
          <LoggedOutNav
            changeLanguage={this.changeLanguage}
            t={ t }
          />
        }
      </header>
    )
  }
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    changeLanguage: PropTypes.func.isRequired
  }).isRequired,
  basket: PropTypes.array,
  user: PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    basket: state.readingRoom.basket,
    router: state.router.location
  }
}



export default connect(mapStateToProps, { logout, removeCaseFromBasket, addCaseToBasket } )(translate('header')(Header));

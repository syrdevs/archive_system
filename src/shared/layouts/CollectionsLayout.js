import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import { push } from 'react-router-redux';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

import { store } from '../../App'
import Header from '../components/Header';
import Sider2 from '../components/Sider2';
import HeroScreen from '../containers/HeroScreen';
import CollectionsScreen from '../containers/CollectionsScreen';
import ProfileScreen from '../containers/ProfileScreen';
import LoginScreen from '../../auth/LoginScreen';
import SignupScreen from '../../auth/SignupScreen';
import ReadingRoom from '../containers/ReadingRoom';
import Footer from '../components/Footer';
import { redirect, onAppLoad, getAllConstants } from '../actions/actions';
import LeaderWorkplace from '../containers/LeaderWorkplace';
import ForgotPassword from '../containers/ForgotPassword';
import ReadingRoomAdmin from '../containers/ReadingRoomAdmin';
import NSA from '../containers/NSA';
import {LOGIN_SUCCESS} from '../actions/actionTypes';
import Sourcing from '../containers/Sourcing';
import ArchiveFundRoutes from '../components/ArchiveFundPages/ArchiveFundRoutes';

class CollectionsLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: [
        {
          name: 'Комплектование',
          pathStart: '/sourcing',
          iconType: 'folder-add',
          children: [
            {
              name: 'Фондообразователи',
              path: '/sourcing/fundMaker'
            },
            {
              name: 'Источники комплектования',
              path: '/sourcing/sourcesMaintenance'
            },
            {
              name: 'График приема архивных документов',
              path: '/sourcing/schedule'
            },
            {
              name: 'План проверки источников комплектования',
              path: '/sourcing/checking'
            },
            {
              name: 'Работы по комплектованию',
              path: '/sourcing/works'
            }
          ]
        },
        {
          name: 'Учет и хранение',
          iconType: 'check-circle-o',
          pathStart: '/archiveFund',
          children: [
            {
              name: 'Архивные фонды',
              path: '/archiveFund/fundsList'
            },
            {
              name: 'График проверки наличия',
              path: '/archiveFund/checking'
            },
            /*{
              name: 'Движение архивных документов',
              path: '/archiveFund/movement'
            },*/
            {
              name: 'Работы по учету и хранению',
              path: '/archiveFund/works'
            }
          ]
        },
        {
          name: 'Научно-справочный аппарат',
          iconType: 'file-text',
          pathStart: '/sra',
          children: [
            {
              name: 'Схемы классификации',
              path: '/sra/classificationSchemas'
            },
            {
              name: 'Справочники и классификаторы',
              path: '/sra/searchPage'
            },
            {
              name: 'Архивные документы',
              path: '/sra/createDocument'
            },
            /*{
              name: 'Тематические обзоры',
              path: '/createCollection'
            },*/
            {
              name: 'Работы по ведению НСА',
              path: '/sra/works'
            }
          ]
        },
        {
          name: 'Использование',
          iconType: 'desktop',
          pathStart: '/uses',
          children: [
            {
              name: 'Исследователи',
              path: '/uses/researchers'
            },
            {
              name: 'Читальный зал',
              path: '/readingRoom'
            },
            {
              name: 'Запросы на получение архивной справки',
              path: '/uses/inquiryReq'
            },
            {
              name: 'Работы по оказанию архивных услуг',
              path: '/uses/archiveServiceWorks'
            }
          ]
        },
        {
          name: 'Управление',
          iconType: 'pie-chart',
          pathStart: '/managing',
          children: [
            {
              name: 'Паспорт архива',
              path: '/managing/archivePassport'
            },
            {
              name: 'Отчеты',
              path: '/managing/reports'
            },
            {
              name: 'Работы по управлению архивом',
              path: '/managing/works'
            }
          ]
        },
        {
          name: 'Администрирование',
          iconType: 'key',
          pathStart: '/admin',
          children: [
            {
              name: 'Пользователи',
              path: '/admin/users'
            },
            {
              name: 'Роли пользователей',
              path: '/admin/userRoles'
            }
          ]
        }
      ]
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      store.dispatch(push(nextProps.redirectTo));
      this.props.redirect();
    }
    if(nextProps.globalError) {
      Modal.error({
        title: nextProps.globalError
      })
    }
  }

  // Server should send an error message?
  componentDidMount() {
    this.props.onAppLoad()
      .then(action => {
        if(action.type === LOGIN_SUCCESS){
          this.props.getAllConstants();
        }
      }).catch(err => {
        console.log(err);
    })
  }

  render() {
    const { user, tofiConstants, location } = this.props;

    return (
      <div className="main-layout">
        <Header />

        <div className="collections content">
          { this.props.user && <Sider2 navs={this.state.collections} pathname={location.pathname}/> }
          {/*<Sider navs={this.state.collections} />*/}


          <div className={`${ !user ? 'collections__content-noUser' : 'collections__content' }`}>
            <Switch>
              <Route exact path="/" component={HeroScreen} />
              <Route path="/collections" component={CollectionsScreen} />
              <Route exact path="/profile" component={ProfileScreen} />
              <Route exact path="/login" component={LoginScreen} />
              <Route exact path="/forgot_password" component={ForgotPassword} />
              <Route exact path="/signup" component={SignupScreen} />
              <Route exact path="/readingRoom" component={ReadingRoom} />
              <Route path="/archiveFund" render={props => <ArchiveFundRoutes tofiConstants={tofiConstants} {...props}/>} />
              <Route path="/sourcing" component={Sourcing} />
              <Route exact path="/leaderWorkplace" component={LeaderWorkplace} />
              <Route path="/readingRoomAdmin" component={ReadingRoomAdmin} />
              <Route path="/sra" render={props => <NSA tofiConstants={tofiConstants} {...props}/>} />
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

CollectionsLayout.propTypes = {
  user: PropTypes.object,
  appLoaded: PropTypes.object,
  currentUser: PropTypes.object,
  redirectTo: PropTypes.string,
  redirect: PropTypes.func.isRequired,
  onAppLoad: PropTypes.func.isRequired,
  getAllConstants: PropTypes.func.isRequired,
  globalError: PropTypes.string,
  tofiConstants: PropTypes.shape()
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    appLoaded: state.common.appLoaded,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo,
    globalError: state.common.globalError,
    tofiConstants: state.generalData.tofiConstants
  }
};

export default connect(mapStateToProps, { redirect, onAppLoad, getAllConstants } )(CollectionsLayout);

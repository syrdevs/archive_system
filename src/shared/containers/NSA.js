import React, { Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types'
import SearchNSA from '../components/NSAPages/SearchNSA';
import CreateDocument from '../components/NSAPages/CreateDocument';
import EditNSAPage from '../components/NSAPages/EditNSAPage';
import ClassificationSchemas from '../components/NSAPages/ClassificationSchemas'
import {Route, Switch} from 'react-router-dom';

class NSA extends Component {

  render() {
    const { t, tofiConstants } = this.props;

    return (
      <div className="NSA">
        <h2>Научно-справочный аппарат</h2>
        <Switch>
        <Route exact path="/sra/classificationSchemas" render={props => <ClassificationSchemas t={t} {...props}/> }/>
        <Route exact path="/sra/searchPage" render={props => <SearchNSA t={t} {...props}/> } />
        <Route exact path="/sra/createDocument" render={props => <CreateDocument t={t} {...props}/> } />
        <Route exact path="/sra/createDocument/:type/:id" render={props => <EditNSAPage t={t} {...props} tofiConstants={tofiConstants}/>} />
      </Switch>
      </div>
    )
  }
}

NSA.propTypes = {
  t: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape()
};

export default translate('NSA')(NSA);


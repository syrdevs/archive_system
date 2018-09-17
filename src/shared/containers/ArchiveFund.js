import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { translate } from 'react-i18next';
import { DatePicker  } from 'antd'
import moment from 'moment'

import AntTabs from '../components/AntTabs';
import FundsList from '../components/ArchiveFundPages/FundsList';
import EditFundCardPage from '../components/ArchiveFundPages/EditFundCardPage';
import ViewInventCardPage from '../components/ArchiveFundPages/ViewInventCardPage';
import ViewCardCases from '../components/ArchiveFundPages/ViewCardCasesPage';
import ViewCardDocuments from '../components/ArchiveFundPages/ViewCardDocumentsPage';

class ArchiveFund extends React.Component {

  constructor(props) {
    super (props);

    this.state = {}
  }

  handleTabChange = key => {
    console.log(key);
  };

  handleTabClick = key => {
    if(key === 'fundList') {
      this.props.history.push('/archiveFund/fundsList');
    }
  };

  onDateChange = (date, dateString) => {
    console.log(date, dateString)
  };

  render() {
    const { t, location } = this.props;

    return (
      <div className="archiveFund">
        <div className="title">
          <h2>{t('ARCHIVE_FUND')}</h2>
          { location.pathname === '/archiveFund' && <DatePicker onChange={this.onDateChange} defaultValue={moment()}/> }
        </div>
        <AntTabs
          tabs={[
            {
              tabName: t('FUNDS_LIST'),
              tabKey: 'fundList',
              tabContent: (
                <Switch>
                  <Route exact path="/archiveFund/fundsList" component={ FundsList } />
                  <Route exact path="/archiveFund/editFundCard/:idFundCard" component={ EditFundCardPage } />
                  <Route exact path="/archiveFund/editFundCard/:idFundCard/:idInventCard" component={ ViewInventCardPage } />
                  <Route exact path="/archiveFund/editFundCard/:idFundCard/:idInventCard/:idCaseCard" component={ ViewCardCases } />
                  <Route exact path="/archiveFund/editFundCard/:idFundCard/:idInventCard/:idCaseCard/:idDocumentCard" component={ ViewCardDocuments } />
                </Switch>
              )
            }
            /*{
              tabName: t('MOVEMENT_RECORD'),
              tabKey: 'movementRecord',
              tabContent: <MovementsRecord t={ t } />
            }*/
          ]}
          type="card"
          onChange={this.handleTabChange}
          onTabClick={ this.handleTabClick }
        />
      </div>
    );
  }
}

export default translate('archiveFund')(ArchiveFund);



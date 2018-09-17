import React from 'react'
import PropTypes from 'prop-types';
import {isEmpty, isEqual} from 'lodash';
import {Button} from 'antd';
import Select from 'react-select';
import { translate } from 'react-i18next';

import AntTable from '../AntTable';
import {Link} from 'react-router-dom';

class LegalEntities extends React.Component {

  state = {
    loading: false,
    selectedRow: {}
  };

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec })
    } else {
      // this.props.history.push(`/archiveFund/editFundCard/${this.state.selectedRow.key}`);
      console.log('rec', rec);
    }
  };

  renderTableHeader = () => {
    const t = this.props.t;
    return (
      <div className="tableHeader__btns">
        <Button>{t('CREATE')}</Button>
        <Link to="/sourcing/legalEntities/123"><Button>{t('EDIT_CARD')}</Button></Link>
        <Button type="danger">{t('REMOVE')}</Button>
        <Select />
      </div>
    )
  };

  render() {
    const { loading } = this.state;
    const { t } = this.props;

    return (
      <div className="LegalEntities">
        <AntTable
          columns={[
            {
              key: 'number',
              title: t('NUMBER'),
              dataIndex: 'number',
              width: '10%'
            },
            {
              key: 'fundNumber',
              title: t('FUND_NUMBER'),
              dataIndex: 'fundNumber',
              width: '10%'
            },
            {
              key: 'name',
              title: t('NAME'),
              dataIndex: 'name',
              width: '40%'
            },
            {
              key: 'legalStatus',
              title: t('LEGAL_STATUS'),
              dataIndex: 'legalStatus',
              width: '20%'
            },
            {
              key: 'location',
              title: t('LOCATION'),
              dataIndex: 'location',
              width: '20%'
            }
          ]}
          loading={loading}
          dataSource={[]}
          openedBy="LegalEntities"
          changeSelectedRow={this.changeSelectedRow}
          title={this.renderTableHeader}
        />
      </div>
    )
  }
}

LegalEntities.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate('sourcing')(LegalEntities);
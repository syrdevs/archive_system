import React from 'react'
import PropTypes from 'prop-types';
import {isEmpty, isEqual} from 'lodash';
import {Button, Input} from 'antd';

import AntTable from '../AntTable';

const Search = Input.Search;

class Individuals extends React.Component {

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
        <Button onClick={() => this.props.history.push('/sourcing/individuals/123')}>{t('EDIT_CARD')}</Button>
        <Button type="danger">{t('REMOVE')}</Button>
        <Button>{ t('SUMMARY') }</Button>
        <Search />
      </div>
    )
  };

  render() {
    const { loading } = this.state;
    const { t } = this.props;

    return (
      <div className="Individuals">
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
          openedBy="Individuals"
          changeSelectedRow={this.changeSelectedRow}
          title={this.renderTableHeader}
        />
      </div>
    )
  }
}

Individuals.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default Individuals;
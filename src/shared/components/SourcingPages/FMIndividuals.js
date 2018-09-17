import React from 'react';
import { Button, Input } from 'antd';
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition'

import AntTable from '../AntTable';
import {isEmpty, isEqual} from 'lodash';
import SiderCard_FMIndividuals from './SiderCard_FMIndividuals';
import moment from 'moment';

class FMIndividuals extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      openCard: false,
      search: '',
      selectedRow: null,
      initialValues: {dateOfBirth: moment()}
    }
  }

  onSearch = e => {this.setState({search: e.target.value})};

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec })
    } else {
      this.setState({ openCard: true })
    }
  };

  openCard = () => {
    this.setState({ openCard: true })
  };

  closeCard = () => {
    this.setState({ openCard: false })
  };

  render() {
    const { t, tofiConstants } = this.props;
    if(!tofiConstants) return null;

    return (
      <div className="FMIndividuals">
        <div className="FMIndividuals__heading">
          <div className="table-header">
            <div className="table-header-btns">
              <Button onClick={this.openCard}>{t('ADD')}</Button>
            </div>
            <Input.Search
              value={this.state.search}
              onChange={this.onSearch}
            />
          </div>
        </div>
        <div className="FMIndividuals__body">
          <AntTable
            loading={false}
            columns={[
              {
                key: 'numb',
                title: '№',
                dataIndex: 'numb',
                width: '10%'
              },
              {
                key: 'personList',
                title: t('NAME'),
                dataIndex: 'personList',
                width: '30%'
              }
            ]}
            dataSource={[
              {
                key: '1',
                numb: 1,
                personList: 'Физ. лицо 1',
              }
            ]}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="FMIndividuals"
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard_FMIndividuals t={t} tofiConstants={tofiConstants} initialValues={this.state.initialValues}
                                closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}/>
          </CSSTransition>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps)(FMIndividuals);
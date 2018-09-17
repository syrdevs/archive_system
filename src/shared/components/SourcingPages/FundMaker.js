import React from 'react';
import { Button, Radio, Input, DatePicker, Checkbox } from 'antd';
import Select from 'react-select';
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition'
import moment from 'moment';

import AntTable from '../AntTable';
import SiderCard_FundMaker from './SiderCard_FundMaker';
import {isEmpty, isEqual} from 'lodash';

const RadioGroup = Radio.Group;
const Search = Input.Search;

class FundMaker extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      legalStatus: null,
      orgLocation: null,
      orgIndustry: null,
      form_of_admission: {
        full: true,
        selected: false
      },
      search: '',
      openCard: false,

      selectedRow: null,
      initialValues: {}
    }
  }

  onRadioChange = e => {
    console.log(e.target.value)
  };

  onLegalStatusChange = s => {this.setState({legalStatus: s})};
  onOrgLocationChange= s => {this.setState({orgLocation: s})};
  onOrgIndustryChange = s => {this.setState({orgIndustry: s})};

  onDateChange = date => {console.log(date)};

  onSearch = e => { this.setState({search: e.target.value}) };

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec })
    } else {
      this.setState({ initialValues: {...rec, workPlannedEndDate: moment(rec.workPlannedEndDate, 'DD.MM.YYYY')}, openCard: true })
    }
  };

  openCard = () => {
    this.setState({ openCard: true, initialValues: {} })
  };

  closeCard = () => {
    this.setState({ openCard: false })
  };

  onCheckboxChange = e => {
    this.setState({
      form_of_admission: {
        ...this.state.form_of_admission,
        [e.target.name]: e.target.checked
      }
    })
  };

  render() {
    const { t, tofiConstants } = this.props;
    if(!tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { legalStatus, formOfAdmission, orgIndustry, orgLocation} = tofiConstants;

    return (
      <div className="FundMaker">
        <div className="FundMaker__heading">
          <div className="table-header">
            <div className="table-header-btns">
              <Button onClick={this.openCard}>{this.props.t('ADD')}</Button>
            </div>
            <div className="table-header-checkboxes">
              <div className="table-header-checkboxes-label">
                {t('FORM_OF_ADMISSION')}
              </div>
              <div className="table-header-checkboxes-input">
                <Checkbox onChange={this.onCheckboxChange} name="full" checked={this.state.form_of_admission.full}>{t('FULL')}</Checkbox>
                <Checkbox onChange={this.onCheckboxChange} name="selected" checked={this.state.form_of_admission.selected}>{t('SELECTED')}</Checkbox>
              </div>
            </div>
            <div className="label-select">
              <p>{legalStatus.name[lng]}</p>
              <Select
                name="legalStatus"
                searchable={false}
                value={this.state.legalStatus}
                onChange={this.onLegalStatusChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                ]}
              />
            </div>
            <div className="label-select">
              <p>{orgLocation.name[lng]}</p>
              <Select
                name="orgLocation"
                searchable={false}
                value={this.state.orgLocation}
                onChange={this.onOrgLocationChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                ]}
              />
            </div>
            <div className="label-select">
              <p>{orgIndustry.name[lng]}</p>
              <Select
                name="orgIndustry"
                searchable={false}
                value={this.state.orgIndustry}
                onChange={this.onOrgIndustryChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                ]}
              />
            </div>
            <Search
              placeholder="search"
              onChange={this.onSearch}
              value={this.state.search}
            />
            <DatePicker onChange={this.onDateChange} defaultValue={moment()}/>
          </div>
        </div>
        <div className="FundMaker__body">
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
                key: 'orgList',
                title: t('NAME'),
                dataIndex: 'orgList',
                width: '30%'
              },
              {
                key: 'legalStatus',
                title: legalStatus.name[lng],
                dataIndex: 'legalStatus',
                width: '20%'
              },
              {
                key: 'formOfAdmission',
                title: formOfAdmission.name[lng],
                dataIndex: 'formOfAdmission',
                width: '20%'
              },
              {
                key: 'orgIndustry',
                title: orgIndustry.name[lng],
                dataIndex: 'orgIndustry',
                width: '20%'
              }
            ]}
            dataSource={[
              {
                key: '1',
                numb: 1,
                orgList: 'Работа 1',
                legalStatus: 'Добавить опись',
                formOfAdmission: '29.06.2018',
                orgIndustry: 'Создана'
              }
            ]}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="FundMaker"
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard_FundMaker t={t} tofiConstants={tofiConstants} initialValues={this.state.initialValues}
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

export default connect(mapStateToProps)(FundMaker);
import React, { Component } from 'react';
import {Button, Icon, Input, Modal} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { isEmpty, isEqual, forEach } from 'lodash';
import { submit } from 'redux-form';
import axios from 'axios';

import AntTable from '../AntTable';
import AntModal from '../AntModal';
import AddNewFundForm from '../Forms/AddNewFundForm';
import {getAFFundsCube, getCube, getFundCountData} from '../../actions/actions';
import { parseCube_new } from '../../utils/cubeParser';
import {
  CUBE_FOR_FUND_AND_IK, DO_FOR_FUND_AND_IK, DP_FOR_FUND_AND_IK, FUND_CATEGORY, FUND_DBEG, FUND_DEND, FUND_INDEX,
  FUND_NUMBER,
  FUND_TYPE
} from '../../constants/tofiConstants';

const confirm = Modal.confirm;

/* eslint eqeqeq:0 */
class FundsList extends Component {
  constructor(props) {
    super(props);

    this.filteredData = [];

    this.state = {
      data: [],
      selectedRow: {},
      search: '',
      loading: true,
      errors: {},
      modal: {
        visible: false,
        type: '',
        loading: false
      },
      countData: {
        countFund: 0,
        countInv: 0,
        countDelo: 0,
        countDeloFile: 0
      },
      filter: {
        fundIndex: '',
        fundList: '',
        fundDbeg: '',
        fundDend: '',
        fundCategory: '',
        fundType: ''
      }
    }

  }

  componentDidMount() {
    const filters = {
      filterDPAnd: [
        {
          dimConst: DP_FOR_FUND_AND_IK,
          concatType: "and",
          conds: [
            {
              consts: `${FUND_NUMBER},${FUND_INDEX},${FUND_DBEG},${FUND_DEND},${FUND_CATEGORY},${FUND_TYPE}`,
            }
          ]
        }
      ],
      filterDOAnd: [
        {
          dimConst: DO_FOR_FUND_AND_IK,
          concatType: 'and',
          conds: [
            {
              clss: 'fundOrg,fundLP,collectionOrg,collectionLP,jointOrg,jointLP'
            }
          ]
        }
      ]
    };
    this.setState({loading: true});
    this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(filters));
    getFundCountData()
      .then(data => {
        this.setState({countData: {...data}})
      })
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.funds) && !isEmpty(nextProps.tofiConstants) && this.props.funds !== nextProps.funds) {
      const { doForFundAndIK, dpForFundAndIK } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(nextProps.funds['cube'], [], 'dp', 'do', nextProps.funds[`do_${doForFundAndIK.id}`], nextProps.funds[`dp_${dpForFundAndIK.id}`], `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`)
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  showModal = modalType => {
    this.setState({
      modal: {
        visible: true,
        type: modalType
      }
    });
  };

  handleModalOk = () => {
    this.props.submit('AddNewFundForm')
  };
  submitForm = values => {
    const mappedValues = {
      name: JSON.stringify(values.fundShortName),
      fullName: JSON.stringify(values.fundName),
      orgCreationDate: values.formationDate.format('YYYY-MM-DD'),
      fundCategory: values.fundCategory.value,
      fundMaker: values.fundMaker.value,
      accessLevel: values.accessLevel.value,
      clsFundConst: values.clsFundConst,
      fundNumber: values.fundNumber
    };
    if(values.eliminationDate) mappedValues.orgLiquiditionDate = values.eliminationDate.format('YYYY-MM-DD');
    if(values.dbeg) mappedValues.fundDbeg = values.dbeg;
    if(values.dend) mappedValues.fundDend = values.dend;
    if(values.fundIndex) mappedValues.fundIndex = values.fundIndex;

    const fd = new FormData();
    forEach(mappedValues, (value, key) => fd.append(key, value));
    this.setState({modal: {...this.state.modal, loading: true}});

    axios.post(`/${localStorage.getItem('i18nextLng')}/archiveFund/appendFund`, fd)
      .then(() => {
        const filters = {
          filterDPAnd: [
            {
              dimConst: DP_FOR_FUND_AND_IK,
              concatType: "and",
              conds: [
                {
                  consts: `${FUND_NUMBER},${FUND_INDEX},${FUND_DBEG},${FUND_DEND},${FUND_CATEGORY}`
                }
              ]
            }
          ]
        };
        this.setState({
          loading: true,
          modal: {
            visible: false,
          }
        });
        this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(filters));
        getFundCountData()
          .then(data => {
            this.setState({countData: {...data}})
          });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          modal: {
            visible: false,
          }
        });
      })
  };

  handleModalCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  removeFund = e => {
    e.stopPropagation();
    confirm({
      title: this.props.t('REMOVE_CONFIRMATION_TITLE'),
      content: this.props.t('REMOVE_CONFIRMATION_MESSAGE'),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        console.log(this.state.selectedRow);
      },
      onCancel() {
        console.log('that was close one');
      },
    });
  };

  handleSelectChange = selectedOption => {
    console.log(`Selected report: ${selectedOption.label}`);
  };
  onInputChange = e => {
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.name]: e.target.value
      }
    })
  };
  emitEmpty = e => {
    this.setState({filter: {
      ...this.state.filter,
      [e.target.dataset.name]: ''
    }})
  };

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec })
    } else {
      this.props.history.push(`/archiveFund/editFundCard/${this.state.selectedRow.key}`);
    }
  };

  renderTableFooter = () => {
    const {countFund, countInv, countDelo, countDeloFile} = this.state.countData;
    return (
      <div className="table-footer">
        <div className="flex">
          <div className="label"><label htmlFor="">Фондов:</label><Input size='small' type="text" readOnly value={countFund}/></div>
          <div className="label"><label htmlFor="">Описей:</label><Input size='small' type="text" readOnly value={countInv}/></div>
          <div className="label"><label htmlFor="">Дел:</label><Input size='small' type="text" readOnly value={countDelo}/></div>
          <div className="label"><label htmlFor="">Дел с электронными образами:</label><Input size='small' type="text" readOnly value={countDeloFile}/></div>
        </div>
        <div className="data-length">
          <div className="label"><label htmlFor="">Всего:</label><Input size='small' type="text" readOnly value={this.filteredData.length + ' / ' + this.state.data.length}/></div>
        </div>
      </div>
    )
  };

  // why id toString?
  renderTableData = item => {
    const { fundDbeg, fundDend, fundNumber, fundIndex, fundCategory } = this.props.tofiConstants;
    const fundNumbObj = item.props.find(element =>  element.prop == fundNumber.id),
          fundIndexObj = item.props.find(element => element.prop == fundIndex.id),
          fundCategoryObj = item.props.find(element => element.prop == fundCategory.id),
          dendObj = item.props.find(element => element.prop == fundDend.id),
          dbegObj = item.props.find(element => element.prop == fundDbeg.id);

    return {
      key: item.id,
      fundType: this.props.tofiConstants[['fundOrg','fundLP','collectionOrg','collectionLP','jointOrg','jointLP'].find(c => this.props.tofiConstants[c].id == item.clsORtr)].name[this.lng],
      fundList: !!item.name ? item.name[this.lng] || '' : '',
      fundNumber: !!fundNumbObj ? fundNumbObj.value || '' : '',
      fundIndex: !!fundIndexObj ? fundIndexObj.value || '' : '',
      fundDend: !!dendObj ? dendObj.value || '' : '',
      fundDbeg: !!dbegObj ? dbegObj.value || '' : '',
      fundCategory: !!fundCategoryObj ? fundCategoryObj.value || '' : '',
    }
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { loading, modal, selectedRow, data, filter } = this.state;
    const { t, tofiConstants: { fundNumber, fundDbeg, fundDend, fundIndex, fundCategory } } = this.props;
    this.filteredData = data.map(this.renderTableData).filter(item => {
      return (
        item.fundIndex.toLowerCase().includes(filter.fundIndex.toLowerCase()) &&
        item.fundList.toLowerCase().includes(filter.fundList.toLowerCase()) &&
        item.fundDbeg.toLowerCase().includes(filter.fundDbeg.toLowerCase()) &&
        item.fundDend.toLowerCase().includes(filter.fundDend.toLowerCase()) &&
        item.fundCategory.toLowerCase().includes(filter.fundCategory.toLowerCase()) &&
        item.fundType.toLowerCase().includes(filter.fundType.toLowerCase())
      )
    });
    this.lng = localStorage.getItem('i18nextLng');

    return (
      <div className="fundsList" ref={node => this.fundList = node}>
        <div className="fundsList__heading">
          <div className="fundsList__heading-buttons">
            <Button onClick={() => this.showModal('addForm')}>{t('ADD')}</Button>
            {/*<Link to={ `/archiveFund/editFundCard/${selectedRow.key}` }><Button disabled={ isEmpty(selectedRow) }>{t('EDIT_CARD')}</Button></Link>
            <Button type="danger" disabled={ isEmpty(selectedRow) } onClick={this.removeFund}>{t('REMOVE')}</Button>*/}
            <Button icon='printer'>Отчеты</Button>
          </div>
        </div>
        <div className="fundsList__body">
          <AntTable
            columns={
              [
                {
                  key: 'fundNumber',
                  title: fundNumber.name[this.lng] || '',
                  dataIndex: 'fundNumber',
                  width: "8%",
                  sorter: (a, b) => b.fundNumber - a.fundNumber,
                },
                {
                  key: 'fundIndex',
                  title: fundIndex.name[this.lng] || '',
                  dataIndex: 'fundIndex',
                  width: "8%",
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="fundIndex"
                        suffix={filter.fundIndex ? <Icon type="close-circle" data-name="fundIndex" onClick={this.emitEmpty} /> : null}
                        ref={ele => this.fundIndex = ele}
                        placeholder="Поиск"
                        value={filter.fundIndex}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: filter.fundIndex ? '#ff9800' : '#aaa' }} />,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.fundIndex.focus());
                  }
                },
                {
                  key: 'fundList',
                  title: 'Название фонда',
                  dataIndex: 'fundList',
                  width: "25%",
                  sorter: (a, b) => b.fundList.localeCompare(a.fundList),
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="fundList"
                        suffix={filter.fundList ? <Icon type="close-circle" data-name="fundList" onClick={this.emitEmpty} /> : null}
                        ref={ele => this.fundList = ele}
                        placeholder="Поиск"
                        value={filter.fundList}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: filter.fundList ? '#ff9800' : '#aaa' }} />,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.fundList.focus());
                  }
                },
                {
                  key: 'fundDbeg',
                  title: fundDbeg.name[this.lng] || '',
                  dataIndex: 'fundDbeg',
                  width: "13%",
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="fundDbeg"
                        suffix={filter.fundDbeg ? <Icon type="close-circle" data-name="fundDbeg" onClick={this.emitEmpty} /> : null}
                        ref={ele => this.fundDbeg = ele}
                        placeholder="Поиск"
                        value={filter.fundDbeg}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: filter.fundDbeg ? '#ff9800' : '#aaa' }} />,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.fundDbeg.focus());
                  }
                },
                {
                  key: 'fundDend',
                  title: fundDend.name[this.lng] || '',
                  dataIndex: 'fundDend',
                  width: "13%",
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="fundDend"
                        suffix={filter.fundDend ? <Icon type="close-circle" data-name="fundDend" onClick={this.emitEmpty} /> : null}
                        ref={ele => this.fundDend = ele}
                        placeholder="Поиск"
                        value={filter.fundDend}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: filter.fundDend ? '#ff9800' : '#aaa' }} />,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.fundDend.focus());
                  }
                },
                {
                  key: 'fundCategory',
                  title: fundCategory.name[this.lng] || '',
                  dataIndex: 'fundCategory',
                  width: "13%",
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="fundCategory"
                        suffix={filter.fundCategory ? <Icon type="close-circle" data-name="fundCategory" onClick={this.emitEmpty} /> : null}
                        ref={ele => this.fundCategory = ele}
                        placeholder="Поиск"
                        value={filter.fundCategory}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: filter.fundCategory ? '#ff9800' : '#aaa' }} />,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.fundCategory.focus());
                  }
                },
                {
                  key: 'fundType',
                  title: 'Тип фонда',
                  dataIndex: 'fundType',
                  width: "13%",
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="fundType"
                        suffix={filter.fundType ? <Icon type="close-circle" data-name="fundType" onClick={this.emitEmpty} /> : null}
                        ref={ele => this.fundType = ele}
                        placeholder="Поиск"
                        value={filter.fundType}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: filter.fundType ? '#ff9800' : '#aaa' }} />,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.fundType.focus());
                  }
                },
                {
                  key: 'action',
                  title: '',
                  dataIndex: '',
                  width: '9%',
                  render: (text, record) => {
                    return (
                      <div className="editable-row-operations" style={{ display: 'flex' }}>
                        <Button icon="edit" className="green-btn" style={{marginRight: '5px'}} disabled={selectedRow.key !== record.key}/>
                        <Button icon="delete" className="green-btn yellow-bg" onClick={this.removeFund} disabled={selectedRow.key !== record.key}/>
                      </div>
                    );
                  },
                }
              ]
            }
            scroll={{y: '100%', x: 1200}}
            loading={ loading }
            openedBy="ArchiveFundList"
            changeSelectedRow={ this.changeSelectedRow }
            dataSource={ this.filteredData }
            footer={ this.renderTableFooter }
          />
        </div>
        <AntModal
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={modal.visible}
          title={t('ADD_NEW_FUND')}
          maskClosable={false}
          width={600}
          loading={modal.loading}
        >
          { modal.type === 'addForm' && <AddNewFundForm
            t={ t }
            tofiConstants={this.props.tofiConstants}
            onSubmit={this.submitForm}
            initialValues={{clsFundConst: {value: this.props.tofiConstants.fundOrg.id, label: this.props.tofiConstants.fundOrg.name[this.lng]}, formationDate: null}}
          /> }
        </AntModal>
      </div>
    )
  }
}

FundsList.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  tofiConstants: PropTypes.shape()
};

function mapStateToProps(state) {
  return {
    funds: state.cubes[CUBE_FOR_FUND_AND_IK],
    tofiConstants: state.generalData.tofiConstants,
  }
}

export default connect(mapStateToProps, { getAFFundsCube, getCube, submit })(translate('archiveFund')(FundsList));

import React, { Component } from 'react';
import {Button, Icon, Input, Modal} from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {isEmpty, isEqual} from 'lodash';

import AntTable from '../AntTable';
import AntModal from '../AntModal';
import AddNewInventoryForm from '../Forms/AddNewInventoryForm';
import {getCasesCount, redirectWithPush} from '../../actions/actions';
import {parseCube_new} from '../../utils/cubeParser';
import {CUBE_FOR_AF_INV} from '../../constants/tofiConstants';

const confirm = Modal.confirm;

/*eslint eqeqeq:0*/
class EditCardInventories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      search: '',
      errors: {},
      selectedRow: {},
      modal: {
        visible: false,
        type: ''
      },
      countData: {
        countFund: 0,
        countDelo: 0,
        countDeloFile: 0
      },
      filter: {
        invDates: '',
        inventName: '',
        inventType: ''
      }
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
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  handleModalCancel = () => {
    console.log('cancel');
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    try {
      const { doForInv, dpForInv} = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(nextProps.invCube['cube'], [], 'dp', 'do', nextProps.invCube[`do_${doForInv.id}`], nextProps.invCube[`dp_${dpForInv.id}`], `do_${doForInv.id}`, `dp_${dpForInv.id}`)
        }
      );
    } catch (err) {
        console.log(err);
        this.setState({ loading: false });
    }

    try {
      const ids = nextProps.invCube[`do_${nextProps.tofiConstants.doForInv.id}`].map(dimObj => dimObj.id);
      getCasesCount(JSON.stringify(ids), 'CubeForAF_Inv', 'doForInv')
        .then(caseData => {
          if(caseData) {
            this.setState({
              countData: {
                ...this.state.countData,
                countFund: 1,
                countDelo: caseData.cntCases,
                countDeloFile: caseData.cntEO
              }
            })
          }
        })
    } catch (err) {
      console.log(err);
    }
  }

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec })
    } else {
      this.props.redirectWithPush(`/archiveFund/editFundCard/${this.props.fundCardId}/${this.state.selectedRow.key}`);
    }
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

  remove = e => {
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

  renderTableData = item => {
    const { invNumber, invDates, invType, fundNumberOfCases, fundNumberOfCasesWithFiles } = this.props.tofiConstants;
    const invNumbObj = item.props.find(element =>  element.prop == invNumber.id),
      invTypeObj = item.props.find(element => element.prop == invType.id),
      dbegObj = item.props.find(element => element.prop == invDates.id),
      fundNumberOfCasesObj = item.props.find(element => element.prop == fundNumberOfCases.id),
      fundNumberOfCasesWithFilesObj = item.props.find(element => element.prop == fundNumberOfCasesWithFiles.id);
    return {
      key: item.id,
      inventName: !!item.name ? item.name[localStorage.getItem('i18nextLng')] || '' : '',
      inventNumb: !!invNumbObj ? invNumbObj.value || '' : '',
      invDates: !!dbegObj ? dbegObj.value || '' : '',
      inventType: !!invTypeObj ? invTypeObj.value || '' : '',
      fundNumberOfCases: !!fundNumberOfCasesObj ? fundNumberOfCasesObj.value || '' : '',
      fundNumberOfCasesWithFiles: !!fundNumberOfCasesWithFilesObj ? fundNumberOfCasesWithFilesObj.value || '' : ''
    }
  };

  renderTableFooter = () => {
    const {data, countData: {countFund, countDelo, countDeloFile}} = this.state;
    return (
      <div className="table-footer">
        <div className="flex">
          <div className="label"><label htmlFor="">Фондов:</label><Input size='small' type="text" readOnly value={countFund}/></div>
          <div className="label"><label htmlFor="">Описей:</label><Input size='small' type="text" readOnly value={data.length}/></div>
          <div className="label"><label htmlFor="">Дел:</label><Input size='small' type="text" readOnly value={countDelo}/></div>
          <div className="label"><label htmlFor="">Дел с электронными образами:</label><Input size='small' type="text" readOnly value={countDeloFile}/></div>
        </div>
        <div className="data-length">
          <div className="label"><label htmlFor="">Всего:</label><Input size='small' type="text" readOnly value={this.filteredData.length + ' / ' + this.state.data.length}/></div>
        </div>
      </div>
    )
  };

  render() {
    const { loading, data, modal, selectedRow, filter } = this.state;
    const lng = localStorage.getItem('i18nextLng');
    const { t, tofiConstants: {invNumber, invDates, invList, invType, fundNumberOfCases, fundNumberOfCasesWithFiles} } = this.props;

    this.filteredData = data.map(this.renderTableData).filter(item => {
      return (
        item.inventName.toLowerCase().includes(filter.inventName.toLowerCase()) &&
        item.inventType.toLowerCase().includes(filter.inventType.toLowerCase()) &&
        item.invDates.toLowerCase().includes(filter.invDates.toLowerCase())
      )
    });

    return (
      <div className="EditCardInventories">
        <div className="table-header">
          <Button onClick={() => this.showModal('addForm')}>{t('ADD')}</Button>
          {/*<Link to={`/archiveFund/editFundCard/${fundCardId}/${selectedRow.key}`}><Button disabled={isEmpty(selectedRow)}>{t('EDIT_CARD')}</Button></Link>*/}
          {/*<Button type="danger" disabled={isEmpty(selectedRow)}>{t('REMOVE')}</Button>*/}
          <Button type="primary" disabled={isEmpty(selectedRow)} icon="download">{t('UNLOAD_CASES_LIST')}</Button>
        </div>
        <div className="EditCardInventories__body">
          <AntTable
            columns={
              [
                {
                  key: 'inventNumb',
                  title: invNumber.name[lng],
                  dataIndex: 'inventNumb',
                  width: '7%'
                },
                {
                  key: 'inventName',
                  title: invList.name[lng],
                  dataIndex: 'inventName',
                  width: '25%',
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="inventName"
                        suffix={filter.inventName ? <Icon type="close-circle" data-name="inventName" onClick={this.emitEmpty} /> : null}
                        ref={ele => this.inventName = ele}
                        placeholder="Поиск"
                        value={filter.inventName}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: filter.inventName ? '#ff9800' : '#aaa' }} />,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.inventName.focus());
                  }
                },
                {
                  key: 'inventType',
                  title: invType.name[lng],
                  dataIndex: 'inventType',
                  width: '10%',
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="inventType"
                        suffix={filter.inventType ? <Icon type="close-circle" data-name="inventType" onClick={this.emitEmpty} /> : null}
                        ref={ele => this.inventType = ele}
                        placeholder="Поиск"
                        value={filter.inventType}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: filter.inventType ? '#ff9800' : '#aaa' }} />,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.inventType.focus());
                  }
                },
                {
                  key: 'invDates',
                  title: invDates.name[lng],
                  dataIndex: 'invDates',
                  width: '20%',
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="invDates"
                        suffix={filter.invDates ? <Icon type="close-circle" data-name="invDates" onClick={this.emitEmpty} /> : null}
                        ref={ele => this.invDates = ele}
                        placeholder="Поиск"
                        value={filter.invDates}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: filter.invDates ? '#ff9800' : '#aaa' }} />,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.invDates.focus());
                  }
                },
                {
                  key: 'fundNumberOfCases',
                  title: fundNumberOfCases.name[lng],
                  dataIndex: 'fundNumberOfCases',
                  width: '15%'
                },
                {
                  key: 'fundNumberOfCasesWithFiles',
                  title: fundNumberOfCasesWithFiles.name[lng],
                  dataIndex: 'fundNumberOfCasesWithFiles',
                  width: '15%'
                },
                {
                  key: 'action',
                  title: '',
                  dataIndex: '',
                  width: '8%',
                  render: (text, record) => {
                    return (
                      <div className="editable-row-operations" style={{ display: 'flex' }}>
                        <Button icon="edit" className="green-btn" style={{marginRight: '5px'}} disabled={selectedRow.key !== record.key}/>
                        <Button icon="delete" className="green-btn yellow-bg" onClick={this.remove} disabled={selectedRow.key !== record.key}/>
                      </div>
                    );
                  },
                }
              ]
            }
            scroll={{x: 1200, y: '100%'}}
            openedBy="ArchiveFundInvList"
            changeSelectedRow={ this.changeSelectedRow }
            loading={loading}
            dataSource={ this.filteredData }
            footer={ this.renderTableFooter }
          />
        </div>
        <AntModal
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={modal.visible}
          width={400}
          title={t('ADDING_NEW_INVENTORY')}
        >
          <AddNewInventoryForm t={ t }/>
        </AntModal>
      </div>
    )
  }
}

EditCardInventories.PropTypes = {
  tofiConstants: PropTypes.shape({
    doForInv: PropTypes.shape(),
    dpForInv: PropTypes.shape()
  }).isRequired,
  invCube: PropTypes.shape({}),
  fundCardId: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants,
    invCube: state.cubes[CUBE_FOR_AF_INV]
  }
}

export default connect(mapStateToProps, { redirectWithPush })(EditCardInventories);

import React from 'react';
import {Breadcrumb, Button, Checkbox, Input, Table, message} from 'antd';
import {Link} from 'react-router-dom';
import {differenceWith, isEmpty, isEqual, pickBy} from 'lodash';
import AntModal from '../../AntModal';
import {addDerivativeWorksAcc, getValuesOfObjsWithProps, updateCubeData} from '../../../actions/actions';
import {CUBE_FOR_WORKS, DO_FOR_WORKS} from '../../../constants/tofiConstants';
import moment from 'moment';

/*eslint eqeqeq:0*/
class ArchiveFundWorksCaseAccounting extends React.PureComponent {

  state = {
    data: [],
    modal: {
      visible: false,
      inputValue: 0
    },
    workRegFundNumber: '',
    workRegFundIndex: '',
    workRegInvNumber: '',
  };

  openModal = () => {
    this.setState({ modal: {...this.state.modal, visible: true} })
  };
  handleModalOk = () => {
    this.sendAddedWorks('temp')
  };
  handleModalCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };
  onInputChange = e => {
    if((e.target.value > 0 && e.target.value <= this.state.data.length) || e.target.value === '') {
      this.setState({ modal: { ...this.state.modal, inputValue: e.target.value } })
    }
  };

  sendAddedWorks = mode => {
    const initData = this.props.location.state.data.map(this.renderTableData);
    const diffInit = differenceWith(initData, this.state.data, isEqual);
    const diffData = this.state.data.filter(el => diffInit.some(elem => elem.key == el.key));
    const fd = new FormData();
    fd.append('workId', this.props.location.state.workId.split('_')[1]);
    fd.append('workRegFund', this.props.match.params.fund.split('_')[0]);
    fd.append('workRegInv', this.props.match.params.fund.split('_')[1]);
    fd.append('mode', mode);
    fd.append('cases', JSON.stringify(diffData.map((el, idx) =>
      ({
        caseId: String(el.key),
        changes: pickBy(el, (val, key) => !isEqual(val, diffInit[idx][key]))
      })
    )));
    const hideLoading = message.loading('CREATING_NEW_OBJECT', 30);
    addDerivativeWorksAcc(fd)
      .then(res => {
        hideLoading();
        if(res.success) {
          message.success('OBJECT_CREATED_SUCCESSFULLY');
          const datas = mode === 'temp' ? [{
            own: [{doConst: DO_FOR_WORKS, doItem: this.props.location.state.workId, isRel: "0", objData: {} }],
            props: [
              {propConst: 'workIndexNumber', val: String(this.state.modal.inputValue), typeProp: '21', periodDepend: '2', isUniq: '1'},
              {propConst: 'intermediateResultDate', val: moment().format('YYYY-MM-DD'), typeProp: '312', periodDepend: '2', isUniq: '1'}
            ],
            periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
          }] : [{
            own: [{doConst: DO_FOR_WORKS, doItem: this.props.location.state.workId, isRel: "0", objData: {} }],
            props: [
              {propConst: 'workStatusAdmissionAndExpertise', val: String(this.props.tofiConstants.completed.id), typeProp: '11', periodDepend: '2', isUniq: '1'},
              {propConst: 'workActualEndDate', val: moment().format('YYYY-MM-DD'), typeProp: '312', periodDepend: '2', isUniq: '1'},
              {propConst: 'intermediateResultDate', val: null, typeProp: '312', periodDepend: '2', isUniq: '1', mode: 'del'}
            ],
            periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
          }];
          updateCubeData(CUBE_FOR_WORKS, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
            .then(res => {
              if(res.success) {
                this.props.history.push('/archiveFund/works')
              }
            });
        }
      })
  };
  renderTableHeader = () => {
    return (
      <div className="table-header">
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/archiveFund/works">Работы по учету и хранению</Link></Breadcrumb.Item>
          <Breadcrumb.Item>
            <b>{this.props.tofiConstants.caseRegistration.name[this.lng]}
              <span style={{fontSize: '13px'}}>&#8594;</span>
              {this.props.t('FUND_NUMB')}: {this.state.workRegFundNumber + this.state.workRegFundIndex}, {this.props.t('INV_NUMB')}: {this.state.workRegInvNumber}</b>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  };
  renderTableData = (item, idx) => {
    return {
      key: item.id,
      numb: idx + 1,
      caseNumber: item.caseNumber[this.lng],
      cases: item.name[this.lng],
      caseOCD: item.caseOCD == 1,
      disinfection: item.disinfection == 1,
      disinfestation: item.disinfestation == 1,
      restoration: item.restoration == 1,
      binding: item.binding == 1,
      restorationOfFadingTexts: item.restorationOfFadingTexts == 1,
      irreparablyDamaged: item.irreparablyDamaged == 1,
      availability: item.availability == 1
    }
  };
  renderTableFooter = () => {
    return (
      <div className="table-footer">
        <Button onClick={this.openModal}>{this.props.t('SAVE_TEMPORARY_STATE')}</Button>
        <Link to="/archiveFund/works"><Button>{this.props.t('CANCEL')}</Button></Link>
        <Button onClick={() => this.sendAddedWorks('complete')}>{this.props.t('COMPLETE')}</Button>
      </div>
    )
  };

  componentDidMount() {
    if(this.props.location && this.props.location.state && this.props.location.state.data) {
      this.setState({ data: this.props.location.state.data.map(this.renderTableData) });

      const fd = new FormData();
      const datas = [{objs: `${this.props.match.params.fund.split('_')[0]}`, propConsts: "fundNumber,fundIndex"}, {objs: `${this.props.match.params.fund.split('_')[1]}`, propConsts: "invNumber"}];
      fd.append('datas', JSON.stringify(datas));
      getValuesOfObjsWithProps(fd)
        .then(res => {
          if(res.success) {
            const workRegFundNumber = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[0]).fundNumber[this.lng];
            const workRegFundIndex = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[0]).fundIndex[this.lng];
            const workRegInvNumber = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[1]).invNumber[this.lng];
            this.setState({workRegFundNumber, workRegFundIndex, workRegInvNumber})
          }
        }).catch(err => {
        console.error(err);
      });
    }
  }

  onChange = (value, key, column) => {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;

    const { t, tofiConstants: {caseNumber, restorationOfFadingTexts, disinfection, disinfestation, restoration, binding, irreparablyDamaged, caseOCD} } = this.props;

    this.lng = localStorage.getItem('i18nextLng');
    return (
      <div className="WorksChecking">
        <Table
          columns={[
            {
              key: 'numb',
              title: '№',
              dataIndex: 'numb',
              width: '5%',
            },
            {
              key: 'caseNumber',
              title: caseNumber.name[this.lng],
              dataIndex: 'caseNumber',
              width: '5%'
            },
            {
              key: 'cases',
              title: 'CASE_NAME',
              dataIndex: 'cases',
              width: '14%',
            },
            {
              key: 'availability',
              title: t('AVAILABILITY'),
              dataIndex: 'availability',
              width: '6%',
              className: 'td-center',
              render: (text, record) => (
                <Checkbox checked={text} onChange={(e) => this.onChange(e.target.checked, record.key, 'availability')}/>
              )
            },
            {
              key: 'caseOCD',
              title: caseOCD.name[this.lng],
              dataIndex: 'caseOCD',
              width: '10%',
              className: 'td-center',
              render: (text, record) => (
                <Checkbox checked={text} /*onChange={(e) => this.onChange(e.target.checked, record.key, 'caseOCD')}*//>
              )
            },
            {
              title: t('REQUIRES'),
              children: [
                {
                  key: 'disinfection',
                  title: disinfection.name[this.lng],
                  dataIndex: 'disinfection',
                  width: '10%',
                  className: 'td-center',
                  render: (text, record) => (
                    <Checkbox checked={text} onChange={e => this.onChange(e.target.checked, record.key, 'disinfection')}/>
                  )
                },
                {
                  key: 'disinfestation',
                  title: disinfestation.name[this.lng],
                  dataIndex: 'disinfestation',
                  width: '10%',
                  className: 'td-center',
                  render: (text, record) => (
                    <Checkbox checked={text} onChange={e => this.onChange(e.target.checked, record.key, 'disinfestation')}/>
                  )
                },
                {
                  key: 'restoration',
                  title: restoration.name[this.lng],
                  dataIndex: 'restoration',
                  width: '10%',
                  className: 'td-center',
                  render: (text, record) => (
                    <Checkbox checked={text} onChange={e => this.onChange(e.target.checked, record.key, 'restoration')}/>
                  )
                },
                {
                  key: 'binding',
                  title: binding.name[this.lng],
                  dataIndex: 'binding',
                  width: '10%',
                  className: 'td-center',
                  render: (text, record) => (
                    <Checkbox checked={text} onChange={e => this.onChange(e.target.checked, record.key, 'binding')}/>
                  )
                },
                {
                  key: 'restorationOfFadingTexts',
                  title: restorationOfFadingTexts.name[this.lng],
                  dataIndex: 'restorationOfFadingTexts',
                  width: '10%',
                  className: 'td-center',
                  render: (text, record) => (
                    <Checkbox checked={text} onChange={e => this.onChange(e.target.checked, record.key, 'restorationOfFadingTexts')}/>
                  )
                },
              ]
            },
            {
              key: 'irreparablyDamaged',
              title: irreparablyDamaged.name[this.lng],
              dataIndex: 'irreparablyDamaged',
              width: '10%',
              className: 'td-center',
              render: (text, record) => (
                <Checkbox checked={text} onChange={e => this.onChange(e.target.checked, record.key, 'irreparablyDamaged')}/>
              )
            }
          ]}
          bordered
          size="small"
          rowClassName={(rec, idx) => (this.props.location.state && rec.numb == this.props.location.state.workIndexNumber ? "row-selected" : "")}
          title={this.renderTableHeader}
          footer={this.renderTableFooter}
          dataSource={this.state.data}
          pagination={{pageSize: 20, defaultCurrent: this.props.location.state && this.props.location.state.workIndexNumber && Math.ceil(Number(this.props.location.state.workIndexNumber)/20)}}
          scroll={{x: 1500, y: '100%'}}
        />
        <AntModal
          visible={this.state.modal.visible}
          title={t('INDICATE_NUMBER_TITLE')}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <label>{t('INDICATE_NUMBER_LABEL')}</label>
          <Input type="number"/>
        </AntModal>
      </div>
    )
  }
}

export default ArchiveFundWorksCaseAccounting;
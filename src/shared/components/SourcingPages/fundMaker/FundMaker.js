import React from 'react';
import {Button, Input, Icon, message} from 'antd';
import Select from 'react-select';
import CSSTransition from 'react-transition-group/CSSTransition'
import moment from 'moment';
import SelectVirt from 'react-virtualized-select';

import AntTable from '../../AntTable';
import SiderCard_FundMaker from './SiderCard_FundMaker';
import {isEmpty, isEqual, map} from 'lodash';
import {parseCube_new, getPropMeta} from '../../../utils/cubeParser';
import {getCube, getPropVal, updateCubeData, createObj, insPropVal} from '../../../actions/actions';
import {connect} from 'react-redux';
import {
  FORM_OF_ADMISSION, LEGAL_STATUS, ORG_INDUSTRY, FUND_MAKER_ARCHIVE,
  IS_ACTIVE, CUBE_FOR_ORG_FUNDMAKER, CUBE_FOR_FUND_AND_IK
} from '../../../constants/tofiConstants';

/*eslint eqeqeq:0*/
class FundMaker extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      filter: {
        orgList: '',
        legalStatus: [],
        legalStatusLoading: false,
        fundmakerArchive: [],
        fundmakerArchiveLoading: false,
        orgIndustry: [],
        orgIndustryLoading: false,
        formOfAdmission: [],
        formOfAdmissionLoading: false,
        isActive: [],
        isActiveLoading: false
      },
      openCard: false,
      loading: true,
      selectedRow: null,
      initialValues: {}
    }
  }

  onLegalStatusChange = s => {this.setState({filter: {...this.state.filter, legalStatus: s}})};
  onOrgLocationChange= s => {this.setState({filter: {...this.state.filter, fundmakerArchive: s}})};
  onFormOfAdmissionChange = s => {this.setState({filter: {...this.state.filter, formOfAdmission: s}})};
  onOrgIndustryChange = s => {this.setState({filter: {...this.state.filter, orgIndustry: s}})};
  onIsActiveChange = s => {this.setState({filter: {...this.state.filter, isActive: s}})};

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)){
      this.setState({ selectedRow: rec })
    } else {
      const initialValues = {
        key: rec.key,
        shortName: rec.orgList,
        name: rec.name,
        dbeg: rec.dbeg,
        dend: rec.dend,
        accessLevel: rec.accessLevel,
        legalStatus: rec.legalStatus,
        formOfAdmission: rec.formOfAdmission,
        orgIndustry: rec.orgIndustry,
        isActive: rec.isActiveObj,
        fundmakerArchive: rec.orgLocationObj,
        orgAddress: rec.orgAddressObj,
        orgPhone: rec.orgPhone,
        contractNumber: rec.contractNumber,
        orgDocType: rec.orgDocTypeObj,
        orgFax: rec.orgFax,
        orgEmail: rec.orgEmail,
        orgFormationDoc: rec.orgFormationDocObj,
        orgReorganizationDoc: rec.orgReorganizationDocObj,
        orgLiquidationDoc: rec.orgLiquidationDocObj,
        leaderFIO: rec.leaderFIOObj,
        leaderPosition: rec.leaderPositionObj,
        leaderPhone: rec.leaderPhone,
        depLeaderFIO: rec.depLeaderFIOObj,
        depLeaderPosition: rec.depLeaderPositionObj,
        depLeaderPhone: rec.depLeaderPhone,
        responsibleFIO: rec.responsibleFIOObj,
        responsiblePosition: rec.responsiblePositionObj,
        responsiblePhone: rec.responsiblePhone,
        responsibleAppointmentDate: rec.responsibleAppointmentDate,
        archiveLeaderFIO: rec.archiveLeaderFIOObj,
        archiveLeaderPosition: rec.archiveLeaderPositionObj,
        archiveLeaderPhone: rec.archiveLeaderPhone,
        archiveLeaderAppointmentDate: rec.archiveLeaderAppointmentDate,
        commissionLeaderFIO: rec.commissionLeaderFIOObj,
        commissionLeaderPosition: rec.commissionLeaderPositionObj,
        commissionLeaderPhone: rec.commissionLeaderPhone
      };
      this.setState({ initialValues, openCard: true, selectedRow: rec })
    }
  };

  openCard = () => {
    this.setState({ openCard: true, initialValues: {accessLevel: {value: 1, label: "Общедоступный уровень"}} })
  };

  closeCard = () => {
    this.setState({ openCard: false })
  };
  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({filter: {...this.state.filter, [c+'Loading']: true}});
        this.props.getPropVal(c)
          .then(() => this.setState({filter: {...this.state.filter, [c+'Loading']: false}}));
      }
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

  componentDidMount() {
    this.loadOptions(IS_ACTIVE)();

    if(!isEmpty(this.props.tofiConstants)) {
      const isActiveTrue = this.props.tofiConstants.isActiveTrue;
      this.onIsActiveChange([{value: isActiveTrue.id, label: isActiveTrue.name[this.lng]}])
    }

    if(isEmpty(this.props.tofiConstants) || !this.props.orgCube) return;
    const { doForOrgFundmakers, dpForOrgFundmakers } = this.props.tofiConstants;
    this.setState(
      {
        loading: false,
        data: parseCube_new(
          this.props.orgCube['cube'],
          [],
          'dp',
          'do',
          this.props.orgCube[`do_${doForOrgFundmakers.id}`],
          this.props.orgCube[`dp_${dpForOrgFundmakers.id}`],
          `do_${doForOrgFundmakers.id}`,
          `dp_${dpForOrgFundmakers.id}`).map(this.renderTableData)
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.orgCube) && !isEmpty(nextProps.tofiConstants) && this.props.orgCube !== nextProps.orgCube) {
      const { doForOrgFundmakers, dpForOrgFundmakers } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(
            nextProps.orgCube['cube'],
            [],
            'dp',
            'do',
            nextProps.orgCube[`do_${doForOrgFundmakers.id}`],
            nextProps.orgCube[`dp_${dpForOrgFundmakers.id}`],
            `do_${doForOrgFundmakers.id}`,
            `dp_${dpForOrgFundmakers.id}`).map(this.renderTableData)
        }
      );
    }
  }

  renderTableData = (item, idx) => {
    const { legalStatus, formOfAdmission, orgIndustry, fundmakerArchive,
        isActive, orgAddress, orgPhone, orgFax, orgEmail, orgFormationDoc, orgReorganizationDoc, orgLiquidationDoc,
        leaderFIO, leaderPosition, leaderPhone, depLeaderFIO, depLeaderPosition, depLeaderPhone, responsibleFIO, responsiblePosition, responsiblePhone,
        responsibleAppointmentDate, archiveLeaderFIO, archiveLeaderPosition, archiveLeaderPhone, archiveLeaderAppointmentDate,
        commissionLeaderFIO, commissionLeaderPosition, commissionLeaderPhone, contractNumber, orgDocType} = this.props.tofiConstants;
    const legalStatusObj = item.props.find(element => element.prop == legalStatus.id),
      formOfAdmissionObj = item.props.find(element => element.prop == formOfAdmission.id),
      contractNumberObj = item.props.find(element => element.prop == contractNumber.id),
      orgIndustryObj = item.props.find(element => element.prop == orgIndustry.id),
      orgLocationObj = item.props.find(element => element.prop == fundmakerArchive.id),
      isActiveObj = item.props.find(element => element.prop == isActive.id),
      orgAddressObj = item.props.find(element => element.prop == orgAddress.id),
      orgDocTypeObj = item.props.find(element => element.prop == orgDocType.id),
      orgPhoneObj = item.props.find(element => element.prop == orgPhone.id),
      orgFaxObj = item.props.find(element => element.prop == orgFax.id),
      orgEmailObj = item.props.find(element => element.prop == orgEmail.id),
      orgFormationDocObj = item.props.find(element => element.prop == orgFormationDoc.id),
      orgReorganizationDocObj = item.props.find(element => element.prop == orgReorganizationDoc.id),
      orgLiquidationDocObj = item.props.find(element => element.prop == orgLiquidationDoc.id),
      leaderFIOObj = item.props.find(element => element.prop == leaderFIO.id),
      leaderPositionObj = item.props.find(element => element.prop == leaderPosition.id),
      leaderPhoneObj = item.props.find(element => element.prop == leaderPhone.id),
      depLeaderFIOObj = item.props.find(element => element.prop == depLeaderFIO.id),
      depLeaderPositionObj = item.props.find(element => element.prop == depLeaderPosition.id),
      depLeaderPhoneObj = item.props.find(element => element.prop == depLeaderPhone.id),
      responsibleFIOObj = item.props.find(element => element.prop == responsibleFIO.id),
      responsiblePositionObj = item.props.find(element => element.prop == responsiblePosition.id),
      responsiblePhoneObj = item.props.find(element => element.prop == responsiblePhone.id),
      responsibleAppointmentDateObj = item.props.find(element => element.prop == responsibleAppointmentDate.id),
      archiveLeaderFIOObj = item.props.find(element => element.prop == archiveLeaderFIO.id),
      archiveLeaderPositionObj = item.props.find(element => element.prop == archiveLeaderPosition.id),
      archiveLeaderPhoneObj = item.props.find(element => element.prop == archiveLeaderPhone.id),
      archiveLeaderAppointmentDateObj = item.props.find(element => element.prop == archiveLeaderAppointmentDate.id),
      commissionLeaderFIOObj = item.props.find(element => element.prop == commissionLeaderFIO.id),
      commissionLeaderPositionObj = item.props.find(element => element.prop == commissionLeaderPosition.id),
      commissionLeaderPhoneObj = item.props.find(element => element.prop == commissionLeaderPhone.id);

    return {
      key: item.id,
      numb: idx + 1,
      orgList: !!item.name ? item.name : {kz: '', ru: '', en: ''},
      name: !!item.fullName ? item.fullName : {},
      dbeg: !!item.dbeg && moment(item.dbeg).isAfter('1800-01-01') ? moment(item.dbeg ) : null,
      dend: !!item.dend && moment(item.dend).isBefore('3333-12-31') ? moment(item.dend) : null,
      accessLevel: item.accessLevel,
      legalStatus: legalStatusObj && legalStatusObj.refId ? {value: legalStatusObj.refId, label: legalStatusObj.value} : {},
      formOfAdmission: formOfAdmissionObj && formOfAdmissionObj.refId ? {value: formOfAdmissionObj.refId, label: formOfAdmissionObj.value} : {},
      orgIndustry: !!orgIndustryObj && orgIndustryObj.values && orgIndustryObj.values[orgIndustryObj.values.length-1] ? orgIndustryObj.values[orgIndustryObj.values.length-1] : {},
      fundmakerArchive: !!orgLocationObj ? orgLocationObj.value || '' : '',
      orgLocationObj: !!orgLocationObj ? {value: orgLocationObj.cube.idRef, label: orgLocationObj.value} : {},
      orgDocTypeObj: !!orgDocTypeObj && orgDocTypeObj.values ? orgDocTypeObj.values : [],
      isActiveObj: !!isActiveObj ? {value: isActiveObj.refId, label: isActiveObj.value} : {},
      orgAddressObj: !!orgAddressObj ? orgAddressObj.valueLng || '' : '',
      orgPhone: !!orgPhoneObj ? orgPhoneObj.value || '' : '',
      contractNumber: !!contractNumberObj ? contractNumberObj.value || '' : '',
      orgFax: !!orgFaxObj ? orgFaxObj.value || '' : '',
      orgEmail: !!orgEmailObj ? orgEmailObj.value || '' : '',
      orgFormationDocObj: !!orgFormationDocObj ? orgFormationDocObj.valueLng || '' : '',
      orgReorganizationDocObj: !!orgReorganizationDocObj ? orgReorganizationDocObj.valueLng || '' : '',
      orgLiquidationDocObj: !!orgLiquidationDocObj ? orgLiquidationDocObj.valueLng || '' : '',
      leaderFIOObj: !!leaderFIOObj ? leaderFIOObj.valueLng || '' : '',
      leaderPositionObj: !!leaderPositionObj ? leaderPositionObj.valueLng || '' : '',
      leaderPhone: !!leaderPhoneObj ? leaderPhoneObj.value || '' : '',
      depLeaderFIOObj: !!depLeaderFIOObj ? depLeaderFIOObj.valueLng || '' : '',
      depLeaderPositionObj: !!depLeaderPositionObj ? depLeaderPositionObj.valueLng || '' : '',
      depLeaderPhone: !!depLeaderPhoneObj ? depLeaderPhoneObj.value || '' : '',
      responsibleFIOObj: !!responsibleFIOObj ? responsibleFIOObj.valueLng || '' : '',
      responsiblePositionObj: !!responsiblePositionObj ? responsiblePositionObj.valueLng || '' : '',
      responsiblePhone: !!responsiblePhoneObj ? responsiblePhoneObj.value || '' : '',
      responsibleAppointmentDate: !!responsibleAppointmentDateObj ? responsibleAppointmentDateObj.value || '' : '',
      archiveLeaderFIOObj: !!archiveLeaderFIOObj ? archiveLeaderFIOObj.valueLng || '' : '',
      archiveLeaderPositionObj: !!archiveLeaderPositionObj ? archiveLeaderPositionObj.valueLng || '' : '',
      archiveLeaderPhone: !!archiveLeaderPhoneObj ? archiveLeaderPhoneObj.value || '' : '',
      archiveLeaderAppointmentDate: !!archiveLeaderAppointmentDateObj ? archiveLeaderAppointmentDateObj.value || '' : '',
      commissionLeaderFIOObj: !!commissionLeaderFIOObj ? commissionLeaderFIOObj.valueLng || '' : '',
      commissionLeaderPositionObj: !!commissionLeaderPositionObj ? commissionLeaderPositionObj.valueLng || '' : '',
      commissionLeaderPhone: !!commissionLeaderPhoneObj ? commissionLeaderPhoneObj.value || '' : ''
    }
  };

  onCreateObj = values => {
    const { shortName, name, dbeg, dend, accessLevel, ...rest } = values;
    const cube = {
      cubeSConst: CUBE_FOR_ORG_FUNDMAKER
    };
    const obj = {
      name: shortName,
      fullName: name,
      clsConst: 'orgList',
      dbeg,
      dend,
      accessLevel: accessLevel ? accessLevel.value : ''
    };

    const hideCreateObj = message.loading('CREATING_NEW_OBJECT', 3);
    createObj(cube, obj)
      .then(res => {
        hideCreateObj();
        if(res.success) {
          const fd = new FormData();
          fd.append('obj', res.data.idItemDO.split('_')[1]);
          fd.append('propConst', 'fundmakerOfIK');
          insPropVal(fd)
            .then(insResp => {
              if(insResp.success) {
                cube.cubeSConst = CUBE_FOR_FUND_AND_IK;
                obj.clsConst = 'sourceOrgList';
                createObj(cube, obj)
                  .then(resp => {
                    if(resp.success) {
                      const datas = [{
                        own: [{doConst: 'doForFundAndIK', doItem: resp.data.idItemDO, isRel: "0", objData: {}}],
                        props: [{propConst: 'fundmakerOfIK', val: res.data.idItemDO.split('_')[1], typeProp: '41', periodDepend: "0", isUniq: '1'}],
                        periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
                      }];
                      updateCubeData(CUBE_FOR_FUND_AND_IK, this.props.globalDate.format('YYYY-MM-DD'), JSON.stringify(datas))
                    }
                  })
              };
            });

          const hideLoading = message.loading('UPDATING_PROPS', 0);
          const datas = [{
            own: [{doConst: 'doForOrgFundmakers', doItem: res.data.idItemDO, isRel: "0", objData: {}}],
            props: map(rest, (val, key) => {
              const propMetaData = getPropMeta(this.props.orgCube["dp_" + this.props.tofiConstants.dpForOrgFundmakers.id], this.props.tofiConstants[key]);
              let value = val;
              if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
              if(typeof val === 'object' && val.value) value = String(val.value);
              if(propMetaData.isUniq === 2 && val[0].value) value = val.map(v => String(v.value)).join(",");
              return {propConst: key, val: value, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq)}
            }),
            periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
          }];
          updateCubeData(CUBE_FOR_ORG_FUNDMAKER, this.props.globalDate.format('YYYY-MM-DD'), JSON.stringify(datas))
            .then(resp => {
              hideLoading();
              if(resp.success) {
                message.success('PROPS_SUCCESSFULLY_UPDATED');
                this.setState({loading: true});
                this.props.getCube(CUBE_FOR_ORG_FUNDMAKER)
                  .then(() => {
                    this.setState({loading: false})
                  })
              } else {
                message.error('PROPS_UPDATING_ERROR');
              }
            })
        } else {
          if(res.errors) {
            res.errors.forEach(err => {
              message.error(err.text)
            })
          }
        }
      });
  };

  onSaveCubeData = values => {
    const { shortName, name, dbeg, dend, accessLevel, ...rest } = values;

    const datas = [{
      own: [{doConst: 'doForOrgFundmakers', doItem: this.state.selectedRow.key, isRel: "0", objData: {name: shortName, fullName: name, dbeg, dend, accessLevel: accessLevel ? accessLevel.value : ''}}],
      props: map(rest, (val, key) => {
        const propMetaData = getPropMeta(this.props.orgCube["dp_" + this.props.tofiConstants.dpForOrgFundmakers.id], this.props.tofiConstants[key]);
        let value = val;
        if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
        if(typeof val === 'object' && val.value) value = String(val.value);
        if(propMetaData.isUniq === 2 && val[0].value) value = val.map(v => String(v.value)).join(",");
        return {propConst: key, val: value, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq)}
      }),
      periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
    }];
    const hideLoading = message.loading('UPDATING_PROPS', 0);
    updateCubeData(CUBE_FOR_ORG_FUNDMAKER, this.props.globalDate.format('YYYY-MM-DD'), JSON.stringify(datas))
      .then(res => {
        hideLoading();
        if(res.success) {
          message.success('PROPS_SUCCESSFULLY_UPDATED');
          this.setState({loading: true});
          this.props.getCube(CUBE_FOR_ORG_FUNDMAKER)
            .then(() => {
              this.setState({loading: false})
            })
        } else {
          message.error('PROPS_UPDATING_ERROR');
          if(res.errors) {
            res.errors.forEach(err => {
              message.error(err.text)
            })
          }
        }
      })
  };

  render() {
    const { filter, data, loading } = this.state;
    const { t, tofiConstants, legalStatusOptions, fundmakerArchiveOptions, orgIndustryOptions, formOfAdmissionOptions, isActiveOptions } = this.props;
    if(isEmpty(tofiConstants)) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { legalStatus, formOfAdmission, orgIndustry, fundmakerArchive, isActive } = tofiConstants;

    this.filteredData = data.filter(item => {
      return (
        item.orgList[this.lng].toLowerCase().includes(filter.orgList.toLowerCase()) &&
        ( filter.formOfAdmission.length === 0  || filter.formOfAdmission.some(p => p.value == item.formOfAdmission.value) ) &&
        ( filter.isActive.length === 0  || filter.isActive.some(p => p.value == item.isActiveObj.value) ) &&
        ( filter.legalStatus.length === 0  || filter.legalStatus.some(p => p.value == item.legalStatus.value) ) &&
        ( filter.fundmakerArchive.length === 0  || filter.fundmakerArchive.some(p => p.label == item.fundmakerArchive) ) &&
        ( filter.orgIndustry.length === 0  || filter.orgIndustry.some(p => p.value == item.orgIndustry.value) )
      )
    }).map((item, idx) => ({...item, numb: idx+1}));

    return (
      <div className="FundMaker">
        <div className="FundMaker__heading">
          <div className="table-header">
            <div className="table-header-btns">
              <Button onClick={this.openCard}>{this.props.t('ADD')}</Button>
            </div>
            <div className="label-select">
              <Select
                name="formOfAdmission"
                multi
                searchable={false}
                value={filter.formOfAdmission}
                onChange={this.onFormOfAdmissionChange}
                onOpen={this.loadOptions(FORM_OF_ADMISSION)}
                isLoading={filter.formOfAdmissionLoading}
                options={formOfAdmissionOptions ? formOfAdmissionOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('FORM_OF_ADMISSION')}
              />
            </div>
            <div className="label-select">
              <Select
                name="legalStatus"
                multi
                searchable={false}
                value={filter.legalStatus}
                onChange={this.onLegalStatusChange}
                isLoading={filter.legalStatusLoading}
                options={legalStatusOptions ? legalStatusOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={legalStatus.name[this.lng]}
                onOpen={this.loadOptions(LEGAL_STATUS)}
                menuStyle={{minWidth: 200}}
                menuContainerStyle={{minWidth: 202}}
              />
            </div>
            <div className="label-select">
              <SelectVirt
                name="fundmakerArchive"
                multi
                searchable
                optionHeight={40}
                className="long-selected-menu"
                isLoading={filter.fundmakerArchiveLoading}
                onOpen={this.loadOptions(FUND_MAKER_ARCHIVE)}
                value={filter.fundmakerArchive}
                onChange={this.onOrgLocationChange}
                options={fundmakerArchiveOptions ? fundmakerArchiveOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={fundmakerArchive.name[this.lng]}
              />
            </div>
            <div className="label-select">
              <Select
                name="orgIndustry"
                multi
                isLoading={filter.orgIndustryLoading}
                onOpen={this.loadOptions(ORG_INDUSTRY)}
                value={filter.orgIndustry}
                onChange={this.onOrgIndustryChange}
                options={orgIndustryOptions ? orgIndustryOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                menuStyle={{minWidth: 200}}
                menuContainerStyle={{minWidth: 202}}
                placeholder={orgIndustry.name[this.lng]}
              />
            </div>
            <div className="label-select">
              <Select
                name="isActive"
                multi
                searchable={false}
                isLoading={filter.isActiveLoading}
                onOpen={this.loadOptions(IS_ACTIVE)}
                value={filter.isActive}
                onChange={this.onIsActiveChange}
                options={isActiveOptions ? isActiveOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                menuStyle={{minWidth: 200}}
                menuContainerStyle={{minWidth: 202}}
                placeholder={isActive.name[this.lng]}
              />
            </div>
          </div>
        </div>
        <div className="FundMaker__body">
          <AntTable
            loading={loading}
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
                width: '30%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="orgList"
                      suffix={filter.orgList ? <Icon type="close-circle" data-name="orgList" onClick={this.emitEmpty} /> : null}
                      ref={ele => this.orgList = ele}
                      placeholder="Поиск"
                      value={filter.orgList}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: filter.orgList ? '#ff9800' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.orgList.focus());
                },
                render: obj => obj[this.lng]
              },
              {
                key: 'legalStatus',
                title: legalStatus.name[this.lng],
                dataIndex: 'legalStatus',
                width: '20%',
                render: text => text.label
              },
              {
                key: 'formOfAdmission',
                title: formOfAdmission.name[this.lng],
                dataIndex: 'formOfAdmission',
                width: '20%',
                render: text => text.label
              },
              {
                key: 'orgIndustry',
                title: orgIndustry.name[this.lng],
                dataIndex: 'orgIndustry',
                width: '20%',
                render: value => value.label
              }
            ]}
            dataSource={this.filteredData}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="FundMaker"
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard_FundMaker t={t} tofiConstants={tofiConstants} initialValues={this.state.initialValues} //eslint-disable-line
                       closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}
                       optionsData={{legalStatusOptions: this.props.legalStatusOptions, fundmakerArchiveOptions: this.props.fundmakerArchiveOptions,
                       orgIndustryOptions:this.props.orgIndustryOptions}} onSaveCubeData={this.onSaveCubeData} onCreateObj={this.onCreateObj}
            />
          </CSSTransition>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    legalStatusOptions: state.generalData[LEGAL_STATUS],
    fundmakerArchiveOptions: state.generalData[FUND_MAKER_ARCHIVE],
    orgIndustryOptions: state.generalData[ORG_INDUSTRY],
    formOfAdmissionOptions: state.generalData[FORM_OF_ADMISSION],
    isActiveOptions: state.generalData[IS_ACTIVE]
  }
}

export default connect(mapStateToProps, {getCube, getPropVal})(FundMaker);
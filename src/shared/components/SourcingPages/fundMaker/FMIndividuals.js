import React from 'react';
import {Button, Icon, Input, message} from 'antd';
import CSSTransition from 'react-transition-group/CSSTransition'
import Select from 'react-select';

import AntTable from '../../AntTable';
import {isEmpty, isEqual, map} from 'lodash';
import SiderCard_FMIndividuals from './SiderCard_FMIndividuals';
import moment from 'moment';
import {getPropMeta, parseCube_new} from '../../../utils/cubeParser';
import {createObj, getPropVal, insPropVal, updateCubeData} from '../../../actions/actions';
import {
  CUBE_FOR_FUND_AND_IK,
  CUBE_FOR_LP_FUNDMAKER, PERSON_ACADEMIC_DEGREE, PERSON_ACADEMIC_TITLE,
  PERSON_SPECIALTY
} from '../../../constants/tofiConstants';
import {SYSTEM_LANG_ARRAY} from '../../../constants/constants';
import {connect} from 'react-redux';

/*eslint eqeqeq:0*/
class FMIndividuals extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      openCard: false,
      search: '',
      filter: {
        personList: '',
        personAcademicDegree: [],
        personAcademicDegreeLoading: false,
        personAcademicTitle: [],
        personAcademicTitleLoading: false,
        personSpecialty: [],
        personSpecialtyLoading: false
      },
      selectedRow: null,
      initialValues: {dateOfBirth: moment()}
    }
  }

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)){
      this.setState({ selectedRow: rec })
    } else {
      const initialValues = {
        personLastName: rec.personLastNameObj,
        personName: rec.personNameObj,
        accessLevel: rec.accessLevel,
        personPatronymic: rec.personPatronymicObj,
        dateOfBirth: rec.dateOfBirthObj,
        dateOfDeath: rec.dateOfDeathObj,
        personAcademicDegree: rec.personAcademicDegree,
        personAcademicTitle: rec.personAcademicTitle,
        personSpecialty: rec.personSpecialty,
        personAddress: rec.personAddressObj,
        personPhone: rec.personPhone,
        personEmail: rec.personEmail,
        ownerLastName: rec.ownerLastNameObj,
        ownerName: rec.ownerNameObj,
        ownerPatronymic: rec.ownerPatronymicObj,
        ownerStatus: rec.ownerStatusObj,
        ownerAddress: rec.ownerAddressObj,
        ownerPhone: rec.ownerPhone,
        ownerEmail: rec.ownerEmail,
        personLaborBeginYear: rec.personLaborBeginYear,
        personLaborEndYear: rec.personLaborEndYear,
        personLaborPosition: rec.personLaborPosition,
        personLaborOrg: rec.personLaborOrg
      };
      this.setState({ initialValues, openCard: true, selectedRow: rec })
    }
  };

  componentDidMount() {
    if(isEmpty(this.props.tofiConstants) || !this.props.LPCube) return;
    const { doForLPFundmakers, dpForLPFundmakers } = this.props.tofiConstants;
    this.setState(
      {
        loading: false,
        data: parseCube_new(this.props.LPCube['cube'], [], 'dp', 'do', this.props.LPCube[`do_${doForLPFundmakers.id}`], this.props.LPCube[`dp_${dpForLPFundmakers.id}`], `do_${doForLPFundmakers.id}`, `dp_${dpForLPFundmakers.id}`)
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.LPCube) && !isEmpty(nextProps.tofiConstants) && this.props.LPCube !== nextProps.LPCube) {
      const { doForLPFundmakers, dpForLPFundmakers } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(nextProps.LPCube['cube'], [], 'dp', 'do', nextProps.LPCube[`do_${doForLPFundmakers.id}`], nextProps.LPCube[`dp_${dpForLPFundmakers.id}`], `do_${doForLPFundmakers.id}`, `dp_${dpForLPFundmakers.id}`)
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  onPersonAcademicDegreeChange = s => {this.setState({filter: {...this.state.filter, personAcademicDegree: s}})};
  onPersonAcademicTitleChange = s => {this.setState({filter: {...this.state.filter, personAcademicTitle: s}})};
  onPersonSpecialtyChange = s => {this.setState({filter: {...this.state.filter, personSpecialty: s}})};

  onCreateObj = values => {
    const {accessLevel, ...rest } = values;
    const cube = {
      cubeSConst: CUBE_FOR_LP_FUNDMAKER
    };
    const name = {};
    SYSTEM_LANG_ARRAY.forEach(lang => {
      name[lang] = (rest.personLastName ? (rest.personLastName[lang] || '') : '') + ' ' +
        (rest.personName ? (rest.personName[lang] || '') : '') + ' ' +
        (rest.personPatronymic ? (rest.personPatronymic[lang] || '') : '')
    });
    const obj = {
      name,
      fullName: name,
      clsConst: 'personList',
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
              console.log(insResp);
              cube.cubeSConst = CUBE_FOR_FUND_AND_IK;
              obj.clsConst = 'sourceLPList';
              createObj(cube, obj)
                .then(resp => {
                  if(resp.success) {
                    const datas = [{
                      own: [{doConst: 'doForFundAndIK', doItem: resp.data.idItemDO, isRel: "0", objData: {}}],
                      props: [{propConst: 'fundmakerOfIK', val: res.data.idItemDO.split('_')[1], typeProp: '41', periodDepend: "0", isUniq: '1'}],
                      periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
                    }];
                    updateCubeData(CUBE_FOR_FUND_AND_IK, this.props.globalDate.format('YYYY-MM-DD'), JSON.stringify(datas))
                      .then(res => {
                        if(res.success) {
                          console.log(res);
                        }
                      })
                  }
                })
            });


          const hideLoading = message.loading('UPDATING_PROPS', 0);
          const datas = [{
            own: [{doConst: 'doForLPFundmakers', doItem: res.data.idItemDO, isRel: "0", objData: {}}],
            props: map(rest, (val, key) => {
              const propMetaData = getPropMeta(this.props.LPCube["dp_" + this.props.tofiConstants.dpForLPFundmakers.id], this.props.tofiConstants[key]);
              let value = val;
              if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
              if(typeof val === 'object' && val.value) value = String(val.value);
              if(propMetaData.isUniq === 2 && val[0].value) value = val.map(v => String(v.value)).join(",");
              return {propConst: key, val: value, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq)}
            }),
            periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
          }];
          updateCubeData(CUBE_FOR_LP_FUNDMAKER, this.props.globalDate.format('YYYY-MM-DD'), JSON.stringify(datas))
            .then(() => {
              hideLoading();
              if(res.success) {
                message.success('PROPS_SUCCESSFULLY_UPDATED');
                this.setState({loading: true});
                this.props.getCube(CUBE_FOR_LP_FUNDMAKER)
                  .then(() => {
                    this.setState({loading: false})
                  })
              } else {
                message.error('PROPS_UPDATING_ERROR');
              }
            }).catch(() => {
            hideLoading();
            message.error('PROPS_UPDATING_ERROR')
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
    const { accessLevel, ...rest } = values;
    const name = {};
    SYSTEM_LANG_ARRAY.forEach(lang => {
      name[lang] = (rest.personLastName ? (rest.personLastName[lang] || '') : '') + ' ' +
        (rest.personName ? (rest.personName[lang] || '') : '') + ' ' +
        (rest.personPatronymic ? (rest.personPatronymic[lang] || '') : '')
    });

    const datas = [{
      own: [{doConst: 'doForLPFundmakers', doItem: this.state.selectedRow.key, isRel: "0", objData: {name, fullName: name, accessLevel: accessLevel ? accessLevel.value : ''}}],
      props: map(rest, (val, key) => {
        const propMetaData = getPropMeta(this.props.LPCube["dp_" + this.props.tofiConstants.dpForLPFundmakers.id], this.props.tofiConstants[key]);
        let value = val;
        if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
        if(typeof val === 'object' && val.value) value = String(val.value);
        if(propMetaData.isUniq === 2 && val[0].value) value = val.map(v => String(v.value)).join(",");
        return {propConst: key, val: value, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq)}
      }),
      periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
    }];
    const hideLoading = message.loading('UPDATING_PROPS', 0);
    updateCubeData(CUBE_FOR_LP_FUNDMAKER, this.props.globalDate.format('YYYY-MM-DD'), JSON.stringify(datas))
      .then(res => {
        hideLoading();
        if(res.success) {
          message.success('PROPS_SUCCESSFULLY_UPDATED');
          this.setState({loading: true});
          this.props.getCube(CUBE_FOR_LP_FUNDMAKER)
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

  renderTableData = (item, idx) => {
    const { personLastName, personName, personPatronymic,
      dateOfBirth, dateOfDeath, personAcademicDegree, personAcademicTitle, personSpecialty, personAddress, personPhone, personEmail,
      ownerLastName, ownerName, ownerPatronymic, ownerStatus, ownerAddress, ownerPhone, ownerEmail,
      personLaborBeginYear, personLaborEndYear, personLaborPosition, personLaborOrg} = this.props.tofiConstants;
    const personLastNameObj = item.props.find(element => element.prop == personLastName.id),
      personNameObj = item.props.find(element => element.prop == personName.id),
      personPatronymicObj = item.props.find(element => element.prop == personPatronymic.id),
      dateOfBirthObj = item.props.find(element => element.prop == dateOfBirth.id),
      dateOfDeathObj = item.props.find(element => element.prop == dateOfDeath.id),
      personAcademicDegreeObj = item.props.find(element => element.prop == personAcademicDegree.id),
      personAcademicTitleObj = item.props.find(element => element.prop == personAcademicTitle.id),
      personSpecialtyObj = item.props.find(element => element.prop == personSpecialty.id),
      personAddressObj = item.props.find(element => element.prop == personAddress.id),
      personPhoneObj = item.props.find(element => element.prop == personPhone.id),
      personEmailObj = item.props.find(element => element.prop == personEmail.id),
      ownerLastNameObj = item.props.find(element => element.prop == ownerLastName.id),
      ownerNameObj = item.props.find(element => element.prop == ownerName.id),
      ownerPatronymicObj = item.props.find(element => element.prop == ownerPatronymic.id),
      ownerStatusObj = item.props.find(element => element.prop == ownerStatus.id),
      ownerAddressObj = item.props.find(element => element.prop == ownerAddress.id),
      ownerPhoneObj = item.props.find(element => element.prop == ownerPhone.id),
      ownerEmailObj = item.props.find(element => element.prop == ownerEmail.id),
      personLaborBeginYearObj = item.props.find(element => element.prop == personLaborBeginYear.id),
      personLaborEndYearObj = item.props.find(element => element.prop == personLaborEndYear.id),
      personLaborPositionObj = item.props.find(element => element.prop == personLaborPosition.id),
      personLaborOrgObj = item.props.find(element => element.prop == personLaborOrg.id);

    return {
      key: item.id,
      numb: idx + 1,
      accessLevel: item.accessLevel,
      personList: !!item.name ? item.name : {kz: '', ru: '', en: ''},
      personLastNameObj: !!personLastNameObj ? personLastNameObj.valueLng || '' : '',
      personNameObj: !!personNameObj ? personNameObj.valueLng || '' : '',
      personPatronymicObj: !!personPatronymicObj ? personPatronymicObj.valueLng || '' : '',
      dateOfBirthObj: !!dateOfBirthObj && dateOfBirthObj.value ? moment(dateOfBirthObj.value, 'DD-MM-YYYY') : null,
      dateOfDeathObj: !!dateOfDeathObj && dateOfDeathObj.value ? moment(dateOfDeathObj.value, 'DD-MM-YYYY') : null,
      personAcademicDegree: !!personAcademicDegreeObj && personAcademicDegreeObj.refId ? {value: personAcademicDegreeObj.refId, label: personAcademicDegreeObj.value} : null,
      personAcademicTitle: !!personAcademicTitleObj && personAcademicTitleObj.refId ? {value: personAcademicTitleObj.refId, label: personAcademicTitleObj.value} : null,
      personSpecialty: !!personSpecialtyObj && personSpecialtyObj.values ? personSpecialtyObj.values : [],
      personAddressObj: !!personAddressObj ? personAddressObj.valueLng || '' : '',
      personPhone: !!personPhoneObj ? personPhoneObj.value || '' : '',
      personEmail: !!personEmailObj ? personEmailObj.value || '' : '',
      ownerLastNameObj: !!ownerLastNameObj ? ownerLastNameObj.valueLng || '' : '',
      ownerNameObj: !!ownerNameObj ? ownerNameObj.valueLng || '' : '',
      ownerPatronymicObj: !!ownerPatronymicObj ? ownerPatronymicObj.valueLng || '' : '',
      ownerStatusObj: !!ownerStatusObj ? ownerStatusObj.refId || '' : '',
      ownerAddressObj: !!ownerAddressObj ? ownerAddressObj.valueLng || '' : '',
      ownerPhone: !!ownerPhoneObj ? ownerPhoneObj.value || '' : '',
      ownerEmail: !!ownerEmailObj ? ownerEmailObj.value || '' : '',
      personLaborBeginYear: !!personLaborBeginYearObj ? personLaborBeginYearObj.value || '' : '',
      personLaborEndYear: !!personLaborEndYearObj ? personLaborEndYearObj.value || '' : '',
      personLaborPosition: !!personLaborPositionObj ? personLaborPositionObj.value || '' : '',
      personLaborOrg: !!personLaborOrgObj ? personLaborOrgObj.value || '' : ''
    }
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

  openCard = () => {
    this.setState({ openCard: true, initialValues: {accessLevel: {value: 1, label: "Общедоступный уровень"}} })
  };

  closeCard = () => {
    this.setState({ openCard: false })
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

  render() {
    const { t, tofiConstants, personAcademicDegreeOptions, personAcademicTitleOptions, personSpecialtyOptions } = this.props;
    const { filter, data } = this.state;
    if(isEmpty(tofiConstants)) return null;
    this.lng = localStorage.getItem('i18nextLng');

    this.filteredData = data.map(this.renderTableData).filter(item => {
      return (
        item.personList[this.lng].toLowerCase().includes(filter.personList.toLowerCase()) &&
        ( filter.personAcademicDegree.length === 0  || filter.personAcademicDegree.some(p => item.personAcademicDegree && p.value == item.personAcademicDegree.value) ) &&
        ( filter.personAcademicTitle.length === 0  || filter.personAcademicTitle.some(p => item.personAcademicTitle && p.value == item.personAcademicTitle.value) ) &&
        ( filter.personSpecialty.length === 0  || filter.personSpecialty.some(p => item.personSpecialty.some(v => v.value == p.value) ))
      )
    });

    return (
      <div className="FMIndividuals">
        <div className="FMIndividuals__heading">
          <div className="table-header">
            <div className="table-header-btns">
              <Button onClick={this.openCard}>{t('ADD')}</Button>
            </div>
            <div className="label-select">
              <Select
                name="personAcademicDegree"
                multi
                searchable={false}
                value={filter.personAcademicDegree}
                onChange={this.onPersonAcademicDegreeChange}
                onOpen={this.loadOptions(PERSON_ACADEMIC_DEGREE)}
                isLoading={filter.personAcademicDegreeLoading}
                options={personAcademicDegreeOptions ? personAcademicDegreeOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('PERSON_ACADEMIC_DEGREE')}
              />
            </div>
            <div className="label-select">
              <Select
                name="personAcademicTitle"
                multi
                searchable={false}
                value={filter.personAcademicTitle}
                onChange={this.onPersonAcademicTitleChange}
                onOpen={this.loadOptions(PERSON_ACADEMIC_TITLE)}
                isLoading={filter.personAcademicTitleLoading}
                options={personAcademicTitleOptions ? personAcademicTitleOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('PERSON_ACADEMIC_TITLE')}
              />
            </div>
            <div className="label-select">
              <Select
                name="personSpecialty"
                multi
                searchable={false}
                value={filter.personSpecialty}
                onChange={this.onPersonSpecialtyChange}
                onOpen={this.loadOptions(PERSON_SPECIALTY)}
                isLoading={filter.personSpecialtyLoading}
                options={personSpecialtyOptions ? personSpecialtyOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('PERSON_SPECIALTY')}
              />
            </div>
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
                width: '90%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="personList"
                      suffix={filter.personList ? <Icon type="close-circle" data-name="personList" onClick={this.emitEmpty} /> : null}
                      ref={ele => this.personList = ele}
                      placeholder="Поиск"
                      value={filter.personList}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: filter.personList ? '#ff9800' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.personList.focus());
                },
                render: obj => obj[this.lng]
              }
            ]}
            dataSource={this.filteredData}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="FMIndividuals"
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard_FMIndividuals t={t} tofiConstants={tofiConstants} initialValues={this.state.initialValues} //eslint-disable-line
                                closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}
                                onSaveCubeData={this.onSaveCubeData} onCreateObj={this.onCreateObj} LPdimObj={this.props.LPCube && this.props.LPCube[`dp_${this.props.tofiConstants.dpForLPFundmakers.id}`]}
                                recKey={this.state.selectedRow ? this.state.selectedRow.key : ''}
            />
          </CSSTransition>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    personAcademicDegreeOptions: state.generalData[PERSON_ACADEMIC_DEGREE],
    personAcademicTitleOptions: state.generalData[PERSON_ACADEMIC_TITLE],
    personSpecialtyOptions: state.generalData[PERSON_SPECIALTY]
  }
}

export default connect(mapStateToProps, { getPropVal })(FMIndividuals);
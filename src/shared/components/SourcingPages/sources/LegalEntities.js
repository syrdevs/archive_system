import React from 'react'
import PropTypes from 'prop-types';
import {isEmpty, uniq} from 'lodash';
import {Button, Icon, Input, Spin} from 'antd';
import Select from 'react-select';
import SelectVirt from 'react-virtualized-select';

import AntTable from '../../AntTable';
import {parseCube_new} from '../../../utils/cubeParser';
import {
  LEGAL_STATUS, FORM_OF_ADMISSION, FUND_MAKER_ARCHIVE, ORG_INDUSTRY, DP_FOR_ORG_FUNDMAKER, DO_FOR_INV, DP_FOR_INV,
  CUBE_FOR_AF_INV
} from '../../../constants/tofiConstants';
import {getCube, getObjByProp, getPropVal} from '../../../actions/actions';
import {connect} from 'react-redux';
import {CSSTransition} from 'react-transition-group';
import SiderCardLegalEntities from './SiderCardLegalEntities';
import DocsStorageConditions from './DocsStorageConditions';
import LegalEntitiesInventoriesSmall from './legalEntitiesInv/LegalEntitiesInventoriesSmall';
import LegalEntitiesNomenclatureSmall from './LegalEntitiesNomenclatureSmall';
import NMDocsSmall from './NMDocsSmall';

/*eslint eqeqeq:0*/
class LegalEntities extends React.PureComponent {

  state = {
    data: [],
    openCard: false,
    siderCardChildren: null,
    loading: true,
    selectedRow: {},
    filter: {
      sourceOrgList: '',
      legalStatus: [],
      legalStatusLoading: false,
      fundmakerArchive: [],
      fundmakerArchiveLoading: false,
      formOfAdmission: [],
      formOfAdmissionLoading: false,
      orgIndustry: [],
      orgIndustryLoading: false
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

  onLegalStatusChange = s => {this.setState({filter: {...this.state.filter, legalStatus: s}})};
  onOrgLocationChange= s => {this.setState({filter: {...this.state.filter, fundmakerArchive: s}})};
  onFormOfAdmissionChange = s => {this.setState({filter: {...this.state.filter, formOfAdmission: s}})};
  onorgIndustryChange = s => {this.setState({filter: {...this.state.filter, orgIndustry: s}})};

  onDelete = key => {
    return function inter(e) {
      e.preventDefault();
      console.log(key);
    }
  };

  handleClick = (rec, name) => {
    return e => {
      e.stopPropagation();
      switch (name) {
        case 'nmDocs':
          this.selectedKey !== rec.key && this.props.loadEntity(rec.key);
          // this.props.history.push(`/sourcing/sourcesMaintenance/legalEntities/${rec.key}/nmDocs`);
          this.setState({ openCard: true, siderCardChildren: <NMDocsSmall tofiConstants={this.props.tofiConstants} t={this.props.t} /> });
          this.selectedKey = rec.key;
          break;
        case 'storageConditions':
          this.selectedKey !== rec.key && this.props.loadEntity(rec.key);
          this.setState({ openCard: true, siderCardChildren: <DocsStorageConditions tofiConstants={this.props.tofiConstants} t={this.props.t} /> });
          this.selectedKey = rec.key;
          break;
        case 'docsInfo' :
          this.selectedKey !== rec.key && this.props.loadEntity(rec.key);
          this.props.history.push(`/sourcing/sourcesMaintenance/legalEntities/${rec.key}/docsInfo`);
          this.selectedKey = rec.key;
          break;
        case 'inventories': {
          this.setState({ openCard: true, siderCardChildren: <Spin /> });
          const filters = {
            filterDOAnd: [
              {
                dimConst: DO_FOR_INV,
                concatType: "and",
                conds: [
                  {
                    data: {
                      valueRef: {
                        id: rec.key
                      }
                    }
                  }
                ]
              }
            ],
            filterDPAnd: [
              {
                dimConst: DP_FOR_INV,
                concatType: "and",
                conds: [
                  {
                    consts: 'invNumber,invType,fundNumberOfCases,invDates,invAgreement2Date,invApprovalDate2'
                  }
                ]
              }
            ]
          };
          this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters))
            .then(res => {
              if (res.cube) {
                this.setState({ openCard: true, siderCardChildren: <LegalEntitiesInventoriesSmall
                  record={rec}
                  tofiConstants={this.props.tofiConstants}
                  t={this.props.t}
                  CubeForAF_Inv={this.props.CubeForAF_Inv}
                /> });
              } else {
                throw res;
              }
            }).catch(err => {
              console.error(err);
              this.setState({ openCard: true, siderCardChildren: <LegalEntitiesInventoriesSmall
                record={rec}
                tofiConstants={this.props.tofiConstants}
                t={this.props.t}
              /> });
          });
          this.selectedKey = rec.key;
          break;
        }
        case 'nomenclature':
          this.setState({ openCard: true, siderCardChildren: <Spin /> });
          const dataRec = this.state.data.find(o => o.id === rec.key);
          const prop = dataRec ? dataRec.props.find(p => p.prop == this.props.tofiConstants.nomen.id) : null;
          const obj = prop && prop.values ? uniq(prop.values.map(p => p.value)).join(',') : '';
          if(obj) {
            const filters = {
              filterDOAnd: [
                {
                  dimConst: 'dimObjNomen',
                  concatType: "and",
                  conds: [
                    {
                      obj
                    }
                  ]
                }
              ]
            };
            this.props.getCube('cubeSNomen', JSON.stringify(filters))
              .then(res => {
                if (res.cube) {
                  this.setState({ openCard: true, siderCardChildren: <LegalEntitiesNomenclatureSmall
                    IK={rec.key}
                    tofiConstants={this.props.tofiConstants}
                    t={this.props.t}
                    cubeSNomen={this.props.cubeSNomen}
                  /> });
                };
              })
          } else {
            this.setState({ openCard: true, siderCardChildren: <LegalEntitiesNomenclatureSmall
              IK={rec.key}
              tofiConstants={this.props.tofiConstants}
              t={this.props.t}
            /> });
          }
          // this.siderCardChildren = <LegalEntitiesInventoriesSmall tofiConstants={this.props.tofiConstants} t={this.props.t} />;
          this.selectedKey = rec.key;
          break;
        default: break;
      }
    }
  };

  closeCard = () => {
    this.setState({ openCard: false })
  };
  stopPropagation = e => {
    e.stopPropagation();
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

  async componentDidMount() {
    if(isEmpty(this.props.tofiConstants) || !this.props.orgSourceCube) return;
    await this.props.loadEntity();
    const { doForFundAndIK, dpForFundAndIK, fundmakerOfIK, doForOrgFundmakers, dpForOrgFundmakers } = this.props.tofiConstants;

    const data = parseCube_new(this.props.orgSourceCube['cube'], [], 'dp', 'do', this.props.orgSourceCube[`do_${doForFundAndIK.id}`], this.props.orgSourceCube[`dp_${dpForFundAndIK.id}`], `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`);

    if(this.props.orgCube) {
      this.filteredOrgCubeDP = this.props.orgCube[`dp_${this.props.tofiConstants[DP_FOR_ORG_FUNDMAKER].id}`].filter(dpItem => {
        return ['orgIndustry', 'formOfAdmission', 'legalStatus', 'fundmakerArchive'].some(c =>
          dpItem.prop == this.props.tofiConstants[c].id          //eslint-disable-line eqeqeq
        );
      });
      this.filteredOrgCubeDO = this.props.orgCube[`do_${doForOrgFundmakers.id}`].filter(doItem =>
        data.some(item => {
          const fundmakerOfIKObj = item.props.find(element => element.prop == fundmakerOfIK.id);
          return fundmakerOfIKObj.cube.idRef && doItem.id.includes(fundmakerOfIKObj.cube.idRef);
        })
      );
      this.filteredOrgCubeTF = this.props.orgCube.cube.filter(tf => {
        return this.filteredOrgCubeDP.some(dpItem => tf[`dp_${dpForOrgFundmakers.id}`] == dpItem.id) && this.filteredOrgCubeDO.some(doItem => tf[`do_${doForOrgFundmakers.id}`] == doItem.id)
      });
      this.filteredOrgCube = parseCube_new(this.filteredOrgCubeTF, [], 'dp', 'do', this.filteredOrgCubeDO, this.filteredOrgCubeDP, `do_${doForOrgFundmakers.id}`, `dp_${dpForOrgFundmakers.id}`);
    }
    this.setState(
      {
        loading: false,
        data
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.orgSourceCube) && !isEmpty(nextProps.tofiConstants) && this.props.orgSourceCube !== nextProps.orgSourceCube) {
      const { doForFundAndIK, dpForFundAndIK, fundmakerOfIK, doForOrgFundmakers, dpForOrgFundmakers } = this.props.tofiConstants;
      const data = parseCube_new(nextProps.orgSourceCube['cube'], [], 'dp', 'do', nextProps.orgSourceCube[`do_${doForFundAndIK.id}`], nextProps.orgSourceCube[`dp_${dpForFundAndIK.id}`], `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`);
      if(this.props.orgCube) {
        this.filteredOrgCubeDP = this.props.orgCube[`dp_${this.props.tofiConstants[DP_FOR_ORG_FUNDMAKER].id}`].filter(dpItem => {
          return ['orgIndustry', 'formOfAdmission', 'legalStatus', 'fundmakerArchive'].some(c =>
            dpItem.prop == this.props.tofiConstants[c].id          //eslint-disable-line eqeqeq
          );
        });

        this.filteredOrgCubeDO = this.props.orgCube[`do_${doForOrgFundmakers.id}`].filter(doItem =>
          data.some(item => {
            const fundmakerOfIKObj = item.props.find(element => element.prop == fundmakerOfIK.id);
            //TODO fundmaker should be single valued
            return fundmakerOfIKObj.cube.idRef && doItem.id.includes(fundmakerOfIKObj.cube.idRef);
          })
        );
        this.filteredOrgCubeTF = this.props.orgCube.cube.filter(tf => {
          return this.filteredOrgCubeDP.some(dpItem => tf[`dp_${dpForOrgFundmakers.id}`] == dpItem.id) && this.filteredOrgCubeDO.some(doItem => tf[`do_${doForOrgFundmakers.id}`] == doItem.id)
        });
        this.filteredOrgCube = parseCube_new(this.filteredOrgCubeTF, [], 'dp', 'do', this.filteredOrgCubeDO, this.filteredOrgCubeDP, `do_${doForOrgFundmakers.id}`, `dp_${dpForOrgFundmakers.id}`)
      }

      this.setState(
        {
          loading: false,
          data
        }
      );
    } else if(this.props.loading !== nextProps.loading){
      this.setState({ loading: nextProps.loading });
    }

  }

  renderTableData = (item, idx) => {
    const { fundmakerOfIK, orgIndustry, formOfAdmission, legalStatus, fundmakerArchive } = this.props.tofiConstants;
    const fundmakerOfIKObj = item.props.find(element => element.prop == fundmakerOfIK.id);

    const fmItem = this.filteredOrgCube && this.filteredOrgCube.find(fmItem => fundmakerOfIKObj.cube.idRef && fmItem.id.includes(fundmakerOfIKObj.cube.idRef));

    const orgIndustryObj = fmItem && fmItem.props.find(element => element.prop == orgIndustry.id),
      formOfAdmissionObj = fmItem && fmItem.props.find(element => element.prop == formOfAdmission.id),
      legalStatusObj = fmItem && fmItem.props.find(element => element.prop == legalStatus.id),
      fundmakerArchiveObj = fmItem && fmItem.props.find(element => element.prop == fundmakerArchive.id);
    return {
      key: item.id,
      numb: idx + 1,
      sourceOrgList: !!item.name ? item.name[this.lng] || '' : '',
      formOfAdmission: formOfAdmissionObj && formOfAdmissionObj.refId ? {value: formOfAdmissionObj.refId, label: formOfAdmissionObj.value} : {},
      orgIndustry: !!orgIndustryObj && orgIndustryObj.values && orgIndustryObj.values[orgIndustryObj.values.length-1] ? orgIndustryObj.values[orgIndustryObj.values.length-1] : {},
      legalStatus: legalStatusObj && legalStatusObj.refId ? {value: legalStatusObj.refId, label: legalStatusObj.value} : {},
      fundmakerArchive: !!fundmakerArchiveObj && fundmakerArchiveObj.cube && fundmakerArchiveObj.cube.idRef ? {value: fundmakerArchiveObj.cube.idRef, label: fundmakerArchiveObj.value} : {},
    }
  };

  render() {
    const { loading, openCard, filter } = this.state;
    const { t, tofiConstants, legalStatusOptions, fundmakerArchiveOptions, orgIndustryOptions, formOfAdmissionOptions } = this.props;
    if(isEmpty(tofiConstants)) return null;

    const {legalStatus, fundmakerArchive, orgIndustry} = tofiConstants;

    this.lng = localStorage.getItem('i18nextLng');

    this.filteredData = this.state.data.map(this.renderTableData).filter(item => {
      return (
        item.sourceOrgList.toLowerCase().includes(filter.sourceOrgList.toLowerCase()) &&
        ( filter.orgIndustry.length === 0  || filter.orgIndustry.some(p => p.value == item.orgIndustry.value) ) &&
        ( filter.legalStatus.length === 0  || filter.legalStatus.some(p => p.value == item.legalStatus.value) ) &&
        ( filter.fundmakerArchive.length === 0  || filter.fundmakerArchive.some(p => p.value == item.fundmakerArchive.value) ) &&
        ( filter.formOfAdmission.length === 0  || filter.formOfAdmission.some(p => p.value == item.formOfAdmission.value) )
      )
    });

    return (
      <div className="LegalEntities">
        <div className="LegalEntities__heading">
          <div className="table-header">
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
              <SelectVirt
                name="orgIndustry"
                multi
                searchable
                optionHeight={40}
                className="long-selected-menu"
                isLoading={filter.orgIndustryLoading}
                onOpen={this.loadOptions(ORG_INDUSTRY)}
                value={filter.orgIndustry}
                onChange={this.onorgIndustryChange}
                options={orgIndustryOptions ? orgIndustryOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={orgIndustry.name[this.lng]}
              />
            </div>
          </div>
        </div>
        <div className="LegalEntities__body">
          <AntTable
            columns={[
              {
                key: 'numb',
                title: '№',
                dataIndex: 'numb',
                width: '5%'
              },
              {
                key: 'sourceOrgList',
                title: t('NAME'),
                dataIndex: 'sourceOrgList',
                width: '35%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="sourceOrgList"
                      suffix={filter.sourceOrgList ? <Icon type="close-circle" data-name="sourceOrgList" onClick={this.emitEmpty} /> : null}
                      ref={ele => this.sourceOrgList = ele}
                      placeholder="Поиск"
                      value={filter.sourceOrgList}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: filter.sourceOrgList ? '#ff9800' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.sourceOrgList.focus());
                },
              },
              {
                key: 'orgIndustry',
                title: orgIndustry.name[this.lng],
                dataIndex: 'orgIndustry',
                width: '20%',
                render: text => text.label
              },
              {
                key: 'nmDocs',
                title: 'Нормативно-методические документы',
                className: 'td-center td-btn-half',
                dataIndex: '',
                width: '8%',
                render: (text, record) => (
                  <Button icon="right-square" className='green-btn' onClick={this.handleClick(record, 'nmDocs')}/>
                )
              },
              {
                key: 'storageConditions',
                title: 'Условия хранения документов',
                className: 'td-center td-btn-half',
                dataIndex: '',
                width: '8%',
                render: (text, record) => (
                  <Button icon="right-square" className='green-btn' onClick={this.handleClick(record, 'storageConditions')}/>
                )
              },
              {
                key: 'docsInfo',
                title: 'Сведения о документах',
                className: 'td-center td-btn-half',
                dataIndex: '',
                width: '8%',
                render: (text, record) => (
                  <Button icon="right-square" className='green-btn' onClick={this.handleClick(record, 'docsInfo')}/>
                )
              },
              {
                key: 'inventories',
                title: 'Описи',
                className: 'td-center td-btn-half',
                dataIndex: '',
                width: '8%',
                render: (text, record) => (
                  <Button icon="right-square" className='green-btn' onClick={this.handleClick(record, 'inventories')}/>
                )
              },
              {
                key: 'nomenclature',
                title: 'Номенклатура дел',
                className: 'td-center td-btn-half',
                dataIndex: '',
                width: '8%',
                render: (text, record) => (
                  <Button icon="right-square" className='green-btn' onClick={this.handleClick(record, 'nomenclature')}/>
                )
              }
            ]}
            loading={loading}
            dataSource={this.filteredData}
            // openedBy="LegalEntities"
            // changeSelectedRow={this.changeSelectedRow}
          />
          <CSSTransition
            in={openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCardLegalEntities closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>} >
              {this.state.siderCardChildren}
            </SiderCardLegalEntities>
          </CSSTransition>
        </div>
      </div>
    )
  }
}

LegalEntities.propTypes = {
  t: PropTypes.func.isRequired,
  orgSourceCube: PropTypes.shape()
};

function mapStateToProps(state) {
  return {
    legalStatusOptions: state.generalData[LEGAL_STATUS],
    fundmakerArchiveOptions: state.generalData[FUND_MAKER_ARCHIVE],
    orgIndustryOptions: state.generalData[ORG_INDUSTRY],
    formOfAdmissionOptions: state.generalData[FORM_OF_ADMISSION],
    cubeSNomen: state.cubes.cubeSNomen,
    CubeForAF_Inv: state.cubes[CUBE_FOR_AF_INV]
  }
}

export default connect(mapStateToProps, {getCube, getPropVal})(LegalEntities);
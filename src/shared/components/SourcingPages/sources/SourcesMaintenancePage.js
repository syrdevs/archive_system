import React from 'react';
import { connect }from 'react-redux'
import PropTypes from 'prop-types';
import {Breadcrumb, DatePicker} from 'antd';

import AntTabs from '../../AntTabs'
import LegalEntities from './LegalEntities';
import Individuals from './Individuals';
import moment from 'moment';
import {Link, Route, Switch} from 'react-router-dom';
import DocsStorageConditions from './DocsStorageConditions';
import {getCube, getObjByObjVal} from '../../../actions/actions';
import {
  CUBE_FOR_FUND_AND_IK, CUBE_FOR_ORG_FUNDMAKER, DO_FOR_FUND_AND_IK, DP_FOR_FUND_AND_IK} from '../../../constants/tofiConstants';
import DocsInfoPage from './DocsInfoPage';
import ProviderInfo from './ProviderInfo';
import Acts from './Acts';
import IndividualInventories from './IndividualInventories';
import LegalEntitiesInventoriesMain from './legalEntitiesInv/LegalEntitiesInventoriesMain';
import LegalEntitiesNomenclatureMain from './LegalEntitiesNomenclatureMain';
import LegalEntitiesNomenclatureMainEdit from './LegalEntitiesNomenclatureMainEdit';
import {isEmpty} from 'lodash';
import LegalEntitiesInventoriesMain_new from './legalEntitiesInv/LegalEntitiesInventoriesMain_new';

class SourcesMaintenancePage extends React.PureComponent {

  state = {
    loading: true
  };

  handleTabChange = () => {
    /*switch (key) {
      case 'legalEntities': {
        // TODO need to download only dimObj no need for props
        this.setState({ loading: true });
        this.loadEntity()
          .then(() => {
            this.setState({ loading: false })
          });
        break;
      }
      case 'individuals': {
        // TODO need to download only dimObj no need for props
        this.setState({ loading: true });
        this.loadInd()
          .then(() => {
            this.setState({ loading: false });
          });
        break;
      }
      default: break;
    }*/
    if(this.props.location.pathname !== '/sourcing/sourcesMaintenance')
      this.props.history.push('/sourcing/sourcesMaintenance');
  };

  /*componentDidUpdate(prevProps) {
    if(this.props.location.pathname === '/sourcing/sourcesMaintenance' && prevProps.location.pathname !== '/sourcing/sourcesMaintenance') {
      switch (true) {
        case prevProps.location.pathname.includes('legalEntities'): {
          // TODO need to download only dimObj no need for props
          this.setState({ loading: true });
          this.loadEntity()
            .then(() => {
              this.setState({ loading: false })
            });
          break;
        }
        case prevProps.location.pathname.includes('individuals'): {
          // TODO need to download only dimObj no need for props
          this.setState({ loading: true });
          this.loadInd()
            .then(() => {
              this.setState({ loading: false });
            });
          break;
        }
        default: break;
      }
    }
  }*/

  onDateChange = date => {
    console.log(date);
  };

  async componentDidMount() {
    if(isEmpty(this.props.tofiConstants) || this.props.orgSourceCube) return;
    if(!this.props.orgCube) {
      await this.props.getCube(CUBE_FOR_ORG_FUNDMAKER);
    }
    this.loadEntity()
      .then(() => {
        this.setState({ loading: false })
      });
  }

  loadEntity = async id => {
    try {
      if (!this.props.IK_FUNDMAKER_ACTIVE) {
        const fd = new FormData();
        fd.append('clsConst', 'sourceOrgList');
        fd.append('propConst', 'fundmakerOfIK');
        fd.append('propConstOfVal', 'isActive');
        fd.append('idRef', this.props.tofiConstants.isActiveTrue.id);
        fd.append('valueType', 'factorVal');
        await this.props.getObjByObjVal(fd, 'IK_FUNDMAKER_ACTIVE')
      }
      const filters = id ? {
        filterDOAnd: [
          {
            dimConst: DO_FOR_FUND_AND_IK,
            concatType: "and",
            conds: [
              {
                ids: id
              }
            ]
          }
        ]
      } : {
        filterDOAnd: [
          {
            dimConst: DO_FOR_FUND_AND_IK,
            concatType: "and",
            conds: [
              {
                // clss: 'sourceOrgList',
                obj: this.props.IK_FUNDMAKER_ACTIVE.map(o => o.id).join(',')
              }
            ]
          }
        ],
        filterDPAnd: [
          {
            dimConst: DP_FOR_FUND_AND_IK,
            concatType: "and",
            conds: [
              {
                consts: "hasArchiveStore,numberOfRooms,roomArea,roomOccupancy,roomHeating,shelving,lockers,hasFireAlarm," +
                "hasSecurityAlarmSystem,hasReadingRoom,hasDevices,numberOfEmployees,archiveInfoDate1,archiveInfoDate2,archiveInfoDate3," +
                "normativeDocType,file1,file2,file3,docFile,nomen,fundmakerOfIK,normMethDocs",
              }
            ]
          }
        ]
      };
      return this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(filters), id ? {
        customKey: 'OrgSourceCubeSingle',
        parent: id
      } : {customKey: 'orgSourceCube'})
    } catch (err) {
      return Promise.reject();
    }
  };

  loadInd = id => {
    const conds = id ? [
      {
        ids: id
      }
    ] : [
      {
        clss: 'sourceLPList'
      }
    ];
    const filters = {
      filterDOAnd: [
        {
          dimConst: DO_FOR_FUND_AND_IK,
          concatType: "and",
          conds
        }
      ]
    };
    return this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(filters), id ? {customKey: 'IndCubeSingle', parent: id} : undefined)
  };

  render() {
    const { t, tofiConstants, orgSourceCubeSingle, indCubeSingle, orgSourceCube, orgCube } = this.props;
    return (
      <div className="SourcesMaintenancePage">
        <div className="title">
          <h2>Источники комплектования</h2>
          <DatePicker onChange={this.onDateChange} defaultValue={moment()}/>
        </div>
        <AntTabs
          defaultActiveKey={this.props.location.pathname.includes('individuals') ? 'individuals' : 'legalEntities'}
          tabs={[
            {
              tabKey: 'legalEntities',
              tabName: t('LEGAL_ENTITIES'),
              tabContent: <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {this.props.location.pathname.split('/').length >= 5 && <Breadcrumb>
                  <Breadcrumb.Item><Link to={{pathname: "/sourcing/sourcesMaintenance", state: { tabKey: 'legalEntities' }}}>{t('SOURCING')}</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><b>{(this.props.location.state && this.props.location.state.record && this.props.location.state.record.sourceOrgList) || ''}</b></Breadcrumb.Item>
                </Breadcrumb> }
                <Switch>
                  <Route exact path="/sourcing/sourcesMaintenance" render={props =>
                    <LegalEntities loading={this.state.loading} t={t} tofiConstants={tofiConstants} {...props} loadEntity={this.loadEntity} orgSourceCube={orgSourceCube} orgCube={orgCube}/>}/>
                  {/*<Route exact path="/sourcing/sourcesMaintenance/legalEntities/:id" render={props => <LegalEntitiesCard t={t} {...props} />} />*/}
                  {/*<Route exact path="/sourcing/sourcesMaintenance/legalEntities/:id/nmDocs" render={props => <NMDocs t={t} {...props} tofiConstants={tofiConstants} />} />*/}
                  <Route exact path="/sourcing/sourcesMaintenance/legalEntities/:id/storageConditions" render={props => <DocsStorageConditions orgSourceCube={orgSourceCubeSingle} tofiConstants={tofiConstants} t={t} {...props}/>} />
                  <Route exact path="/sourcing/sourcesMaintenance/legalEntities/:id/docsInfo" render={props => <DocsInfoPage tofiConstants={tofiConstants} t={t} {...props} orgSourceCubeSingle={orgSourceCubeSingle} />}/>
                  {/*<Route exact path="/sourcing/sourcesMaintenance/legalEntities/:id/inventories" render={props => <LegalEntitiesInventories t={t} tofiConstants={tofiConstants} {...props}/>} />*/}
                  <Route exact path="/sourcing/sourcesMaintenance/legalEntities/:id/inventories" render={props => <LegalEntitiesInventoriesMain_new t={t} tofiConstants={tofiConstants} {...props}/>} />
                  {/*<Route exact path="/sourcing/sourcesMaintenance/legalEntities/:id/nomenclature_old" render={props => <CaseNomenclatureCard t={t} tofiConstants={tofiConstants} {...props}/>} />*/}
                  <Route exact path="/sourcing/sourcesMaintenance/legalEntities/:id/nomenclature" render={props => <LegalEntitiesNomenclatureMain t={t} tofiConstants={tofiConstants} {...props}/>} />
                  <Route exact path="/sourcing/sourcesMaintenance/legalEntities/:id/nomenclature/:key" render={props => <LegalEntitiesNomenclatureMainEdit t={t} tofiConstants={tofiConstants} {...props}/>} />
                </Switch>
              </div>
            },
            {
              tabKey: 'individuals',
              tabName: t('INDIVIDUALS'),
              tabContent: <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Breadcrumb>
                  {this.props.location.pathname.split('/').length >= 5 && <Breadcrumb.Item><Link to={{pathname:"/sourcing/sourcesMaintenance", state: { tabKey: 'individuals' }}}>{t('SOURCING')}</Link></Breadcrumb.Item>}
                </Breadcrumb>
                <Switch>
                  <Route exact path="/sourcing/sourcesMaintenance" render={props => <Individuals loading={this.state.loading} t={t} loadInd={this.loadInd} tofiConstants={tofiConstants} {...props}/>}/>
                  {/*<Route exact path="/sourcing/sourcesMaintenance/individuals/:id" render={props => <IndividualsCard t={t} {...props}/>}/>*/}
                  <Route exact path="/sourcing/sourcesMaintenance/individuals/:id/providerInfo" render={props => <ProviderInfo t={t} {...props} tofiConstants={tofiConstants} indCubeSingle={indCubeSingle}/>}/>
                  <Route exact path="/sourcing/sourcesMaintenance/individuals/:id/acts" render={props => <Acts t={t} {...props} tofiConstants={tofiConstants} indCubeSingle={indCubeSingle}/>}/>
                  <Route exact path="/sourcing/sourcesMaintenance/individuals/:id/inventories" render={props => <IndividualInventories t={t} {...props} tofiConstants={tofiConstants} indCubeSingle={indCubeSingle}/>}/>
                </Switch>
              </div>
            }
          ]}
          type="card"
          onChange={this.handleTabChange}
        />
      </div>
    )
  }
}

SourcesMaintenancePage.propTypes = {
  t: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape()
};

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants,
    orgCube: state.cubes[CUBE_FOR_ORG_FUNDMAKER],
    orgSourceCube: state.cubes.orgSourceCube,
    orgSourceCubeSingle: state.cubes['OrgSourceCubeSingle'],
    indCubeSingle: state.cubes['IndCubeSingle'],
    IK_FUNDMAKER_ACTIVE: state.generalData.IK_FUNDMAKER_ACTIVE
  }
}

export default connect(mapStateToProps, {getCube, getObjByObjVal})(SourcesMaintenancePage);
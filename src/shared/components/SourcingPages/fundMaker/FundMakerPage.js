import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AntTabs from '../../AntTabs';
import FundMaker from './FundMaker';
import FMIndividuals from './FMIndividuals';
import {getCube, updateCubeData} from '../../../actions/actions';
import {CUBE_FOR_LP_FUNDMAKER, CUBE_FOR_ORG_FUNDMAKER} from '../../../constants/tofiConstants';
import {DatePicker} from 'antd';
import moment from 'moment';

class FundMakerPage extends React.PureComponent {

  state = {
    globalDate: moment()
  };

  //TODO don't forget to remove all console.logs
  handleTabChange = key => {
    switch (key) {
      /*case 'organizations':
        this.props.getCube(CUBE_FOR_ORG_FUNDMAKER);
        break;*/
      case 'individuals':
        if(!this.props.LPCube) {
          this.props.getCube(CUBE_FOR_LP_FUNDMAKER);
        }
        break;
      default: break;
    }
  };

  componentDidMount() {
    if(!this.props.orgCube) {
      this.props.getCube(CUBE_FOR_ORG_FUNDMAKER)
    }
  }

  onDateChange = date => {this.setState({globalDate: date})};

  render() {
    const { globalDate } = this.state;
    const { t, orgCube, tofiConstants, LPCube, getCube } = this.props;
    return (
      <div className="FundMakerPage">
        <div className="title">
          <h2>Фондообразователи</h2>
          <DatePicker onChange={this.onDateChange} value={globalDate}/>
        </div>
        <AntTabs type="card" onChange={this.handleTabChange} tabs={[
          {
            tabKey: 'organizations',
            tabName: t('ORGANIZATIONS'),
            tabContent: <FundMaker t={t} orgCube={orgCube} tofiConstants={tofiConstants} globalDate={globalDate}/>
          },
          {
            tabKey: 'individuals',
            tabName: t('INDIVIDUALS'),
            tabContent: <FMIndividuals t={t} LPCube={LPCube} tofiConstants={tofiConstants} globalDate={globalDate} getCube={getCube}/>
          }
        ]}/>
      </div>
    )
  }
}

FundMakerPage.propTypes = {
  t: PropTypes.func.isRequired,
  orgCube: PropTypes.shape(),
  LPCube: PropTypes.shape(),
  tofiConstants: PropTypes.shape().isRequired
};

function mapStateToProps(state) {
  return {
    orgCube: state.cubes[CUBE_FOR_ORG_FUNDMAKER],
    LPCube: state.cubes[CUBE_FOR_LP_FUNDMAKER],
    tofiConstants: state.generalData.tofiConstants || {}
  }
}

export default connect(mapStateToProps, { getCube })(FundMakerPage);
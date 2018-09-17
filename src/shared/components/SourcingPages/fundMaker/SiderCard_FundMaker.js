import React from 'react';
import AntTabs from '../../AntTabs';
import MainInfoFundMaker from './MainInfoFundMaker';
import ManagingFormFundMaker from './ManagingFormFundMaker';
import FundMakerContent from './FundMakerContent';
import {getObjVer_new} from '../../../actions/actions';

class SiderCard_FundMaker extends React.PureComponent {

  state = {
    fundMakerVer: null
  };

  handleTabChange = key => {
    switch (key) {
      case 'versions':
        if(this.props.initialValues.key)
          getObjVer_new(this.props.initialValues.key.split('_')[1])
            .then(res => {
              if(res.success) {
                this.setState({ fundMakerVer: res.data })
              }
            });
        break;
      default: break;
    }
  };
  componentDidUpdate(prevProps) {
    if (this.props.initialValues.key && this.props.initialValues.key !== prevProps.initialValues.key) {
      getObjVer_new(this.props.initialValues.key.split('_')[1])
        .then(res => {
          if(res.success) {
            this.setState({ fundMakerVer: res.data })
          }
        });
    }
  }

  render() {
    const { t, tofiConstants, initialValues, optionsData, onSaveCubeData, onCreateObj } = this.props;

    return (
      <div className="card">
        {this.props.closer}
        <AntTabs
          tabs={[
            {
              tabKey: 'props',
              tabName: t('MAIN_INFO'),
              tabContent: <MainInfoFundMaker tofiConstants={tofiConstants} t={t} onSaveCubeData={onSaveCubeData} onCreateObj={onCreateObj} initialValues={{...initialValues }} optionsData={optionsData}/>
            },
            {
              tabKey: 'Description',
              tabName: t('MANAGING'),
              tabContent: <ManagingFormFundMaker tofiConstants={tofiConstants} onSaveCubeData={onSaveCubeData} onCreateObj={onCreateObj} t={t} initialValues={{...initialValues }}/>
            },
            {
              tabKey: 'versions',
              disabled: !initialValues.key,
              tabName: t('VERSIONS'),
              tabContent: <FundMakerContent tofiConstants={tofiConstants} t={t} id={initialValues.key} fundMakerVer={this.state.fundMakerVer}/>
            }
          ]}
          onChange={this.handleTabChange}
        />
      </div>
    )
  }
}

export default SiderCard_FundMaker;

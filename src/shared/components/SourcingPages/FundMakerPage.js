import React from 'react';
import AntTabs from '../AntTabs';
import FundMaker from './FundMaker';
import FMIndividuals from './FMIndividuals';

class FundMakerPage extends React.PureComponent {

  //todo don't forget to remove all console.logs
  handleTabChange = key => {
    console.log(key)
  };

  render() {
    const { t } = this.props;
    return (
      <AntTabs type="card" onChange={this.handleTabChange} tabs={[
        {
          tabKey: 'organizations',
          tabName: t('ORGANIZATIONS'),
          tabContent: <FundMaker t={t}/>
        },
        {
          tabKey: 'individuals',
          tabName: t('INDIVIDUALS'),
          tabContent: <FMIndividuals t={t}/>
        }
      ]}/>
    )
  }

}

export default FundMakerPage;
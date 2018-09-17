import React from 'react';
import { connect } from 'react-redux';

import Tabs from '../components/Tabs';
import ConfirmedCases from '../components/ProfileTabPages/ConfirmedCases';
import CaseExtraditionRequest from '../components/ProfileTabPages/CaseExtraditionRequest';
import ReferenceExtraditionRequest from '../components/ProfileTabPages/ReferenceExtraditionRequest';
import PersonalInfo from '../components/ProfileTabPages/PersonalInfo';

class ProfileScreen extends React.Component {

  constructor(props) {
    super (props);

    this.state = {
      tabs: [
        {
          name: 'Подтвержденные дела'
        },
        {
          name: 'Требования на выдачу дел'
        },
        {
          name: 'Требования на выдачу справки'
        },
        {
          name: 'Личные данные'
        }
      ],
      activeTab: 0

    }
  }

  handleTapClick = (event) => {
    this.setState({
      activeTab: event.target.dataset.index
    });
  };

  render() {
    const { tabs, activeTab } = this.state;

    let Content = null;
    switch (Number(activeTab)) {
      case 0: Content = <ConfirmedCases />; break;
      case 1: Content = <CaseExtraditionRequest />; break;
      case 2: Content =  <ReferenceExtraditionRequest />; break;
      case 3: Content =  <PersonalInfo />; break;
      default: Content =  null; break;
    }

    return (
      <div className="profileScreen">
        <div className="profileScreen__content">
          <Tabs tabs={tabs} activeTab={activeTab} handleTapClick={this.handleTapClick}/>
          { Content }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {})(ProfileScreen);

import React, { Component } from 'react';
import { translate } from 'react-i18next';

import Sider2 from '../components/Sider2';
import FAQPage from '../components/HelpScreenPages/FAQPage';
import Instructions from '../components/HelpScreenPages/Instructions';
import Header from '../components/Header';

class CollectionsLayout extends Component {
  constructor(props) {
    super(props);
    const { t } = this.props;

    this.state = {
      collections: [
        {
          name: t('FAQ'),
          link: 'FAQPage'
        },
        {
          name: t('INSTRUCTIONS'),
          link: 'Instructions'
        }
      ],

      siderIsOpen: true,

      questions: [
        {
          title: t('HOWTOSIGNUP'),
          body: 'A paragraph of text A second row of text'
        },
        {
          title: t('HOWTOORDERCASES'),
          body: 'A paragraph of text A second row of text'
        },
        {
          title: t('HOWTOVIEWORDERS'),
          body: 'A paragraph of text A second row of text'
        }
      ]
    }

  }

  siderToggle = () => {
    this.setState({
      siderIsOpen: !this.state.siderIsOpen
    });
  };

  renderCollections = () => {
    return this.state.collections.map( (item, idx) => {
      return (
        <li key={idx}>
          <span onClick={() => document.getElementsByClassName(`${item.link}`)[0].scrollIntoView({behavior: 'smooth'})} className="sider-nav">{ item.name }</span>
        </li>);
    });
  };


  render() {

    const { siderIsOpen } = this.state;
    const { t } = this.props;

    return (
      <div className="main-layout">
        <Header />
        <div className="collections content">
          <Sider2 siderIsOpen={siderIsOpen} siderToggle={this.siderToggle}>
            <h3 className="SiderMenu__header">
              Помощь
            </h3>
            <ul className="SiderMenu__collectionsList">
              {this.renderCollections()}
            </ul>
          </Sider2>
          <div className={`collections__content ${ siderIsOpen ? 'collections__content-pushed' : '' }`}>
            <FAQPage
              questions={this.state.questions}
              translations={
                {
                  FAQ: t('FAQ')
                }
              }
            />
            <Instructions
            />
          </div>
        </div>
      </div>
    );
  }
}

export default translate('helpScreen')(CollectionsLayout);

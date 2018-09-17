import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';

const TabPane = Tabs.TabPane;

const renderTabs = item => {
  return <TabPane tab={item.tabName} key={item.tabKey} disabled={item.disabled}>{item.tabContent}</TabPane>
};

const AntTabs = props => {
  return (
    <Tabs
      {...props}
      type={props.type}
      onChange={props.onChange}
      tabBarExtraContent={props.tabBarExtraContent ? props.tabBarExtraContent : undefined}
      onTabClick={ props.onTabClick ? props.onTabClick : undefined }
    >
      {props.tabs.map(renderTabs)}
    </Tabs>
  )
};

AntTabs.propTypes = {
  type: PropTypes.string,
  onTabClick: PropTypes.func,
  onChange: PropTypes.func,
  tabs: PropTypes.array.isRequired
};

export default AntTabs;

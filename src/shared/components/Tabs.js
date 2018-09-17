import React from 'react';

const Tabs = (props) => {
  const { tabs, activeTab } = props;

  const _renderTab = (item, idx) => {
    if(idx === Number(activeTab)) {
      return <li key={idx}> <button className="tabBtn tabBtn-active" onClick={props.handleTapClick} data-index={idx}>{item.name}</button> </li>
    }
    return (
      <li key={idx}> <button className="tabBtn" onClick={props.handleTapClick} data-index={idx}>{item.name}</button> </li>
    )
  };

  return (
    <ul className="Tabs clearfix">
      {tabs.map(_renderTab)}
    </ul>
  );


};

Tabs.defaultProps = {
  activeTab: 0
};

export default Tabs;

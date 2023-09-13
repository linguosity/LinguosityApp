import React, { useState } from "react";
import classNames from "classnames";
import Tab from "./Tab";

const tabs = [
  { label: "Prep", value: "pre_reading" },
  { label: "Read", value: "story_text" },
  { label: "Recap", value: "post_reading" },
]

const Tabs = ({ 
  activeTab, 
  setActiveTab, 
  story_text, 
  pre_reading, 
  post_reading
}) => {

  const handleTabClick = tab => {
    setActiveTab(tab);
  };

  return (
    <div className="wrap">
      <ul className="tabs group">
        {tabs.map((tab, i) => (
          <li key={i}>
            <a onClick={() => handleTabClick(tab.value)} className={classNames({ active: activeTab === tab.value })}>
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
      <div id="content">
        <Tab
          activeTab={activeTab}
          story_text={story_text}
          pre_reading={pre_reading}
          post_reading={post_reading}
        />
      </div>
    </div>
  );
};

export default Tabs;

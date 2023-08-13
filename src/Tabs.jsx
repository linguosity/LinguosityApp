import React, { useState } from "react";
import classNames from "classnames";

const TabContent = ({ id, activeTab, children }) => {
    return activeTab === id ? <div>{children}</div> : null;
}

const Tabs = ({story, preReading, postReading}) => {
    const [activeTab, setActiveTab] = useState('two');

    const handleTabClick = tab => {
        setActiveTab(tab);
    };

    return (
        <div className="wrap">
            <ul className="tabs group">
                <li><a onClick={() => handleTabClick('one')} className={classNames({ active: activeTab === 'one' })}>Prep</a></li>
                <li><a onClick={() => handleTabClick('two')} className={classNames({ active: activeTab === 'two' })}>Read</a></li>
                <li><a onClick={() => handleTabClick('three')} className={classNames({ active: activeTab === 'three' })}>Recap</a></li>
            </ul>
      
            <div id="content">
                <TabContent id='one' activeTab={activeTab}>
                    {preReading && <div>{preReading}</div>}
                </TabContent>
                <TabContent id='two' activeTab={activeTab}>
                    {story && <div>{story}</div>}
                </TabContent>
                <TabContent id='three' activeTab={activeTab}>
                    {postReading && <div>{postReading}</div>}
                </TabContent>
            </div>
        </div>
    );
};

export default Tabs;

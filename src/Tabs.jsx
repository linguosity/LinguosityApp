import React, { useState } from "react";
import classNames from "classnames";
import { TextToVoice } from "./texttoVoice";

const TabContent = ({ id, activeTab, children }) => {
    return activeTab === id ? <div>{children}</div> : null;
}

const Tabs = ({story_text, pre_reading, post_reading, voice, playAudio}) => {
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
        <TextToVoice activeTab={activeTab} story_text={story_text} pre_reading={pre_reading} post_reading={post_reading} voice={voice} playAudio={playAudio} />
      </div>
        </div>
    );
};

export default Tabs;

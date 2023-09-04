import React from 'react';
import PreReading from './PreReading';
import Story from './Story';
import PostReading from './PostReading';

export default function Tab({
  activeTab,
  story_text,
  pre_reading,
  post_reading
}) {
  return (
    <div className="tab">
      {activeTab === "one" && <PreReading preReading={pre_reading} />}
      {activeTab === "two" && <Story story={story_text} />}
      {activeTab === "three" && <PostReading postReading={post_reading} />}
    </div>

  )
}

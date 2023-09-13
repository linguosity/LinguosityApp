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
      {activeTab === "pre_reading" && <PreReading preReading={pre_reading} />}
      {activeTab === "story_text" && <Story story={story_text} />}
      {activeTab === "post_reading" && <PostReading postReading={post_reading} />}
    </div>

  )
}

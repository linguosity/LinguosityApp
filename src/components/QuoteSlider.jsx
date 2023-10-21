import { useState, useEffect } from 'react';
import QuotationSVG from '../assets/quotations.svg';

// Inside your component render:
<img src={QuotationSVG} width="58" alt="" className="quote-icon" />


const QuoteSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0); // Current active slide index
  const slideData = [
    {
      text: `
            Before discovering Linguosity, I spent countless hours crafting individualized lesson plans for my speech therapy clients. 
            Now, with this application, I can create highly personalized materials in a fraction of the time.  
            `,
      author: 'Alan Vu, MA, CCC-SLP'
    },
    {
      text: `
            Not only has Linguosity saved me valuable hours, but my clients have seen incredible progress. 
            Their tailored learning experiences keep them motivated and engaged. I couldn't be more impressed 
            with Linguosity's cutting-edge technology and the impact it's had on my clients' success.
            `,
      author: 'Jessica Smith, MS, CCC-SLP'
    },
    // Add more slides here
  ];

  // Auto slide after 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slideData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slideData.length]);

  // Function to manually change slide when arrows are clicked
  const changeSlide = (direction) => {
    const length = slideData.length;
    setCurrentSlide(
      direction === 'left'
        ? (currentSlide - 1 + length) % length
        : (currentSlide + 1) % length
    );
  };

  return (
    <div className="quote-slider">
      {/* Active Slide */}
      <div className="quote-wrap">
      <img src={QuotationSVG} width="58" alt="" className="quote-icon" />
        <h3>{slideData[currentSlide].text}</h3>
        <div className="quote-attribution">
          <p>{slideData[currentSlide].author}</p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="slider-nav">
        <button onClick={() => changeSlide('left')}> {`<`} </button>
        <button onClick={() => changeSlide('right')}> {`>`} </button>
      </div>
    </div>
  );
};

export default QuoteSlider;

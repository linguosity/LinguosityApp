import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

const LottieAnimation = ({ path }) => {
  const containerRef = useRef();

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: path
    });
    return () => {
      anim.destroy(); // Cleanup the animation instance on component unmount
    };
  }, [path]);

  return <div ref={containerRef}></div>;
};

export default LottieAnimation;

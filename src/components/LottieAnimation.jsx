import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

const LottieAnimation = ({ path, loop = true, autoplay = true }) => {
  const containerRef = useRef();

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: loop,
      autoplay: autoplay,
      path: path
    });
    return () => {
      anim.destroy(); // Cleanup the animation instance on component unmount
    };
  }, [path, loop, autoplay]);

  return <div ref={containerRef}></div>;
};

export default LottieAnimation;

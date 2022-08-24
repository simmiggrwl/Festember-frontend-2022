import React from 'react';
import Lottie from 'react-lottie';
import bgAnimationData from '../../assets/lotties/bg.json';

const BackgroundAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: bgAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        position: 'absolute'
      }}
    >
      <Lottie options={defaultOptions} isClickToPauseDisabled />
    </div>
  );
};
export default BackgroundAnimation;

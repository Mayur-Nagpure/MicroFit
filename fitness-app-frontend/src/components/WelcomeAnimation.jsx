import React from 'react';

const WelcomeAnimation = () => (
  <div
    style={{
      width: '100%',
      maxWidth: 420,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.15)', // lighter, more see-through
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.19)',
      padding: 18,
    }}
  >
    <video
      src="/animations/OlympicAthlete.mp4"
      autoPlay
      loop
      muted
      playsInline
      style={{ width: '100%', borderRadius: 16, background: 'transparent' }}
    />
  </div>
);

export default WelcomeAnimation;

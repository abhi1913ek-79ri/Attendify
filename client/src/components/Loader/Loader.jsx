import React from 'react';

const Loader = () => {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.dot, animationDelay: '0s' }} />
      <div style={{ ...styles.dot, animationDelay: '0.1s' }} />
      <div style={{ ...styles.dot, animationDelay: '0.4s' }} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '7px'
  },
  dot: {
    width: '12px',
    height: '12px',
    backgroundColor: 'white', // Tailwind sky-400
    borderRadius: '9999px',
    animation: 'bounce 0.8s infinite',
  },
};

// Inject keyframes dynamically
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
`, styleSheet.cssRules.length);

export default Loader;

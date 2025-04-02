// Wind blowing effect for text
document.addEventListener('DOMContentLoaded', () => {
  // Find the target text span element
  const targetElement = document.querySelector('h1 span:nth-of-type(2)');
  
  if (!targetElement) return;
  
  // Add the wind-text class
  targetElement.classList.add('wind-text');
  
  // Create lines for the wind effect
  const lineCount = 15; // Increased number of wind lines
  
  // Create a container for the lines
  const lineContainer = document.createElement('div');
  lineContainer.classList.add('wind-lines-container');
  lineContainer.style.position = 'absolute';
  lineContainer.style.top = '0';
  lineContainer.style.left = '0';
  lineContainer.style.width = '100%';
  lineContainer.style.height = '100%';
  lineContainer.style.pointerEvents = 'none';
  lineContainer.style.overflow = 'visible'; // Allow lines to flow outside
  
  // Generate wind lines
  for (let i = 0; i < lineCount; i++) {
    createWindLine(lineContainer, i, lineCount);
  }
  
  targetElement.appendChild(lineContainer);
  
  // Remove mouseenter event and replace with continuous animation
  
  // Create a continuous animation function
  function startContinuousWindAnimation() {
    // Initial animation
    animateWindLines(lineContainer.querySelectorAll('.wind-line'), 0.7);
    
    // Continuous animation with varying intensity
    setInterval(() => {
      const intensity = 0.5 + Math.random() * 0.5; // Random intensity between 0.5-1.0
      animateWindLines(lineContainer.querySelectorAll('.wind-line'), intensity);
    }, 3000); // Play animation every 3 seconds
  }
  
  // Start continuous animation
  startContinuousWindAnimation();
  
  // Add subtle wave animation to the text
  targetElement.style.animation = 'windWave 5s ease-in-out infinite';
});

// Function to create a single wind line
function createWindLine(container, index, total) {
  const line = document.createElement('div');
  line.classList.add('wind-line');
  
  // Set line properties
  const yPercent = 10 + (index * 80 / total); // Distribute lines vertically
  const width = 20 + Math.random() * 60; // Random width between 20-80px
  
  line.style.top = `${yPercent}%`;
  line.style.width = `${width}px`;
  line.style.left = `${Math.random() * 30}%`; // Random starting position
  line.style.opacity = '0';
  
  container.appendChild(line);
}

// Function to animate all wind lines
function animateWindLines(lines, intensityFactor = 1) {
  lines.forEach((line, index) => {
    // Reset animation
    line.style.animation = 'none';
    
    // Force reflow
    void line.offsetWidth;
    
    // Set animation with random duration
    const duration = (0.8 + Math.random() * 1.2) * intensityFactor;
    const delay = Math.random() * 0.4;
    
    // Animate most lines for continuous effect
    if (Math.random() > 0.1) { // Increased probability (90% chance to animate)
      line.style.animation = `windFlow ${duration}s ease-out ${delay}s`;
      
      // Remove animation after it completes
      setTimeout(() => {
        line.style.animation = 'none';
      }, (duration + delay) * 1000);
    }
  });
} 
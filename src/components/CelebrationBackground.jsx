import { useEffect } from 'react'

function CelebrationBackground({ score, total }) {
  useEffect(() => {
    const percentage = (score / total) * 100
    
    if (percentage >= 70) {
      // Create stars for good scores
      const starsContainer = document.createElement('div')
      starsContainer.className = 'stars-container'
      document.body.appendChild(starsContainer)
      
      // Create multiple stars
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div')
        star.className = 'star'
        star.style.left = Math.random() * 100 + '%'
        star.style.top = Math.random() * 100 + '%'
        star.style.animationDelay = Math.random() * 3 + 's'
        star.style.animationDuration = (Math.random() * 2 + 2) + 's'
        starsContainer.appendChild(star)
      }
      
      // Cleanup
      return () => {
        document.body.removeChild(starsContainer)
      }
    }
  }, [score, total])
  
  return null
}

export default CelebrationBackground

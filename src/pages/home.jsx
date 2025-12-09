import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import '../App.css'
import './Home.css'
import NavigationMenu from './widget/navigationMenu'
import CustomMenu from './widget/customMenu'
import Footer from './widget/footer'

function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleTocClick = (e) => {
      const link = e.target.closest('.toc-link')
      if (!link) return
      
      e.preventDefault()
      const targetId = link.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        // Smooth scroll
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Add pulse effect
        targetElement.classList.add('pulse-effect')
        setTimeout(() => {
          targetElement.classList.remove('pulse-effect')
        }, 1500)
      }
    }

    const tocNav = document.querySelector('.toc-nav')
    if (tocNav) {
      tocNav.addEventListener('click', handleTocClick)
    }

    return () => {
      if (tocNav) {
        tocNav.removeEventListener('click', handleTocClick)
      }
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationMenu />
      <CustomMenu />
      <aside className="table-of-contents">
        <h3>List</h3>
        <nav className="toc-nav">
          <a href="#module1a" className="toc-link">Module 1A</a>
          <a href="#module1b" className="toc-link">Module 1B</a>
          <a href="#module2a" className="toc-link">Module 2A</a>
          <a href="#module2b" className="toc-link">Module 2B</a>
          <a href="#module2c" className="toc-link">Module 2C</a>
          <a href="#module3a" className="toc-link">Module 3A</a>
          <a href="#module3b" className="toc-link">Module 3B</a>
          <a href="#module3c" className="toc-link">Module 3C</a>
          <a href="#module4a" className="toc-link">Module 4A</a>
          <a href="#module4b" className="toc-link">Module 4B</a>
          <a href="#module5a" className="toc-link">Module 5A</a>
          <a href="#module5b" className="toc-link">Module 5B</a>
        </nav>
      </aside>
      <div className="home-content">
        <h1 className="home-title">Teamwork & Group Dynamics</h1>
        <p>Master the fundamentals of effective teamwork</p>
        <div className="chapter-list">
          <div className="chapter-divider">
            <span>Module 1: Group Psychology</span>
          </div>
          <div className="chapters-grid">
            <Link to="/module1a" className="chapter-button starred" id="module1a">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 1A</h3>
              <p>Gruppepsykologi og gruppedannelse</p>
              <span className="question-count">39 questions</span>
            </Link>
            <Link to="/module1b" className="chapter-button starred" id="module1b">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 1B</h3>
              <p>Prosjektarbeid og Teamutvikling</p>
              <span className="question-count">16 questions</span>
            </Link>
          </div>
        </div>

        <div className="chapter-list">
          <div className="chapter-divider">
            <span>Module 2: Team Development</span>
          </div>
          <div className="chapters-grid">
            <Link to="/module2a" className="chapter-button starred" id="module2a">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 2A</h3>
              <p>Kommunikasjon i grupper</p>
              <span className="question-count">24 questions</span>
            </Link>
            <Link to="/module2b" className="chapter-button starred" id="module2b">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 2B</h3>
              <p>Relasjonsbygging og teambygging i prosjekter</p>
              <span className="question-count">24 questions</span>
            </Link>
            <Link to="/module2c" className="chapter-button starred" id="module2c">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 2C</h3>
              <p>Utvikling av prosjektkultur og tillit</p>
              <span className="question-count">21 questions</span>
            </Link>
          </div>
        </div>

        <div className="chapter-list">
          <div className="chapter-divider">
            <span>Module 3: Project Closure & Benefit Realization</span>
          </div>
          <div className="chapters-grid">
            <Link to="/module3a" className="chapter-button starred" id="module3a">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 3A</h3>
              <p>Arbeid i profesjonelle team og aksjonslæring</p>
              <span className="question-count">22 questions</span>
            </Link>
            <Link to="/module3b" className="chapter-button starred" id="module3b">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 3B</h3>
              <p>Læring og kunnskapsdeling i prosjekter</p>
              <span className="question-count">21 questions</span>
            </Link>
            <Link to="/module3c" className="chapter-button starred" id="module3c">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 3C</h3>
              <p>Prosjektavslutning og gevinstrealisering</p>
              <span className="question-count">20 questions</span>
            </Link>
          </div>
        </div>

        <div className="chapter-list">
          <div className="chapter-divider">
            <span>Module 4: Dynamic Project Management</span>
          </div>
          <div className="chapters-grid">
            <Link to="/module4a" className="chapter-button starred" id="module4a">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 4A</h3>
              <p>Dynamisk prosjektledelse</p>
              <span className="question-count">19 questions</span>
            </Link>
            <Link to="/module4b" className="chapter-button starred" id="module4b">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 4B</h3>
              <p>Styring, kontroll og fremdrift i prosjekter</p>
              <span className="question-count">20 questions</span>
            </Link>
          </div>
        </div>

        <div className="chapter-list">
          <div className="chapter-divider">
            <span>Module 5: Conflict Management</span>
          </div>
          <div className="chapters-grid">
            <Link to="/module5a" className="chapter-button starred" id="module5a">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 5A</h3>
              <p>Konflikter i prosjekter</p>
              <span className="question-count">25 questions</span>
            </Link>
            <Link to="/module5b" className="chapter-button starred" id="module5b">
              <div className="star-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffd700">
                  <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
                </svg>
              </div>
              <h3>Module 5B</h3>
              <p>Psykologiske aspekter ved konflikter</p>
              <span className="question-count">25 questions</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
          ↑
        </button>
      )}
    </motion.div>
  )
}

export default Home

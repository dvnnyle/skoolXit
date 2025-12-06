import { useState } from 'react'
import './toastModal.css'
import logo from '../../assets/day17logo.png'

function ToastModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 className="modal-title">About This Quiz App</h2>
        <div className="toast-modal-divider"></div>
        <div className="modal-body">
          <p>Welcome to the <strong>UX Interaction Design Quiz App</strong>!</p>
          
          <h3>Purpose</h3>
          <p>This application is designed to help students practice and master concepts from the UX Interaction Design course through interactive quizzes.</p>
          
          <h3>Curriculum</h3>
          <p>Based on <strong>"Designing User Experience: A guide to HCI, UX and interaction design"</strong> for the class <strong>IS104 - Interaction Design</strong>.</p>
          
          <h3>Features</h3>
          <ul>
            <li><strong>5 Chapters</strong> covering key topics in UX design</li>
            <li><strong>148 questions</strong> total across all chapters</li>
            <li>Detailed explanations for each answer</li>
            <li>Practical examples to reinforce learning</li>
            <li>Progress tracking and instant feedback</li>
          </ul>
          
          <h3>How to Use</h3>
          <p>Select any chapter from the home page to begin. Answer questions one by one, review explanations, and track your progress. You can retake quizzes anytime to improve your understanding.</p>
          
          <h3>Topics Covered</h3>
          <ul>
            <li><strong>Chapter 3: </strong>The process of human-centred UX design</li>
            <li><strong>Chapter 5: </strong>Designing for people</li>
            <li><strong>Chapter 6: </strong>Designing for experience</li>
            <li><strong>Chapter 8: </strong>Envisionment</li>
            <li><strong>Chapter 10: </strong>Evaluation</li>
          </ul>
        </div>
        <div className="toast-modal-divider"></div>
        <div className="modal-footer">
          <img src={logo} alt="Day17 Logo" className="modal-logo" />
          <p className="modal-creator">Created by Danny Nguyen Le</p>
        </div>
      </div>
    </div>
  )
}

export default ToastModal

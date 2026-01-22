import { useState, useEffect, useRef } from 'react';
import DemoTest from './imports/DemoTest';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [inputPosition, setInputPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const totalSlides = 3; // Adjust based on number of testimonials

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleTryFree = () => {
    alert('Try free for 7 days clicked! This would typically redirect to a signup page.');
  };

  const handleAppleLogin = () => {
    alert('Sign in with Apple clicked! This would typically initiate Apple authentication.');
  };

  const handleGoogleLogin = () => {
    alert('Sign in with Google clicked! This would typically initiate Google authentication.');
  };

  const handleSubscribe = () => {
    if (email && email.includes('@')) {
      alert(`Thanks for subscribing with: ${email}`);
      setEmail('');
      setShowEmailInput(false);
    } else {
      alert('Please enter a valid email address');
    }
  };

  // Add click handlers to the page
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest('[data-name="Button"]');
    const arrowButton = target.closest('[data-name*="Previous slide"]');
    const appleLink = target.closest('[data-name="Link"]');
    const inputField = target.closest('[data-name="Input"]') as HTMLElement;
    const subscribeButton = target.closest('[data-name="Button - Subscribe for newsletters"]');
    
    // Check for subscribe button
    if (subscribeButton) {
      e.preventDefault();
      handleSubscribe();
      return;
    }

    // Check for input field
    if (inputField && !showEmailInput) {
      e.preventDefault();
      const rect = inputField.getBoundingClientRect();
      setInputPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
      setShowEmailInput(true);
      // Focus the input after a brief delay to allow rendering
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return;
    }

    // Check for main CTA button
    if (button) {
      const text = button.textContent;
      if (text?.includes('Try free')) {
        e.preventDefault();
        handleTryFree();
        return;
      }
    }

    // Check for Apple login
    if (appleLink && target.closest('svg')) {
      const pathElement = target.closest('[data-name="apple.svg"]');
      if (pathElement) {
        e.preventDefault();
        handleAppleLogin();
        return;
      }
    }

    // Check for Google login
    if (appleLink && target.closest('svg')) {
      const pathElement = target.closest('[data-name="google.svg"]');
      if (pathElement) {
        e.preventDefault();
        handleGoogleLogin();
        return;
      }
    }

    // Check for carousel arrows
    if (arrowButton) {
      e.preventDefault();
      const carouselArrows = target.closest('[data-name="div.carousel__arrows"]');
      if (carouselArrows) {
        // Check if it's a previous or next button based on rotation
        const rotatedParent = target.closest('.rotate-\\[180deg\\]');
        if (rotatedParent) {
          handlePrevSlide();
        } else {
          handleNextSlide();
        }
      }
    }
  };

  // Close input when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showEmailInput && !target.closest('#email-input-wrapper') && !target.closest('[data-name="Input"]')) {
        setShowEmailInput(false);
      }
    };

    if (showEmailInput) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [showEmailInput]);

  return (
    <div onClick={handleClick} style={{ cursor: 'default' }}>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }
        #root {
          width: 100%;
          overflow-x: hidden;
        }
        [data-name="Button"],
        [data-name*="Previous slide"],
        [data-name="Link"],
        [data-name="Input"],
        [data-name="Button - Subscribe for newsletters"] {
          cursor: pointer !important;
          transition: opacity 0.2s ease, transform 0.1s ease;
        }
        [data-name="Button"]:hover,
        [data-name*="Previous slide"]:hover,
        [data-name="Link"]:hover,
        [data-name="Input"]:hover,
        [data-name="Button - Subscribe for newsletters"]:hover {
          opacity: 0.8 !important;
        }
        [data-name="Button"]:active,
        [data-name="Button - Subscribe for newsletters"]:active {
          transform: scale(0.98);
        }
        [data-name*="Previous slide"]:active {
          transform: scale(0.9);
        }
      `}</style>
      
      {/* Email input overlay - positioned exactly over the design input */}
      {showEmailInput && (
        <div
          id="email-input-wrapper"
          style={{
            position: 'fixed',
            top: inputPosition.top,
            left: inputPosition.left,
            width: inputPosition.width,
            height: inputPosition.height,
            zIndex: 1000,
            pointerEvents: 'auto'
          }}
        >
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubscribe();
              } else if (e.key === 'Escape') {
                setShowEmailInput(false);
              }
            }}
            placeholder="Enter your email"
            style={{
              width: '100%',
              height: '100%',
              background: '#404547',
              color: 'white',
              border: 'none',
              outline: 'none',
              padding: '14px 12px',
              borderRadius: '6px 0 0 6px',
              fontSize: '16px',
              fontFamily: "'Avenir Next', sans-serif"
            }}
          />
        </div>
      )}
      
      <DemoTest />
    </div>
  );
}
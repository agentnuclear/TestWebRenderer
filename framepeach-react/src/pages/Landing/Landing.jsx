import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  const navigate=useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleElements(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleButtonClick = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 600);

    navigate('/register'); // Redirect to register page on button click
  };

  const styles = {
    // Fixed container styles - removed problematic background
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      color: 'white',
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      width: '100%',
    },
    
    // Background wrapper to handle the gradient properly
    backgroundWrapper: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      zIndex: -1,
    },
    
    // Content wrapper to ensure proper scrolling
    contentWrapper: {
      position: 'relative',
      zIndex: 1,
      minHeight: '100vh',
    },
    
    nav: {
      position: 'fixed',
      top: 0,
      width: '100%',
      background: isScrolled ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      padding: '15px 0',
      transition: 'all 0.3s ease',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    
    navContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#ffffff',
    },
    
    navLinks: {
      display: 'flex',
      listStyle: 'none',
      gap: '30px',
      margin: 0,
      padding: 0,
    },
    
    navLink: {
      color: 'white',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
    },
    
    ctaButton: {
      background: 'linear-gradient(45deg, #333333, #555555)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '12px 24px',
      borderRadius: '25px',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    
    hero: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '100px 0 50px',
    },
    
    heroContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '60px',
      flexWrap: 'wrap',
    },
    
    heroContent: {
      flex: 1,
      zIndex: 2,
      minWidth: '300px',
    },
    
    heroTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 900,
      lineHeight: 1.2,
      marginBottom: '20px',
      background: 'linear-gradient(45deg, #ffffff, #cccccc)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    
    heroDescription: {
      fontSize: '1.2rem',
      marginBottom: '30px',
      opacity: 0.9,
      maxWidth: '600px',
      lineHeight: 1.6,
    },
    
    heroButtons: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
    },
    
    btnPrimary: {
      background: 'linear-gradient(45deg, #333333, #555555)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '15px 30px',
      borderRadius: '30px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
    },
    
    btnSecondary: {
      background: 'transparent',
      border: '2px solid #666666',
      padding: '13px 28px',
      borderRadius: '30px',
      color: '#cccccc',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
    },
    
    canvasContainer: {
      flex: 1,
      height: '500px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '300px',
    },
    
    canvas3d: {
      width: '100%',
      height: '100%',
      borderRadius: '20px',
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
    },
    
    geometricShape: {
      width: '200px',
      height: '200px',
      background: 'linear-gradient(45deg, #444444, #666666, #888888)',
      borderRadius: '20px',
      animation: 'rotate3d 8s linear infinite',
      position: 'relative',
      transformStyle: 'preserve-3d',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    
    section: {
      padding: '100px 0',
      position: 'relative',
    },
    
    sectionContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    
    sectionTitle: {
      textAlign: 'center',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '60px',
    },
    
    useCasesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
    },
    
    useCaseCard: {
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      opacity: 0,
      transform: 'translateY(30px)',
    },
    
    useCaseCardVisible: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    
    useCaseIcon: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(45deg, #333333, #555555)',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      marginBottom: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '40px',
    },
    
    featureItem: {
      textAlign: 'center',
      opacity: 0,
      transform: 'translateY(30px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    },
    
    featureItemVisible: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    
    featureIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(45deg, #333333, #555555)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '30px',
      margin: '0 auto 20px',
      animation: 'pulse 2s ease-in-out infinite',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    
    footer: {
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '50px 0',
      textAlign: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
    },
    
    footerContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '40px',
      marginBottom: '30px',
    },
    
    footerSection: {
      textAlign: 'left',
    },
    
    footerSectionTitle: {
      marginBottom: '20px',
      color: '#cccccc',
      fontSize: '1.1rem',
      fontWeight: 'bold',
    },
    
    footerLink: {
      color: '#888888',
      textDecoration: 'none',
      display: 'block',
      marginBottom: '10px',
      transition: 'color 0.3s ease',
    },
    
    floatingShapes: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
    },
    
    shape: {
      position: 'absolute',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%',
      animation: 'float 6s ease-in-out infinite',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  };

  const useCases = [
    { icon: '🛍️', title: 'Ecommerce', description: 'Engage users with interactive product showcases that let customers explore every detail in stunning 3D. Boost conversion rates with immersive shopping experiences.' },
    { icon: '🏢', title: 'Corporate', description: 'Create professional, cutting-edge websites that showcase your brand\'s innovation. Perfect for tech companies, agencies, and forward-thinking businesses.' },
    { icon: '🎨', title: 'Creative Portfolio', description: 'Showcase your work in breathtaking 3D environments. Perfect for artists, designers, architects, and creative professionals who want to stand out.' },
    { icon: '🎓', title: 'Education', description: 'Create interactive learning experiences that engage students with 3D visualizations, virtual labs, and immersive educational content.' },
    { icon: '🏠', title: 'Real Estate', description: 'Offer virtual property tours and interactive floor plans that let potential buyers explore properties from anywhere in the world.' },
    { icon: '🎮', title: 'Gaming & Entertainment', description: 'Build immersive landing pages for games, interactive entertainment experiences, and engaging promotional websites.' },
  ];

  const features = [
    { icon: '🎯', title: 'Drag & Drop Editor', description: 'Intuitive visual editor that lets you build complex 3D scenes without any coding knowledge.' },
    { icon: '⚡', title: 'Real-time Rendering', description: 'See your changes instantly with our high-performance 3D rendering engine optimized for the web.' },
    { icon: '🎬', title: 'Keyframe Animations', description: 'Create smooth, professional animations with our timeline-based animation system.' },
    { icon: '📱', title: 'Mobile Optimized', description: 'Your 3D websites work perfectly on all devices, from desktop to mobile.' },
    { icon: '🔧', title: 'Interactive Elements', description: 'Add clickable hotspots, interactive objects, and dynamic user interactions.' },
    { icon: '🚀', title: 'Fast Loading', description: 'Optimized for performance with smart loading and compression techniques.' },
  ];

  return (
    <div style={styles.container}>
      {/* Fixed background */}
      <div style={styles.backgroundWrapper}></div>
      
      {/* Main content wrapper */}
      <div style={styles.contentWrapper}>
        <style>{`
          @keyframes rotate3d {
            0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
          
          @media (max-width: 768px) {
            .hero-container {
              flex-direction: column !important;
              text-align: center;
            }
            .nav-links {
              display: none !important;
            }
          }
          
          /* Ensure scrolling works */
          html, body {
            height: auto !important;
            overflow-x: hidden;
            overflow-y: auto;
          }
        `}</style>

        {/* Navigation */}
        <nav style={styles.nav}>
          <div style={styles.navContent}>
            <div style={styles.logo}>Frame Peach</div>
            <ul style={styles.navLinks} className="nav-links">
              <li><a href="#features" style={styles.navLink} onClick={(e) => handleSmoothScroll(e, '#features')}>Features</a></li>
              <li><a href="#use-cases" style={styles.navLink} onClick={(e) => handleSmoothScroll(e, '#use-cases')}>Use Cases</a></li>
              <li><a href="#pricing" style={styles.navLink}>Pricing</a></li>
              <li><a href="#docs" style={styles.navLink}>Docs</a></li>
            </ul>
            <div style={{marginRight: '20px',width: '220px',display: 'flex', justifyContent: 'space-between'}}>
            <button style={styles.ctaButton} onClick={handleButtonClick}>Login</button>
            <button style={styles.ctaButton} onClick={handleButtonClick}>Get Started</button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.floatingShapes}>
            <div style={{...styles.shape, width: '80px', height: '80px', top: '20%', left: '10%', animationDelay: '0s'}}></div>
            <div style={{...styles.shape, width: '120px', height: '120px', top: '60%', right: '10%', animationDelay: '2s'}}></div>
            <div style={{...styles.shape, width: '60px', height: '60px', top: '80%', left: '20%', animationDelay: '4s'}}></div>
          </div>
          
          <div style={styles.heroContainer} className="hero-container">
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>Stunning Interactive 3D Websites Without Code</h1>
              <p style={styles.heroDescription}>
                FramePeach empowers creators, designers, and brands to build immersive, high-performance 3D websites without writing code. 
                Use our intuitive drag-and-drop 3D scene editor, keyframe animations, and real-time interactivity to create visually stunning experiences.
              </p>
              <div style={styles.heroButtons}>
                <button style={styles.btnPrimary} onClick={handleButtonClick}>Start Building</button>
                <button style={styles.btnSecondary} onClick={handleButtonClick}>Watch Demo</button>
              </div>
            </div>
            
            <div style={styles.canvasContainer}>
              <div style={styles.canvas3d}>
                <div style={styles.geometricShape}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" style={{...styles.section, background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'}}>
          <div style={styles.sectionContainer}>
            <h2 style={styles.sectionTitle}>Use Cases</h2>
            <div style={styles.useCasesGrid}>
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  id={`use-case-${index}`}
                  className="animate-on-scroll"
                  style={{
                    ...styles.useCaseCard,
                    ...(visibleElements.has(`use-case-${index}`) ? styles.useCaseCardVisible : {}),
                    transitionDelay: `${index * 0.1}s`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div style={styles.useCaseIcon}>{useCase.icon}</div>
                  <h3 style={{fontSize: '1.5rem', marginBottom: '15px'}}>{useCase.title}</h3>
                  <p style={{opacity: 0.8, lineHeight: 1.6}}>{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{...styles.section, background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'}}>
          <div style={styles.sectionContainer}>
            <h2 style={styles.sectionTitle}>Powerful Features</h2>
            <div style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  id={`feature-${index}`}
                  className="animate-on-scroll"
                  style={{
                    ...styles.featureItem,
                    ...(visibleElements.has(`feature-${index}`) ? styles.featureItemVisible : {}),
                    transitionDelay: `${index * 0.1}s`
                  }}
                >
                  <div style={styles.featureIcon}>{feature.icon}</div>
                  <h3 style={{fontSize: '1.3rem', marginBottom: '15px'}}>{feature.title}</h3>
                  <p style={{opacity: 0.8, lineHeight: 1.6}}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{...styles.section, textAlign: 'center', background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'}}>
          <div style={styles.sectionContainer}>
            <h2 style={{fontSize: '2.5rem', marginBottom: '20px'}}>Ready to Build Something Amazing?</h2>
            <p style={{fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9}}>
              Join thousands of creators building the future of web experiences with FramePeach.
            </p>
            <button 
              style={{...styles.btnPrimary, fontSize: '1.2rem', padding: '18px 36px'}}
              onClick={handleButtonClick}
            >
              Start Your Free Trial
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer} id="footer">
          <div style={styles.sectionContainer}>
            <div style={styles.footerContent}>
              <div style={styles.footerSection}>
                <h3 style={styles.footerSectionTitle}>Product</h3>
                <a href="#" style={styles.footerLink}>Features</a>
                <a href="#" style={styles.footerLink}>Pricing</a>
                <a href="#" style={styles.footerLink}>Templates</a>
                <a href="#" style={styles.footerLink}>Tutorials</a>
              </div>
              <div style={styles.footerSection}>
                <h3 style={styles.footerSectionTitle}>Company</h3>
                <a href="#" style={styles.footerLink}>About</a>
                <a href="#" style={styles.footerLink}>Blog</a>
                <a href="#" style={styles.footerLink}>Careers</a>
                <a href="#" style={styles.footerLink}>Contact</a>
              </div>
              <div style={styles.footerSection}>
                <h3 style={styles.footerSectionTitle}>Resources</h3>
                <a href="#" style={styles.footerLink}>Documentation</a>
                <a href="#" style={styles.footerLink}>API</a>
                <a href="#" style={styles.footerLink}>Community</a>
                <a href="#" style={styles.footerLink}>Support</a>
              </div>
              <div style={styles.footerSection}>
                <h3 style={styles.footerSectionTitle}>Legal</h3>
                <a href="#" style={styles.footerLink}>Privacy Policy</a>
                <a href="#" style={styles.footerLink}>Terms of Service</a>
                <a href="#" style={styles.footerLink}>Security</a>
                <a href="#" style={styles.footerLink}>GDPR</a>
              </div>
            </div>
            <div style={{borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '30px', opacity: 0.6}}>
              <p>&copy; 2025 FramePeach. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
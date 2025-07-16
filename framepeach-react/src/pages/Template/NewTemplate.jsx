import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewTemplate = ({onClose}) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();
  const templates = [
    {
      id: 1,
      title: "New Blank Website Design",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%23333'/%3E%3Ccircle cx='100' cy='60' r='20' fill='%23666' stroke='%23999' stroke-width='2'/%3E%3Ctext x='100' y='90' text-anchor='middle' fill='%23999' font-family='Arial' font-size='12'%3EBlank%3C/text%3E%3C/svg%3E",
      author: "by PeachWeb",
      free: true
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    },

    nav: {
      position: 'fixed',
      top: 0,
      width: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      padding: '15px 0',
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
      textDecoration: 'none',
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
      fontSize: '16px',
    },

    navCtaButton: {
      background: 'linear-gradient(45deg, #333333, #555555)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '12px 24px',
      borderRadius: '25px',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      fontSize: '14px',
    },

    mainContent: {
      flex: 1,
      paddingTop: '100px',
      padding: '100px 20px 50px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
    },

    header: {
      textAlign: 'center',
      marginBottom: '60px',
    },

    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '16px',
    },

    subtitle: {
      fontSize: '1.2rem',
      color: '#cccccc',
      opacity: 0.9,
    },

    templatesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '30px',
      marginTop: '40px',
    },

    templateCard: {
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
    },

    templateCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },

    templateImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      display: 'block',
    },

    templateInfo: {
      padding: '20px',
    },

    templateTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: 'white',
      marginBottom: '8px',
      lineHeight: 1.3,
    },

    templateMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    templateAuthor: {
      fontSize: '0.9rem',
      color: '#888888',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },

    authorIcon: {
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: '#666666',
    },

    freeLabel: {
      background: 'linear-gradient(45deg, #333333, #555555)',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '0.8rem',
      fontWeight: '500',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },

    createNewCard: {
      background: 'rgba(0, 0, 0, 0.6)',
      borderRadius: '16px',
      border: '2px dashed rgba(255, 255, 255, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '280px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },

    createNewCardHover: {
      borderColor: 'rgba(255, 255, 255, 0.5)',
      background: 'rgba(0, 0, 0, 0.8)',
    },

    createIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #333333, #555555)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },

    createText: {
      color: 'white',
      fontSize: '1.1rem',
      fontWeight: '600',
      textAlign: 'center',
    },

    createSubtext: {
      color: '#888888',
      fontSize: '0.9rem',
      marginTop: '4px',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
        }
      `}</style>

      {/* Navigation Header */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <a href="/" style={styles.logo}>PeachWeb</a>
          
          <button 
            style={styles.navCtaButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
              e.target.style.background = 'linear-gradient(45deg, #444444, #666666)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'linear-gradient(45deg, #333333, #555555)';
            }}
            onClick={() => onClose(false)}
          >
            X
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.title}>Get Started!</h1>
          <p style={styles.subtitle}>Start from scratch or pick a free template to begin with.</p>
        </div>

        <div style={styles.templatesGrid}>
          {/* Create New Project Card */}
          <div
            style={{
              ...styles.createNewCard,
              ...(hoveredCard === 'new' ? styles.createNewCardHover : {})
            }}
            onMouseEnter={() => setHoveredCard('new')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => console.log('Create new project')}
          >
            <div style={styles.createIcon} onClick={()=>navigate('/app')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <div style={styles.createText}>Start from Scratch</div>
            <div style={styles.createSubtext}>Create a new blank project</div>
          </div>

          {/* Template Cards */}
          {templates.map((template) => (
            <div
              key={template.id}
              style={{
                ...styles.templateCard,
                ...(hoveredCard === template.id ? styles.templateCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard(template.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => console.log(`Selected template: ${template.title}`)}
            >
              <img 
                src={template.image} 
                alt={template.title}
                style={styles.templateImage}
              />
              <div style={styles.templateInfo}>
                <h3 style={styles.templateTitle}>{template.title}</h3>
                <div style={styles.templateMeta}>
                  <div style={styles.templateAuthor}>
                    <div style={styles.authorIcon}></div>
                    {template.author}
                  </div>
                  {template.free && (
                    <span style={styles.freeLabel}>Free</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewTemplate;
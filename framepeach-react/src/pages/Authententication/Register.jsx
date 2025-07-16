import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../services/auth';

const AuthPages = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPage === 'login') {
      console.log('Login submitted:', { email: formData.email, password: formData.password });
      const response=await login(formData.email, formData.password);

      if(response.success)
        {
          alert('Login successful! ');
          navigate('/template')
        }
      else
        alert('Login failed: ' + response.message);
      

    } else {

      const response=await register(formData.firstName,formData.lastName,formData.email, formData.password);

      if(response.success)
        { 
          alert('Registration successful! Please login to continue.');
          navigate('/login')
        }
      else
        alert('Registration failed: ' + response.message);

      console.log('Register submitted:', formData);
      
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    setShowPassword(false);
  };

  const switchPage = (page) => {
    setCurrentPage(page);
    resetForm();
  };

  const styles = {
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
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    },
    
    formWrapper: {
      width: '100%',
      maxWidth: '28rem',
    },
    
    formCard: {
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    
    header: {
      background: 'linear-gradient(45deg, #333333, #555555)',
      padding: '24px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px',
    },
    
    headerSubtitle: {
      color: '#cccccc',
      fontSize: '14px',
    },
    
    formContent: {
      padding: '24px',
    },
    
    inputGroup: {
      marginBottom: '16px',
    },
    
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#cccccc',
      marginBottom: '8px',
    },
    
    inputWrapper: {
      position: 'relative',
    },
    
    input: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      background: 'rgba(0, 0, 0, 0.3)',
      color: 'white',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    
    inputFocus: {
      borderColor: '#666666',
      boxShadow: '0 0 0 2px rgba(102, 102, 102, 0.2)',
    },
    
    inputWithToggle: {
      paddingRight: '48px',
    },
    
    icon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#888888',
      width: '20px',
      height: '20px',
    },
    
    toggleButton: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#888888',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      transition: 'color 0.3s ease',
    },
    
    submitButton: {
      width: '100%',
      background: 'linear-gradient(45deg, #333333, #555555)',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '8px',
    },
    
    submitButtonHover: {
      background: 'linear-gradient(45deg, #444444, #666666)',
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
    },
    
    switchSection: {
      marginTop: '24px',
      textAlign: 'center',
    },
    
    switchText: {
      color: '#888888',
      fontSize: '14px',
    },
    
    switchButton: {
      background: 'none',
      border: 'none',
      color: '#cccccc',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'color 0.3s ease',
    },
    
    forgotPassword: {
      marginTop: '16px',
      textAlign: 'center',
    },
    
    forgotButton: {
      background: 'none',
      border: 'none',
      color: '#888888',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
    },
    
    demoControls: {
      marginTop: '24px',
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(8px)',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    
    demoTitle: {
      color: 'white',
      fontSize: '14px',
      marginBottom: '12px',
    },
    
    demoButtons: {
      display: 'flex',
      gap: '8px',
    },
    
    demoButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    
    demoButtonActive: {
      background: 'white',
      color: '#333333',
    },
    
    demoButtonInactive: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
    },
  };
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

    if(e.target.name==='login')
        switchPage('login');
    else
        switchPage('register');
       // Redirect to register page on button click
  };
  return (
    <div style={styles.container}>
          {/* Navigation */}
          <nav style={styles.nav}>
          <div style={styles.navContent}>
            <div style={styles.logo} onClick={()=>navigate('/')}>Frame Peach</div>
            <div style={{marginRight: '20px',width: '220px',display: 'flex', justifyContent: 'space-between'}}>
            <button style={styles.ctaButton} onClick={handleButtonClick} name='login'>Login</button>
            <button style={styles.ctaButton} onClick={handleButtonClick} name='register'>Register</button>
            </div>
          </div>
        </nav>
      <div style={styles.formWrapper}>
        <div style={styles.formCard}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>
              {currentPage === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={styles.headerSubtitle}>
              {currentPage === 'login' 
                ? 'Sign in to your account' 
                : 'Join us to get started'
              }
            </p>
          </div>

          {/* Form */}
          <div style={styles.formContent}>
            <div>
              {/* Register Fields */}
              {currentPage === 'register' && (
                <>
                  {/* First Name */}
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>
                      First Name
                    </label>
                    <div style={styles.inputWrapper}>
                      <User style={styles.icon} />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Enter your first name"
                        required
                        onFocus={(e) => {
                          Object.assign(e.target.style, styles.inputFocus);
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>
                      Last Name
                    </label>
                    <div style={styles.inputWrapper}>
                      <User style={styles.icon} />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="Enter your last name"
                        required
                        onFocus={(e) => {
                          Object.assign(e.target.style, styles.inputFocus);
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Email Address
                </label>
                <div style={styles.inputWrapper}>
                  <Mail style={styles.icon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Enter your email"
                    required
                    onFocus={(e) => {
                      Object.assign(e.target.style, styles.inputFocus);
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Password
                </label>
                <div style={styles.inputWrapper}>
                  <Lock style={styles.icon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={{...styles.input, ...styles.inputWithToggle}}
                    placeholder="Enter your password"
                    required
                    onFocus={(e) => {
                      Object.assign(e.target.style, styles.inputFocus);
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.toggleButton}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#cccccc';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#888888';
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                style={styles.submitButton}
                onMouseEnter={(e) => {
                  Object.assign(e.target.style, styles.submitButtonHover);
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, #333333, #555555)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {currentPage === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            {/* Switch between Login/Register */}
            <div style={styles.switchSection}>
              <p style={styles.switchText}>
                {currentPage === 'login' 
                  ? "Don't have an account? " 
                  : "Already have an account? "
                }
                <button
                  onClick={() => switchPage(currentPage === 'login' ? 'register' : 'login')}
                  style={styles.switchButton}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#cccccc';
                  }}
                >
                  {currentPage === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Forgot Password (only on login) */}
            {currentPage === 'login' && (
              <div style={styles.forgotPassword}>
                <button 
                  style={styles.forgotButton}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#cccccc';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#888888';
                  }}
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default AuthPages;
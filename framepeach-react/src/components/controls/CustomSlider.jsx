import React, { useRef,useEffect,useState } from 'react';
import './CustomSlider.css'; // Import your CSS styles


const CustomSlider = ({ min = 0, max = 200, step = 1, value, onChange }) => {
    const [currentValue, setCurrentValue] = useState(value || 0);
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef(null);
  
    // Update currentValue when value prop changes
    React.useEffect(() => {
      // console.log("value", value);
      setCurrentValue(value);
    }, [value]);
  
    const updateValue = (clientX) => {
      if (!trackRef.current) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      let newValue = min + percent * (max - min);
      newValue = Math.round(newValue / step) * step;
      newValue = Math.max(min, Math.min(max, newValue));
      setCurrentValue(newValue);
      
    };
    
    const handleThumbMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      
      const handleMouseMove = (e) => {
        updateValue(e.clientX);
      };
      
      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
  
    const handleTrackClick = (e) => {
      // Only handle clicks directly on track or progress, not on thumb
      // if (e.target.classList.contains('slider-thumb')) {
      //   return;
      // }
      updateValue(e.clientX);
      console.log("track click", e.clientX);
      onChange?.(currentValue); 
    };
  
    const thumbPosition = ((currentValue - min) / (max - min)) * 100;
    
    const trackStyle = {
      position: 'relative',
      width: '100%',
      backgroundColor: '#4B5563',
      borderRadius: '4px',
      cursor: 'pointer',
      height: '100%',
      background:'#38383a',
    };
  
    const progressStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: `${thumbPosition}%`,
      backgroundColor: "#414244",
      borderRadius: "4px",
      height: '100%',
      pointerEvents: 'none'
    };
  
    const thumbStyle = {
      left: `${thumbPosition}%`,
      transform: isDragging ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%)',
      cursor: isDragging ? 'grabbing' : 'grab',
      transition: isDragging ? 'none' : 'transform 0.1s ease',
      zIndex: 2,
      position: 'absolute',
    };
  
    return (
      <div className="slider-container flex-1" style={{ minHeight: '20px', display: 'flex', alignItems: 'center' }}>
        <div 
          // className="slider-track" 
          ref={trackRef}
          onClick={handleTrackClick}
          style={trackStyle}
        >
          <div style={progressStyle}></div>
          <div 
            className="slider-thumb" 
            style={thumbStyle}
            onMouseDown={handleThumbMouseDown}
          ></div>
        </div>
      </div>
    );
  };


  export default CustomSlider;
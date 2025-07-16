import React, { useState, useRef, useEffect, useCallback, useMemo, useReducer } from 'react';
import { 
  Play, Pause, Square, SkipBack, SkipForward, 
  ChevronDown, ChevronRight, ChevronLeft, Clock, Settings, 
  Plus, Minus, Eye, EyeOff, Lock, Unlock,
  MoreVertical, Copy, Trash2, Move, Save, 
  FolderOpen, Camera, Film, FileText, Search,
  Maximize, RotateCcw, Zap, Menu, Target, User, Music,
  Lightbulb, Sparkles, Box, Globe, Volume2, Percent
} from 'lucide-react';

// ==================== CONSTANTS ====================
const TIMELINE_CONSTANTS = {
  DEFAULT_FPS: 30,
  DEFAULT_TOTAL_FRAMES: 240,
  DEFAULT_ZOOM: 1,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 10,
  BASE_PIXELS_PER_FRAME: 4,
  TRACK_HEIGHT: {
    GROUP: 44,
    ITEM: 36
  },
  SNAP_THRESHOLD: 3,
  SNAP_INTERVALS: {
    FRAME: 10,
    MAJOR_TICK: 60
  },
  SNAP_PERCENTAGES: [0, 0.25, 0.5, 0.75, 1],
  VIEWPORT_WIDTH: 800,
  VIRTUALIZATION_BUFFER: 100,
  OUTLINER_WIDTH: 320,
  TOOLBAR_HEIGHT: 48,
  PLAYBACK_BAR_HEIGHT: 40,
  RULER_HEIGHT: 48,
  // Ruler tick intervals based on zoom level
  RULER_INTERVALS: {
    PERCENT: {
      // Zoom-based percentage intervals
      ZOOM_INTERVALS: [
        { minZoom: 0.1, maxZoom: 0.5, major: 25, minor: 0 },      // 0%, 25%, 50%, 75%, 100%
        { minZoom: 0.5, maxZoom: 1.0, major: 10, minor: 0 },      // Every 10%
        { minZoom: 1.0, maxZoom: 2.0, major: 10, minor: 5 },      // Every 5%
        { minZoom: 2.0, maxZoom: 5.0, major: 5, minor: 1 },       // Every 1%
        { minZoom: 5.0, maxZoom: 10.0, major: 2, minor: 0.5 }     // Every 0.5%
      ]
    },
    DVH: {
      // Zoom levels and their corresponding intervals
      ZOOM_INTERVALS: [
        { minZoom: 0.1, maxZoom: 0.5, major: 60, minor: 30 },
        { minZoom: 0.5, maxZoom: 1.0, major: 30, minor: 10 },
        { minZoom: 1.0, maxZoom: 2.0, major: 20, minor: 5 },
        { minZoom: 2.0, maxZoom: 5.0, major: 10, minor: 2 },
        { minZoom: 5.0, maxZoom: 10.0, major: 5, minor: 1 }
      ]
    }
  }
};

const COLORS = {
  background: {
    dark: '#1a1a1a',
    darker: '#151515',
    panel: '#2a2a2a',
    header: '#333333',
    track: '#242424',
    trackHover: '#2f2f2f'
  },
  border: '#404040',
  text: {
    primary: '#ffffff',
    light: '#cccccc',
    secondary: '#999999'
  },
  accent: {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    yellow: '#eab308',
    cyan: '#06b6d4'
  }
};

// ==================== ACTION TYPES ====================
const TIMELINE_ACTIONS = {
  SET_CURRENT_FRAME: 'SET_CURRENT_FRAME',
  SET_ZOOM: 'SET_ZOOM',
  SET_SCROLL_LEFT: 'SET_SCROLL_LEFT',
  MOVE_KEYFRAME: 'MOVE_KEYFRAME',
  TOGGLE_AUTO_KEY: 'TOGGLE_AUTO_KEY',
  TOGGLE_SNAPPING: 'TOGGLE_SNAPPING',
  TOGGLE_SNAP_METHOD: 'TOGGLE_SNAP_METHOD',
  SELECT_KEYFRAMES: 'SELECT_KEYFRAMES',
  TOGGLE_TRACK_EXPANSION: 'TOGGLE_TRACK_EXPANSION',
  TOGGLE_TRACK_VISIBILITY: 'TOGGLE_TRACK_VISIBILITY',
  TOGGLE_TRACK_LOCK: 'TOGGLE_TRACK_LOCK',
  TOGGLE_RULER_MODE: 'TOGGLE_RULER_MODE'
};

// ==================== STYLES INJECTION ====================
const TimelineStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .clip-path-diamond {
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      }
      .timeline-scrollbar::-webkit-scrollbar { height: 8px; }
      .timeline-scrollbar::-webkit-scrollbar-track { background: ${COLORS.background.dark}; }
      .timeline-scrollbar::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
      .timeline-scrollbar::-webkit-scrollbar-thumb:hover { background: #555555; }
      .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  return null;
};

// ==================== UTILITY FUNCTIONS ====================
const calculateSnapPoint = (frame, snapPoints) => {
  const closestPoint = snapPoints.reduce((closest, point) => {
    return Math.abs(point - frame) < Math.abs(closest - frame) ? point : closest;
  }, snapPoints[0]);
  
  return Math.abs(closestPoint - frame) <= TIMELINE_CONSTANTS.SNAP_THRESHOLD 
    ? closestPoint 
    : frame;
};

const generateSnapPoints = (totalFrames, snapByPercent) => {
  const points = [];
  
  if (snapByPercent) {
    TIMELINE_CONSTANTS.SNAP_PERCENTAGES.forEach(percent => {
      points.push(Math.floor(percent * totalFrames));
    });
  } else {
    for (let i = 0; i <= totalFrames; i += TIMELINE_CONSTANTS.SNAP_INTERVALS.FRAME) {
      points.push(i);
    }
  }
  
  return points;
};

// Get ruler intervals based on zoom level
const getRulerIntervals = (zoom, mode = 'dvh') => {
  const intervals = mode === 'percent' 
    ? TIMELINE_CONSTANTS.RULER_INTERVALS.PERCENT.ZOOM_INTERVALS
    : TIMELINE_CONSTANTS.RULER_INTERVALS.DVH.ZOOM_INTERVALS;
    
  for (const interval of intervals) {
    if (zoom >= interval.minZoom && zoom <= interval.maxZoom) {
      return interval;
    }
  }
  return intervals[0]; // fallback
};

// Generate darker version of color for track backgrounds
const getDarkerColor = (color, opacity = 0.15) => {
  // Extract color from Tailwind class or use direct color
  const colorMap = {
    'bg-blue-500': '#3b82f6',
    'bg-cyan-500': '#06b6d4',
    'bg-green-500': '#10b981',
    'bg-emerald-500': '#10b981',
    'bg-yellow-500': '#eab308',
    'bg-red-500': '#ef4444',
    'bg-purple-500': '#a855f7',
    'bg-pink-500': '#ec4899',
    'bg-orange-500': '#f97316'
  };
  
  const hexColor = colorMap[color] || color;
  
  // Convert to RGB and apply darkening
  if (hexColor.startsWith('#')) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // For track backgrounds, darken to ~35% brightness
    if (opacity === 'track-bg') {
      const darkenedR = Math.floor(r * 0.35);
      const darkenedG = Math.floor(g * 0.35);
      const darkenedB = Math.floor(b * 0.35);
      return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
    }
    
    // For section bars, maintain ~83% brightness
    if (opacity === 'section-bar') {
      const brightenedR = Math.floor(r * 0.83);
      const brightenedG = Math.floor(g * 0.83);
      const brightenedB = Math.floor(b * 0.83);
      return `rgb(${brightenedR}, ${brightenedG}, ${brightenedB})`;
    }
    
    // Default: apply opacity
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  return `rgba(128, 128, 128, ${opacity})`;
};

// Get the actual hex color from Tailwind class
const getHexColor = (color) => {
  const colorMap = {
    'bg-blue-500': '#3b82f6',
    'bg-cyan-500': '#06b6d4',
    'bg-green-500': '#10b981',
    'bg-emerald-500': '#10b981',
    'bg-yellow-500': '#eab308',
    'bg-red-500': '#ef4444',
    'bg-purple-500': '#a855f7',
    'bg-pink-500': '#ec4899',
    'bg-orange-500': '#f97316'
  };
  
  return colorMap[color] || color;
};

// ==================== REDUCER ====================
const timelineReducer = (state, action) => {
  switch (action.type) {
    case TIMELINE_ACTIONS.SET_CURRENT_FRAME:
      return { 
        ...state, 
        currentFrame: Math.max(0, Math.min(state.totalFrames - 1, action.payload)) 
      };
    
    case TIMELINE_ACTIONS.SET_ZOOM:
      const newZoom = Math.max(
        TIMELINE_CONSTANTS.MIN_ZOOM, 
        Math.min(TIMELINE_CONSTANTS.MAX_ZOOM, action.payload)
      );
      return { 
        ...state, 
        zoom: newZoom, 
        pixelsPerFrame: TIMELINE_CONSTANTS.BASE_PIXELS_PER_FRAME * newZoom 
      };
    
    case TIMELINE_ACTIONS.SET_SCROLL_LEFT:
      return { 
        ...state, 
        scrollLeft: Math.max(0, action.payload) 
      };
    
    case TIMELINE_ACTIONS.MOVE_KEYFRAME: {
      const { trackId, sectionIndex, keyframeIndex, newFrame: inputFrame } = action.payload;
      let newFrame = inputFrame;
      
      if (state.snappingEnabled) {
        const snapPoints = generateSnapPoints(state.totalFrames, state.snapByPercent);
        newFrame = calculateSnapPoint(inputFrame, snapPoints);
      }
      
      return {
        ...state,
        tracks: state.tracks.map(track => {
          if (track.id !== trackId) return track;
          return {
            ...track,
            sections: track.sections?.map((section, sIdx) => {
              if (sIdx !== sectionIndex) return section;
              return {
                ...section,
                keyframes: section.keyframes.map((kf, kIdx) => {
                  if (kIdx !== keyframeIndex) return kf;
                  return { ...kf, frame: newFrame };
                })
              };
            }) || []
          };
        })
      };
    }
    
    case TIMELINE_ACTIONS.TOGGLE_AUTO_KEY:
      return { ...state, autoKeyEnabled: !state.autoKeyEnabled };
      
    case TIMELINE_ACTIONS.TOGGLE_SNAPPING:
      return { ...state, snappingEnabled: !state.snappingEnabled };
      
    case TIMELINE_ACTIONS.TOGGLE_SNAP_METHOD:
      return { ...state, snapByPercent: !state.snapByPercent };
    
    case TIMELINE_ACTIONS.SELECT_KEYFRAMES:
      return {
        ...state,
        selectedKeyframes: action.payload.multiSelect 
          ? state.selectedKeyframes.includes(action.payload.id)
            ? state.selectedKeyframes.filter(id => id !== action.payload.id)
            : [...state.selectedKeyframes, action.payload.id]
          : [action.payload.id]
      };
    
    case TIMELINE_ACTIONS.TOGGLE_TRACK_EXPANSION:
      return {
        ...state,
        tracks: state.tracks.map(track => 
          track.id === action.payload 
            ? { ...track, expanded: !track.expanded }
            : track
        )
      };
    
    case TIMELINE_ACTIONS.TOGGLE_TRACK_VISIBILITY:
      return {
        ...state,
        tracks: state.tracks.map(track => 
          track.id === action.payload 
            ? { ...track, visible: !track.visible }
            : track
        )
      };
    
    case TIMELINE_ACTIONS.TOGGLE_TRACK_LOCK:
      return {
        ...state,
        tracks: state.tracks.map(track => 
          track.id === action.payload 
            ? { ...track, locked: !track.locked }
            : track
        )
      };
    
    case TIMELINE_ACTIONS.TOGGLE_RULER_MODE:
      return { ...state, rulerMode: state.rulerMode === 'percent' ? 'dvh' : 'percent' };
    
    default:
      return state;
  }
};

// ==================== SUB-COMPONENTS ====================

// Main Toolbar Component
const TimelineToolbar = ({ state, dispatch }) => {
  return (
    <div 
      className="flex items-center justify-between px-3 border-b"
      style={{ 
        height: `${TIMELINE_CONSTANTS.TOOLBAR_HEIGHT}px`,
        backgroundColor: COLORS.background.header,
        borderColor: COLORS.border
      }}
    >
      <div className="flex items-center gap-2">
        <button 
          className="flex items-center gap-1 px-2 py-1 rounded"
          style={{ backgroundColor: COLORS.background.panel }}
        >
          <Save size={12} style={{ color: COLORS.text.light }} />
          <span className="text-xs" style={{ color: COLORS.text.light }}>Save</span>
        </button>

        <div className="w-px h-6 mx-1" style={{ backgroundColor: COLORS.border }} />
        
        <button 
          className="flex items-center gap-1 px-2 py-1 rounded"
          style={{ backgroundColor: COLORS.background.panel }}
        >
          <Camera size={12} style={{ color: COLORS.text.light }} />
          <span select-none className="text-xs" style={{ color: COLORS.text.light }}>Camera</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button 
          className="flex items-center gap-1 px-2 py-1 rounded text-white text-xs transition-colors"
          style={{ 
            backgroundColor: state.autoKeyEnabled ? COLORS.accent.red : COLORS.background.panel 
          }}
          title="Auto Key - Creates keyframes automatically (K)"
          onClick={() => dispatch({ type: TIMELINE_ACTIONS.TOGGLE_AUTO_KEY })}
        >
          <Target size={12} />
          <span select-none>Auto Key</span>
        </button>
        
        <button 
          className="flex items-center gap-1 px-2 py-1 rounded text-white text-xs transition-colors"
          style={{ 
            backgroundColor: state.snappingEnabled ? COLORS.accent.blue : COLORS.background.panel 
          }}
          title="Snapping - Keyframes snap to timeline (S)"
          onClick={() => dispatch({ type: TIMELINE_ACTIONS.TOGGLE_SNAPPING })}
        >
          <Zap size={12} style={{ color: COLORS.text.light }} />
          <span select-none className="text-xs" style={{ color: COLORS.text.light }}>Snapping</span>
        </button>
        
        <button 
          className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors"
          style={{ 
            backgroundColor: state.rulerMode === 'percent' ? COLORS.accent.yellow : COLORS.background.panel,
            color: COLORS.text.light
          }}
          title="Toggle ruler units (R)"
          onClick={() => dispatch({ type: TIMELINE_ACTIONS.TOGGLE_RULER_MODE })}
        >
          {state.rulerMode === 'percent' ? (
            <Percent size={12} />
          ) : (
            <span select-none className="text-xs font-bold">DVH</span>
          )}
          <span>{state.rulerMode === 'percent' ? 'Percent' : 'Frames'}</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        

        <button 
          className="p-1.5 rounded transition-colors"
          style={{ color: COLORS.text.secondary }}
          title="Lock Sequence"
        >
          <Lock size={14} />
        </button>
      </div>
    </div>
  );
};

// Ruler Component
const TimelineRuler = ({ state, dispatch, frameToPixel, handleFrameClick, handlePlayheadMouseDown, timelineWidth, visibleFrameRange }) => {
  // Generate ruler marks based on mode and zoom
  const generateRulerMarks = () => {
    const marks = [];
    
    if (state.rulerMode === 'percent') {
      // Percentage mode with zoom-based intervals
      const intervals = getRulerIntervals(state.zoom, 'percent');
      
      // Generate major marks
      if (intervals.major > 0) {
        for (let percent = 0; percent <= 100; percent += intervals.major) {
          const frame = Math.floor((percent / 100) * state.totalFrames);
          if (frame >= visibleFrameRange.startFrame - 10 && frame <= visibleFrameRange.endFrame + 10) {
            marks.push({
              type: 'major',
              frame,
              label: percent % 1 === 0 ? `${percent}%` : `${percent.toFixed(1)}%`,
              position: frameToPixel(frame)
            });
          }
        }
      }
      
      // Generate minor marks
      if (intervals.minor > 0) {
        for (let percent = 0; percent <= 100; percent += intervals.minor) {
          // Skip if it's already a major mark
          if (percent % intervals.major !== 0) {
            const frame = Math.floor((percent / 100) * state.totalFrames);
            if (frame >= visibleFrameRange.startFrame - 10 && frame <= visibleFrameRange.endFrame + 10) {
              marks.push({
                type: 'minor',
                frame,
                label: percent % 1 === 0 ? `${percent}%` : `${percent.toFixed(1)}%`,
                position: frameToPixel(frame)
              });
            }
          }
        }
      }
    } else {
      // DVH/Frame mode
      const intervals = getRulerIntervals(state.zoom, 'dvh');
      
      // Major marks
      for (let frame = 0; frame <= state.totalFrames; frame += intervals.major) {
        if (frame >= visibleFrameRange.startFrame - intervals.major && frame <= visibleFrameRange.endFrame + intervals.major) {
          marks.push({
            type: 'major',
            frame,
            label: `${frame}`,
            position: frameToPixel(frame)
          });
        }
      }
      
      // Minor marks
      for (let frame = 0; frame <= state.totalFrames; frame += intervals.minor) {
        if (frame % intervals.major !== 0) { // Skip if it's already a major mark
          if (frame >= visibleFrameRange.startFrame - intervals.minor && frame <= visibleFrameRange.endFrame + intervals.minor) {
            marks.push({
              type: 'minor',
              frame,
              label: null,
              position: frameToPixel(frame)
            });
          }
        }
      }
    }
    
    return marks;
  };
  
  const rulerMarks = generateRulerMarks();
  
  return (
    <div style={{ width: `${timelineWidth}px`, height: '100%', position: 'relative' }}>
      {/* Range Markers */}
      <div 
        className="absolute top-0 left-0 w-1 h-full z-20" 
        style={{ backgroundColor: COLORS.accent.green }}
        title="Sequence Start"
      />
      <div 
        className="absolute top-0 w-1 h-full z-20" 
        style={{ 
          left: `${frameToPixel(state.totalFrames - 1)}px`,
          backgroundColor: COLORS.accent.red
        }}
        title="Sequence End"
      />
      
      {/* Progress Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{ backgroundColor: COLORS.background.dark }}
      >
        <div 
          className="h-full transition-all duration-150"
          style={{ 
            width: `${(state.currentFrame / state.totalFrames) * 100}%`,
            backgroundColor: COLORS.accent.blue
          }}
        />
      </div>

      {/* Ruler Marks */}
      {rulerMarks.map((mark, index) => {
        if (mark.type === 'major') {
          return (
            <div 
              key={`major-${mark.frame}-${index}`}
              className="absolute top-1 flex flex-col cursor-pointer group"
              style={{ left: `${mark.position}px` }}
              onClick={() => handleFrameClick(mark.frame)}
              title={`Jump to ${mark.label}`}
            >
              <div 
                className="text-sm font-medium select-none px-1 rounded font-mono"
                style={{ 
                  color: COLORS.text.primary,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  fontSize: state.zoom >= 3 ? '13px' : '11px'
                }}
              >
                {mark.label}
              </div>
              <div 
                className="w-px mt-1"
                style={{ 
                  height: '20px',
                  backgroundColor: COLORS.text.primary 
                }}
              />
            </div>
          );
        } else {
          // Minor marks - show labels in percent mode at high zoom
          const showMinorLabel = state.rulerMode === 'percent' && state.zoom >= 3;
          
          return (
            <div 
              key={`minor-${mark.frame}-${index}`}
              className="absolute cursor-pointer hover:opacity-100 transition-opacity"
              style={{ 
                left: `${mark.position}px`,
                opacity: 0.6,
                top: showMinorLabel ? '4px' : 'auto',
                bottom: showMinorLabel ? 'auto' : '4px'
              }}
              onClick={() => handleFrameClick(mark.frame)}
              title={`${state.rulerMode === 'percent' ? mark.label : `Frame ${mark.frame}`}`}
            >
              {showMinorLabel && mark.label && (
                <div 
                  className="text-xs select-none px-0.5 rounded font-mono"
                  style={{ 
                    color: COLORS.text.secondary,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    fontSize: '10px',
                    marginBottom: '2px'
                  }}
                >
                  {mark.label}
                </div>
              )}
              <div 
                className="w-px"
                style={{ 
                  height: showMinorLabel ? '10px' : '12px',
                  backgroundColor: COLORS.text.secondary
                }}
              />
            </div>
          );
        }
      })}
      
      {/* Ruler Playhead */}
      <div 
        className="absolute top-0 w-0.5 h-full z-30 cursor-ew-resize shadow-sm"
        style={{ 
          left: `${frameToPixel(state.currentFrame)}px`,
          backgroundColor: COLORS.accent.red
        }}
        onMouseDown={handlePlayheadMouseDown}
        title="Drag to scrub timeline"
      >
        <div 
          className="absolute -top-1 -left-2 w-4 h-4 clip-path-diamond cursor-grab active:cursor-grabbing shadow-lg"
          style={{ backgroundColor: COLORS.accent.red }}
        />
        <div 
          className="absolute -top-10 -left-8 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none"
          style={{ 
            backgroundColor: 'black',
            border: `1px solid ${COLORS.border}`
          }}
        >
          {state.rulerMode === 'percent' 
            ? `${((state.currentFrame / state.totalFrames) * 100).toFixed(1)}%`
            : state.currentFrame
          }
        </div>
      </div>
    </div>
  );
};

// Track Row Component
const TrackRow = ({ track, dispatch }) => {
  const trackHeight = track.isGroup 
    ? TIMELINE_CONSTANTS.TRACK_HEIGHT.GROUP 
    : TIMELINE_CONSTANTS.TRACK_HEIGHT.ITEM;
  
  return (
    <div 
      className="flex items-center justify-between border-b transition-colors px-3"
      style={{ 
        height: `${trackHeight}px`,
        paddingLeft: `${track.level * 20 + 12}px`,
        backgroundColor: COLORS.background.track,
        borderColor: COLORS.border
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background.trackHover}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.background.track}
    >
      <div className="flex items-center flex-1">
        {track.isGroup && (
          <button 
            onClick={() => dispatch({ type: TIMELINE_ACTIONS.TOGGLE_TRACK_EXPANSION, payload: track.id })}
            className="mr-2 p-0.5 rounded transition-colors"
          >
            {track.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        )}
        
        {track.isGroup && (
          <div className={`w-4 h-4 mr-2 ${track.color} flex items-center justify-center`}>
            <track.icon size={14} />
          </div>
        )}
        
        {!track.isGroup && (
          <div 
            className="w-3 h-3 rounded mr-2"
            style={{ 
              backgroundColor: track.sections?.[0]?.color?.replace('bg-', '') || COLORS.text.secondary 
            }}
          />
        )}
        
        <span 
          className={`flex-1 truncate select-none ${track.isGroup ? 'font-medium' : ''} ${track.isGroup ? 'text-sm' : 'text-xs'}`}
          style={{  color: track.isGroup ? COLORS.text.primary : COLORS.text.light
           }}
        >
          {track.name}
        </span>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            dispatch({ type: TIMELINE_ACTIONS.TOGGLE_TRACK_VISIBILITY, payload: track.id }); 
          }}
          className="p-0.5 rounded"
          title={track.visible ? 'Hide Track' : 'Show Track'}
        >
          {track.visible ? 
            <Eye size={11} style={{ color: COLORS.text.light }} /> : 
            <EyeOff size={11} style={{ color: COLORS.text.secondary }} />
          }
        </button>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            dispatch({ type: TIMELINE_ACTIONS.TOGGLE_TRACK_LOCK, payload: track.id }); 
          }}
          className="p-0.5 rounded"
          title={track.locked ? 'Unlock Track' : 'Lock Track'}
        >
          {track.locked ? 
            <Lock size={11} style={{ color: COLORS.accent.red }} /> : 
            <Unlock size={11} style={{ color: COLORS.text.light }} />
          }
        </button>
      </div>
    </div>
  );
};

// Keyframe Component
const Keyframe = ({ 
  track, 
  sectionIndex, 
  keyframeIndex, 
  keyframe, 
  isSelected, 
  frameToPixel, 
  handleKeyframeSelect, 
  handleKeyframeMouseDown 
}) => {
  const keyframeId = `${track.id}-${sectionIndex}-${keyframeIndex}`;
  
  return (
    <div 
      className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 border-2 rounded cursor-pointer transition-all duration-150 z-10`}
      style={{ 
        left: `${frameToPixel(keyframe.frame)}px`,
        marginLeft: '-4px',
        backgroundColor: 'white',
        borderColor: COLORS.background.darker,
        transform: `translateY(-50%) scale(${isSelected ? 1.5 : 1})`,
        boxShadow: isSelected ? '0 0 0 2px white' : 'none'
      }}
      onClick={(e) => handleKeyframeSelect(track.id, sectionIndex, keyframeIndex, e)}
      onMouseDown={(e) => handleKeyframeMouseDown(e, track.id, sectionIndex, keyframeIndex)}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.25)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = `translateY(-50%) scale(${isSelected ? 1.5 : 1})`}
      title={`${track.name}: Frame ${keyframe.frame} (Value: ${keyframe.value})`}
    />
  );
};

// Playback Controls Component
const PlaybackControls = ({ state, dispatch, playbackState, setPlaybackState }) => {
  return (
    <div 
      className="flex items-center justify-between px-3 border-t"
      style={{ 
        height: `${TIMELINE_CONSTANTS.PLAYBACK_BAR_HEIGHT}px`,
        backgroundColor: COLORS.background.header,
        borderColor: COLORS.border
      }}
    >
      <div className="flex items-center gap-1">
        <button 
          className="p-1.5 rounded transition-colors"
          style={{ color: COLORS.text.light }}
          onClick={() => dispatch({ type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, payload: 0 })}
          title="Go to Start (Home)"
        >
          <SkipBack size={14} />
        </button>
        <button 
          className="p-1.5 rounded transition-colors"
          style={{ color: COLORS.text.light }}
          onClick={() => dispatch({ 
            type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, 
            payload: state.currentFrame - 1 
          })}
          title="Previous Frame (←)"
        >
          <ChevronLeft size={14} />
        </button>
        <button 
          className="p-2 rounded text-white transition-colors"
          style={{ backgroundColor: COLORS.accent.green }}
          onClick={() => setPlaybackState(playbackState === 'playing' ? 'paused' : 'playing')}
          title={`${playbackState === 'playing' ? 'Pause' : 'Play'} (Space)`}
        >
          {playbackState === 'playing' ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button 
          className="p-1.5 rounded transition-colors"
          style={{ color: COLORS.text.light }}
          onClick={() => dispatch({ 
            type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, 
            payload: state.currentFrame + 1 
          })}
          title="Next Frame (→)"
        >
          <ChevronRight size={14} />
        </button>
        <button 
          className="p-1.5 rounded transition-colors"
          style={{ color: COLORS.text.light }}
          onClick={() => dispatch({ 
            type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, 
            payload: state.totalFrames - 1 
          })}
          title="Go to End (End)"
        >
          <SkipForward size={14} />
        </button>
        <div className="w-px h-6 mx-2" style={{ backgroundColor: COLORS.border }} />
        <button 
          className="p-1.5 rounded transition-colors"
          style={{ color: COLORS.text.light }}
          onClick={() => setPlaybackState('stopped')}
          title="Stop"
        >
          <Square size={14} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.text.light }}>
          <Clock size={12} />
          <span>{(state.currentFrame / state.fps).toFixed(2)}s</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.text.light }}>
          <span>Frame:</span>
          <input 
            type="number" 
            value={state.currentFrame} 
            onChange={(e) => dispatch({ 
              type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, 
              payload: parseInt(e.target.value) || 0 
            })}
            className="w-16 px-1 py-0.5 rounded text-xs text-center"
            style={{ 
              backgroundColor: COLORS.background.panel,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.primary
            }}
          />
          <span>/ {state.totalFrames}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          className="p-1 rounded transition-colors"
          style={{ color: COLORS.text.secondary }}
          onClick={() => dispatch({ 
            type: TIMELINE_ACTIONS.SET_ZOOM, 
            payload: state.zoom - 0.2 
          })}
          title="Zoom Out"
        >
          <Minus size={12} />
        </button>
        <span 
          className="text-xs w-12 text-center"
          style={{ color: COLORS.text.secondary }}
        >
          {Math.round(state.zoom * 100)}%
        </span>
        <button 
          className="p-1 rounded transition-colors"
          style={{ color: COLORS.text.secondary }}
          onClick={() => dispatch({ 
            type: TIMELINE_ACTIONS.SET_ZOOM, 
            payload: state.zoom + 0.2 
          })}
          title="Zoom In"
        >
          <Plus size={12} />
        </button>
        <div className="w-px h-6 mx-2" style={{ backgroundColor: COLORS.border }} />
        <button 
          className="p-1 rounded transition-colors"
          style={{ color: COLORS.text.secondary }}
          onClick={() => dispatch({ 
            type: TIMELINE_ACTIONS.SET_ZOOM, 
            payload: 1 
          })}
          title="Fit View"
        >
          <Maximize size={12} />
        </button>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const TimelinePanel = ({ playbackState, setPlaybackState, height = 400 }) => {
  // Initialize timeline state with reducer
  const [state, dispatch] = useReducer(timelineReducer, {
    currentFrame: 0,
    totalFrames: TIMELINE_CONSTANTS.DEFAULT_TOTAL_FRAMES,
    fps: TIMELINE_CONSTANTS.DEFAULT_FPS,
    zoom: TIMELINE_CONSTANTS.DEFAULT_ZOOM,
    pixelsPerFrame: TIMELINE_CONSTANTS.BASE_PIXELS_PER_FRAME,
    scrollLeft: 0,
    selectedKeyframes: [],
    autoKeyEnabled: false,
    snappingEnabled: false,
    snapByPercent: false,
    rulerMode: 'dvh', // 'percent' or 'dvh'
    tracks: [
      {
        id: 1,
        name: 'CineCameraActor',
        type: 'camera',
        visible: true,
        locked: false,
        expanded: true,
        icon: Camera,
        color: 'text-blue-400',
        level: 0,
        isGroup: true,
        sections: [],
        keyframes: []
      },
      { 
        id: 11, 
        name: 'Transform', 
        type: 'transform', 
        visible: true, 
        locked: false,
        level: 1,
        isGroup: false,
        parentId: 1,
        sections: [
          { 
            color: 'bg-blue-500',
            keyframes: [
              { frame: 0, value: 0 }, 
              { frame: 30, value: 500 }, 
              { frame: 60, value: 1200 },
              { frame: 120, value: 2000 }
            ]
          }
        ]
      },
      { 
        id: 12, 
        name: 'Current Camera Settings', 
        type: 'camera_settings', 
        visible: true, 
        locked: false,
        level: 1,
        isGroup: false,
        parentId: 1,
        sections: [
          { 
            color: 'bg-cyan-500',
            keyframes: [
              { frame: 0, value: 0 }, 
              { frame: 80, value: 800 }, 
              { frame: 160, value: 1600 }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'SK_Mannequin',
        type: 'character',
        visible: true,
        locked: false,
        expanded: true,
        icon: User,
        color: 'text-green-400',
        level: 0,
        isGroup: true,
        sections: [],
        keyframes: []
      },
      { 
        id: 21, 
        name: 'Animation', 
        type: 'animation', 
        visible: true, 
        locked: false,
        level: 1,
        isGroup: false,
        parentId: 2,
        sections: [
          { 
            color: 'bg-green-500',
            keyframes: [
              { frame: 24, value: 240 }, 
              { frame: 72, value: 720 }, 
              { frame: 144, value: 1440 }
            ]
          }
        ]
      },
      { 
        id: 22, 
        name: 'Transform', 
        type: 'transform', 
        visible: true, 
        locked: false,
        level: 1,
        isGroup: false,
        parentId: 2,
        sections: [
          { 
            color: 'bg-emerald-500',
            keyframes: [
              { frame: 0, value: 0 }, 
              { frame: 60, value: 600 }, 
              { frame: 120, value: 1200 },
              { frame: 180, value: 1800 }
            ]
          }
        ]
      },
      {
        id: 3,
        name: 'DirectionalLight',
        type: 'light',
        visible: true,
        locked: false,
        expanded: false,
        icon: Lightbulb,
        color: 'text-yellow-400',
        level: 0,
        isGroup: true,
        sections: [],
        keyframes: []
      }
    ]
  });

  // Refs for DOM manipulation
  const timelineRef = useRef(null);
  const rulerRef = useRef(null);
  const tracksRef = useRef(null);
  const isDragging = useRef(false);
  const dragTarget = useRef(null);
  const dragStartFrame = useRef(0);

  // Coordinate system calculations
  const timelineWidth = useMemo(() => 
    state.totalFrames * state.pixelsPerFrame, 
    [state.totalFrames, state.pixelsPerFrame]
  );
  
  const frameToPixel = useCallback((frame) => 
    frame * state.pixelsPerFrame, 
    [state.pixelsPerFrame]
  );
  
  const pixelToFrame = useCallback((pixel) => 
    Math.round(pixel / state.pixelsPerFrame), 
    [state.pixelsPerFrame]
  );

  // Get visible tracks based on expansion state
  const visibleTracks = useMemo(() => {
    return state.tracks.filter(track => {
      if (track.level === 0) return true;
      const parent = state.tracks.find(t => t.id === track.parentId);
      return parent && parent.expanded;
    });
  }, [state.tracks]);

  // Visible frame range for virtualization
  const visibleFrameRange = useMemo(() => {
    const viewportWidth = TIMELINE_CONSTANTS.VIEWPORT_WIDTH;
    const buffer = TIMELINE_CONSTANTS.VIRTUALIZATION_BUFFER;
    const startFrame = Math.floor(state.scrollLeft / state.pixelsPerFrame);
    const endFrame = Math.ceil((state.scrollLeft + viewportWidth) / state.pixelsPerFrame);
    return { 
      startFrame: Math.max(0, startFrame - buffer), 
      endFrame: Math.min(state.totalFrames, endFrame + buffer)
    };
  }, [state.scrollLeft, state.pixelsPerFrame, state.totalFrames]);

  // Event handlers
  const handleTimelineScroll = useCallback((e) => {
    const scrollLeft = e.target.scrollLeft;
    dispatch({ type: TIMELINE_ACTIONS.SET_SCROLL_LEFT, payload: scrollLeft });
    
    if (rulerRef.current) {
      rulerRef.current.scrollLeft = scrollLeft;
    }
  }, []);

  const handleRulerScroll = useCallback((e) => {
    const scrollLeft = e.target.scrollLeft;
    dispatch({ type: TIMELINE_ACTIONS.SET_SCROLL_LEFT, payload: scrollLeft });
    
    if (tracksRef.current) {
      tracksRef.current.scrollLeft = scrollLeft;
    }
  }, []);

  const handleFrameClick = useCallback((frame) => {
    dispatch({ type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, payload: frame });
  }, []);

  const handleKeyframeSelect = useCallback((trackId, sectionIndex, keyframeIndex, event) => {
    event.stopPropagation();
    const keyframeId = `${trackId}-${sectionIndex}-${keyframeIndex}`;
    const multiSelect = event.ctrlKey || event.metaKey;
    
    dispatch({ 
      type: TIMELINE_ACTIONS.SELECT_KEYFRAMES, 
      payload: { id: keyframeId, multiSelect }
    });
  }, []);

  // Drag handlers
  const handlePlayheadMouseDown = useCallback((e) => {
    isDragging.current = true;
    dragTarget.current = 'playhead';
    dragStartFrame.current = state.currentFrame;
    
    const handleMouseMove = (e) => {
      if (!isDragging.current || !tracksRef.current) return;
      
      const rect = tracksRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + state.scrollLeft;
      const frame = pixelToFrame(x);
      
      dispatch({ type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, payload: frame });
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      dragTarget.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [state.currentFrame, state.scrollLeft, pixelToFrame]);

  const handleKeyframeMouseDown = useCallback((e, trackId, sectionIndex, keyframeIndex) => {
    e.stopPropagation();
    isDragging.current = true;
    dragTarget.current = { trackId, sectionIndex, keyframeIndex };
    
    const track = state.tracks.find(t => t.id === trackId);
    const keyframe = track?.sections?.[sectionIndex]?.keyframes?.[keyframeIndex];
    dragStartFrame.current = keyframe?.frame || 0;
    
    const handleMouseMove = (e) => {
      if (!isDragging.current || !tracksRef.current) return;
      
      const rect = tracksRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + state.scrollLeft;
      const frame = Math.max(0, Math.min(state.totalFrames - 1, pixelToFrame(x)));
      
      dispatch({ 
        type: TIMELINE_ACTIONS.MOVE_KEYFRAME, 
        payload: { 
          trackId: dragTarget.current.trackId,
          sectionIndex: dragTarget.current.sectionIndex,
          keyframeIndex: dragTarget.current.keyframeIndex,
          newFrame: frame
        }
      });
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      dragTarget.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [state.tracks, state.scrollLeft, state.totalFrames, pixelToFrame]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      const keyMap = {
        ' ': () => {
          e.preventDefault();
          setPlaybackState(playbackState === 'playing' ? 'paused' : 'playing');
        },
        'ArrowLeft': () => {
          e.preventDefault();
          dispatch({ type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, payload: state.currentFrame - 1 });
        },
        'ArrowRight': () => {
          e.preventDefault();
          dispatch({ type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, payload: state.currentFrame + 1 });
        },
        'Home': () => {
          e.preventDefault();
          dispatch({ type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, payload: 0 });
        },
        'End': () => {
          e.preventDefault();
          dispatch({ type: TIMELINE_ACTIONS.SET_CURRENT_FRAME, payload: state.totalFrames - 1 });
        },
        'k': () => {
          e.preventDefault();
          dispatch({ type: TIMELINE_ACTIONS.TOGGLE_AUTO_KEY });
        },
        's': () => {
          e.preventDefault();
          dispatch({ type: TIMELINE_ACTIONS.TOGGLE_SNAPPING });
        },
        'p': () => {
          e.preventDefault();
          dispatch({ type: TIMELINE_ACTIONS.TOGGLE_SNAP_METHOD });
        },
        'r': () => {
          e.preventDefault();
          dispatch({ type: TIMELINE_ACTIONS.TOGGLE_RULER_MODE });
        }
      };
      
      if (keyMap[e.key]) {
        keyMap[e.key]();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [playbackState, setPlaybackState, state.currentFrame, state.totalFrames]);

  // Auto-scroll to follow playhead during playback
  useEffect(() => {
    if (playbackState === 'playing' && tracksRef.current) {
      const playheadPixel = frameToPixel(state.currentFrame);
      const viewportWidth = tracksRef.current.clientWidth;
      const scrollLeft = state.scrollLeft;
      
      if (playheadPixel < scrollLeft || playheadPixel > scrollLeft + viewportWidth) {
        const newScrollLeft = Math.max(0, playheadPixel - viewportWidth / 2);
        tracksRef.current.scrollLeft = newScrollLeft;
        if (rulerRef.current) rulerRef.current.scrollLeft = newScrollLeft;
      }
    }
  }, [state.currentFrame, playbackState, frameToPixel, state.scrollLeft]);

  // Render snap indicators
  const renderSnapIndicators = () => {
    if (!state.snappingEnabled) return null;
    
    const snapPoints = generateSnapPoints(state.totalFrames, state.snapByPercent);
    
    if (state.snapByPercent) {
      return snapPoints.map(frame => {
        const leftPosition = frameToPixel(frame);
        const percent = frame / state.totalFrames;
        
        return (
          <div 
            key={`snap-${frame}`}
            className="absolute top-0 bottom-0 w-px pointer-events-none z-10"
            style={{ 
              left: `${leftPosition}px`,
              borderLeft: `1px dashed ${COLORS.accent.yellow}`,
              opacity: 0.5
            }}
          >
            <div 
              className="absolute -top-6 -translate-x-1/2 text-xs font-mono"
              style={{ color: COLORS.accent.yellow }}
            >
              {percent * 100}%
            </div>
          </div>
        );
      });
    } else {
      return snapPoints
        .filter(frame => 
          frame >= visibleFrameRange.startFrame - 60 && 
          frame <= visibleFrameRange.endFrame + 60 &&
          frame % TIMELINE_CONSTANTS.SNAP_INTERVALS.MAJOR_TICK === 0
        )
        .map(frame => (
          <div 
            key={`snap-${frame}`}
            className="absolute top-0 bottom-0 w-px pointer-events-none z-10"
            style={{ 
              left: `${frameToPixel(frame)}px`,
              borderLeft: `1px dotted ${COLORS.accent.blue}`,
              opacity: 0.3
            }}
          />
        ));
    }
  };

  return (
    <div 
      className="flex flex-col"
      style={{ 
        height: `${height}px`,
        backgroundColor: COLORS.background.dark,
        border: `1px solid ${COLORS.border}`
      }}
    >
      <TimelineStyles />
      
      <TimelineToolbar state={state} dispatch={dispatch} />

      {/* Timeline Header */}
      <div className="flex border-b flex-shrink-0" style={{ borderColor: COLORS.border }}>
        {/* Outliner Header */}
        <div 
          className="flex items-center px-3 flex-shrink-0 border-r"
          style={{ 
            width: `${TIMELINE_CONSTANTS.OUTLINER_WIDTH}px`,
            height: `${TIMELINE_CONSTANTS.RULER_HEIGHT}px`,
            backgroundColor: COLORS.background.header,
            borderColor: COLORS.border
          }}
        >
          <span className="text-xs font-medium" style={{ color: COLORS.text.light }}>
            Outliner
          </span>
          <div className="ml-auto flex items-center gap-1">
            <button 
              className="p-1 rounded transition-colors"
              style={{ color: COLORS.text.secondary }}
              title="Add Track"
            >
              <Plus size={12} />
            </button>
            <button 
              className="p-1 rounded transition-colors"
              style={{ color: COLORS.text.secondary }}
              title="Search"
            >
              <Search size={12} />
            </button>
            <button 
              className="p-1 rounded transition-colors"
              style={{ color: COLORS.text.secondary }}
              title="Filter"
            >
              <Menu size={12} />
            </button>
          </div>
        </div>

        {/* Timeline Ruler */}
        <div 
          ref={rulerRef}
          className="flex-1 relative overflow-x-auto overflow-y-hidden no-scrollbar"
          style={{ 
            height: `${TIMELINE_CONSTANTS.RULER_HEIGHT}px`,
            backgroundColor: COLORS.background.header
          }}
          onScroll={handleRulerScroll}
        >
          <TimelineRuler 
            state={state}
            dispatch={dispatch}
            frameToPixel={frameToPixel}
            handleFrameClick={handleFrameClick}
            handlePlayheadMouseDown={handlePlayheadMouseDown}
            timelineWidth={timelineWidth}
            visibleFrameRange={visibleFrameRange}
          />
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Outliner */}
          <div 
            className="flex-shrink-0 overflow-y-auto border-r"
            style={{ 
              width: `${TIMELINE_CONSTANTS.OUTLINER_WIDTH}px`,
              backgroundColor: COLORS.background.track,
              borderColor: COLORS.border
            }}
          >
            {visibleTracks.map((track) => (
              <TrackRow key={track.id} track={track} dispatch={dispatch} />
            ))}
          </div>

          {/* Timeline Tracks */}
          <div 
            ref={tracksRef}
            className="flex-1 overflow-x-auto overflow-y-auto timeline-scrollbar"
            style={{ backgroundColor: COLORS.background.darker }}
            onScroll={handleTimelineScroll}
          >
            <div style={{ width: `${timelineWidth}px`, position: 'relative' }}>
              {renderSnapIndicators()}
              
              {/* Track Playhead */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 z-20 pointer-events-none"
                style={{ 
                  left: `${frameToPixel(state.currentFrame)}px`,
                  backgroundColor: COLORS.accent.red,
                  opacity: 0.8
                }}
              />

              {/* Track Rows */}
              {visibleTracks.map((track) => {
                // Get track color for background
                const trackColor = track.sections?.[0]?.color || 
                                 (track.isGroup ? null : 'bg-gray-500');
                const backgroundColor = trackColor ? getDarkerColor(trackColor, 'track-bg') : 'transparent';
                
                return (
                  <div 
                    key={track.id}
                    className="relative border-b"
                    style={{ 
                      height: track.isGroup 
                        ? `${TIMELINE_CONSTANTS.TRACK_HEIGHT.GROUP}px` 
                        : `${TIMELINE_CONSTANTS.TRACK_HEIGHT.ITEM}px`,
                      backgroundColor: backgroundColor,
                      borderColor: COLORS.border
                    }}
                  >
                    {!track.isGroup && track.visible && track.sections && track.sections.map((section, sectionIndex) => {
                      const keyframeFrames = section.keyframes.map(kf => kf.frame);
                      const startFrame = Math.min(...keyframeFrames);
                      const endFrame = Math.max(...keyframeFrames);
                      const sectionColor = getDarkerColor(section.color, 'section-bar');
                      
                      return (
                        <div key={sectionIndex}>
                          {/* Section Bar */}
                          <div 
                            className="absolute top-1 bottom-1 cursor-pointer transition-all rounded-sm"
                            style={{ 
                              left: `${frameToPixel(startFrame)}px`,
                              width: `${frameToPixel(endFrame - startFrame)}px`,
                              backgroundColor: sectionColor,
                              border: '1px solid rgba(255,255,255,0.1)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = getHexColor(section.color);
                              e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = sectionColor;
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)';
                            }}
                            title={`${track.name}: ${startFrame} - ${endFrame} (${section.keyframes.length} keyframes)`}
                          />

                          {/* Section Label */}
                          <div 
                            className="absolute top-1/2 transform -translate-y-1/2 text-xs font-medium pointer-events-none"
                            style={{ 
                              left: `${frameToPixel((startFrame + endFrame) / 2)}px`,
                              transform: 'translateX(-50%) translateY(-50%)',
                              color: 'white',
                            }}
                          >
                            {track.name}
                          </div>

                          {/* Keyframes */}
                          {section.keyframes.map((keyframe, keyframeIndex) => {
                            const keyframeId = `${track.id}-${sectionIndex}-${keyframeIndex}`;
                            const isSelected = state.selectedKeyframes.includes(keyframeId);
                            
                            return (
                              <Keyframe
                                key={keyframeIndex}
                                track={track}
                                sectionIndex={sectionIndex}
                                keyframeIndex={keyframeIndex}
                                keyframe={keyframe}
                                isSelected={isSelected}
                                frameToPixel={frameToPixel}
                                handleKeyframeSelect={handleKeyframeSelect}
                                handleKeyframeMouseDown={handleKeyframeMouseDown}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <PlaybackControls 
        state={state}
        dispatch={dispatch}
        playbackState={playbackState}
        setPlaybackState={setPlaybackState}
      />
    </div>
  );
};

export default TimelinePanel;
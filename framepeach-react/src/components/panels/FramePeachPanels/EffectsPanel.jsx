import React, { useRef, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import CustomSlider from '../../controls/CustomSlider';

// Reusable Section Divider Component
const SectionDivider = ({ 
  marginTop = "10px", 
  marginBottom = "15px", 
  width = "120%", 
  marginLeft = "-20px",
  color = "var(--border-primary)" 
}) => (
  <hr 
    style={{
      marginTop,
      marginBottom,
      width,
      marginLeft,
      backgroundColor: color,
      border: 'none',
      height: '1px'
    }} 
  />
);


const EffectsPanel = () => {
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [wireframesEnabled, setWireframesEnabled] = useState(true);
  const [helpersEnabled, setHelpersEnabled] = useState(true);
  const [reductionEnabled, setReductionEnabled] = useState(true);
  const [ambientColor, setAmbientColor] = useState('#FFFFFF');
  const [ambientIntensity, setAmbientIntensity] = useState(3);
  const [antiAliasingEnabled, setAntiAliasingEnabled] = useState(true);
  const [antiAliasingType, setAntiAliasingType] = useState('SMAA');

  const [threshold, setThreshold] = useState(60);
  const [minResPercent, setMinResPercent] = useState(77);
  const [effects, setEffects] = useState({
    main: true,
    bloom: true,
    bloomType: 'Screen',
    bloomIntensity: 100,
    vignette: true,
    vignetteType: 'Normal',
    vignetteIntensity: 100,
    depthOfField: true,
    dofType: 'Normal',
    dofIntensity: 100,
    toneMapping: true,
    toneMappingType: 'Linear',
    hueSaturation: true,
    hueType: 'Normal',
    hueIntensity: 100,
    brightnessContrast: true,
    brightnessType: 'Normal',
    brightnessIntensity: 100,
    pixelation: true,
    pixelationValue: 6,
    noise: true,
    noiseType: 'Screen',
    noiseIntensity: 100,
    colorDepth: true,
    colorDepthType: 'Normal',
    colorDepthIntensity: 100,
    ssao: true,
    ssaoValue: 0.5
  });

  const updateEffect = (key, value) => {
    setEffects(prev => ({ ...prev, [key]: value }));
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
        hidden
      />
      <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );



  const EffectRow = ({ 
    label, 
    enabled, 
    onToggle, 
    hasDropdown = false, 
    dropdownValue = '', 
    onDropdownChange = () => {}, 
    dropdownOptions = [],
    hasSlider = false,
    sliderValue = 100,
    hasValueIncrement = false,
    onSliderChange = () => {},
    hasCustomControl = false,
    customControl = null
  }) => (
    <div className="mb-4">
      {/* Main Toggle Row */}
      <div className="flex items-center justify-between mb-3">
        <label className={label !== "Effects" ? 'text-sm text-gray-300' : "text-sm font-semibold text-white"}>{label}</label>
        <ToggleSwitch checked={enabled} onChange={onToggle} />
      </div>

      {/* Controls Row (when enabled) */}
      {enabled && (hasDropdown || hasSlider || hasCustomControl || hasValueIncrement) && (
        <div className="flex items-center gap-3 ml-2">
          {/* Dropdown */}
          {hasDropdown && (
            <div className="relative flex-1">
              <select
                value={dropdownValue}
                onChange={(e) => onDropdownChange(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
              >
                {dropdownOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* Slider with Percentage */}
          {hasSlider && (
            <>
            <CustomSlider     value={sliderValue}  onChange={(value) => { onSliderChange(value); console.log('target value', value)}}
 />
              <span className="text-sm text-gray-400 w-8 text-right">{sliderValue}%</span>
            </>
          )}

          {/* Value Increment */}
          {hasValueIncrement && (
            <>
              <input
                type="number"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => onSliderChange(parseInt(e.target.value))}
                className="w-12 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none text-center"
              />
            </>
          )}

          {/* Custom Control */}
          {hasCustomControl && customControl}
        </div>
      )}
    </div>
  );
  return (
    <div className="p-4 h-full overflow-y-auto" style={{ background: 'var(--bg-secondary)' }}>
      {/* Ambient Light Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-4 text-white">Ambient Light</h4>
        
        {/* Ambient Toggle */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-gray-300">Ambient</label>
            <div className="flex gap-2">
              <button
                onClick={() => setAmbientEnabled(true)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  ambientEnabled 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setAmbientEnabled(false)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  !ambientEnabled 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">Color</label>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={ambientColor}
                onChange={(e) => setAmbientColor(e.target.value)}
                className="w-8 h-8 rounded border-2 border-gray-600 cursor-pointer"
                style={{ backgroundColor: ambientColor }}
              />
            </div>
            <input
              type="text"
              value={ambientColor}
              onChange={(e) => setAmbientColor(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

  
        {/* Intensity Slider */}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-300">Intensity</label>
            </div>
            <div className="flex items-center gap-3">
             {/* <CustomSlider 
                value={ambientIntensity} 
                onChange={setAmbientIntensity}
                min={-25}
                max={25}
                step={0.1}
              /> */}
              <CustomSlider min={-25} max={25} step={0.1} value={ambientIntensity} onChange={setAmbientIntensity}/>
        
            <input
              type="number"
              value={ambientIntensity}
              onChange={(e) => setAmbientIntensity(Math.max(0, Math.min(10, parseFloat(e.target.value) || 0)))}
              className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
              min="0"
              max="10"
              step="0.1"
            />
          </div>
       
      </div>
      </div>
      <SectionDivider />
      {/* Anti-Aliasing Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-sm font-semibold text-white">Anti-Aliasing</h4>
          <HelpCircle size={14} className="text-gray-400 cursor-help" title="Smooths jagged edges in 3D rendering" />
        </div>

        {/* Anti-Aliasing Toggle */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-300">Enable</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={antiAliasingEnabled}
              onChange={(e) => setAntiAliasingEnabled(e.target.checked)}
              className="sr-only peer"
              hidden
            />
            <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Anti-Aliasing Type Dropdown */}
        {antiAliasingEnabled && (
          <div>
            <label className="block text-sm text-gray-300 mb-2">Type</label>
            <div className="relative">
              <select
                value={antiAliasingType}
                onChange={(e) => setAntiAliasingType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="SMAA">SMAA</option>
                <option value="MSAA">MSAA</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
      <SectionDivider />
      {/* Additional Lighting Options */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-4 text-white">Global Settings</h4>
        
        {/* Environment Lighting */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-gray-300">Wireframes</label>
            <div className="flex gap-2">
            <button
                onClick={() => setWireframesEnabled(true)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  wireframesEnabled 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setWireframesEnabled(false)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  !wireframesEnabled 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                No
              </button>
              </div>
          </div>
        </div>

        {/* For Helpers */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-gray-300">Helpers</label>
            <div className="flex gap-2">
            <button
                onClick={() => setHelpersEnabled(true)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  helpersEnabled 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setHelpersEnabled(false)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  !helpersEnabled 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                No
              </button>
              </div>
          </div>
        </div>

      
      </div>
    <SectionDivider />
      {/* Auto Resolution Section */}
    
      <div className="mb-6">
      {/* Auto Resolution Header with Help Icon */}
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-sm font-semibold text-white">Auto Resolution</h4>
        <HelpCircle 
          size={14} 
          className="text-gray-400 cursor-help" 
          title="Automatically adjusts rendering resolution based on performance"
        />
      </div>

      {/* Reduction Toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm text-gray-300">Reduction</label>
          <div className="flex gap-2">
            <button
              onClick={() => setReductionEnabled(false)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                !reductionEnabled 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              No
            </button>
            <button
              onClick={() => setReductionEnabled(true)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                reductionEnabled 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
      {reductionEnabled && (<>
      {/* Threshold Control */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-300">Threshold</label>
          <div className="flex items-center gap-2">
            {/* <span className="text-sm text-gray-400">{threshold}</span> */}
            <div className="relative">
              <select
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer pr-6"
                style={{ minWidth: '60px' }}
              >
                <option value={30}>30</option>
                <option value={60}>60</option>
                <option value={90}>90</option>
                <option value={120}>120</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Min Res % Control */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-300">Min Res %</label>
          </div>
        <div className="flex items-center gap-3">
           {/* <CustomSlider 
                value={minResPercent} 
                onChange={setMinResPercent}
                min={0}
                max={100}
                step={1}
              /> */}
              <CustomSlider   min={0} 
                max={100} 
                step={1} 
                value={minResPercent} 
                onChange={setMinResPercent}/>
          <input
            type="number"
            value={minResPercent}
            onChange={(e) => setMinResPercent(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
            className="w-12 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none text-center"
            min="0"
            max="100"
          />
        </div>
       
      </div> </>)}
      </div>
      <SectionDivider />

      {/* Post-Processing Effects Section */}
      <div className="mb-6">
        {/* Main Effects Toggle */}
        <EffectRow
          label="Effects"
          enabled={effects.main}
          onToggle={(value) => updateEffect('main', value)}
          
        />

        {effects.main && (
          <div className="space-y-4">
            {/* Bloom */}
            <EffectRow
              label="Bloom"
              enabled={effects.bloom}
              onToggle={(value) => updateEffect('bloom', value)}
              hasDropdown={true}
              dropdownValue={effects.bloomType}
              onDropdownChange={(value) => updateEffect('bloomType', value)}
              dropdownOptions={['Screen', 'Add', 'Multiply', 'Overlay']}
              hasSlider={false}
              hasValueIncrement={true}
              sliderValue={effects.bloomIntensity}
              onSliderChange={(value) => updateEffect('bloomIntensity', value)}
            />

            {/* Vignette */}
            <EffectRow
              label="Vignette"
              enabled={effects.vignette}
              onToggle={(value) => updateEffect('vignette', value)}
              hasDropdown={true}
              dropdownValue={effects.vignetteType}
              onDropdownChange={(value) => updateEffect('vignetteType', value)}
              dropdownOptions={['Normal', 'Soft', 'Hard', 'Gradient']}
              hasSlider={false}
              hasValueIncrement={true}
              sliderValue={effects.vignetteIntensity}
              onSliderChange={(value) => updateEffect('vignetteIntensity', value)}
            />

            {/* Depth of Field */}
            <EffectRow
              label="Depth Of Field"
              enabled={effects.depthOfField}
              onToggle={(value) => updateEffect('depthOfField', value)}
              hasDropdown={true}
              dropdownValue={effects.dofType}
              onDropdownChange={(value) => updateEffect('dofType', value)}
              dropdownOptions={['Normal', 'Bokeh', 'Gaussian', 'Cinematic']}
              hasSlider={false}
              hasValueIncrement={true}
              sliderValue={effects.dofIntensity}
              onSliderChange={(value) => updateEffect('dofIntensity', value)}
            />

            {/* Tone Mapping */}
            <EffectRow
              label="Tone Mapping"
              enabled={effects.toneMapping}
              onToggle={(value) => updateEffect('toneMapping', value)}
              hasSlider={false}
              hasDropdown={true}
              hasValueIncrement={true}
              dropdownValue={effects.toneMappingType}
              onDropdownChange={(value) => updateEffect('toneMappingType', value)}
              
              dropdownOptions={['Linear', 'Reinhard', 'Cineon', 'ACES', 'Uncharted2']}
            />

            {/* Hue Saturation */}
            <EffectRow
              label="Hue Saturation"
              enabled={effects.hueSaturation}
              onToggle={(value) => updateEffect('hueSaturation', value)}
              hasDropdown={true}
              dropdownValue={effects.hueType}
              onDropdownChange={(value) => updateEffect('hueType', value)}
              dropdownOptions={['Normal', 'Vibrant', 'Desaturated', 'Monochrome']}
              hasSlider={false}
              hasValueIncrement={true}
              sliderValue={effects.hueIntensity}
              onSliderChange={(value) => updateEffect('hueIntensity', value)}
            />

            {/* Brightness Contrast */}
            <EffectRow
              label="Brightness Contrast"
              enabled={effects.brightnessContrast}
              onToggle={(value) => updateEffect('brightnessContrast', value)}
              hasDropdown={true}
              dropdownValue={effects.brightnessType}
              onDropdownChange={(value) => updateEffect('brightnessType', value)}
              dropdownOptions={['Normal', 'High Contrast', 'Low Contrast', 'Vintage']}
              hasSlider={false}
              hasValueIncrement={true}
              sliderValue={effects.brightnessIntensity}
              onSliderChange={(value) => updateEffect('brightnessIntensity', value)}
            />

            {/* Pixelation */}
            <EffectRow
              label="Pixelation"
              enabled={effects.pixelation}
              onToggle={(value) => updateEffect('pixelation', value)}
              hasCustomControl={true}
              hasSlider={true}
              sliderValue={effects.pixelationValue}
              onSliderChange={(value) => updateEffect('pixelationValue', value)}
            />

            {/* Noise */}
            <EffectRow
              label="Noise"
              enabled={effects.noise}
              onToggle={(value) => updateEffect('noise', value)}
              hasDropdown={true}
              dropdownValue={effects.noiseType}
              onDropdownChange={(value) => updateEffect('noiseType', value)}
              dropdownOptions={['Screen', 'Overlay', 'Film Grain', 'Digital']}
              hasSlider={false}
              hasValueIncrement={true}
              sliderValue={effects.noiseIntensity}
              onSliderChange={(value) => updateEffect('noiseIntensity', value)}
            />

            {/* Color Depth */}
            <EffectRow
              label="Color Depth"
              enabled={effects.colorDepth}
              onToggle={(value) => updateEffect('colorDepth', value)}
              hasDropdown={true}
              dropdownValue={effects.colorDepthType}
              onDropdownChange={(value) => updateEffect('colorDepthType', value)}
              dropdownOptions={['Normal', '8-bit', '16-bit', 'Posterize']}
              hasSlider={false}
              hasValueIncrement={true}
              sliderValue={effects.colorDepthIntensity}
              onSliderChange={(value) => updateEffect('colorDepthIntensity', value)}
            />

            {/* SSAO */}
            <EffectRow
              label="SSAO"
              enabled={effects.ssao}
              onToggle={(value) => updateEffect('ssao', value)}
              hasCustomControl={true}
              hasSlider={true}
              sliderValue={effects.ssaoValue}
              onSliderChange={(value) => updateEffect('ssaoValue', value)}
  
            />
          </div>
        )}
      </div>

      
      <style jsx>{`
        .slider {
          background-color: #4B5563;
          border-radius: 10px;
          height: 10px;
          outline: none;
          transition: all 0.2s ease;
          appearance: none;
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 3px;
          background: #3B82F6;
          cursor: pointer;
          border: 1px solid #1E40AF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          background: #2563EB;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }
        
        .slider::-webkit-slider-track {
          background: #4B5563;
          border-radius: 4px;
          height: 6px;
        }
        
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 3px;
          background: #3B82F6;
          cursor: pointer;
          border: 1px solid #1E40AF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          background: #2563EB;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }
        
        .slider::-moz-range-track {
          background: #4B5563;
          border-radius: 4px;
          height: 6px;
          border: none;
        }
        
        .slider::-moz-range-progress {
          background: #3B82F6;
          border-radius: 4px;
          height: 6px;
        }
      `}</style>
    </div>
  );
};

export default EffectsPanel;
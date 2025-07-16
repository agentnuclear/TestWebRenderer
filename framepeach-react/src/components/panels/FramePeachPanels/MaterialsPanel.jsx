import React, { useState, useEffect } from 'react';
import { Plus, Save, HelpCircle, ChevronDown, X, Image as ImageIcon, Folder } from 'lucide-react';
import CustomSlider from '../../controls/CustomSlider';
import CustomSliderWithNumber from '../../controls/CustomSliderWithNumber';
import { RadioGroup } from '../../controls/RadioGroup';

const MaterialsPanel = ({ materialNodes }) => {
  // Track selected object
  const [selectedObject, setSelectedObject] = useState(null);
  
  // Material state - will be synced with selected object
  const [materialName, setMaterialName] = useState('Default Material');
  const [transparent, setTransparent] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [alphaTest, setAlphaTest] = useState(0);
  const [texture, setTexture] = useState(0);
  const [ambient, setAmbient] = useState(0);
  const [environment, setEnvironment] = useState(0);
  const [intensity, setIntensity] = useState(0);
  const [map, setMap] = useState(0);
  const [metal, setMetal] = useState(30);
  const [rough, setRough] = useState(30);
  const [normal, setNormal] = useState(0);
  const [color, setColor] = useState('#FFFFFF');
  const [side, setSide] = useState('FRONT');
  const [materialType, setMaterialType] = useState('LIT');
  const [flatShading, setFlatShading] = useState(false);
  const [emissionIntensity, setEmissionIntensity] = useState(100);
  const [emissionColor, setEmissionColor] = useState('#000000');
  const [aoIntensity, setAoIntensity] = useState(100);
  const [displacement, setDisplacement] = useState(1);
  const [highFidelity, setHighFidelity] = useState(false);
  const [iridescence, setIridescence] = useState(0);
  const [refraction, setRefraction] = useState(1.5);
  const [sheen, setSheen] = useState(0);
  const [roughness, setRoughness] = useState(0);
  const [sheenRoughness, setSheenRoughness] = useState(0);
  const [sheenColor, setSheenColor] = useState('#FFFFFF');
  const [specularIntensity, setSpecularIntensity] = useState(100);
  const [specularColor, setSpecularColor] = useState('#FFFFFF');
  const [clearCoat, setClearCoat] = useState(0);
  const [clearCoatRoughness, setClearCoatRoughness] = useState(0);
  const [transmission, setTransmission] = useState(0);
  const [attenuationDistance, setAttenuationDistance] = useState(0);
  const [attenuationColor, setAttenuationColor] = useState('#FFFFFF');
  const [reflectivity, setReflectivity] = useState(0);

  // New state for texture maps
  const [textureMap, setTextureMap] = useState(null);
  const [alphaMap, setAlphaMap] = useState(null);
  const [emissionMap, setEmissionMap] = useState(null);
  const [normalMap, setNormalMap] = useState(null);
  const [roughnessMap, setRoughnessMap] = useState(null);
  const [metalnessMap, setMetalnessMap] = useState(null);
  const [aoMap, setAoMap] = useState(null);
  const [displacementMap, setDisplacementMap] = useState(null);
  const [environmentMap, setEnvironmentMap] = useState(null);

  // Asset picker state
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [assetPickerType, setAssetPickerType] = useState(null);
  const [availableTextures, setAvailableTextures] = useState([]);

  // Listen for object selection events
  useEffect(() => {
    const handleObjectSelection = (e) => {
      const object = e.detail;
      console.log("MaterialsPanel received selected object:", object);
      setSelectedObject(object);
      
      // Load material properties from selected object
      if (object && object.material && object.material.properties) {
        const mat = object.material.properties;
        setMaterialName(object.material.name || `${object.name} Material`);
        setTransparent(mat.transparent || false);
        setOpacity(mat.opacity || 100);
        setColor(mat.color || '#FFFFFF');
        setMetal(mat.metalness || 30);
        setRough(mat.roughness || 30);
        setAlphaTest(mat.alphaTest || 0);
        setTexture(mat.texture || 0);
        setAmbient(mat.ambient || 0);
        setEnvironment(mat.environment || 0);
        setIntensity(mat.intensity || 0);
        setMap(mat.map || 0);
        setNormal(mat.normal || 0);
        setSide(mat.side || 'FRONT');
        setMaterialType(mat.materialType || 'LIT');
        setFlatShading(mat.flatShading || false);
        setEmissionIntensity(mat.emissionIntensity || 100);
        setEmissionColor(mat.emissionColor || '#000000');
        setAoIntensity(mat.aoIntensity || 100);
        setDisplacement(mat.displacement || 1);
        setHighFidelity(mat.highFidelity || false);

        // Load texture maps
        setTextureMap(mat.textureMap || null);
        setAlphaMap(mat.alphaMap || null);
        setEmissionMap(mat.emissionMap || null);
        setNormalMap(mat.normalMap || null);
        setRoughnessMap(mat.roughnessMap || null);
        setMetalnessMap(mat.metalnessMap || null);
        setAoMap(mat.aoMap || null);
        setDisplacementMap(mat.displacementMap || null);
        setEnvironmentMap(mat.environmentMap || null);
      } else if (object) {
        // Reset to defaults for objects without materials
        setMaterialName(`${object.name} Material`);
        setTransparent(false);
        setOpacity(100);
        setColor('#FFFFFF');
        setMetal(30);
        setRough(30);
        setAlphaTest(0);
        setTexture(0);
        setAmbient(0);
        setEnvironment(0);
        setIntensity(0);
        setMap(0);
        setNormal(0);
        setSide('FRONT');
        setMaterialType('LIT');
        setFlatShading(false);
        setEmissionIntensity(100);
        setEmissionColor('#000000');
        setAoIntensity(100);
        setDisplacement(1);
        setHighFidelity(false);

        // Reset texture maps
        setTextureMap(null);
        setAlphaMap(null);
        setEmissionMap(null);
        setNormalMap(null);
        setRoughnessMap(null);
        setMetalnessMap(null);
        setAoMap(null);
        setDisplacementMap(null);
        setEnvironmentMap(null);
      }
    };

    window.addEventListener('objectSelected', handleObjectSelection);
    
    return () => {
      window.removeEventListener('objectSelected', handleObjectSelection);
    };
  }, []);

  // Listen for asset data from AssetsPanel
  useEffect(() => {
    const handleAssetData = (e) => {
      const textures = e.detail.textures || [];
      const videos = e.detail.videos || [];
      
      console.log('MaterialsPanel received assets:', { textures, videos });
      
      // Combine textures and videos for material use
      const allMediaAssets = [...textures, ...videos];
      console.log('Combined media assets:', allMediaAssets);
      setAvailableTextures(allMediaAssets);
    };

    // Request asset data on mount
    const requestEvent = new CustomEvent('requestAssetData');
    window.dispatchEvent(requestEvent);

    window.addEventListener('assetDataResponse', handleAssetData);
    
    return () => {
      window.removeEventListener('assetDataResponse', handleAssetData);
    };
  }, []);

  // Update material properties when values change
  const updateMaterialProperty = (property, value) => {
    if (!selectedObject) return;
    
    const materialUpdate = {
      objectId: selectedObject.id,
      property,
      value
    };
    
    // Dispatch material update event
    const materialUpdateEvent = new CustomEvent('materialUpdated', {
      detail: materialUpdate
    });
    window.dispatchEvent(materialUpdateEvent);
  };

  // Handle texture map assignment
  const assignTextureMap = (assetData) => {
    console.log('Assigning texture map:', assetPickerType, assetData);
    
    switch (assetPickerType) {
      case 'map':
        setTextureMap(assetData);
        updateMaterialProperty('textureMap', assetData);
        break;
      case 'alpha':
        setAlphaMap(assetData);
        updateMaterialProperty('alphaMap', assetData);
        break;
      case 'emission':
        setEmissionMap(assetData);
        updateMaterialProperty('emissionMap', assetData);
        break;
      case 'normal':
        setNormalMap(assetData);
        updateMaterialProperty('normalMap', assetData);
        break;
      case 'roughness':
        setRoughnessMap(assetData);
        updateMaterialProperty('roughnessMap', assetData);
        break;
      case 'metalness':
        setMetalnessMap(assetData);
        updateMaterialProperty('metalnessMap', assetData);
        break;
      case 'ao':
        setAoMap(assetData);
        updateMaterialProperty('aoMap', assetData);
        break;
      case 'displacement':
        setDisplacementMap(assetData);
        updateMaterialProperty('displacementMap', assetData);
        break;
      case 'environment':
        setEnvironmentMap(assetData);
        updateMaterialProperty('environmentMap', assetData);
        break;
    }
    setShowAssetPicker(false);
    setAssetPickerType(null);
  };

  // Remove texture map
  const removeTextureMap = (type) => {
    switch (type) {
      case 'map':
        setTextureMap(null);
        updateMaterialProperty('textureMap', null);
        break;
      case 'alpha':
        setAlphaMap(null);
        updateMaterialProperty('alphaMap', null);
        break;
      case 'emission':
        setEmissionMap(null);
        updateMaterialProperty('emissionMap', null);
        break;
      case 'normal':
        setNormalMap(null);
        updateMaterialProperty('normalMap', null);
        break;
      case 'roughness':
        setRoughnessMap(null);
        updateMaterialProperty('roughnessMap', null);
        break;
      case 'metalness':
        setMetalnessMap(null);
        updateMaterialProperty('metalnessMap', null);
        break;
      case 'ao':
        setAoMap(null);
        updateMaterialProperty('aoMap', null);
        break;
      case 'displacement':
        setDisplacementMap(null);
        updateMaterialProperty('displacementMap', null);
        break;
      case 'environment':
        setEnvironmentMap(null);
        updateMaterialProperty('environmentMap', null);
        break;
    }
  };

  // Wrapper functions to update both local state and dispatch events
  const handleOpacityChange = (value) => {
    setOpacity(value);
    updateMaterialProperty('opacity', value);
  };

  const handleColorChange = (value) => {
    setColor(value);
    updateMaterialProperty('color', value);
  };

  const handleMetalnessChange = (value) => {
    setMetal(value);
    updateMaterialProperty('metalness', value);
  };

  const handleRoughnessChange = (value) => {
    setRough(value);
    updateMaterialProperty('roughness', value);
  };

  const handleTransparentChange = (value) => {
    setTransparent(value);
    updateMaterialProperty('transparent', value);
  };

  const handleAlphaTestChange = (value) => {
    setAlphaTest(value);
    updateMaterialProperty('alphaTest', value);
  };

  const handleTextureChange = (value) => {
    setTexture(value);
    updateMaterialProperty('texture', value);
  };

  const handleAmbientChange = (value) => {
    setAmbient(value);
    updateMaterialProperty('ambient', value);
  };

  const handleEnvironmentChange = (value) => {
    setEnvironment(value);
    updateMaterialProperty('environment', value);
  };

  const handleIntensityChange = (value) => {
    setIntensity(value);
    updateMaterialProperty('intensity', value);
  };

  const handleMapChange = (value) => {
    setMap(value);
    updateMaterialProperty('map', value);
  };

  const handleNormalChange = (value) => {
    setNormal(value);
    updateMaterialProperty('normal', value);
  };

  const handleDisplacementChange = (value) => {
    setDisplacement(value);
    updateMaterialProperty('displacement', value);
  };

  const handleAoIntensityChange = (value) => {
    setAoIntensity(value);
    updateMaterialProperty('aoIntensity', value);
  };

  const SliderWithInput = ({ value, onChange, min = 0, max = 100, step = 1 }) => (
    <div className="flex flex-nowrap gap-2 items-center">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center overflow-hidden bg-gray-600 rounded-md border-2 border-transparent focus-within:border-blue-500 w-fit">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex flex-1 box-content p-1.5 min-w-4 h-4 text-gray-200 bg-transparent placeholder:text-gray-300 focus:text-gray-200 focus:outline-none w-7 text-xs"
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>
      <div className="relative rounded-md bg-gray-600 overflow-hidden group w-full h-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-full appearance-none bg-transparent cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((value - min) / (max - min)) * 100}%, #4B5563 ${((value - min) / (max - min)) * 100}%, #4B5563 100%)`
          }}
        />
        <div 
          className="absolute top-1/2 w-3 h-3 bg-gray-400 rounded-full -translate-y-1/2 pointer-events-none group-hover:bg-gray-300 transition-colors"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 6px)` }}
        />
      </div>
    </div>
  );

  const ColorPicker = ({ label, value, onChange }) => (
    <div className="flex flex-1 items-center justify-between min-w-0">
      <h5 className="text-xs font-semibold text-gray-300 mr-2 break-words flex gap-0.5 select-none min-w-20">{label}</h5>
      <div className="flex flex-1 items-center gap-1 justify-end min-w-0">
        <div 
          className="h-8 aspect-square rounded-md bg-gray-800 border-gray-500 border cursor-pointer"
          onClick={() => document.getElementById(`color-${label}`).click()}
        >
          <div 
            className="w-full h-full rounded-md shadow-inner" 
            style={{ backgroundColor: value }}
          />
          <input
            id={`color-${label}`}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="hidden"
          />
        </div>
        <div className="flex flex-nowrap gap-2 items-center flex-1">
          <div className="flex flex-1 flex-col">
            <div className="flex items-center overflow-hidden bg-gray-600 rounded-md border-2 border-transparent focus-within:border-blue-500 flex-1">
              <div className="text-xs pl-2 text-gray-300">#</div>
              <input
                value={value.replace('#', '')}
                onChange={(e) => onChange(`#${e.target.value}`)}
                className="flex flex-1 box-content p-1.5 min-w-4 h-4 text-gray-200 bg-transparent placeholder:text-gray-300 focus:text-gray-200 focus:outline-none w-0 pl-1 text-xs"
                maxLength={6}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced TextureButton with asset preview
  const TextureButton = ({ type, currentMap, onSelect, onRemove }) => {
    const hasTexture = currentMap !== null;
    
    const renderTexturePreview = () => {
      if (!hasTexture) {
        // No texture assigned - show checkerboard pattern
        return (
          <div className="w-full h-full bg-checkerboard opacity-60" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='8' height='8'%3e%3crect fill='%23ffffff' width='4' height='4'/%3e%3crect fill='%23cccccc' x='4' y='4' width='4' height='4'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23a)'/%3e%3c/svg%3e")`,
            backgroundSize: '8px 8px'
          }} />
        );
      }

      // Has texture assigned
      if (currentMap.type === 'videos') {
        // Video asset
        if (currentMap.thumbnail) {
          // Video has a thumbnail
          return (
            <div className="w-full h-full relative">
              <img 
                src={currentMap.thumbnail} 
                alt={currentMap.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 rounded-bl">
                VID
              </div>
            </div>
          );
        } else {
          // Video without thumbnail - show video icon
          return (
            <div className="w-full h-full bg-purple-600 flex flex-col items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white mb-1">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span className="text-xs text-white">VID</span>
            </div>
          );
        }
      } else {
        // Image/texture asset
        if (currentMap.thumbnail) {
          // Image has a thumbnail
          return (
            <img 
              src={currentMap.thumbnail} 
              alt={currentMap.name}
              className="w-full h-full object-cover"
            />
          );
        } else {
          // Image without thumbnail - show image icon
          return (
            <div className="w-full h-full bg-green-600 flex items-center justify-center">
              <ImageIcon size={12} className="text-white" />
            </div>
          );
        }
      }
    };
    
    return (
      <div className="flex items-center gap-1">
        <button 
          className="flex h-8 min-w-8 max-w-8 rounded-md overflow-hidden items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors relative"
          onClick={() => {
            setAssetPickerType(type);
            setShowAssetPicker(true);
          }}
          title={`Select ${type} ${hasTexture && currentMap.type === 'videos' ? 'video' : 'texture'}`}
        >
          {renderTexturePreview()}
        </button>
        
        {hasTexture && (
          <button
            className="w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
            onClick={() => onRemove(type)}
            title={`Remove ${type} ${currentMap.type === 'videos' ? 'video' : 'texture'}`}
          >
            <X size={8} />
          </button>
        )}
      </div>
    );
  };

  const PropertyRow = ({ label, children, helpText }) => (
    <div className="flex flex-1 items-center justify-between min-w-0 mb-2">
      <h5 className="text-xs font-semibold text-gray-300 mr-2 break-words flex gap-0.5 select-none min-w-20">
        {label}
        {helpText && (
          <div className="w-4 h-4 pointer-events-auto">
            <HelpCircle className="w-4 h-4 text-white opacity-60 hover:opacity-100" />
          </div>
        )}
      </h5>
      <div className="flex flex-1 items-center gap-1 justify-end min-w-0">
        {children}
      </div>
    </div>
  );

  const SectionHeader = ({ title }) => (
    <div className="flex flex-1 justify-between items-center mb-3">
      <div className="flex gap-1">
        <h3 className="text-gray-200 select-none text-sm font-bold">{title}</h3>
      </div>
    </div>
  );

  // Show message if no object is selected
  if (!selectedObject) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="text-gray-400 text-center">
          <h4 className="text-sm font-semibold mb-2">No Object Selected</h4>
          <p className="text-xs">Select an object to edit its material properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Material Editor Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-200">Material</h4>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-400">
              {selectedObject.name}
            </div>
            <div className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 text-xs">Add to Library</div>
            <button className="p-1 hover:bg-gray-600 rounded text-xs">
              <Plus size={14} />
            </button>
            <button className="p-1 hover:bg-gray-600 rounded text-xs">
              <Save size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Material Preview */}
        <div className="w-full h-36 border border-gray-500 rounded-md mb-4 bg-gray-900">
          <div className="w-full h-full object-contain p-4" style={{
            background: 'linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}>
            <div 
              className="w-full h-full rounded border border-gray-600 flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: color }}
            >
              {textureMap && textureMap.thumbnail && (
                <img 
                  src={textureMap.thumbnail} 
                  alt="Material preview"
                  className="w-full h-full object-cover opacity-80"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xs text-white opacity-80 mix-blend-difference bg-black bg-opacity-30 px-2 py-1 rounded">
                  {selectedObject.name} Material
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Material Name */}
        <PropertyRow label="Name">
          <div className="flex flex-nowrap gap-2 items-center flex-1">
            <div className="flex flex-1 flex-col">
              <div className="flex items-center overflow-hidden bg-gray-600 rounded-md border-2 border-transparent focus-within:border-blue-500 flex-1">
                <input
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="flex flex-1 box-content p-1.5 min-w-4 h-4 text-gray-200 bg-transparent placeholder:text-gray-300 focus:text-gray-200 focus:outline-none w-0 text-xs"
                  maxLength={256}
                  placeholder="Material name"
                />
              </div>
            </div>
          </div>
        </PropertyRow>

        {/* Properties Section */}
        <div className="border-gray-500 select-none border-b pb-4">
          <SectionHeader title="Properties" />
          <div className="space-y-2">
            {/* Transparent */}
            <PropertyRow label="Transparent">
              <RadioGroup
                value={transparent}
                onChange={handleTransparentChange}
                options={[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' }
                ]}
              />
            </PropertyRow>

            {/* Opacity */}
            <PropertyRow label="Opacity">
              <div className="flex-1">
                <CustomSliderWithNumber 
                  value={opacity} 
                  onChange={handleOpacityChange}
                  max={100}
                />
              </div>
            </PropertyRow>

            {/* Alpha Test */}
            <PropertyRow label="Alpha Test" helpText="Alpha cutoff threshold">
              <div className="flex-1">
                <CustomSliderWithNumber 
                  value={alphaTest} 
                  onChange={handleAlphaTestChange}
                  max={100}
                />
              </div>
            </PropertyRow>

            {/* Color */}
            <ColorPicker label="Color" value={color} onChange={handleColorChange} />

            {/* Side */}
            <PropertyRow label="Side">
              <div className="relative flex flex-1 min-w-0">
                <select 
                  value={side}
                  onChange={(e) => {
                    setSide(e.target.value);
                    updateMaterialProperty('side', e.target.value);
                  }}
                  className="relative inline-block text-left w-full h-8 border-2 border-transparent focus:border-blue-500 rounded-md appearance-none bg-gray-600 text-white text-ellipsis px-2 pr-6 cursor-pointer outline-none hover:bg-gray-500 text-xs"
                >
                  <option value="FRONT">Front</option>
                  <option value="BACK">Back</option>
                  <option value="DOUBLE">Double</option>
                </select>
                <ChevronDown className="absolute right-2 inset-y-0 my-auto pointer-events-none w-4 h-4 text-white" />
              </div>
            </PropertyRow>
          </div>
        </div>

        {/* Texture Section */}
        <div className="border-gray-500 select-none border-b pb-4">
          <SectionHeader title="Texture" />
          <div className="space-y-2">
            <PropertyRow label="Map">
              <div className="flex flex-row-reverse gap-2 items-center w-full">
                <TextureButton 
                  type="map"
                  currentMap={textureMap}
                  onSelect={() => {
                    setAssetPickerType('map');
                    setShowAssetPicker(true);
                  }}
                  onRemove={removeTextureMap}
                />
              </div>
            </PropertyRow>

            <PropertyRow label="Alpha">
              <div className="flex flex-row-reverse gap-2 items-center w-full">
                <TextureButton 
                  type="alpha"
                  currentMap={alphaMap}
                  onSelect={() => {
                    setAssetPickerType('alpha');
                    setShowAssetPicker(true);
                  }}
                  onRemove={removeTextureMap}
                />
              </div>
            </PropertyRow>

            <PropertyRow label="Ambient Occlusion">
              <div className="flex flex-row-reverse gap-2 items-center w-full">
                <TextureButton 
                  type="ao"
                  currentMap={aoMap}
                  onSelect={() => {
                    setAssetPickerType('ao');
                    setShowAssetPicker(true);
                  }}
                  onRemove={removeTextureMap}
                />
                <div className="flex-1">
                  <CustomSliderWithNumber 
                    value={ambient} 
                    onChange={handleAmbientChange}
                    max={100}
                  />
                </div>
              </div>
            </PropertyRow>

            <PropertyRow label="Environment">
              <div className="flex flex-row-reverse gap-2 items-center w-full">
                <TextureButton 
                  type="environment"
                  currentMap={environmentMap}
                  onSelect={() => {
                    setAssetPickerType('environment');
                    setShowAssetPicker(true);
                  }}
                  onRemove={removeTextureMap}
                />
                <div className="flex-1">
                  <CustomSliderWithNumber 
                    value={environment} 
                    onChange={handleEnvironmentChange}
                    max={100}
                  />
                </div>
              </div>
            </PropertyRow>
          </div>
        </div>

        {/* Additional Properties */}
        <div className="border-gray-500 select-none border-b pb-4">
          <SectionHeader title="Additional Properties" />
          <div className="space-y-2">
            <PropertyRow label="Material Type">
              <div className="relative flex flex-1 min-w-0">
                <select 
                  value={materialType}
                  onChange={(e) => {
                    setMaterialType(e.target.value);
                    updateMaterialProperty('materialType', e.target.value);
                  }}
                  className="relative inline-block text-left w-full h-8 border-2 border-transparent focus:border-blue-500 rounded-md appearance-none bg-gray-600 text-white text-ellipsis px-2 pr-6 cursor-pointer outline-none hover:bg-gray-500 text-xs"
                >
                  <option value="LIT">Standard</option>
                  <option value="UNLIT">Basic</option>
                  <option value="PHONG">Phong</option>
                </select>
                <ChevronDown className="absolute right-2 inset-y-0 my-auto pointer-events-none w-4 h-4 text-white" />
              </div>
            </PropertyRow>

            <PropertyRow label="Flat Shading">
              <RadioGroup
                value={flatShading}
                onChange={(value) => {
                  setFlatShading(value);
                  updateMaterialProperty('flatShading', value);
                }}
                options={[
                  { value: false, label: 'No' },
                  { value: true, label: 'Yes' }
                ]}
              />
            </PropertyRow>
          </div>
        </div>

        {/* Emission Section */}
        <div className="border-gray-500 select-none border-b pb-4">
          <SectionHeader title="Emission" />
          <div className="space-y-2">
            <PropertyRow label="Intensity">
              <div className="flex-1">
                <CustomSliderWithNumber 
                  value={intensity} 
                  onChange={(value)=>updateMaterialProperty('emissionIntensity', value) }
                  max={100}
                />
              </div>
            </PropertyRow>
            <ColorPicker 
              label="Color" 
              value={emissionColor} 
              onChange={(value) => {
                setEmissionColor(value);
                updateMaterialProperty('emissionColor', value);
              }} 
            />
            <PropertyRow label="Map">
              <div className="flex flex-row-reverse gap-2 items-center w-full">
                <TextureButton 
                  type="emission"
                  currentMap={emissionMap}
                  onSelect={() => {
                    setAssetPickerType('emission');
                    setShowAssetPicker(true);
                  }}
                  onRemove={removeTextureMap}
                />
                <div className="flex-1">
                  <CustomSliderWithNumber 
                    value={map} 
                    onChange={handleMapChange}
                    max={100}
                  />
                </div>
              </div>
            </PropertyRow>
          </div>
        </div>

        {/* Advanced Texture Properties */}
        <div className="border-gray-500 select-none border-b pb-4">
          <SectionHeader title="Advanced Textures" />
          <div className="space-y-2">
            <PropertyRow label="Displacement">
              <div className="flex flex-row-reverse gap-2 items-center w-full">
                <TextureButton 
                  type="displacement"
                  currentMap={displacementMap}
                  onSelect={() => {
                    setAssetPickerType('displacement');
                    setShowAssetPicker(true);
                  }}
                  onRemove={removeTextureMap}
                />
                <div className="flex-1">
                  <CustomSliderWithNumber 
                    value={displacement} 
                    onChange={handleDisplacementChange}
                    min={0}
                    max={2}
                    step={0.1}
                  />
                </div>
              </div>
            </PropertyRow>

            <PropertyRow label="Metalness">
              <div className="flex flex-row-reverse gap-2 items-center w-full">
                <TextureButton 
                  type="metalness"
                  currentMap={metalnessMap}
                  onSelect={() => {
                    setAssetPickerType('metalness');
                    setShowAssetPicker(true);
                  }}
                  onRemove={removeTextureMap}
                />
                <div className="flex-1">
                  <CustomSliderWithNumber 
                    value={metal} 
                    onChange={handleMetalnessChange}
                    max={100}
                  />
                </div>
              </div>
            </PropertyRow>

            <PropertyRow label="Roughness">
              <div className="flex flex-row-reverse gap-2 items-center w-full">
                <TextureButton 
                  type="roughness"
                  currentMap={roughnessMap}
                  onSelect={() => {
                    setAssetPickerType('roughness');
                    setShowAssetPicker(true);
                  }}
                  onRemove={removeTextureMap}
                />
                <div className="flex-1">
                  <CustomSliderWithNumber 
                    value={rough} 
                    onChange={handleRoughnessChange}
                    max={100}
                  />
                </div>
              </div>
            </PropertyRow>

            <PropertyRow label="Normal">
              <div className="flex flex-row-reverse gap-2 items-center w-full">
                <TextureButton 
                  type="normal"
                  currentMap={normalMap}
                  onSelect={() => {
                    setAssetPickerType('normal');
                    setShowAssetPicker(true);
                  }}
                  onRemove={removeTextureMap}
                />
                <div className="flex-1">
                  <CustomSliderWithNumber 
                    value={normal} 
                    onChange={handleNormalChange}
                    max={100}
                  />
                </div>
              </div>
            </PropertyRow>

            <PropertyRow label="AO Intensity">
              <div className="flex flex-row-reverse gap-2 items-center w-full">
                <TextureButton 
                  type="ao"
                  currentMap={aoMap}
                  onSelect={() => {
                    setAssetPickerType('ao');
                    setShowAssetPicker(true);
                  }}
                  onRemove={removeTextureMap}
                />
                <div className="flex-1">
                  <CustomSliderWithNumber 
                    value={aoIntensity} 
                    onChange={handleAoIntensityChange}
                    max={100}
                  />
                </div>
              </div>
            </PropertyRow>
          </div>
        </div>

        {/* High Fidelity Toggle */}
        <div className="flex flex-1 items-center justify-between min-w-0 mb-4">
          <h5 className="text-xs font-semibold text-gray-300 mr-2 break-words select-none">High Fidelity</h5>
          <div className="flex flex-1 items-center gap-1 justify-end min-w-0">
            <label className="rounded-full relative overflow-hidden cursor-pointer h-5 w-9">
              <input 
                className="opacity-0 h-0 w-0 peer" 
                type="checkbox" 
                checked={highFidelity}
                onChange={(e) => {
                  setHighFidelity(e.target.checked);
                  updateMaterialProperty('highFidelity', e.target.checked);
                }}
              />
              <div className={`h-full w-full absolute top-0 left-0 transition-colors ${highFidelity ? 'bg-blue-500' : 'bg-gray-400'}`} />
              <span className={`absolute top-0.5 left-0.5 bg-gray-200 rounded-full transition-transform h-4 w-4 ${highFidelity ? 'translate-x-4 bg-blue-200' : ''}`} />
            </label>
          </div>
        </div>

        {highFidelity && (
          <div className="text-xs text-gray-300 mb-4">
            Enabling these features can impact performance. Use them carefully, especially in complex projects.
          </div>
        )}

        {/* High Fidelity Features */}
        {highFidelity && (
          <>
            {/* Iridescence */}
            <div className="border-gray-500 select-none border-b pb-4">
              <SectionHeader title="Iridescence" />
              <div className="space-y-2">
                <PropertyRow label="Iridescence">
                  <div className="flex-1">
                    <CustomSliderWithNumber 
                      value={iridescence} 
                      onChange={(value) => {
                        setIridescence(value);
                        updateMaterialProperty('iridescence', value);
                      }}
                      max={100}
                    />
                  </div>
                </PropertyRow>
                <PropertyRow label="Refraction">
                  <div className="flex-1">
                    <CustomSliderWithNumber 
                      value={refraction} 
                      onChange={(value) => {
                        setRefraction(value);
                        updateMaterialProperty('refraction', value);
                      }}
                      min={1}
                      max={2.333}
                      step={0.001}
                    />
                  </div>
                </PropertyRow>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Asset Picker Modal */}
      {showAssetPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h3 className="text-lg font-medium text-white">
                Select {assetPickerType?.charAt(0).toUpperCase() + assetPickerType?.slice(1)} Media Asset
              </h3>
              <button 
                onClick={() => {
                  setShowAssetPicker(false);
                  setAssetPickerType(null);
                }}
                className="p-1 hover:bg-gray-600 rounded text-white"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {availableTextures.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                  <Folder size={24} className="mb-2 opacity-50" />
                  <p className="text-sm mb-1">No media assets available</p>
                  <p className="text-xs text-center">Import image or video files in the Assets panel to use as textures</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {availableTextures.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-2 rounded cursor-pointer hover:bg-gray-700 border border-transparent hover:border-blue-500 transition-colors"
                      onClick={() => assignTextureMap(asset)}
                    >
                      <div className="w-20 h-20 mx-auto mb-2 bg-gray-700 rounded flex items-center justify-center overflow-hidden relative">
                        {asset.thumbnail ? (
                          <img 
                            src={asset.thumbnail} 
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            <ImageIcon size={20} className="text-gray-400 mb-1" />
                            {asset.type === 'videos' && (
                              <span className="text-xs text-blue-400">VIDEO</span>
                            )}
                          </div>
                        )}
                        
                        {/* Video indicator */}
                        {asset.type === 'videos' && (
                          <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
                            VID
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-center">
                        <div className="font-medium truncate text-white" title={asset.name}>
                          {asset.name}
                        </div>
                        <div className="text-gray-400 truncate" title={asset.fileName}>
                          {asset.fileName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {asset.type === 'videos' ? 'Video' : 'Image'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-600 flex justify-end">
              <button 
                onClick={() => {
                  setShowAssetPicker(false);
                  setAssetPickerType(null);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-track {
          background: #4B5563;
          height: 6px;
          border-radius: 3px;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #6B7280;
          cursor: pointer;
          border: none;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          background: #9CA3AF;
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #6B7280;
          cursor: pointer;
          border: none;
        }
        
        input[type="range"]::-moz-range-track {
          background: #4B5563;
          height: 6px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default MaterialsPanel;
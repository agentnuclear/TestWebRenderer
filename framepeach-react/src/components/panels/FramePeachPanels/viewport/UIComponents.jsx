import React from 'react';

// Selected Object Info Component
const SelectedObjectInfo = ({ selectedObject, onDelete }) => {
  if (!selectedObject) return null;

  return (
    <div className="absolute bottom-4 right-4 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-100">Selected</h3>
          <button 
            className="text-gray-400 hover:text-red-400 text-lg transition-colors"
            onClick={onDelete}
            title="Delete (Del)"
          >
            ×
          </button>
        </div>
        <div className="text-xs text-gray-200 mb-2 font-medium">
          {selectedObject.name || 'Selected Object'}
        </div>
        <div className="text-xs text-gray-400 mb-2">
          Type: {selectedObject.type}
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <div>Position: {selectedObject.position.x.toFixed(2)}, {selectedObject.position.y.toFixed(2)}, {selectedObject.position.z.toFixed(2)}</div>
          <div>Rotation: {selectedObject.rotation.x}°, {selectedObject.rotation.y}°, {selectedObject.rotation.z}°</div>
          <div>Scale: {selectedObject.scale.x}, {selectedObject.scale.y}, {selectedObject.scale.z}</div>
        </div>
      </div>
    </div>
  );
};

// Quick Controls Instructions Component
const QuickControlsInfo = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 p-3">
      <h3 className="text-sm font-medium text-gray-100 mb-2">Quick Controls</h3>
      <div className="text-xs text-gray-400 space-y-1">
        <div className="font-medium text-blue-400">Add Objects:</div>
        <div>Press 1: Cube (Standard)</div>
        <div>Press 2: Sphere (Chrome)</div>
        <div>Press 3: Cylinder (Plastic)</div>
        <div>Press 4: Plane</div>
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="font-medium text-green-400">Assets:</div>
          <div>Drag files from Assets Panel</div>
          <div>Drop files directly on viewport</div>
          <div>Double-click assets to add</div>
        </div>
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="font-medium text-purple-400">Materials:</div>
          <div>Create in Assets Panel</div>
          <div>Drag to objects to apply</div>
        </div>
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="font-medium text-orange-400">Camera:</div>
          <div>Right-click + Scroll: Adjust Speed</div>
          <div>Or use slider above</div>
        </div>
      </div>
    </div>
  );
};

// Drag Over Indicator Component
const DragOverIndicator = ({ isDragOver }) => {
  if (!isDragOver) return null;

  return (
    <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-4 border-dashed border-blue-500 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-xl">
        Drop assets here to add to scene
      </div>
    </div>
  );
};

export { SelectedObjectInfo, QuickControlsInfo, DragOverIndicator };

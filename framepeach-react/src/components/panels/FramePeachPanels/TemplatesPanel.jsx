import React from 'react';
import { Search, Plus } from 'lucide-react';

const TemplatesPanel = ({ templates }) => {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm">Template Library</span>
        <div className="flex space-x-1">
          <button className="p-1 hover:bg-gray-600 rounded">
            <Search size={14} />
          </button>
          <button className="p-1 hover:bg-gray-600 rounded">
            <Plus size={14} />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-2">BUSINESS TEMPLATES</h4>
          <div className="grid grid-cols-2 gap-2">
            {templates.business.map(template => (
              <div 
                key={template.id} 
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer text-center"
              >
                <div className="text-2xl mb-1">{template.preview}</div>
                <div className="text-xs font-medium">{template.name}</div>
                <div className="text-xs text-gray-400">{template.category}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-2">E-COMMERCE TEMPLATES</h4>
          <div className="grid grid-cols-2 gap-2">
            {templates.ecommerce.map(template => (
              <div 
                key={template.id} 
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer text-center"
              >
                <div className="text-2xl mb-1">{template.preview}</div>
                <div className="text-xs font-medium">{template.name}</div>
                <div className="text-xs text-gray-400">{template.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPanel;

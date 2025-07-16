import React, { useState } from 'react';
import { Home, Globe, BookOpen, FileText, Archive, Plus, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewTemplate from './NewTemplate';

const Template = () => {

  const navigate=useNavigate();

  const [openNewTemplate, setOpenNewTemplate] = useState(false);
  const websites = [
    { id: 1, title: 'Untitled', lastEdited: '34 minutes ago' },
    { id: 2, title: 'Untitled', lastEdited: '4 days ago' },
    { id: 3, title: 'Untitled', lastEdited: '4 days ago' },
    { id: 4, title: 'Untitled', lastEdited: '4 days ago' },
    { id: 5, title: 'Untitled', lastEdited: '4 days ago' },
    { id: 6, title: 'Untitled', lastEdited: '4 days ago' },
  ];

  const sidebarItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: Globe, label: 'My Websites', active: true },
    { icon: BookOpen, label: 'Tutorials', active: false },
    { icon: FileText, label: 'Templates', active: false },
  ];

  return (
    <div className="flex flex-col h-screen  text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#181818] border-b border-gray-700">
        {/* User Profile */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
            A
          </div>
          <span className="text-white font-medium">Akshay Gupta</span>
        </div>

        {/* New Website Button */}
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors" onClick={() => {setOpenNewTemplate(true);}}>
          <Plus className="w-4 h-4 mr-2" />
          New Website
        </button>

      </div>
      {openNewTemplate && <NewTemplate onClose={setOpenNewTemplate}/>}
      {/* Main Content */}
      <div className="flex-1 overflow-auto flex ">
        {/* Sidebar Navigation */}
        <div className="w-52 bg-[#333333] border-r border-gray-700 p-6">
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div key={index} className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                item.active ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}>
                <item.icon className="w-4 h-4 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-xs bg-gray-600 px-2 py-1 rounded">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
            <div className="absolute flex items-center px-3 py-2 text-gray-400 hover:text-white cursor-pointer rounded-lg transition-colors bottom-1">
              <Archive className="w-4 h-4 mr-3" />
              <span className="text-sm">Archive</span>
            </div>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">

          {/* Content Grid */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {/* {websites.map((website) => (
                <div key={website.id} className="group cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-pink-300 via-purple-300 to-pink-200 aspect-video mb-3 hover:scale-105 transition-transform duration-200">
                
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-pink-200">
                      <div className="absolute top-4 right-6 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-60"></div>
                      <div className="absolute top-8 left-8 w-16 h-3 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-80"></div>
                      <div className="absolute bottom-6 left-4 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-70"></div>
                      <div className="absolute bottom-12 right-8 w-6 h-6 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-60"></div>
                      <div className="absolute top-16 left-16 w-4 h-4 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-50"></div>
                    </div>
                    
             
                    <button className="absolute top-3 right-3 w-8 h-8 bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium text-white">{website.title}</h3>
                    <p className="text-sm text-gray-400">Last edited {website.lastEdited}</p>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
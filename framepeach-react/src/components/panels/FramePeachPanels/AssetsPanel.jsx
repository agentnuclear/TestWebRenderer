import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Grid, Plus, Package, Image, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Download, Save, Eye, Settings, Folder, FolderOpen, Filter, Upload, Film, FileImage, Box, Sparkles, Palette, Play, Trash2, Copy, Star, AlertTriangle, Grid3X3, List, RefreshCw, Home, ArrowUp, MoreHorizontal, X, Check, Edit3 } from 'lucide-react';

const AssetsPanel = ({ assets = { models: [], textures: [], videos: [], materials: [], particles: [] } }) => {
  const [expandedFolders, setExpandedFolders] = useState({
    myAssets: true,
    models: true,
    textures: true,
    videos: true,
    materials: true,
    particles: true
  });

  const [userAssets, setUserAssets] = useState({
    models: [],
    textures: [],
    videos: [],
    materials: [],
    particles: []
  });

  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null); // null = root
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [viewMode, setViewMode] = useState('tiles'); // 'tiles' or 'list'
  const [thumbnailSize, setThumbnailSize] = useState('medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [draggedAsset, setDraggedAsset] = useState(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSourcesPanel, setShowSourcesPanel] = useState(true);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const fileInputRef = useRef(null);
  const createMenuRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const assetsPanelRef = useRef(null);
  const folderInputRef = useRef(null);

  // Generate unique ID
  const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedAssets = localStorage.getItem('framepeach-user-assets');
    const savedFolders = localStorage.getItem('framepeach-user-folders');
    const savedCurrentFolder = localStorage.getItem('framepeach-current-folder');
    
    if (savedAssets) {
      try {
        setUserAssets(JSON.parse(savedAssets));
      } catch (error) {
        console.warn('Failed to load saved assets:', error);
      }
    }
    
    if (savedFolders) {
      try {
        setFolders(JSON.parse(savedFolders));
      } catch (error) {
        console.warn('Failed to load saved folders:', error);
      }
    }
    
    if (savedCurrentFolder) {
      try {
        const folderId = JSON.parse(savedCurrentFolder);
        setCurrentFolderId(folderId);
      } catch (error) {
        console.warn('Failed to load current folder:', error);
      }
    }
  }, []);

  // Save user assets to localStorage with size management
  const saveUserAssets = useCallback((newAssets) => {
    try {
      const dataToSave = JSON.stringify(newAssets);
      
      // Check if data is too large (roughly 4MB limit to be safe)
      if (dataToSave.length > 4 * 1024 * 1024) {
        console.warn('Asset data too large for localStorage, using memory storage only');
        setUserAssets(newAssets);
        
        // Show user notification about storage limit
        if (window.confirm('Assets are too large for browser storage. Continue with in-memory storage only? (Data will be lost when you refresh the page)')) {
          return;
        } else {
          return; // Don't save if user cancels
        }
      }
      
      localStorage.setItem('framepeach-user-assets', dataToSave);
      setUserAssets(newAssets);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, attempting recovery...');
        
        // Show user dialog about storage issue
        const userChoice = window.confirm(
          'Storage quota exceeded! Would you like to:\n\n' +
          'OK: Clear old data and try to save current assets\n' +
          'Cancel: Continue with in-memory storage only (data lost on refresh)'
        );
        
        if (userChoice) {
          // Try to clear old data and save again
          try {
            localStorage.removeItem('framepeach-user-assets');
            localStorage.removeItem('framepeach-user-folders');
            localStorage.removeItem('framepeach-current-folder');
            localStorage.removeItem('framepeach-project');
            localStorage.removeItem('framepeach-project-autosave');
            
            // Clear any other potential large localStorage items
            const keysToCheck = Object.keys(localStorage);
            keysToCheck.forEach(key => {
              if (key.startsWith('framepeach-') || key.includes('asset') || key.includes('project')) {
                localStorage.removeItem(key);
              }
            });
            
            const dataToSave = JSON.stringify(newAssets);
            if (dataToSave.length <= 4 * 1024 * 1024) {
              localStorage.setItem('framepeach-user-assets', dataToSave);
              setUserAssets(newAssets);
              alert('Successfully cleared old data and saved current assets!');
            } else {
              setUserAssets(newAssets);
              alert('Assets are still too large after cleanup. Using in-memory storage.');
            }
          } catch (retryError) {
            console.warn('Still cannot save to localStorage after cleanup:', retryError);
            setUserAssets(newAssets);
            alert('Could not save to storage even after cleanup. Using in-memory storage only.');
          }
        } else {
          // User chose to continue with in-memory storage
          setUserAssets(newAssets);
          console.info('Using in-memory storage as requested by user');
        }
      } else {
        console.error('Error saving assets:', error);
        setUserAssets(newAssets);
        alert('Error saving assets: ' + error.message);
      }
    }
  }, []);

  // Save folders to localStorage
  const saveFolders = useCallback((newFolders) => {
    try {
      localStorage.setItem('framepeach-user-folders', JSON.stringify(newFolders));
      setFolders(newFolders);
    } catch (error) {
      console.warn('Failed to save folders:', error);
      setFolders(newFolders);
    }
  }, []);

  // Save current folder to localStorage
  const saveCurrentFolder = useCallback((folderId) => {
    try {
      localStorage.setItem('framepeach-current-folder', JSON.stringify(folderId));
      setCurrentFolderId(folderId);
    } catch (error) {
      console.warn('Failed to save current folder:', error);
      setCurrentFolderId(folderId);
    }
  }, []);

  // Get current folder object
  const getCurrentFolder = useCallback(() => {
    return folders.find(f => f.id === currentFolderId) || null;
  }, [folders, currentFolderId]);

  // Get breadcrumb path
  const getBreadcrumbPath = useCallback(() => {
    const path = [];
    let current = getCurrentFolder();
    
    while (current) {
      path.unshift(current);
      current = folders.find(f => f.id === current.parentId);
    }
    
    return path;
  }, [getCurrentFolder, folders]);

  // Navigation functions
  const navigateToFolder = useCallback((folderId) => {
    // Add to navigation history
    const newHistoryEntry = { folderId: currentFolderId, timestamp: Date.now() };
    const newHistory = [...navigationHistory.slice(0, historyIndex + 1), newHistoryEntry];
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    saveCurrentFolder(folderId);
    setSelectedAssets([]);
  }, [currentFolderId, navigationHistory, historyIndex, saveCurrentFolder]);

  const navigateUp = useCallback(() => {
    const currentFolder = getCurrentFolder();
    if (currentFolder) {
      navigateToFolder(currentFolder.parentId);
    }
  }, [getCurrentFolder, navigateToFolder]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const previousEntry = navigationHistory[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      saveCurrentFolder(previousEntry.folderId);
      setSelectedAssets([]);
    }
  }, [historyIndex, navigationHistory, saveCurrentFolder]);

  const goForward = useCallback(() => {
    if (historyIndex < navigationHistory.length - 1) {
      const nextEntry = navigationHistory[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      saveCurrentFolder(nextEntry.folderId);
      setSelectedAssets([]);
    }
  }, [historyIndex, navigationHistory, saveCurrentFolder]);

  // Folder operations
  const createFolder = useCallback((name, parentId = currentFolderId) => {
    if (!name.trim()) return null;
    
    const newFolder = {
      id: generateId(),
      name: name.trim(),
      parentId: parentId,
      createdAt: new Date().toISOString(),
      color: null // For future color coding
    };
    
    const updatedFolders = [...folders, newFolder];
    saveFolders(updatedFolders);
    return newFolder;
  }, [currentFolderId, folders, saveFolders]);

  const deleteFolder = useCallback((folderId) => {
    // Get all descendant folders
    const getDescendants = (id) => {
      const children = folders.filter(f => f.parentId === id);
      let descendants = [...children];
      children.forEach(child => {
        descendants = [...descendants, ...getDescendants(child.id)];
      });
      return descendants;
    };
    
    const foldersToDelete = [folderId, ...getDescendants(folderId).map(f => f.id)];
    
    if (window.confirm(`Delete folder and all its contents? This will also delete ${foldersToDelete.length} folder(s) and their assets.`)) {
      // Delete folders
      const updatedFolders = folders.filter(f => !foldersToDelete.includes(f.id));
      saveFolders(updatedFolders);
      
      // Delete assets in these folders
      const updatedAssets = { ...userAssets };
      Object.keys(updatedAssets).forEach(category => {
        updatedAssets[category] = updatedAssets[category].filter(asset => 
          !foldersToDelete.includes(asset.folderId)
        );
      });
      saveUserAssets(updatedAssets);
      
      // Navigate to parent if we're in a deleted folder
      if (foldersToDelete.includes(currentFolderId)) {
        const deletedFolder = folders.find(f => f.id === currentFolderId);
        navigateToFolder(deletedFolder?.parentId || null);
      }
      
      setSelectedAssets([]);
    }
  }, [folders, saveFolders, userAssets, saveUserAssets, currentFolderId, navigateToFolder]);

  const renameFolder = useCallback((folderId, newName) => {
    if (!newName.trim()) return;
    
    const updatedFolders = folders.map(f => 
      f.id === folderId ? { ...f, name: newName.trim() } : f
    );
    saveFolders(updatedFolders);
  }, [folders, saveFolders]);

  // Get folders in current directory
  const getCurrentSubFolders = useCallback(() => {
    return folders.filter(f => f.parentId === currentFolderId);
  }, [folders, currentFolderId]);

  // Get assets in current directory
  const getCurrentAssets = useCallback(() => {
    let allAssets = [];
    
    // Combine all asset types
    Object.keys(userAssets).forEach(category => {
      allAssets = [...allAssets, ...userAssets[category].map(asset => ({
        ...asset,
        category: category
      }))];
    });
    
    // Filter by current folder
    return allAssets.filter(asset => asset.folderId === currentFolderId);
  }, [userAssets, currentFolderId]);

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  // Handle file uploads with size management
  const handleFileUpload = useCallback((files, category) => {
    Array.from(files).forEach(file => {
      // Check file size and get user confirmation for large files
      const fileSizeMB = file.size / (1024 * 1024);
      
      if (fileSizeMB > 10) {
        const confirmed = window.confirm(
          `Warning: "${file.name}" is ${fileSizeMB.toFixed(1)}MB.\n\n` +
          `Large files may cause storage issues and slow performance.\n\n` +
          `Continue with upload?`
        );
        if (!confirmed) {
          console.log(`Upload cancelled by user for file: ${file.name}`);
          return; // Skip this file if user cancels
        }
      }
      
      if (fileSizeMB > 10) {
        console.warn(`Large file detected (${fileSizeMB.toFixed(1)}MB): ${file.name}. This may cause storage issues.`);
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target.result;
        
        // For very large files, store a reference instead of the full data
        let assetUrl = dataURL;
        let storageWarning = false;
        
        if (dataURL.length > 1024 * 1024) { // 1MB threshold
          console.warn(`Large asset: ${file.name} (${(dataURL.length / 1024 / 1024).toFixed(1)}MB)`);
          storageWarning = true;
        }
        
        const newAsset = {
          id: Date.now() + Math.random(),
          name: file.name.split('.')[0],
          fileName: file.name,
          type: category,
          folderId: currentFolderId, // Assign to current folder
          url: assetUrl,
          size: file.size,
          format: file.name.split('.').pop().toLowerCase(),
          uploadDate: new Date().toISOString(),
          thumbnail: file.type.startsWith('image/') && !storageWarning ? assetUrl : null,
          storageWarning: storageWarning
        };

        setUserAssets(prev => {
          const updated = {
            ...prev,
            [category]: [...prev[category], newAsset]
          };
          saveUserAssets(updated);
          return updated;
        });
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        // Create a minimal asset entry for failed uploads
        const newAsset = {
          id: Date.now() + Math.random(),
          name: file.name.split('.')[0],
          fileName: file.name,
          type: category,
          folderId: currentFolderId,
          url: null,
          size: file.size,
          format: file.name.split('.').pop().toLowerCase(),
          uploadDate: new Date().toISOString(),
          thumbnail: null,
          error: 'Failed to read file'
        };

        setUserAssets(prev => {
          const updated = {
            ...prev,
            [category]: [...prev[category], newAsset]
          };
          saveUserAssets(updated);
          return updated;
        });
      };

      // Read all files as data URLs for better persistence
      reader.readAsDataURL(file);
    });
  }, [saveUserAssets, currentFolderId]);

  // Create new material
  const createMaterial = useCallback((materialType) => {
    const materialTemplates = {
      standard: {
        name: `Material_${userAssets.materials.length + 1}`,
        type: 'materials',
        properties: {
          color: '#ffffff',
          roughness: 0.5,
          metalness: 0.0,
          opacity: 1.0,
          transparent: false,
          emissive: '#000000',
          emissiveIntensity: 0.0
        }
      },
      glass: {
        name: `Glass_${userAssets.materials.length + 1}`,
        type: 'materials',
        properties: {
          color: '#ffffff',
          roughness: 0.0,
          metalness: 0.0,
          opacity: 0.8,
          transparent: true,
          ior: 1.5,
          transmission: 1.0
        }
      },
      metal: {
        name: `Metal_${userAssets.materials.length + 1}`,
        type: 'materials',
        properties: {
          color: '#c0c0c0',
          roughness: 0.1,
          metalness: 1.0,
          opacity: 1.0,
          transparent: false
        }
      },
      emissive: {
        name: `Emissive_${userAssets.materials.length + 1}`,
        type: 'materials',
        properties: {
          color: '#ffffff',
          emissive: '#ff0000',
          emissiveIntensity: 1.0,
          opacity: 1.0,
          transparent: false
        }
      }
    };

    const newMaterial = {
      id: Date.now() + Math.random(),
      ...materialTemplates[materialType],
      folderId: currentFolderId,
      createdDate: new Date().toISOString()
    };

    setUserAssets(prev => {
      const updated = {
        ...prev,
        materials: [...prev.materials, newMaterial]
      };
      saveUserAssets(updated);
      return updated;
    });
  }, [userAssets.materials.length, saveUserAssets, currentFolderId]);

  // Create new particle system
  const createParticleSystem = useCallback((particleType) => {
    const particleTemplates = {
      fire: {
        name: `Fire_${userAssets.particles.length + 1}`,
        type: 'particles',
        properties: {
          particleCount: 1000,
          size: 0.1,
          sizeVariation: 0.5,
          color: '#ff4500',
          velocity: { x: 0, y: 2, z: 0 },
          velocityVariation: { x: 0.5, y: 0.5, z: 0.5 },
          lifetime: 2.0,
          emissionRate: 100,
          gravity: { x: 0, y: -0.1, z: 0 }
        }
      },
      smoke: {
        name: `Smoke_${userAssets.particles.length + 1}`,
        type: 'particles',
        properties: {
          particleCount: 500,
          size: 0.2,
          sizeVariation: 0.3,
          color: '#888888',
          velocity: { x: 0, y: 1, z: 0 },
          velocityVariation: { x: 0.3, y: 0.3, z: 0.3 },
          lifetime: 3.0,
          emissionRate: 50,
          gravity: { x: 0, y: 0.05, z: 0 }
        }
      },
      sparkles: {
        name: `Sparkles_${userAssets.particles.length + 1}`,
        type: 'particles',
        properties: {
          particleCount: 200,
          size: 0.05,
          sizeVariation: 0.2,
          color: '#ffff00',
          velocity: { x: 0, y: 0.5, z: 0 },
          velocityVariation: { x: 1, y: 1, z: 1 },
          lifetime: 1.5,
          emissionRate: 80,
          gravity: { x: 0, y: -0.2, z: 0 }
        }
      }
    };

    const newParticleSystem = {
      id: Date.now() + Math.random(),
      ...particleTemplates[particleType],
      folderId: currentFolderId,
      createdDate: new Date().toISOString()
    };

    setUserAssets(prev => {
      const updated = {
        ...prev,
        particles: [...prev.particles, newParticleSystem]
      };
      saveUserAssets(updated);
      return updated;
    });
  }, [userAssets.particles.length, saveUserAssets, currentFolderId]);

  // Handle drag and drop to viewport
  const handleDragStart = useCallback((asset, e) => {
    setDraggedAsset(asset);
    
    // Set drag data for the viewport to receive
    if (e && e.dataTransfer) {
      e.dataTransfer.setData('application/framepeach-asset', JSON.stringify(asset));
      e.dataTransfer.effectAllowed = 'copy';
    }
    
    // Dispatch event for viewport to listen to
    const dragEvent = new CustomEvent('assetDragStart', {
      detail: { asset }
    });
    window.dispatchEvent(dragEvent);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedAsset(null);
    
    const dragEvent = new CustomEvent('assetDragEnd');
    window.dispatchEvent(dragEvent);
  }, []);

  // Delete asset
  const deleteAsset = useCallback((assetId, category) => {
    setUserAssets(prev => {
      const updated = {
        ...prev,
        [category]: prev[category].filter(asset => asset.id !== assetId)
      };
      saveUserAssets(updated);
      return updated;
    });
  }, [saveUserAssets]);

  // Duplicate asset
  const duplicateAsset = useCallback((asset) => {
    const duplicatedAsset = {
      ...asset,
      id: Date.now() + Math.random(),
      name: `${asset.name}_copy`,
      createdDate: new Date().toISOString()
    };

    setUserAssets(prev => {
      const updated = {
        ...prev,
        [asset.type]: [...prev[asset.type], duplicatedAsset]
      };
      saveUserAssets(updated);
      return updated;
    });
  }, [saveUserAssets]);

  // Move asset to folder
  const moveAssetToFolder = useCallback((assetId, targetFolderId, category) => {
    setUserAssets(prev => {
      const updated = {
        ...prev,
        [category]: prev[category].map(asset => 
          asset.id === assetId ? { ...asset, folderId: targetFolderId } : asset
        )
      };
      saveUserAssets(updated);
      return updated;
    });
  }, [saveUserAssets]);

  // Filter assets based on search and category
  const getFilteredAssets = useCallback(() => {
    const currentAssets = getCurrentAssets();
    let filteredAssets = [...currentAssets];

    // Filter by category
    if (activeCategory !== 'all') {
      filteredAssets = filteredAssets.filter(asset => asset.type === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filteredAssets = filteredAssets.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredAssets;
  }, [getCurrentAssets, activeCategory, searchTerm]);

  // Get filtered folders
  const getFilteredFolders = useCallback(() => {
    let currentFolders = getCurrentSubFolders();
    
    // Filter by search term
    if (searchTerm) {
      currentFolders = currentFolders.filter(folder => 
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return currentFolders;
  }, [getCurrentSubFolders, searchTerm]);

  // Handle folder creation
  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim()) {
      createFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  }, [newFolderName, createFolder]);

  // Close create menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setShowCreateMenu(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus folder input when creating
  useEffect(() => {
    if (isCreatingFolder && folderInputRef.current) {
      folderInputRef.current.focus();
    }
  }, [isCreatingFolder]);

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Determine category based on file type
      const file = files[0];
      let category = 'models';
      
      if (file.type.startsWith('image/')) {
        category = 'textures';
      } else if (file.type.startsWith('video/')) {
        category = 'videos';
      }
      
      handleFileUpload(files, category);
    }
  };

  // External file drag and drop handlers
  const handleExternalDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleExternalDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're actually leaving the panel
    if (!assetsPanelRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleExternalDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Process each file based on its type
      files.forEach(file => {
        let category = 'models';
        if (file.type.startsWith('image/')) {
          category = 'textures';
        } else if (file.type.startsWith('video/')) {
          category = 'videos';
        }
        
        handleFileUpload([file], category);
      });
    }
  }, [handleFileUpload]);

  // Handle asset selection (single and multi-select like ContentBrowser)
  const toggleAssetSelection = useCallback((assetId, event) => {
    if (event?.ctrlKey || event?.metaKey) {
      // Multi-select
      setSelectedAssets(prev => 
        prev.includes(assetId) 
          ? prev.filter(id => id !== assetId)
          : [...prev, assetId]
      );
    } else if (event?.shiftKey && selectedAssets.length > 0) {
      // Range select
      const allItems = [...getFilteredFolders().map(f => f.id), ...getFilteredAssets().map(a => a.id)];
      const lastSelectedIndex = allItems.findIndex(id => id === selectedAssets[selectedAssets.length - 1]);
      const currentIndex = allItems.findIndex(id => id === assetId);
      
      if (lastSelectedIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);
        const rangeIds = allItems.slice(start, end + 1);
        setSelectedAssets(rangeIds);
      }
    } else {
      // Single select
      setSelectedAssets([assetId]);
    }
  }, [selectedAssets, getFilteredFolders, getFilteredAssets]);

  // Delete selected assets and folders
  const deleteSelectedItems = useCallback(() => {
    if (selectedAssets.length === 0) return;
    
    const selectedFolders = folders.filter(f => selectedAssets.includes(f.id));
    const selectedAssetItems = getFilteredAssets().filter(a => selectedAssets.includes(a.id));
    
    if (window.confirm(`Delete ${selectedAssets.length} selected item(s)? This includes ${selectedFolders.length} folder(s) and ${selectedAssetItems.length} asset(s).`)) {
      // Delete folders and their contents
      selectedFolders.forEach(folder => {
        deleteFolder(folder.id);
      });
      
      // Delete individual assets
      selectedAssetItems.forEach(asset => {
        deleteAsset(asset.id, asset.type);
      });
      
      setSelectedAssets([]);
    }
  }, [selectedAssets, folders, getFilteredAssets, deleteFolder, deleteAsset]);

  useEffect(() => {
    const handleAssetDataRequest = () => {
      // Send texture assets to MaterialsPanel
      const assetDataEvent = new CustomEvent('assetDataResponse', {
        detail: {
          textures: userAssets.textures || [],
          videos: userAssets.videos || [] 
        }
      });
      window.dispatchEvent(assetDataEvent);
    };
  
    window.addEventListener('requestAssetData', handleAssetDataRequest);
    
    return () => {
      window.removeEventListener('requestAssetData', handleAssetDataRequest);
    };
  }, [userAssets.textures,userAssets.videos]);
  
  useEffect(() => {
    console.log('AssetsPanel: Assets changed, auto-sending update');
    console.log('Textures:', userAssets.textures?.length || 0);
    console.log('Videos:', userAssets.videos?.length || 0);
    
    const assetDataEvent = new CustomEvent('assetDataResponse', {
      detail: {
        textures: userAssets.textures || [],
        videos: userAssets.videos || []  // ← This is the key line
      }
    });
    window.dispatchEvent(assetDataEvent);
  }, [userAssets.textures, userAssets.videos]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!assetsPanelRef.current?.contains(document.activeElement)) return;

      switch (event.key) {
        case 'Delete':
        case 'Backspace':
          if (selectedAssets.length > 0) {
            deleteSelectedItems();
          }
          break;
        case 'Escape':
          setSelectedAssets([]);
          setIsCreatingFolder(false);
          break;
        case 'a':
        case 'A':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            const allIds = [...getFilteredFolders().map(f => f.id), ...getFilteredAssets().map(a => a.id)];
            setSelectedAssets(allIds);
          }
          break;
        case 'Enter':
          if (isCreatingFolder) {
            handleCreateFolder();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAssets, deleteSelectedItems, getFilteredFolders, getFilteredAssets, isCreatingFolder, handleCreateFolder]);

  // Storage management utilities
  const getStorageInfo = useCallback(() => {
    try {
      const used = JSON.stringify(localStorage).length;
      const total = 5 * 1024 * 1024; // Estimate 5MB limit
      return {
        used: used,
        total: total,
        percentage: (used / total) * 100,
        usedMB: (used / 1024 / 1024).toFixed(2),
        totalMB: (total / 1024 / 1024).toFixed(2)
      };
    } catch (error) {
      return { used: 0, total: 0, percentage: 0, usedMB: '0', totalMB: '5' };
    }
  }, []);

  const clearLargeAssets = useCallback(() => {
    if (window.confirm('Clear large assets to free up storage space? This will remove assets larger than 1MB.')) {
      setUserAssets(prev => {
        const updated = { ...prev };
        
        Object.keys(updated).forEach(category => {
          updated[category] = updated[category].filter(asset => {
            const assetSize = asset.url ? asset.url.length : 0;
            return assetSize < 1024 * 1024; // Keep assets smaller than 1MB
          });
        });
        
        saveUserAssets(updated);
        return updated;
      });
    }
  }, [saveUserAssets]);

  const clearAllAssets = useCallback(() => {
    if (window.confirm('Clear all assets and folders? This cannot be undone.')) {
      const emptyAssets = {
        models: [],
        textures: [],
        videos: [],
        materials: [],
        particles: []
      };
      
      saveUserAssets(emptyAssets);
      saveFolders([]);
      saveCurrentFolder(null);
      setSelectedAssets([]);
    }
  }, [saveUserAssets, saveFolders, saveCurrentFolder]);

  const getThumbnailSize = () => {
    switch (thumbnailSize) {
      case 'small': return 'w-16 h-16';
      case 'large': return 'w-32 h-32';
      default: return 'w-24 h-24';
    }
  };

  // Render folder tree recursively
  const renderFolderTree = (parentId, depth = 0) => {
    const childFolders = folders.filter(f => f.parentId === parentId);
    
    return childFolders.map(folder => {
      const hasChildren = folders.some(f => f.parentId === folder.id);
      const isExpanded = expandedFolders[folder.id];
      const assetCount = getCurrentAssets().filter(a => a.folderId === folder.id).length;
      const isActive = currentFolderId === folder.id;
      
      return (
        <div key={folder.id}>
          <div 
            className={`flex items-center text-sm py-1 px-2 hover:bg-gray-700 rounded cursor-pointer ${
              isActive ? 'text-blue-400 bg-gray-700' : 'text-gray-300'
            }`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => navigateToFolder(folder.id)}
          >
            {hasChildren && (
              <button
                className="mr-1 p-0.5 hover:bg-gray-600 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedFolders(prev => ({
                    ...prev,
                    [folder.id]: !prev[folder.id]
                  }));
                }}
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
            )}
            {!hasChildren && <div className="w-5" />}
            <Folder size={12} className="mr-2 text-yellow-500" />
            <span className="flex-1">{folder.name}</span>
            <span className="text-xs text-gray-500">({assetCount})</span>
          </div>
          {hasChildren && isExpanded && renderFolderTree(folder.id, depth + 1)}
        </div>
      );
    });
  };

  const filteredAssets = getFilteredAssets();
  const filteredFolders = getFilteredFolders();

  return (
    <div 
      ref={assetsPanelRef}
      className={`bg-[#2a2a2a] text-white font-sans h-full flex flex-col ${isDragOver ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}`}
      onDragOver={handleExternalDragOver}
      onDragLeave={handleExternalDragLeave}
      onDrop={handleExternalDrop}
      style={{ fontFamily: 'Segoe UI, Arial, sans-serif', minHeight: '100%', maxHeight: '100vh' }}
      tabIndex={0}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 border-4 border-dashed border-blue-400 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-medium shadow-2xl">
            <Upload size={32} className="mx-auto mb-2" />
            Drop files to import into Assets Panel
          </div>
        </div>
      )}

      {/* Main Toolbar */}
      <div className="bg-[#1e1e1e] border-b border-[#404040] px-2 py-1 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Create dropdown */}
            <div className="relative" ref={createMenuRef}>
              <button 
                className="flex items-center px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium"
                onClick={() => setShowCreateMenu(!showCreateMenu)}
              >
                <Plus size={10} className="mr-1" />
                Add
              </button>
              
              {showCreateMenu && (
                <div className="absolute top-full left-0 mt-1 bg-[#383838] border border-[#555] rounded shadow-2xl z-50 min-w-56">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs text-[#bbb] font-medium border-b border-[#555]">CREATE</div>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                      onClick={() => { setIsCreatingFolder(true); setShowCreateMenu(false); }}
                    >
                      <Folder size={14} className="mr-2 text-yellow-500" />
                      New Folder
                    </button>
                    
                    <div className="border-t border-[#555] my-1"></div>
                    <div className="px-3 py-1 text-xs text-[#bbb] font-medium">MATERIALS</div>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                      onClick={() => { createMaterial('standard'); setShowCreateMenu(false); }}
                    >
                      <Palette size={14} className="mr-2" />
                      Standard Material
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                      onClick={() => { createMaterial('glass'); setShowCreateMenu(false); }}
                    >
                      <Palette size={14} className="mr-2" />
                      Glass Material
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                      onClick={() => { createMaterial('metal'); setShowCreateMenu(false); }}
                    >
                      <Palette size={14} className="mr-2" />
                      Metal Material
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                      onClick={() => { createMaterial('emissive'); setShowCreateMenu(false); }}
                    >
                      <Palette size={14} className="mr-2" />
                      Emissive Material
                    </button>
                    
                    <div className="border-t border-[#555] my-1"></div>
                    <div className="px-3 py-1 text-xs text-[#bbb] font-medium">PARTICLE SYSTEMS</div>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                      onClick={() => { createParticleSystem('fire'); setShowCreateMenu(false); }}
                    >
                      <Sparkles size={14} className="mr-2" />
                      Fire Particles
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                      onClick={() => { createParticleSystem('smoke'); setShowCreateMenu(false); }}
                    >
                      <Sparkles size={14} className="mr-2" />
                      Smoke Particles
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                      onClick={() => { createParticleSystem('sparkles'); setShowCreateMenu(false); }}
                    >
                      <Sparkles size={14} className="mr-2" />
                      Sparkle Particles
                    </button>
                    
                    <div className="border-t border-[#555] my-1"></div>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                      onClick={() => { fileInputRef.current?.click(); setShowCreateMenu(false); }}
                    >
                      <Upload size={14} className="mr-2" />
                      Import Assets...
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Import button */}
            <button 
              className="flex items-center px-3 py-1.5 bg-[#404040] hover:bg-[#4a4a4a] text-sm rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} className="mr-1" />
              Import
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.mp4,.webm,.glb,.gltf,.fbx,.obj,.3ds,.dae"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Navigation buttons */}
            <div className="flex border border-[#555] rounded overflow-hidden">
              <button 
                className="px-2 py-1.5 hover:bg-[#4a4a4a] disabled:opacity-50"
                onClick={goBack}
                disabled={historyIndex <= 0}
                title="Back"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                className="px-2 py-1.5 hover:bg-[#4a4a4a] disabled:opacity-50 border-l border-[#555]"
                onClick={goForward}
                disabled={historyIndex >= navigationHistory.length - 1}
                title="Forward"
              >
                <ChevronRight size={14} />
              </button>
              <button 
                className="px-2 py-1.5 hover:bg-[#4a4a4a] disabled:opacity-50 border-l border-[#555]"
                onClick={navigateUp}
                disabled={!getCurrentFolder()}
                title="Up"
              >
                <ArrowUp size={14} />
              </button>
            </div>
          </div>

          {/* Path breadcrumb */}
          <div className="flex items-center bg-[#383838] rounded px-3 py-1 text-sm">
            <Home size={14} className="mr-2 text-[#888]" />
            <button 
              onClick={() => navigateToFolder(null)}
              className={`hover:text-blue-400 transition-colors ${currentFolderId === null ? 'text-blue-400' : ''}`}
            >
              Assets
            </button>
            {getBreadcrumbPath().map((folder, index) => (
              <React.Fragment key={folder.id}>
                <ChevronRight size={12} className="mx-1 text-[#888]" />
                <button 
                  className={`hover:text-blue-400 transition-colors ${
                    index === getBreadcrumbPath().length - 1 ? 'text-blue-400' : ''
                  }`}
                  onClick={() => navigateToFolder(folder.id)}
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* View controls */}
          <div className="flex items-center space-x-2">
            <div className="flex border border-[#555] rounded overflow-hidden">
              <button 
                className={`px-2 py-1.5 text-xs ${viewMode === 'tiles' ? 'bg-blue-600' : 'hover:bg-[#4a4a4a]'}`}
                onClick={() => setViewMode('tiles')}
                title="Thumbnail View"
              >
                <Grid size={14} />
              </button>
              <button 
                className={`px-2 py-1.5 text-xs border-l border-[#555] ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-[#4a4a4a]'}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={14} />
              </button>
            </div>
            
            {/* Thumbnail size slider */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-[#888]">Size:</span>
              <input 
                type="range" 
                min="1" 
                max="3" 
                value={thumbnailSize === 'small' ? 1 : thumbnailSize === 'medium' ? 2 : 3}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setThumbnailSize(value === 1 ? 'small' : value === 2 ? 'medium' : 'large');
                }}
                className="w-20"
              />
            </div>

            {/* Settings dropdown */}
            <div className="relative" ref={settingsMenuRef}>
              <button 
                className="p-1.5 hover:bg-[#4a4a4a] rounded"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                title="View Options"
              >
                <Settings size={14} />
              </button>
              
              {showSettingsMenu && (
                <div className="absolute top-full right-0 mt-1 bg-[#383838] border border-[#555] rounded shadow-2xl z-50 min-w-48">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs text-[#bbb] font-medium border-b border-[#555]">VIEW OPTIONS</div>
                    <label className="flex items-center px-3 py-2 text-sm hover:bg-[#4a4a4a] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showSourcesPanel}
                        onChange={(e) => setShowSourcesPanel(e.target.checked)}
                        className="mr-2"
                      />
                      Show Sources Panel
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar - Folder tree */}
        {showSourcesPanel && (
          <div className="w-64 bg-[#242424] border-r border-[#404040] flex flex-col min-h-0">
            <div className="flex-shrink-0 p-2 border-b border-[#404040]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#888] font-medium">SOURCES</span>
                <button 
                  className="p-1 hover:bg-[#4a4a4a] rounded text-[#888]"
                  onClick={() => setShowSourcesPanel(false)}
                  title="Hide Sources Panel"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 min-h-0">
              <div className="sources-tree">
                {/* Root folder */}
                <div 
                  className={`flex items-center text-sm py-1 px-2 hover:bg-gray-700 rounded cursor-pointer ${
                    currentFolderId === null ? 'text-blue-400 bg-gray-700' : 'text-gray-300'
                  }`}
                  onClick={() => navigateToFolder(null)}
                >
                  <Home size={12} className="mr-2" />
                  <span className="flex-1">Assets</span>
                  <span className="text-xs text-gray-500">
                    ({getCurrentAssets().filter(a => a.folderId === null).length})
                  </span>
                </div>
                
                {/* Folder tree */}
                {renderFolderTree(null)}

                {/* My Assets Section */}
                <div className="mt-4 mb-3">
                  <div 
                    className="flex items-center text-sm text-gray-300 py-1 hover:bg-gray-700 rounded cursor-pointer"
                    onClick={() => toggleFolder('myAssets')}
                  >
                    {expandedFolders.myAssets ? 
                      <ChevronDown size={12} className="mr-1" /> : 
                      <ChevronRight size={12} className="mr-1" />
                    }
                    <Star size={12} className="mr-2 text-yellow-500" />
                    Asset Types
                  </div>

                  {expandedFolders.myAssets && (
                    <div className="ml-4 mt-1 space-y-1">
                      <div 
                        className={`flex items-center text-sm py-1 hover:bg-gray-700 rounded cursor-pointer ${
                          activeCategory === 'models' ? 'text-blue-400 bg-gray-700' : 'text-gray-300'
                        }`}
                        onClick={() => setActiveCategory('models')}
                      >
                        <Box size={12} className="mr-2" />
                        3D Models ({userAssets.models.length})
                      </div>
                      <div 
                        className={`flex items-center text-sm py-1 hover:bg-gray-700 rounded cursor-pointer ${
                          activeCategory === 'textures' ? 'text-blue-400 bg-gray-700' : 'text-gray-300'
                        }`}
                        onClick={() => setActiveCategory('textures')}
                      >
                        <Image size={12} className="mr-2" />
                        Textures ({userAssets.textures.length})
                      </div>
                      <div 
                        className={`flex items-center text-sm py-1 hover:bg-gray-700 rounded cursor-pointer ${
                          activeCategory === 'videos' ? 'text-blue-400 bg-gray-700' : 'text-gray-300'
                        }`}
                        onClick={() => setActiveCategory('videos')}
                      >
                        <Film size={12} className="mr-2" />
                        Videos ({userAssets.videos.length})
                      </div>
                      <div 
                        className={`flex items-center text-sm py-1 hover:bg-gray-700 rounded cursor-pointer ${
                          activeCategory === 'materials' ? 'text-blue-400 bg-gray-700' : 'text-gray-300'
                        }`}
                        onClick={() => setActiveCategory('materials')}
                      >
                        <Palette size={12} className="mr-2" />
                        Materials ({userAssets.materials.length})
                      </div>
                      <div 
                        className={`flex items-center text-sm py-1 hover:bg-gray-700 rounded cursor-pointer ${
                          activeCategory === 'particles' ? 'text-blue-400 bg-gray-700' : 'text-gray-300'
                        }`}
                        onClick={() => setActiveCategory('particles')}
                      >
                        <Sparkles size={12} className="mr-2" />
                        Particles ({userAssets.particles.length})
                      </div>
                      <div 
                        className={`flex items-center text-sm py-1 hover:bg-gray-700 rounded cursor-pointer ${
                          activeCategory === 'all' ? 'text-blue-400 bg-gray-700' : 'text-gray-300'
                        }`}
                        onClick={() => setActiveCategory('all')}
                      >
                        <Folder size={12} className="mr-2" />
                        All Assets
                      </div>
                    </div>
                  )}
                </div>

                {/* Storage Info */}
                <div className="mt-4 pt-3 border-t border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Storage</span>
                    <span className="text-xs text-gray-400">
                      {getStorageInfo().usedMB}MB / {getStorageInfo().totalMB}MB
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                    <div 
                      className={`h-1.5 rounded-full ${
                        getStorageInfo().percentage > 80 ? 'bg-red-500' : 
                        getStorageInfo().percentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(getStorageInfo().percentage, 100)}%` }}
                    ></div>
                  </div>
                  {getStorageInfo().percentage > 80 && (
                    <p className="text-xs text-yellow-400 mb-2">Storage nearly full! Consider clearing large assets.</p>
                  )}
                  
                  <div className="space-y-1 mt-2">
                    <button 
                      className="w-full text-left px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded flex items-center"
                      onClick={clearLargeAssets}
                    >
                      <Trash2 size={10} className="mr-1" />
                      Clear Large Assets
                    </button>
                    <button 
                      className="w-full text-left px-2 py-1 bg-red-800 hover:bg-red-900 text-white text-xs rounded flex items-center"
                      onClick={clearAllAssets}
                    >
                      <Trash2 size={10} className="mr-1" />
                      Clear All Assets
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fixed Storage Info at bottom */}
            {/* <div className="flex-shrink-0 p-2 border-t border-[#404040] bg-[#1e1e1e]"> */}
              {/* <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Storage</span>
                <span className="text-xs text-gray-400">
                  {getStorageInfo().usedMB}MB / {getStorageInfo().totalMB}MB
                </span>
              </div> */}
              {/* <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                <div 
                  className={`h-1.5 rounded-full ${
                    getStorageInfo().percentage > 80 ? 'bg-red-500' : 
                    getStorageInfo().percentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(getStorageInfo().percentage, 100)}%` }}
                ></div>
              </div>
              {getStorageInfo().percentage > 80 && (
                <p className="text-xs text-yellow-400 mb-2">Storage nearly full!</p>
              )} */}
              
              {/* <div className="space-y-1">
                <button 
                  className="w-full text-left px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded flex items-center"
                  onClick={clearLargeAssets}
                >
                  <Trash2 size={10} className="mr-1" />
                  Clear Large
                </button>
                <button 
                  className="w-full text-left px-2 py-1 bg-red-800 hover:bg-red-900 text-white text-xs rounded flex items-center"
                  onClick={clearAllAssets}
                >
                  <Trash2 size={10} className="mr-1" />
                  Clear All
                </button>
              </div> */}
            {/* </div>2 */}
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search and filters bar */}
          <div className="bg-[#2a2a2a] border-b border-[#404040] px-4 py-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888]" />
                  <input 
                    type="text" 
                    placeholder="Search Assets"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[#383838] border border-[#555] rounded w-80 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-[#888]">
                {!showSourcesPanel && (
                  <button 
                    className="flex items-center px-2 py-1 hover:bg-[#4a4a4a] rounded"
                    onClick={() => setShowSourcesPanel(true)}
                    title="Show Sources Panel"
                  >
                    <Folder size={14} className="mr-1" />
                    Sources
                  </button>
                )}
                <span>{filteredAssets.length + filteredFolders.length} items</span>
                {selectedAssets.length > 0 && (
                  <>
                    <span className="text-blue-400">({selectedAssets.length} selected)</span>
                    <button 
                      onClick={deleteSelectedItems}
                      className="flex items-center px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                      title="Delete Selected Items"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Asset grid */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0">
            {filteredAssets.length === 0 && filteredFolders.length === 0 && !isCreatingFolder ? (
              <div className="flex flex-col items-center justify-center h-32 text-[#888]">
                <Package size={24} className="mb-2 opacity-50" />
                <p className="text-sm mb-1">No items found</p>
                <p className="text-xs text-center mb-3 max-w-sm">
                  {activeCategory === 'all' 
                    ? 'Create folders, import files, or create materials to get started'
                    : `No ${activeCategory} assets in this folder`
                  }
                </p>
                <div className="flex space-x-1">
                  <button 
                    className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded flex items-center text-xs text-white"
                    onClick={() => setIsCreatingFolder(true)}
                  >
                    <Folder size={12} className="mr-1" />
                    Folder
                  </button>
                  <button 
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded flex items-center text-xs text-white"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={12} className="mr-1" />
                    Import
                  </button>
                  <button 
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded flex items-center text-xs text-white"
                    onClick={() => setShowCreateMenu(true)}
                  >
                    <Plus size={12} className="mr-1" />
                    Create
                  </button>
                </div>
              </div>
            ) : (
              <div className={
                viewMode === 'tiles' 
                  ? `grid gap-2 auto-rows-max ${
                      thumbnailSize === 'small' ? 'grid-cols-8' : 
                      thumbnailSize === 'medium' ? 'grid-cols-6' : 
                      'grid-cols-4'
                    }`
                  : 'space-y-1'
              }>
                {/* Parent folder navigation */}
                {getCurrentFolder() && (
                  viewMode === 'list' ? (
                    <div 
                      className="flex items-center p-2 rounded cursor-pointer hover:bg-[#333] border-2 border-dashed border-[#555]"
                      onClick={navigateUp}
                    >
                      <ArrowUp size={16} className="mr-3 text-[#888]" />
                      <span className="flex-1 text-sm font-medium">..</span>
                      <span className="text-xs text-[#888] ml-2">Parent Folder</span>
                    </div>
                  ) : (
                    <div 
                      className="p-2 rounded cursor-pointer hover:bg-[#333] border-2 border-dashed border-[#555]"
                      onClick={navigateUp}
                    >
                      <div className={`${getThumbnailSize()} mx-auto mb-2 bg-[#383838] rounded flex items-center justify-center`}>
                        <ArrowUp size={32} className="text-[#888]" />
                      </div>
                      <div className="text-xs text-center">
                        <div className="font-medium">..</div>
                        <div className="text-[#888]">Parent Folder</div>
                      </div>
                    </div>
                  )
                )}

                {/* New folder creation */}
                {isCreatingFolder && (
                  <div className="p-2 rounded bg-[#404040] border-2 border-blue-500">
                    <div className={`${getThumbnailSize()} mx-auto mb-2 bg-[#383838] rounded flex items-center justify-center`}>
                      <Folder size={32} className="text-yellow-500" />
                    </div>
                    <div className="text-xs text-center">
                      <input
                        ref={folderInputRef}
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateFolder();
                          if (e.key === 'Escape') {
                            setIsCreatingFolder(false);
                            setNewFolderName('');
                          }
                        }}
                        onBlur={handleCreateFolder}
                        placeholder="New Folder"
                        className="bg-[#2a2a2a] border border-[#555] rounded px-2 py-1 text-center w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Folders */}
                {filteredFolders.map(folder => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    viewMode={viewMode}
                    thumbnailSize={thumbnailSize}
                    isSelected={selectedAssets.includes(folder.id)}
                    onSelect={toggleAssetSelection}
                    onNavigate={navigateToFolder}
                    onDelete={deleteFolder}
                    onRename={renameFolder}
                    assetCount={getCurrentAssets().filter(a => a.folderId === folder.id).length}
                  />
                ))}

                {/* Assets */}
                {filteredAssets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    viewMode={viewMode}
                    thumbnailSize={thumbnailSize}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDelete={deleteAsset}
                    onDuplicate={duplicateAsset}
                    isSelected={selectedAssets.includes(asset.id)}
                    onSelect={toggleAssetSelection}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Folder Card Component
const FolderCard = ({ folder, viewMode, thumbnailSize, isSelected, onSelect, onNavigate, onDelete, onRename, assetCount }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameName, setRenameName] = useState(folder.name);
  const renameInputRef = useRef(null);

  const getThumbnailSize = () => {
    switch (thumbnailSize) {
      case 'small': return 'w-16 h-16';
      case 'large': return 'w-32 h-32';
      default: return 'w-24 h-24';
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDoubleClick = () => {
    onNavigate(folder.id);
  };

  const handleRename = () => {
    if (renameName.trim() && renameName !== folder.name) {
      onRename(folder.id, renameName.trim());
    }
    setIsRenaming(false);
    setRenameName(folder.name);
  };

  const handleClick = (e) => {
    onSelect(folder.id, e);
  };

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowContextMenu(false);
        if (isRenaming) {
          setIsRenaming(false);
          setRenameName(folder.name);
        }
      }
    };

    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showContextMenu, isRenaming, folder.name]);

  if (viewMode === 'list') {
    return (
      <div 
        className={`flex items-center p-2 rounded cursor-pointer hover:bg-[#333] border ${
          isSelected ? 'border-blue-500 bg-[#333]' : 'border-transparent'
        }`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <FolderOpen size={16} className="mr-3 text-yellow-500" />
        {isRenaming ? (
          <input
            ref={renameInputRef}
            type="text"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setIsRenaming(false);
                setRenameName(folder.name);
              }
            }}
            onBlur={handleRename}
            className="bg-[#2a2a2a] border border-[#555] rounded px-2 py-1 text-sm flex-1"
          />
        ) : (
          <span className="flex-1 text-sm">{folder.name}</span>
        )}
        <span className="text-xs text-[#888] ml-2">({assetCount} items)</span>
        
        {showContextMenu && (
          <div 
            className="fixed bg-[#383838] border border-[#555] rounded shadow-2xl z-50 min-w-32"
            style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
          >
            <div className="py-1">
              <button 
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                onClick={() => {
                  onNavigate(folder.id);
                  setShowContextMenu(false);
                }}
              >
                <FolderOpen size={14} className="mr-2" />
                Open
              </button>
              <button 
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                onClick={() => {
                  setIsRenaming(true);
                  setShowContextMenu(false);
                }}
              >
                <Edit3 size={14} className="mr-2" />
                Rename
              </button>
              <button 
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] text-red-400 flex items-center"
                onClick={() => {
                  onDelete(folder.id);
                  setShowContextMenu(false);
                }}
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`p-2 rounded cursor-pointer hover:bg-[#333] border ${
        isSelected ? 'border-blue-500 bg-[#333]' : 'border-transparent'
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      <div className={`${getThumbnailSize()} mx-auto mb-2 bg-[#383838] rounded flex items-center justify-center`}>
        <FolderOpen size={32} className="text-yellow-500" />
      </div>
      <div className="text-xs text-center">
        {isRenaming ? (
          <input
            ref={renameInputRef}
            type="text"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setIsRenaming(false);
                setRenameName(folder.name);
              }
            }}
            onBlur={handleRename}
            className="bg-[#2a2a2a] border border-[#555] rounded px-2 py-1 text-center w-full"
          />
        ) : (
          <>
            <div className="font-medium truncate">{folder.name}</div>
            <div className="text-[#888]">({assetCount} items)</div>
          </>
        )}
      </div>
      
      {showContextMenu && (
        <div 
          className="fixed bg-[#383838] border border-[#555] rounded shadow-2xl z-50 min-w-32"
          style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
        >
          <div className="py-1">
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
              onClick={() => {
                onNavigate(folder.id);
                setShowContextMenu(false);
              }}
            >
              <FolderOpen size={14} className="mr-2" />
              Open
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
              onClick={() => {
                setIsRenaming(true);
                setShowContextMenu(false);
              }}
            >
              <Edit3 size={14} className="mr-2" />
              Rename
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] text-red-400 flex items-center"
              onClick={() => {
                onDelete(folder.id);
                setShowContextMenu(false);
              }}
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Asset Card Component
const AssetCard = ({ asset, viewMode, thumbnailSize, onDragStart, onDragEnd, onDelete, onDuplicate, isSelected, onSelect }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameName, setRenameName] = useState(asset.name);
  const renameInputRef = useRef(null);

  const getThumbnailSize = () => {
    switch (thumbnailSize) {
      case 'small': return 'w-16 h-16';
      case 'large': return 'w-32 h-32';
      default: return 'w-24 h-24';
    }
  };

  const getAssetIcon = () => {
    switch (asset.type || asset.category) {
      case 'models': return <Box size={32} className="text-blue-400" />;
      case 'textures': return <Image size={32} className="text-green-400" />;
      case 'videos': return <Film size={32} className="text-purple-400" />;
      case 'materials': return <Palette size={32} className="text-orange-400" />;
      case 'particles': return <Sparkles size={32} className="text-pink-400" />;
      default: return <Package size={32} className="text-gray-400" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDoubleClick = () => {
    setShowPreview(true);
  };

  const handleDragStart = (e) => {
    onDragStart(asset, e);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  const handleClick = (e) => {
    onSelect(asset.id, e);
  };

  const handleRename = () => {
    if (renameName.trim() && renameName !== asset.name) {
      // In a real app, you'd call an update function here
      asset.name = renameName.trim();
    }
    setIsRenaming(false);
    setRenameName(asset.name);
  };

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowContextMenu(false);
        setShowPreview(false);
        if (isRenaming) {
          setIsRenaming(false);
          setRenameName(asset.name);
        }
      }
    };

    if (showContextMenu || showPreview) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showContextMenu, showPreview, isRenaming, asset.name]);

  if (viewMode === 'list') {
    return (
      <div 
        className={`flex items-center p-2 rounded cursor-pointer hover:bg-[#333] border ${
          isSelected ? 'border-blue-500 bg-[#333]' : 'border-transparent'
        }`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <div className="w-8 h-8 mr-3 bg-[#383838] rounded flex items-center justify-center">
          {asset.thumbnail ? (
            <img 
              src={asset.thumbnail} 
              alt={asset.name}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            getAssetIcon()
          )}
        </div>
        {isRenaming ? (
          <input
            ref={renameInputRef}
            type="text"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setIsRenaming(false);
                setRenameName(asset.name);
              }
            }}
            onBlur={handleRename}
            className="bg-[#2a2a2a] border border-[#555] rounded px-2 py-1 text-sm flex-1"
          />
        ) : (
          <div className="flex-1">
            <div className="text-sm font-medium truncate">{asset.name}</div>
            <div className="text-xs text-[#888]">
              {asset.fileName && `${asset.fileName} • `}
              {formatFileSize(asset.size)}
              {asset.storageWarning && <span className="text-yellow-400 ml-1">(Large)</span>}
              {asset.error && <span className="text-red-400 ml-1">(Error)</span>}
            </div>
          </div>
        )}
        
        {showContextMenu && (
          <div 
            className="fixed bg-[#383838] border border-[#555] rounded shadow-2xl z-50 min-w-32"
            style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
          >
            <div className="py-1">
              <button 
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                onClick={() => {
                  setShowPreview(true);
                  setShowContextMenu(false);
                }}
              >
                <Eye size={14} className="mr-2" />
                Preview
              </button>
              <button 
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                onClick={() => {
                  setIsRenaming(true);
                  setShowContextMenu(false);
                }}
              >
                <Edit3 size={14} className="mr-2" />
                Rename
              </button>
              <button 
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
                onClick={() => {
                  onDuplicate(asset);
                  setShowContextMenu(false);
                }}
              >
                <Copy size={14} className="mr-2" />
                Duplicate
              </button>
              <button 
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] text-red-400 flex items-center"
                onClick={() => {
                  onDelete(asset.id, asset.type || asset.category);
                  setShowContextMenu(false);
                }}
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`p-2 rounded cursor-pointer hover:bg-[#333] border ${
        isSelected ? 'border-blue-500 bg-[#333]' : 'border-transparent'
      } ${asset.error ? 'border-red-500 border-opacity-50' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      <div className={`${getThumbnailSize()} mx-auto mb-2 bg-[#383838] rounded flex items-center justify-center overflow-hidden relative`}>
        {asset.thumbnail && !asset.error ? (
          <img 
            src={asset.thumbnail} 
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          getAssetIcon()
        )}
        
        {asset.storageWarning && (
          <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs px-1 rounded">
            !
          </div>
        )}
        
        {asset.error && (
          <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">
            <AlertTriangle size={10} />
          </div>
        )}
      </div>
      
      <div className="text-xs text-center">
        {isRenaming ? (
          <input
            ref={renameInputRef}
            type="text"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setIsRenaming(false);
                setRenameName(asset.name);
              }
            }}
            onBlur={handleRename}
            className="bg-[#2a2a2a] border border-[#555] rounded px-2 py-1 text-center w-full"
          />
        ) : (
          <>
            <div className="font-medium truncate" title={asset.name}>{asset.name}</div>
            <div className="text-[#888] truncate" title={asset.fileName}>
              {asset.fileName || 'Generated Asset'}
            </div>
            <div className="text-[#888]">
              {formatFileSize(asset.size)}
            </div>
            {asset.error && (
              <div className="text-red-400 text-xs">Failed to load</div>
            )}
          </>
        )}
      </div>
      
      {showContextMenu && (
        <div 
          className="fixed bg-[#383838] border border-[#555] rounded shadow-2xl z-50 min-w-32"
          style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
        >
          <div className="py-1">
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
              onClick={() => {
                setShowPreview(true);
                setShowContextMenu(false);
              }}
            >
              <Eye size={14} className="mr-2" />
              Preview
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
              onClick={() => {
                setIsRenaming(true);
                setShowContextMenu(false);
              }}
            >
              <Edit3 size={14} className="mr-2" />
              Rename
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] flex items-center"
              onClick={() => {
                onDuplicate(asset);
                setShowContextMenu(false);
              }}
            >
              <Copy size={14} className="mr-2" />
              Duplicate
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#4a4a4a] text-red-400 flex items-center"
              onClick={() => {
                onDelete(asset.id, asset.type || asset.category);
                setShowContextMenu(false);
              }}
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
      
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] border border-[#555] rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#555]">
              <h3 className="text-lg font-medium">{asset.name}</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-[#4a4a4a] rounded"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              {asset.thumbnail && !asset.error ? (
                <img 
                  src={asset.thumbnail} 
                  alt={asset.name}
                  className="max-w-full max-h-96 mx-auto"
                />
              ) : (
                <div className="w-64 h-64 mx-auto bg-[#383838] rounded flex items-center justify-center">
                  {getAssetIcon()}
                </div>
              )}
              <div className="mt-4 space-y-2 text-sm">
                <div><strong>File:</strong> {asset.fileName || 'Generated Asset'}</div>
                <div><strong>Type:</strong> {asset.type || asset.category}</div>
                <div><strong>Size:</strong> {formatFileSize(asset.size)}</div>
                {asset.format && <div><strong>Format:</strong> {asset.format.toUpperCase()}</div>}
                {asset.uploadDate && (
                  <div><strong>Uploaded:</strong> {new Date(asset.uploadDate).toLocaleDateString()}</div>
                )}
                {asset.createdDate && (
                  <div><strong>Created:</strong> {new Date(asset.createdDate).toLocaleDateString()}</div>
                )}
                {asset.error && (
                  <div className="text-red-400"><strong>Error:</strong> {asset.error}</div>
                )}
                {asset.storageWarning && (
                  <div className="text-yellow-400"><strong>Warning:</strong> Large file may cause storage issues</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsPanel;

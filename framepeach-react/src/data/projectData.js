// Template Data Structure
export const templates = {
  business: [
    { id: 'corp-hq', name: 'Corporate HQ', category: 'Professional', preview: '🏢' },
    { id: 'product-showcase', name: 'Product Showcase', category: 'E-commerce', preview: '📱' },
    { id: 'portfolio', name: 'Creative Portfolio', category: 'Creative', preview: '🎨' }
  ],
  ecommerce: [
    { id: 'fashion-store', name: 'Fashion Store', category: 'Retail', preview: '👕' },
    { id: 'tech-shop', name: 'Electronics Shop', category: 'Technology', preview: '💻' },
    { id: 'furniture', name: 'Furniture Showroom', category: 'Home Goods', preview: '🪑' }
  ]
};

// Scene Hierarchy Data Structure
export const sceneHierarchy = [
  {
    id: 'root',
    name: 'Project Root',
    type: 'project',
    children: [
      {
        id: 'page-1',
        name: 'Home Page',
        type: 'page',
        children: [
          { id: 'hero-section', name: 'Hero Section', type: 'component' },
          { id: 'nav-menu', name: 'Navigation Menu', type: 'component' },
          { id: 'product-showcase', name: '3D Product Showcase', type: '3d-component' },
          { id: 'footer', name: 'Footer', type: 'component' }
        ]
      },
      {
        id: 'page-2',
        name: 'About Page',
        type: 'page',
        children: []
      }
    ]
  }
];

// Asset Library Data Structure
export const assets = {
  models: [
    { id: '1', name: 'Product Model', type: '3d', format: '.glb', size: '2.3MB' },
    { id: '2', name: 'Character Rig', type: '3d', format: '.fbx', size: '5.1MB' },
    { id: '3', name: 'Environment', type: '3d', format: '.gltf', size: '8.7MB' }
  ],
  textures: [
    { id: '4', name: 'Metal Texture', type: 'texture', format: '.jpg', size: '512KB' },
    { id: '5', name: 'Wood Pattern', type: 'texture', format: '.png', size: '1.2MB' },
    { id: '6', name: 'HDRI Sky', type: 'texture', format: '.hdr', size: '4.5MB' }
  ],
  components: [
    { id: '7', name: 'Hero Banner', type: 'component', category: 'layout' },
    { id: '8', name: 'Product Card', type: 'component', category: 'e-commerce' },
    { id: '9', name: 'Contact Form', type: 'component', category: 'forms' }
  ]
};

// Material Nodes Data
export const materialNodesData = [
  { id: 'output', type: 'output', x: 400, y: 150 },
  { id: 'texture', type: 'texture', x: 100, y: 100 },
  { id: 'multiply', type: 'math', x: 250, y: 120 }
];

// Performance Metrics Data
export const performanceMetricsData = {
  fps: 60,
  memoryUsage: 1.2,
  renderCalls: 45,
  triangles: 15420,
  loadTime: 2.3
};

// Collaboration Data
export const collaboratorsData = [
  { id: 1, name: 'Alex Chen', avatar: 'AC', status: 'active' },
  { id: 2, name: 'Sarah Kim', avatar: 'SK', status: 'active' },
  { id: 3, name: 'Mike Johnson', avatar: 'MJ', status: 'idle' }
];

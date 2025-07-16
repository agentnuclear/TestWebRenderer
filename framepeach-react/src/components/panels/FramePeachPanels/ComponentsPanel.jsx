import React, { useState } from 'react';
import { 
  Search, Box, Layout, Type, Image, Play, ShoppingBag, 
  Users, MessageSquare, Calendar, BarChart, Map, 
  ChevronDown, ChevronRight, Plus, Code, Link, 
  List, Square, Circle, Minus, AlignLeft, AlignCenter
} from 'lucide-react';

const ComponentsPanel = ({ assets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(['elements', 'layout']);

  const componentCategories = {
    elements: {
      name: 'HTML Elements',
      icon: Code,
      components: [
        { id: 'div', name: 'Div Container', icon: Box, description: 'Generic container element' },
        { id: 'span', name: 'Span', icon: Type, description: 'Inline text element' },
        { id: 'h1', name: 'Heading 1', icon: Type, description: 'Main page heading' },
        { id: 'h2', name: 'Heading 2', icon: Type, description: 'Section heading' },
        { id: 'h3', name: 'Heading 3', icon: Type, description: 'Subsection heading' },
        { id: 'p', name: 'Paragraph', icon: AlignLeft, description: 'Text paragraph' },
        { id: 'img', name: 'Image', icon: Image, description: 'Image element' },
        { id: 'a', name: 'Link', icon: Link, description: 'Hyperlink element' },
        { id: 'button', name: 'Button', icon: Square, description: 'Clickable button' },
        { id: 'input', name: 'Input Field', icon: Square, description: 'Text input' },
        { id: 'textarea', name: 'Text Area', icon: Square, description: 'Multi-line text input' },
        { id: 'select', name: 'Select Dropdown', icon: ChevronDown, description: 'Dropdown selection' },
        { id: 'ul', name: 'Unordered List', icon: List, description: 'Bullet point list' },
        { id: 'ol', name: 'Ordered List', icon: List, description: 'Numbered list' },
        { id: 'li', name: 'List Item', icon: Circle, description: 'Individual list item' },
        { id: 'table', name: 'Table', icon: Layout, description: 'Data table' },
        { id: 'form', name: 'Form', icon: Square, description: 'Form container' },
        { id: 'section', name: 'Section', icon: Box, description: 'Content section' },
        { id: 'article', name: 'Article', icon: Type, description: 'Article content' },
        { id: 'header', name: 'Header', icon: Layout, description: 'Page/section header' },
        { id: 'footer', name: 'Footer', icon: Layout, description: 'Page/section footer' },
        { id: 'nav', name: 'Navigation', icon: Layout, description: 'Navigation container' },
        { id: 'aside', name: 'Aside', icon: Layout, description: 'Sidebar content' },
        { id: 'main', name: 'Main', icon: Layout, description: 'Main content area' },
        { id: 'hr', name: 'Horizontal Rule', icon: Minus, description: 'Divider line' },
        { id: 'br', name: 'Line Break', icon: Type, description: 'Line break' },
        { id: 'strong', name: 'Bold Text', icon: Type, description: 'Bold/strong text' },
        { id: 'em', name: 'Italic Text', icon: Type, description: 'Emphasized/italic text' },
        { id: 'code', name: 'Code', icon: Code, description: 'Inline code' },
        { id: 'pre', name: 'Preformatted', icon: Code, description: 'Preformatted text block' }
      ]
    },
    media: {
      name: 'Media Elements',
      icon: Play,
      components: [
        { id: 'video', name: 'Video', icon: Play, description: 'Video player element' },
        { id: 'audio', name: 'Audio', icon: Play, description: 'Audio player element' },
        { id: 'canvas', name: 'Canvas', icon: Square, description: 'Drawing/graphics canvas' },
        { id: 'svg', name: 'SVG', icon: Image, description: 'Scalable vector graphics' },
        { id: 'iframe', name: 'iFrame', icon: Square, description: 'Embedded content frame' },
        { id: 'embed', name: 'Embed', icon: Square, description: 'Embedded external content' },
        { id: 'object', name: 'Object', icon: Square, description: 'External object embed' },
        { id: 'picture', name: 'Picture', icon: Image, description: 'Responsive image container' },
        { id: 'source', name: 'Source', icon: Image, description: 'Media resource source' },
        { id: 'track', name: 'Track', icon: Type, description: 'Text track for media' }
      ]
    },
    forms: {
      name: 'Form Elements',
      icon: MessageSquare,
      components: [
        { id: 'form', name: 'Form', icon: Square, description: 'Form container' },
        { id: 'input-text', name: 'Text Input', icon: Type, description: 'Single-line text input' },
        { id: 'input-email', name: 'Email Input', icon: MessageSquare, description: 'Email address input' },
        { id: 'input-password', name: 'Password Input', icon: Square, description: 'Password input field' },
        { id: 'input-number', name: 'Number Input', icon: BarChart, description: 'Numeric input' },
        { id: 'input-tel', name: 'Phone Input', icon: MessageSquare, description: 'Telephone number input' },
        { id: 'input-url', name: 'URL Input', icon: Link, description: 'Web address input' },
        { id: 'input-search', name: 'Search Input', icon: Search, description: 'Search input field' },
        { id: 'input-date', name: 'Date Input', icon: Calendar, description: 'Date picker input' },
        { id: 'input-time', name: 'Time Input', icon: Calendar, description: 'Time picker input' },
        { id: 'input-datetime', name: 'DateTime Input', icon: Calendar, description: 'Date and time picker' },
        { id: 'input-color', name: 'Color Input', icon: Circle, description: 'Color picker input' },
        { id: 'input-range', name: 'Range Slider', icon: Minus, description: 'Range slider input' },
        { id: 'input-file', name: 'File Input', icon: Box, description: 'File upload input' },
        { id: 'input-checkbox', name: 'Checkbox', icon: Square, description: 'Checkbox input' },
        { id: 'input-radio', name: 'Radio Button', icon: Circle, description: 'Radio button input' },
        { id: 'textarea', name: 'Text Area', icon: AlignLeft, description: 'Multi-line text input' },
        { id: 'select', name: 'Select', icon: ChevronDown, description: 'Dropdown selection' },
        { id: 'option', name: 'Option', icon: Minus, description: 'Select option item' },
        { id: 'optgroup', name: 'Option Group', icon: List, description: 'Grouped select options' },
        { id: 'label', name: 'Label', icon: Type, description: 'Form field label' },
        { id: 'fieldset', name: 'Fieldset', icon: Box, description: 'Form field grouping' },
        { id: 'legend', name: 'Legend', icon: Type, description: 'Fieldset caption' },
        { id: 'button', name: 'Button', icon: Square, description: 'Form submit/action button' },
        { id: 'input-submit', name: 'Submit Button', icon: Square, description: 'Form submission button' },
        { id: 'input-reset', name: 'Reset Button', icon: Square, description: 'Form reset button' }
      ]    },
    layout: {
      name: 'Layout',
      icon: Layout,
      components: [
        { id: 'header', name: 'Header', icon: Layout, description: 'Navigation header' },
        { id: 'hero', name: 'Hero Section', icon: Image, description: 'Main banner area' },
        { id: 'footer', name: 'Footer', icon: Layout, description: 'Page footer' },
        { id: 'sidebar', name: 'Sidebar', icon: Layout, description: 'Side navigation' },
        { id: 'grid', name: 'Grid Layout', icon: Layout, description: 'Responsive grid' },
        { id: 'container', name: 'Container', icon: Box, description: 'Content wrapper' }
      ]
    },
    content: {
      name: 'Content',
      icon: Type,
      components: [
        { id: 'heading', name: 'Heading', icon: Type, description: 'Text heading' },
        { id: 'paragraph', name: 'Paragraph', icon: Type, description: 'Body text' },
        { id: 'image', name: 'Image', icon: Image, description: 'Picture element' },
        { id: 'gallery', name: 'Image Gallery', icon: Image, description: 'Photo gallery' },
        { id: 'video', name: 'Video Player', icon: Play, description: 'Video embed' },
        { id: 'carousel', name: 'Carousel', icon: Image, description: 'Image slider' }
      ]
    },
    ecommerce: {
      name: 'E-commerce',
      icon: ShoppingBag,
      components: [
        { id: 'product-card', name: 'Product Card', icon: ShoppingBag, description: 'Product display' },
        { id: 'cart', name: 'Shopping Cart', icon: ShoppingBag, description: 'Cart widget' },
        { id: 'checkout', name: 'Checkout Form', icon: ShoppingBag, description: 'Payment form' },
        { id: 'wishlist', name: 'Wishlist', icon: ShoppingBag, description: 'Saved items' },
        { id: 'reviews', name: 'Product Reviews', icon: MessageSquare, description: 'Customer reviews' },
        { id: 'pricing', name: 'Pricing Table', icon: BarChart, description: 'Price comparison' }
      ]    },
    formsInput: {
      name: 'Forms & Input',
      icon: MessageSquare,
      components: [
        { id: 'contact-form', name: 'Contact Form', icon: MessageSquare, description: 'Contact us form' },
        { id: 'newsletter', name: 'Newsletter Signup', icon: MessageSquare, description: 'Email subscription' },
        { id: 'search-bar', name: 'Search Bar', icon: Search, description: 'Site search' },
        { id: 'login', name: 'Login Form', icon: Users, description: 'User authentication' },
        { id: 'survey', name: 'Survey Form', icon: MessageSquare, description: 'Feedback form' }
      ]
    },
    navigation: {
      name: 'Navigation',
      icon: Layout,
      components: [
        { id: 'navbar', name: 'Navigation Bar', icon: Layout, description: 'Main navigation' },
        { id: 'breadcrumb', name: 'Breadcrumb', icon: Layout, description: 'Page path' },
        { id: 'pagination', name: 'Pagination', icon: Layout, description: 'Page numbers' },
        { id: 'tabs', name: 'Tab Navigation', icon: Layout, description: 'Tabbed content' },
        { id: 'dropdown', name: 'Dropdown Menu', icon: Layout, description: 'Expandable menu' }
      ]
    },
    social: {
      name: 'Social & Media',
      icon: Users,
      components: [
        { id: 'social-links', name: 'Social Links', icon: Users, description: 'Social media icons' },
        { id: 'testimonial', name: 'Testimonial', icon: MessageSquare, description: 'Customer quote' },
        { id: 'team-card', name: 'Team Member', icon: Users, description: 'Staff profile' },
        { id: 'blog-post', name: 'Blog Post', icon: Type, description: 'Article layout' },
        { id: 'comment', name: 'Comments', icon: MessageSquare, description: 'User comments' }
      ]
    },
    interactive: {
      name: 'Interactive',
      icon: Play,
      components: [
        { id: 'modal', name: 'Modal Dialog', icon: Box, description: 'Popup window' },
        { id: 'accordion', name: 'Accordion', icon: Box, description: 'Collapsible content' },
        { id: 'tooltip', name: 'Tooltip', icon: MessageSquare, description: 'Hover information' },
        { id: 'progress', name: 'Progress Bar', icon: BarChart, description: 'Loading indicator' },
        { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'Date picker' },
        { id: 'map', name: 'Map', icon: Map, description: 'Location map' }
      ]
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredCategories = Object.entries(componentCategories).map(([id, category]) => ({
    id,
    ...category,
    components: category.components.filter(component => 
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.components.length > 0);

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredCategories.map(category => {
            const CategoryIcon = category.icon;
            const isExpanded = expandedCategories.includes(category.id);
            
            return (
              <div key={category.id} className="mb-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded text-left"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <CategoryIcon size={14} className="text-blue-400" />
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs text-gray-500">({category.components.length})</span>
                  </div>
                </button>

                {/* Category Components */}
                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {category.components.map(component => {
                      const ComponentIcon = component.icon;
                      return (
                        <div
                          key={component.id}
                          className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer group"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('component', JSON.stringify(component));
                          }}
                        >
                          <ComponentIcon size={14} className="mr-3 text-gray-400 group-hover:text-blue-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{component.name}</div>
                            <div className="text-xs text-gray-500 truncate">{component.description}</div>
                          </div>
                          <Plus size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Component */}
      <div className="p-3 border-t border-gray-700">
        <button className="w-full btn">
          <Plus size={14} />
          Create Custom Component
        </button>
      </div>
    </div>
  );
};

export default ComponentsPanel;

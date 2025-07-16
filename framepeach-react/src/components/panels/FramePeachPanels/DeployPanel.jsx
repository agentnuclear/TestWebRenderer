import React, { useState } from 'react';
import {
  Globe, ExternalLink, CheckCircle, Clock, AlertCircle,
  Upload, Share2, Copy, Link, Settings
} from 'lucide-react';

const DeployPanel = () => {
  const [deploymentStatus, setDeploymentStatus] = useState('ready');
  const [customDomain, setCustomDomain] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeploymentStatus('deploying');

    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);
      setDeploymentStatus('success');
    }, 3000);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText('https://framepeach-demo.vercel.app');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="property-group-header">
        <span>Deploy & Share</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Current Site Status */}
          <div className="property-group">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Globe size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Your Website</div>
                    <div className="text-sm text-gray-400">framepeach-demo.vercel.app</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${deploymentStatus === 'success' ? 'bg-green-400' :
                          deploymentStatus === 'deploying' ? 'bg-yellow-400 animate-pulse' :
                            'bg-gray-400'
                        }`}></div>
                      <span className="text-xs text-gray-400">
                        {deploymentStatus === 'success' ? 'Live' :
                          deploymentStatus === 'deploying' ? 'Deploying...' :
                            'Ready to deploy'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyUrl}
                      className="tool-button"
                      title="Copy URL"
                    >
                      <Copy size={16} />
                    </button>
                    <button className="tool-button" title="Open in new tab">
                      <ExternalLink size={16} />
                    </button>
                    <button className="tool-button" title="Share">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>


              {/* Deploy Button */}
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className={`btn primary w-full h-12 text-lg ${isDeploying ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isDeploying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deploying...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Deploy Website
                  </>
                )}
              </button>

              {deploymentStatus === 'success' && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="text-sm text-green-400">Deployed successfully!</span>
                </div>
              )}
            </div>
          </div>          {/* Custom Domain */}
          <div className="property-group">
            <div className="property-group-header">
              <span>Custom Domain</span>
              <Link size={12} className="text-gray-400" />
            </div>
            <div className="p-4 space-y-3">
              <div className="text-sm text-gray-400 mb-3">
                Want to use your own domain? Enter it below and we'll handle the rest.
              </div>

              <div className="property-row">
                <span className="property-label">Domain</span>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="example.com"
                  className="property-value"
                />
              </div>

              {customDomain && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-sm font-medium mb-2">Next Steps:</div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>1. Add these DNS records to your domain:</div>
                    <div className="ml-4 font-mono bg-gray-800 p-2 rounded">
                      A Record: @ → 76.76.19.142
                    </div>
                    <div className="ml-4 font-mono bg-gray-800 p-2 rounded">
                      CNAME: www → framepeach-demo.vercel.app
                    </div>
                    <div>2. Click "Verify Domain" when DNS is updated</div>
                  </div>
                </div>
              )}

              <button
                className={`btn w-full ${customDomain ? 'primary' : ''}`}
                disabled={!customDomain}
              >
                {customDomain ? 'Verify Domain' : 'Enter Domain First'}
              </button>
            </div>
          </div>

          {/* Deployment History */}
          <div className="property-group">
            <div className="property-group-header">
              <span>Recent Deployments</span>
              <Clock size={12} className="text-gray-400" />
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div>
                      <div className="text-sm font-medium">Production</div>
                      <div className="text-xs text-gray-400">2 minutes ago</div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-gray-400 hover:text-white cursor-pointer" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <div>
                      <div className="text-sm font-medium">Previous Version</div>
                      <div className="text-xs text-gray-400">1 hour ago</div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-gray-400 hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployPanel;

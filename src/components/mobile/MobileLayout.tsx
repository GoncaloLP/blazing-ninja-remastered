import React, { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  showHeader = true, 
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 flex flex-col">
      {/* Status Bar Placeholder */}
      <div className="h-6 bg-black/20" />
      
      {/* Header */}
      {showHeader && (
        <div className="flex-none px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🔥</span>
                </div>
                <span className="text-white font-bold text-lg">Blazing</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-blue-400 rounded-full" />
                <span className="text-white font-bold text-sm">999</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-purple-400 rounded-full" />
                <span className="text-white font-bold text-sm">50</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-green-400 rounded-full" />
                <span className="text-white font-bold text-sm">120/120</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      
      {/* Footer Navigation */}
      {showFooter && (
        <div className="flex-none bg-gradient-to-r from-gray-800 to-gray-900 px-2 py-2 shadow-lg">
          <div className="flex justify-around items-center">
            <FooterButton icon="🏠" label="Home" active />
            <FooterButton icon="⭐" label="Summon" />
            <FooterButton icon="📦" label="Box" />
            <FooterButton icon="🗺️" label="Story" />
            <FooterButton icon="⚔️" label="Battle" />
            <FooterButton icon="⚙️" label="More" />
          </div>
        </div>
      )}
    </div>
  );
};

interface FooterButtonProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const FooterButton: React.FC<FooterButtonProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-lg transition-all ${
      active 
        ? 'bg-orange-500 text-white shadow-lg' 
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-xs font-semibold">{label}</span>
  </button>
);
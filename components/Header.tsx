
import React from 'react';
import { User, AppView } from '../types.ts';

interface HeaderProps {
  user: User | null;
  setView: (view: AppView) => void;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, setView, onLogout, onLoginClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer group" 
          onClick={() => setView('landing')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
            FV
          </div>
          <span className="text-xl font-display font-bold text-slate-900 tracking-tight">FabricVision</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <button onClick={() => setView('landing')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</button>
          <button onClick={() => setView('catalog')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Catalog</button>
          <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</button>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Hello, <span className="font-semibold">{user.name}</span></span>
              <button 
                onClick={onLogout}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-indigo-200 transition-all active:scale-95"
            >
              Partner Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

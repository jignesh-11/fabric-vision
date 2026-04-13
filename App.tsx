
import React, { useState } from 'react';
import { Material, User, AppView } from './types.ts';
import { FABRIC_MATERIALS } from './constants.ts';
import Header from './components/Header.tsx';
import MaterialCatalog from './components/MaterialCatalog.tsx';
import ImagePreviewer from './components/ImagePreviewer.tsx';
import LandingPage from './components/LandingPage.tsx';
import AuthModal from './components/AuthModal.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleMaterialToggle = (material: Material) => {
    setSelectedMaterials(prev => {
      if (prev.find(m => m.id === material.id)) {
        return prev.filter(m => m.id !== material.id);
      } else {
        return [...prev, material];
      }
    });
  };

  const handlePreviewClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setView('previewer');
    }
  };

  const handleLogin = (email: string) => {
    setUser({
      name: email.split('@')[0],
      email: email,
      isLoggedIn: true
    });
    setShowAuthModal(false);
    if (selectedMaterials.length > 0) {
      setView('previewer');
    } else {
      setView('catalog');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user} 
        setView={setView} 
        onLogout={() => { setUser(null); setView('landing'); }}
        onLoginClick={() => setShowAuthModal(true)}
      />

      <main className="flex-grow">
        {view === 'landing' && (
          <LandingPage onGetStarted={() => setView('catalog')} />
        )}

        {view === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-display font-bold text-slate-900">Premium Fabric Collection</h2>
              {selectedMaterials.length > 0 && (
                <button 
                  onClick={handlePreviewClick}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center space-x-2"
                >
                  <span>Preview {selectedMaterials.length} Selected</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <MaterialCatalog 
              materials={FABRIC_MATERIALS} 
              selectedMaterials={selectedMaterials}
              onToggleSelect={handleMaterialToggle} 
            />
          </div>
        )}

        {view === 'previewer' && (
          <ImagePreviewer 
            selectedMaterials={selectedMaterials} 
            onBack={() => setView('catalog')}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">FV</div>
            <span className="text-slate-900 font-bold">FabricVision</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 FabricVision SaaS. Empowering material sellers worldwide.
          </div>
          <div className="flex space-x-6 text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
};

export default App;

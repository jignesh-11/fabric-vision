
import React from 'react';
import { Material } from '../types.ts';

interface MaterialCatalogProps {
  materials: Material[];
  selectedMaterials: Material[];
  onToggleSelect: (material: Material) => void;
}

const MaterialCatalog: React.FC<MaterialCatalogProps> = ({ materials, selectedMaterials, onToggleSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {materials.map((material) => {
        const isSelected = selectedMaterials.some(m => m.id === material.id);
        return (
        <div 
          key={material.id}
          className={`group bg-white rounded-2xl border ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-slate-200'} overflow-hidden hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 flex flex-col`}
        >
          <div className="relative aspect-square overflow-hidden bg-slate-100">
            <img 
              src={material.imageUrl} 
              alt={material.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{material.category}</p>
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-900">{material.name}</h3>
              <p className="text-indigo-600 font-bold">${material.pricePerMeter.toFixed(2)}<span className="text-slate-400 text-xs font-normal">/m</span></p>
            </div>
            <p className="text-slate-500 text-sm mb-6 flex-grow">{material.description}</p>
            <button 
              onClick={() => onToggleSelect(material)}
              className={`w-full font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-900 group-hover:bg-indigo-600 text-white'}`}
            >
              <span>{isSelected ? 'Selected' : 'Select for Preview'}</span>
              {isSelected ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )})}
    </div>
  );
};

export default MaterialCatalog;

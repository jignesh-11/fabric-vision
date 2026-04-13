
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-slate-200 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Revolutionizing Textile Retail</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 leading-[1.1]">
              Try Before You <span className="text-indigo-600">Sew.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              FabricVision allows your customers to upload photos and instantly see how your premium materials look on them. Boost conversion and reduce returns with AI-powered texture mapping.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={onGetStarted}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1"
              >
                Explore Catalog
              </button>
              <button className="bg-white border border-slate-200 hover:border-indigo-600 text-slate-700 hover:text-indigo-600 px-8 py-4 rounded-xl font-semibold transition-all">
                How it Works
              </button>
            </div>
            
            <div className="flex items-center space-x-8 pt-8 border-t border-slate-100">
              <div>
                <p className="text-2xl font-bold text-slate-900">500+</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider">Materials</p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">98%</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider">AI Accuracy</p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">10k+</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider">Users</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white p-4 rounded-3xl shadow-2xl rotate-3 relative z-20">
              <img 
                src="https://images.unsplash.com/photo-1594932224828-b4b059b6ffc0?q=80&w=800&auto=format&fit=crop" 
                alt="AI preview mockup" 
                className="rounded-2xl w-full h-[450px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-indigo-600 text-white p-4 rounded-2xl shadow-xl -rotate-6 hidden lg:block">
                <p className="text-sm font-semibold italic">"The texture mapping is flawless!"</p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-indigo-600/5 rounded-full -rotate-12 -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

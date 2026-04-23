import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, Image as ImageIcon } from 'lucide-react';

const UnsplashModal = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // We'll use a public-ish demo key for now, or suggest the user adds theirs
  // In a real app, this would be an environment variable
  const UNSPLASH_ACCESS_KEY = ''; // User can paste theirs here

  const searchImages = React.useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      if (!UNSPLASH_ACCESS_KEY) {
        const fallbacks = [
          { id: '1', urls: { regular: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' }, alt_description: 'Office' },
          { id: '2', urls: { regular: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80' }, alt_description: 'Meeting' },
          { id: '3', urls: { regular: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80' }, alt_description: 'Team' },
          { id: '4', urls: { regular: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80' }, alt_description: 'Collaboration' },
          { id: '5', urls: { regular: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80' }, alt_description: 'Laptop' },
          { id: '6', urls: { regular: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80' }, alt_description: 'Analysis' }
        ];
        setImages(fallbacks);
        setError("Note: No Unsplash API key found. Showing demo results.");
      } else {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        setImages(data.results || []);
      }
    } catch (err) {
      setError("Failed to fetch images from Unsplash.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (isOpen && query) {
      const timeoutId = setTimeout(() => {
        searchImages();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, query, searchImages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-[#c7cad5]">
        {/* Header */}
        <div className="p-6 border-b border-[#e9eaef] flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-lg">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 leading-none">Unsplash Library</h2>
              <p className="text-xs text-slate-500 mt-1 font-bold">Search millions of free high-resolution photos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-[#e9eaef]">
          <form onSubmit={searchImages} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for 'office', 'technology', 'abstract'..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl text-lg font-medium outline-none focus:ring-2 focus:ring-[#5b76fe] transition-all"
              autoFocus
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#5b76fe] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
            </button>
          </form>
          {error && <p className="text-xs text-amber-600 mt-2 font-bold">{error}</p>}
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => onSelect(img.urls.regular)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 hover:ring-4 hover:ring-[#5b76fe] transition-all shadow-sm"
                >
                  <img src={img.urls.regular} alt={img.alt_description} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-black shadow-lg">SELECT PHOTO</span>
                  </div>
                </button>
              ))}
            </div>
          ) : !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <ImageIcon size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-bold">Search for beautiful images</p>
              <p className="text-sm">Enter a keyword above to start browsing</p>
            </div>
          )}
          
          {loading && images.length === 0 && (
            <div className="h-full flex items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-[#5b76fe]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnsplashModal;

import React, { useState } from 'react';
import { 
  X, Search, Zap, Shield, Smartphone, Heart, Star, Cloud, 
  Code, Command, Cpu, Database, Globe, Image, Layout, 
  Mail, Map, MessageSquare, Moon, Music, Package, 
  PieChart, Play, Rocket, Settings, Share2, ShoppingCart, 
  Smile, Sun, Target, Terminal, ThumbsUp, Trash2, 
  TrendingUp, Truck, Users, Video, Wifi, Bell, Camera
} from 'lucide-react';

const ICON_LIST = {
  Zap, Shield, Smartphone, Heart, Star, Cloud, 
  Code, Command, Cpu, Database, Globe, Image, Layout, 
  Mail, Map, MessageSquare, Moon, Music, Package, 
  PieChart, Play, Rocket, Settings, Share2, ShoppingCart, 
  Smile, Sun, Target, Terminal, ThumbsUp, Trash2, 
  TrendingUp, Truck, Users, Video, Wifi, Bell, Camera
};

const IconPickerModal = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredIcons = Object.keys(ICON_LIST).filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[70vh] overflow-hidden flex flex-col shadow-2xl border border-[#c7cad5]">
        <div className="p-6 border-b border-[#e9eaef] flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-800 leading-none">Pick an Icon</h2>
            <p className="text-xs text-slate-500 mt-1 font-bold">Choose the perfect visual for your feature</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-[#e9eaef]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search icons..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#5b76fe] transition-all"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredIcons.map((name) => {
              const Icon = ICON_LIST[name];
              return (
                <button
                  key={name}
                  onClick={() => onSelect(name)}
                  className="aspect-square flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-[#e9eaef] hover:border-[#5b76fe] hover:bg-[#5b76fe]/5 transition-all group"
                  title={name}
                >
                  <Icon size={24} className="text-slate-600 group-hover:text-[#5b76fe] transition-colors" />
                  <span className="text-[10px] mt-1 text-slate-400 truncate w-full text-center">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconPickerModal;
export { ICON_LIST };

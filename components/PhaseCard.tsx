
import React from 'react';
import { Phase } from '../types';

interface PhaseCardProps {
  phase: Phase;
  isActive: boolean;
  onClick: () => void;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-300 transform ${
        isActive ? 'scale-105 z-10' : 'hover:scale-102 opacity-80 hover:opacity-100'
      }`}
    >
      <div className={`p-6 rounded-2xl glass h-full ${
        isActive ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-zinc-800'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <span className="text-4xl">{phase.icon}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isActive ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}>
            Month {phase.month}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{phase.title}</h3>
        <p className="text-blue-400 text-sm font-medium mb-3">{phase.focus}</p>
        <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed">
          {phase.description}
        </p>
        
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default PhaseCard;

import React, { useState, KeyboardEvent } from 'react';
import { X, Plus, Terminal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TagInputProps {
  label?: string;
  placeholder?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  icon?: React.ReactNode;
}

export const TagInput = ({ label, placeholder, tags, onChange, icon }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onChange([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="w-full space-y-3">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-zinc-500">
          {label}
        </label>
      )}
      <div className="flex gap-2 items-center">
        <div className="flex-1 flex flex-wrap items-center gap-2 min-h-[56px] rounded-xl border border-white/[0.05] bg-white/[0.02] transition-all focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 px-4 py-2">
          {icon ? (
            <div className="text-zinc-600 flex-shrink-0">{icon}</div>
          ) : (
            <Terminal className="h-4 w-4 text-zinc-600 flex-shrink-0" />
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 text-sm font-medium p-1 text-white placeholder:text-zinc-600"
          />
        </div>
        <button 
          type="button"
          onClick={addTag}
          className="h-14 w-14 bg-white/[0.03] border border-white/[0.08] text-white rounded-xl flex items-center justify-center hover:bg-white/[0.06] hover:border-white/[0.12] transition-all shrink-0"
        >
          <Plus className="h-5 w-5 opacity-60" />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-in zoom-in-95 duration-200 uppercase tracking-widest"
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-indigo-200 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

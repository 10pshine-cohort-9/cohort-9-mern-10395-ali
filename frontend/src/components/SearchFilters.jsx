import { Search, X } from 'lucide-react';

const SearchFilters = ({ onSearch, value }) => {
  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="dashboard-search" className="sr-only">Search notes</label>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        id="dashboard-search"
        type="text"
        placeholder="Search through notes..."
        className="w-full rounded-2xl bg-white py-4 pl-12 pr-12 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-accent transition-all shadow-sm"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
      {value && (
        <button 
          onClick={() => onSearch('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchFilters;
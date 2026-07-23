import { Search } from 'lucide-react';
import './SearchBar.css';

export function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search className="search-bar__icon" size={20} aria-hidden="true" />
      <input
        className="search-bar__input"
        type="search"
        placeholder="Search your tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks"
      />
    </div>
  );
}

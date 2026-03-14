import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface BlockSearchProps {
  onSearch: (query: string) => void;
}

export default function BlockSearch({ onSearch }: BlockSearchProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 150);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="block-search">
      <Search size={14} />
      <input
        type="text"
        placeholder="Search blocks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

import { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { blockDefinitions, getCategories, getBlocksByCategory } from '../../blocks/blockDefinitions';
import { useEditorStore } from '../../store/useEditorStore';
import BlockCard from './BlockCard';
import BlockSearch from './BlockSearch';
import './BlockLibrary.css';

export default function BlockLibrary() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Primitives']));
  const [searchQuery, setSearchQuery] = useState('');
  const addBlock = useEditorStore((s) => s.addBlock);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.toLowerCase());
  }, []);

  const categories = getCategories();

  const filteredBlocks = searchQuery
    ? blockDefinitions.filter((b) => b.name.toLowerCase().includes(searchQuery))
    : null;

  return (
    <div className="block-library">
      <BlockSearch onSearch={handleSearch} />
      <div className="block-library-content">
        {filteredBlocks ? (
          <div className="block-grid">
            {filteredBlocks.map((def) => (
              <BlockCard
                key={def.id}
                blockId={def.id}
                name={def.name}
                onClick={() => addBlock(def.id, def.name)}
              />
            ))}
            {filteredBlocks.length === 0 && (
              <div className="no-results">No blocks found</div>
            )}
          </div>
        ) : (
          categories.map((cat) => {
            const catBlocks = getBlocksByCategory(cat);
            const isExpanded = expandedCategories.has(cat);
            return (
              <div key={cat} className="block-category">
                <button className="category-header" onClick={() => toggleCategory(cat)}>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>{cat}</span>
                  <span className="category-count">{catBlocks.length}</span>
                </button>
                {isExpanded && (
                  <div className="block-grid">
                    {catBlocks.map((def) => (
                      <BlockCard
                        key={def.id}
                        blockId={def.id}
                        name={def.name}
                        onClick={() => addBlock(def.id, def.name)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ChevronDown, ChevronRight, Bot } from 'lucide-react';
import { getMechTypes, getTemplatesByType } from '../../blocks/mechTemplates';
import { useEditorStore } from '../../store/useEditorStore';
import './MechTemplates.css';

const mechTypes = getMechTypes();

export default function MechTemplates() {
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const loadTemplate = useEditorStore((s) => s.loadTemplate);

  const toggleType = (typeId: string) => {
    setExpandedType((prev) => (prev === typeId ? null : typeId));
  };

  return (
    <div className="mech-templates">
      <div className="mech-templates-content">
        {mechTypes.map((mt) => {
          const templates = getTemplatesByType(mt.id);
          const isExpanded = expandedType === mt.id;
          return (
            <div key={mt.id} className="mech-type-group">
              <button className="mech-type-header" onClick={() => toggleType(mt.id)}>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span>{mt.name}</span>
                <span className="mech-type-count">{templates.length}</span>
              </button>
              {isExpanded && (
                <div className="mech-template-list">
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      className="mech-template-card"
                      onClick={() => loadTemplate(tpl.id)}
                      title={tpl.description}
                    >
                      <div className="mech-template-icon">
                        <Bot size={18} />
                      </div>
                      <div className="mech-template-info">
                        <span className="mech-template-name">{tpl.name}</span>
                        <span className="mech-template-parts">{tpl.parts.length} parts</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

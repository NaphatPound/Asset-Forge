import { useState } from 'react';
import BlockLibrary from '../blocks/BlockLibrary';
import MechTemplates from '../blocks/MechTemplates';
import SceneTree from '../hierarchy/SceneTree';
import './LeftPanel.css';

export default function LeftPanel() {
  const [tab, setTab] = useState<'blocks' | 'templates'>('blocks');

  return (
    <div className="left-panel panel">
      <div className="left-panel-section left-panel-library">
        <div className="left-panel-tabs">
          <button
            className={`left-panel-tab ${tab === 'blocks' ? 'active' : ''}`}
            onClick={() => setTab('blocks')}
          >
            Blocks
          </button>
          <button
            className={`left-panel-tab ${tab === 'templates' ? 'active' : ''}`}
            onClick={() => setTab('templates')}
          >
            Templates
          </button>
        </div>
        {tab === 'blocks' ? <BlockLibrary /> : <MechTemplates />}
      </div>
      <div className="left-panel-section left-panel-tree">
        <SceneTree />
      </div>
    </div>
  );
}

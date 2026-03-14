import './BlockCard.css';

interface BlockCardProps {
  name: string;
  blockId: string;
  onClick: () => void;
}

export default function BlockCard({ name, onClick }: BlockCardProps) {
  return (
    <button className="block-card" onClick={onClick} title={name}>
      <div className="block-card-icon">
        <span>{name.charAt(0)}</span>
      </div>
      <span className="block-card-name">{name}</span>
    </button>
  );
}

export default function SentimentBadge({ sentiment }) {
  const map = {
    positive: { emoji: '😄', color: '#27ae60', bg: '#eafaf1' },
    neutral:  { emoji: '😐', color: '#f39c12', bg: '#fef9e7' },
    negative: { emoji: '😡', color: '#e74c3c', bg: '#fdedec' },
  };
  const s = map[sentiment] || map.neutral;
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px',
      borderRadius: 12, fontSize: 13, fontWeight: 600 }}>
      {s.emoji} {sentiment}
    </span>
  );
}

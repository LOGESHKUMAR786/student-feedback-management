export default function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          style={{ fontSize: 28, cursor: readOnly ? 'default' : 'pointer',
            color: star <= value ? '#f5a623' : '#ccc', transition: 'color 0.2s' }}
        >★</span>
      ))}
    </div>
  );
}

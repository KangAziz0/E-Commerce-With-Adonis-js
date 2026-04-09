export const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="d-flex gap-1 mb-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={star <= rating ? "#f5a623" : "none"}
        stroke={star <= rating ? "#f5a623" : "#ccc"}
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

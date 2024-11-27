import ReactStars from "react-stars";

export default function StarRating({ rating, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <ReactStars
        count={5}
        value={rating}
        onChange={onChange}
        size={20}
        color2={"#ffd700"}
      />
      <p className="text-xl">{rating}</p>
    </div>
  );
}

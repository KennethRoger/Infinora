import StarRating from "../Rating/StarRating";
import { useState } from "react";

export default function ProductCard() {
  const [rating, setRating] = useState(0);
  const ratingChanged = (newRating) => {
    setRating(newRating);
    console.log(newRating);
  };
  return (
    <>
      <div className="w-[250px] border shadow-lg">
        <div>
          <img
            src="https://placehold.co/200x200"
            alt="Product image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start p-2">
          <p className="text-gray-600">Creator name</p>
          <h3 className="font-bold">Product name ajjhak assd sk...</h3>
          <StarRating rating={rating} onChange={ratingChanged} />
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl text-green-600">₹553</p>
            <div className="flex gap-2 text-sm">
              <s>₹700</s>
              <p>(79% off)</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

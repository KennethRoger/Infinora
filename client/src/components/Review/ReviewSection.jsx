import { useEffect, useState } from "react";
import { getProductReviews } from "@/api/review/reviewApi";
import StarRating from "../Rating/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import Spinner from "../Spinner/Spinner";
import Pagination from "../Pagination";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
  });

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getProductReviews(productId, page);
      setReviews(data.reviews);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalReviews: data.pagination.totalReviews,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handlePageChange = (newPage) => {
    fetchReviews(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading reviews: {error}
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-16">
      <div className="border-t pt-10">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <StarRating rating={averageRating} />
            <span className="text-gray-600">
              Based on {pagination.totalReviews} reviews
            </span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b pb-8 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review.user.profileImagePath}
                        alt={review.user.name}
                      />
                      <AvatarFallback>
                        {review.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{review.user.name}</h3>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        {review.isVerifiedPurchase && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-gray-600">{review.review}</p>
                  {review.isEdited && (
                    <span className="text-xs text-gray-500 mt-2 block">
                      (Edited)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

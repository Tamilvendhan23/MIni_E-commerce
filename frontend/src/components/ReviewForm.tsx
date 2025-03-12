import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useReviewStore } from '../stores/reviewStore';
import { useAuthStore } from '../stores/authStore';

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSuccess }) => {
  const { user } = useAuthStore();
  const { addReview } = useReviewStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    addReview({
      productId,
      userId: user.id,
      rating,
      comment,
      verified: true
    });
    
    setRating(0);
    setComment('');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  value <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input"
          placeholder="Share your thoughts about this product..."
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={rating === 0 || !comment.trim()}
        className="btn btn-primary w-full"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
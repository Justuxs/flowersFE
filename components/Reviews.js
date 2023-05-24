import React from 'react';

const Reviews = ({ reviews }) => {
    return (
        <div className="flex flex-wrap gap-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-yellow-200 p-4 rounded-lg break-all flex-shrink-0 w-64"
                >
                    <p className="text-lg font-bold">Comment: {review.comment}</p>
                    <p>Rate: {review.rate}</p>
                    <p>Reviewer: {review.reviewerName}</p>
                </div>
            ))}
        </div>
    );
};

export default Reviews;

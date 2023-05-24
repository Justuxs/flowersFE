import React from 'react';

const Reviews = ({ reviews }) => {
    return (
        <div >
            {reviews.map((review) => (
                <div className="card bg-amber-50 p-5"
                    key={review.id}
                >
                    <p className="text-xl font-bold whitespace-pre-line"> {review.comment}</p>

                    <p>Rate: {review.rate}</p>
                    <p>Reviewer: {review.reviewerName}</p>
                </div>
            ))}
        </div>
    );
};

export default Reviews;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Star, UserCircle, MessageSquare } from 'lucide-react';

interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface CompanyReviewsProps {
  reviews: Review[];
}

const CompanyReviews: React.FC<CompanyReviewsProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
     return (
        <section aria-labelledby="reviews-title" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 id="reviews-title" className="text-xl font-semibold text-hegra-deep-navy mb-4">Ulasan Klien</h2>
            <div className="flex flex-col items-center justify-center text-gray-400 h-32 bg-gray-50 rounded-md">
                <MessageSquare size={32} className="mb-2" />
                <p className="text-sm ">Belum ada ulasan untuk perusahaan ini.</p>
            </div>
        </section>
    );
  }

  return (
    <section aria-labelledby="reviews-title" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 id="reviews-title" className="text-xl font-semibold text-hegra-deep-navy mb-5">
        Ulasan Klien ({reviews.length})
      </h2>
      <div className="space-y-5 max-h-96 overflow-y-auto pr-2"> {/* Added pr-2 for scrollbar space */}
        {reviews.map((review, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-start sm:items-center justify-between mb-1.5 flex-wrap gap-y-1">
              <div className="flex items-center">
                <UserCircle size={24} className="text-gray-400 mr-1.5" />
                <div>
                  <p className="text-sm font-semibold text-hegra-deep-navy">{review.author}</p>
                  <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric'})}</p>
                </div>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < review.rating ? 'text-hegra-yellow' : 'text-gray-300'}
                    fill={i < review.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed pl-1">{review.comment}</p> {/* Added pl-1 for slight indent */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompanyReviews;
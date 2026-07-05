import { ProductReview } from "@lib/data/reviews"

type ProductReviewsProps = {
  reviews: ProductReview[]
  count: number
  averageRating: number
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < full ? "#f5a623" : "#e0e0e0"}
          aria-hidden
        >
          <path d="M12 2l2.9 6.9 7.1.6-5.4 4.6 1.7 7-6.3-3.8-6.3 3.8 1.7-7-5.4-4.6 7.1-.6L12 2z" />
        </svg>
      ))}
    </span>
  )
}

function formatDate(value?: string) {
  if (!value) {
    return ""
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

const ProductReviews = ({ reviews, count, averageRating }: ProductReviewsProps) => {
  if (count === 0) {
    return (
      <p className="py-4 text-sm text-[#888]">
        No reviews yet. Be the first to share your experience.
      </p>
    )
  }

  return (
    <div className="py-2">
      <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-[#eee] pb-6">
        <Stars rating={averageRating} />
        <span className="text-sm font-medium text-[#2d2d2d]">
          {averageRating.toFixed(1)} out of 5
        </span>
        <span className="text-sm text-[#888]">
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      </div>

      <ul className="flex flex-col gap-6">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="border-b border-[#f0f0f0] pb-6 last:border-0 last:pb-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[#2d2d2d]">
                  {review.first_name} {review.last_name.charAt(0)}.
                </p>
                {review.created_at ? (
                  <p className="text-xs text-[#999]">{formatDate(review.created_at)}</p>
                ) : null}
              </div>
              <Stars rating={review.rating} />
            </div>
            {review.title ? (
              <p className="mt-2 text-sm font-medium text-[#444]">{review.title}</p>
            ) : null}
            <p className="mt-2 text-sm leading-relaxed text-[#666]">{review.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductReviews

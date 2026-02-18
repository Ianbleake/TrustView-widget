import WidgetCard from '../components/WidgetCard'
import Rating from '../components/Rating'

type Props = {
  storeId: string
  reviews: any[]
}

export const ReviewsLayout = ({ reviews }: Props) => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-6">
        Reseñas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.length === 0 && (
          <WidgetCard>
            <p className="text-sm text-gray-500">
              No hay reseñas todavía.
            </p>
          </WidgetCard>
        )}

        {reviews.map((review, index) => (
          <WidgetCard key={index}>
            <div className="flex flex-col gap-2">
              <Rating value={review.rating} />

              <p className="text-sm text-gray-700">
                {review.comment}
              </p>

              <span className="text-xs text-gray-400">
                {review.author}
              </span>
            </div>
          </WidgetCard>
        ))}
      </div>
    </div>
  )
}

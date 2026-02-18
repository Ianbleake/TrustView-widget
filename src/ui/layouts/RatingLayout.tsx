import Rating from '../components/Rating'

type Props = {
  storeId: string
  reviews: any[]
}

export const RatingLayout = ({ reviews }: Props) => {
  const rating = reviews.length
    ? 4.8 // luego lo calculamos real
    : 0

  return (
    <div className="flex items-center gap-2">
      <Rating value={rating} />

      <span className="text-sm text-gray-500">
        ({reviews.length})
      </span>
    </div>
  )
}

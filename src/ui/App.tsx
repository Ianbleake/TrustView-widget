import { RatingLayout } from './layouts/RatingLayout'
import { ReviewsLayout } from './layouts/ReviewsLayout'

type AppProps = {
  storeId: string
  reviews: any[]
  mode?: 'rating' | 'reviews'
}

export default function App({
  storeId,
  reviews,
  mode,
}: AppProps) {

  if (mode === 'rating') {
    return <RatingLayout storeId={storeId} reviews={reviews} />
  }

  if (mode === 'reviews') {
    return <ReviewsLayout storeId={storeId} reviews={reviews} />
  }

  return null
}

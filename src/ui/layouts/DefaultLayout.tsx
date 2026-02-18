import WidgetCard from '../components/WidgetCard'
import Rating from '../components/Rating'
import ReviewCount from '../components/ReviewCount'

type Props = {
  storeId: string
  reviews: any[]
}

export default function DefaultLayout({ storeId, reviews }: Props) {
  const rating = 4.8 // luego será calculado

  return (
    <WidgetCard>
      <div className="flex flex-col ">
        
      </div>
    </WidgetCard>
  )
}

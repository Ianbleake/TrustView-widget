export type AppProps = {
  storeId: string
  reviews: any[]
  config: Record<string, any>
}

export default function App({
  storeId,
  reviews,
  config,
}: AppProps) {
  return (
    <div className="p-4 border rounded-widget">
      <h2 className="text-lg font-semibold text-primary">
        TrustView Widget
      </h2>

      <p className="text-sm mt-2">
        Store: {storeId}
      </p>

      <p className="text-sm mt-2">
        Reviews: {reviews.length}
      </p>
    </div>
  )
}

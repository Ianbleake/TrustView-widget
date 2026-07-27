import { useProductRating } from "../hooks/widgets/useProductRating";
import { StarsRating } from "./components/StarsRating";

export function ProductRatingCard({
  storeId,
  productId,
  widgetConfig,
}: ProductRatingCardProps) {

  const { data, isLoading, error, refetch } = useProductRating(storeId, productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center my-2">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-4 rounded-sm bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <button
        onClick={() => refetch()}
        className="text-xs text-gray-400 my-2 cursor-pointer hover:text-gray-600"
      >
        ↺
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center my-2">
      <StarsRating
        count={data.data.rating}
        bodyColor={widgetConfig.starBodyColor}
        fillColor={widgetConfig.starFillColor}
        emptyColor={widgetConfig.emptyStarColor}
      />
    </div>
  );
}

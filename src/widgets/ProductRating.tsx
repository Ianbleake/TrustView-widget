import { useProductRating } from "../hooks/widgets/useProductRating";
import { StarsRating } from "./components/StarsRating";

export function ProductRating({
  storeId,
  productId,
  widgetConfig,
}: ProductRatingProps) {

  const { data, isLoading, error, refetch } = useProductRating(storeId, productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center md:justify-start py-1">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-5 w-5 rounded-sm bg-gray-200 animate-pulse"
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
        className="text-xs text-gray-400 py-1 cursor-pointer hover:text-gray-600"
      >
        ↺
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center md:justify-start">
      <StarsRating
        count={data.data.rating}
        bodyColor={widgetConfig.starBodyColor}
        fillColor={widgetConfig.starFillColor}
        emptyColor={widgetConfig.emptyStarColor}
      />
    </div>
  );
}

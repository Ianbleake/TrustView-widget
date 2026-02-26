
import { useProductRating } from "../hooks/widgets/useProductRating";
import { StarsRating } from "./components/StarsRating";

export function ProductRating({
  storeId,
  productId,
  widgetConfig,
}: ProductRatingProps) {

  const { data, isLoading } = useProductRating(storeId, productId);

  if (isLoading || !data) return null;

  return (
    <div className="flex items-center justify-start">
      <StarsRating
        count={data.data.rating}
        bodyColor={widgetConfig.starBodyColor}
        fillColor={widgetConfig.starFillColor}
        emptyColor={widgetConfig.emptyStarColor}
      />
    </div>
  );
}
import { useProductRating } from "../hooks/widgets/useProductRating";
import { StarsRating } from "./components/StarsRating";

export function ProductRatingCard({
  storeId,
  productId,
  widgetConfig,
}: {
  storeId: string;
  productId: string;
  widgetConfig: WidgetStyles;
}) {

  const { data, isLoading } = useProductRating(storeId, productId);

  if (isLoading || !data) return null;

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
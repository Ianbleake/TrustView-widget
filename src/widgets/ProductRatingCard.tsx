import { widgetConfig } from "../content/widgetConfig";
import { StarsRating } from "./components/StarsRating";

export function ProductRatingCard() {
  return (
    <div className="flex flex-1 items-center justify-center my-2">
      <StarsRating count={3} bodyColor={widgetConfig.starBodyColor} fillColor={widgetConfig.starFillColor} emptyColor={widgetConfig.emptyStarColor} />
    </div>
  );
}
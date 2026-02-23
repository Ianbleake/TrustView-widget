import { widgetConfig } from "../content/widgetConfig";
import { StarsRating } from "./components/StarsRating";

export function ProductRating() {
  return (
    <div className="flex flex-1 items-center justify-start">
      <StarsRating count={3} bodyColor={widgetConfig.starBodyColor} fillColor={widgetConfig.starFillColor} emptyColor={widgetConfig.emptyStarColor} />
    </div>
  );
}
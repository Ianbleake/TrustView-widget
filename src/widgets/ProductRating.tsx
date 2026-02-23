import { widgetConfig } from "../content/widgetConfig";
import { StarsRating } from "./components/StarsRating";

export function ProductRating() {
  return (
    <div className="">
      <StarsRating count={3} bodyColor={widgetConfig.starBodyColor} fillColor={widgetConfig.starFillColor} emptyColor={widgetConfig.emptyStarColor} />
    </div>
  );
}
import { lastReviews } from "../content/lastReviews";
import { widgetConfig } from "../content/widgetConfig";
import { getTextStyleClasses } from "../utils/getTextStyleClasses";
import { merge } from "../utils/mergeStyles";
import { ReviewCardWidget } from "./components/ReviewCard";

export function GridReviews() {
  return (
    <div className="flex flex-col gap-8">

      <div className="">
        <h1
          className={merge(
            "text-2xl",
            getTextStyleClasses(widgetConfig.sectionTitleStyle)
          )}
        >
          { widgetConfig.sectionTitle }
        </h1>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        {lastReviews?.map((review) => (
          <ReviewCardWidget
            key={review.id}
            review={review}
            config={widgetConfig}
            showProduct={false}
          />
        ))}
      </div>
    </div>
  );
}
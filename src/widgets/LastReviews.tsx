import { widgetConfig } from "../content/widgetConfig";
import { useLastReviews } from "../hooks/widgets/useLastReviews";
import { getTextStyleClasses } from "../utils/getTextStyleClasses";
import { merge } from "../utils/mergeStyles";
import { ReviewCardWidget } from "./components/ReviewCard";

export function LastReviews({ storeId }: { storeId: string }) {

  const { data, isLoading } = useLastReviews(storeId);

  if (isLoading || !data?.data.length ) return null;

  return (
    <div className="flex flex-1 flex-col gap-8 px-10 mb-10">

      <h1
        className={merge(
          "text-2xl",
          getTextStyleClasses(widgetConfig.sectionTitleStyle)
        )}
      >
        {widgetConfig.sectionTitle}
      </h1>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.data.map((review) => (
          <ReviewCardWidget
            key={review.id}
            review={review}
            config={widgetConfig}
          />
        ))}
      </div>
    </div>
  );
}
import { useProductReviews } from "../hooks/widgets/useProductReviews";
import { getTextStyleClasses } from "../utils/getTextStyleClasses";
import { merge } from "../utils/mergeStyles";
import { t } from "../i18n/translations";

export function ReviewGraph({
  storeId,
  productId,
  widgetConfig,
  locale = "es",
}: ReviewGraphProps) {

  const { data, isLoading, error, refetch } = useProductReviews(storeId, productId, 1, 200);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-10 py-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-4 w-8 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 flex-1 rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-8 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 px-10 py-6 text-gray-500">
        <span className="text-sm">⚠️ {t(locale, "error")}</span>
        <button
          onClick={() => refetch()}
          className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-50"
        >
          {t(locale, "retry")}
        </button>
      </div>
    );
  }

  const reviews = data?.data ?? [];

  if (!reviews.length) return null;

  // Calculate star distribution
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    const star = Math.round(r.rating);
    if (star >= 1 && star <= 5) distribution[star]++;
  });

  const total = reviews.length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total;

  return (
    <div className="flex flex-col gap-4 px-10 py-6">

      <div className="flex items-center gap-4 mb-2">
        <span
          className={merge("text-4xl font-bold", getTextStyleClasses(widgetConfig.sectionTitleStyle))}
          style={{ color: widgetConfig.titleColor }}
        >
          {avgRating.toFixed(1)}
        </span>
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={s <= Math.round(avgRating) ? widgetConfig.starFillColor : "transparent"}
                stroke={s <= Math.round(avgRating) ? widgetConfig.starBodyColor : widgetConfig.emptyStarColor}
                strokeWidth="2"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400">{total} {t(locale, "reviews")}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <span
                className="text-sm font-medium w-4 text-right shrink-0"
                style={{ color: widgetConfig.dateColor }}
              >
                {star}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={widgetConfig.starFillColor}
                stroke={widgetConfig.starBodyColor}
                strokeWidth="2"
                className="shrink-0"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: "8px", backgroundColor: widgetConfig.emptyStarColor + "33" }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    backgroundColor: widgetConfig.starFillColor,
                    borderRadius: "9999px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <span
                className="text-xs w-8 text-right shrink-0"
                style={{ color: widgetConfig.dateColor }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

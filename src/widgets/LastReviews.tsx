import { useState } from "react";
import { useLastReviews } from "../hooks/widgets/useLastReviews";
import { getTextStyleClasses } from "../utils/getTextStyleClasses";
import { merge } from "../utils/mergeStyles";
import { ReviewCardWidget } from "./components/ReviewCard";
import { t } from "../i18n/translations";

const PAGE_SIZE = 9;

export function LastReviews({ storeId, widgetConfig, locale = "es" }: LastReviewsProps) {

  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useLastReviews(storeId, page, PAGE_SIZE);

  const [allReviews, setAllReviews] = useState<Review[]>([]);

  const currentPageData = data?.data ?? [];
  const mergedReviews = page === 1 ? currentPageData : [...allReviews, ...currentPageData.filter(r => !allReviews.find(a => a.id === r.id))];

  const hasMore = currentPageData.length === PAGE_SIZE;

  if (isLoading && page === 1) {
    return (
      <div className="flex flex-1 flex-col gap-8 px-10 mb-10">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 px-10 py-8 text-gray-500">
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

  if (!mergedReviews.length) return null;

  const handleLoadMore = () => {
    setAllReviews(mergedReviews);
    setPage((p) => p + 1);
  };

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
        {mergedReviews.map((review) => (
          <ReviewCardWidget
            key={review.id}
            review={review}
            config={widgetConfig}
            locale={locale}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading ? "..." : t(locale, "loadMore")}
          </button>
        </div>
      )}
    </div>
  );
}

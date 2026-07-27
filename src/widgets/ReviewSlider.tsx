import { useRef, useState } from "react";
import { useProductReviews } from "../hooks/widgets/useProductReviews";
import { ReviewCardWidget } from "./components/ReviewCard";
import { getTextStyleClasses } from "../utils/getTextStyleClasses";
import { merge } from "../utils/mergeStyles";
import { t } from "../i18n/translations";

export function ReviewSlider({
  storeId,
  productId,
  widgetConfig,
  locale = "es",
}: ReviewSliderProps) {

  const { data, isLoading, error, refetch } = useProductReviews(storeId, productId, 1, 20);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="px-10 py-6 overflow-hidden">
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 w-72 rounded-xl bg-gray-100 animate-pulse shrink-0" />
          ))}
        </div>
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

  const scrollToIndex = (index: number) => {
    if (!trackRef.current) return;
    const items = trackRef.current.children;
    if (items[index]) {
      items[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      setActiveIndex(index);
    }
  };

  const prev = () => scrollToIndex(Math.max(activeIndex - 1, 0));
  const next = () => scrollToIndex(Math.min(activeIndex + 1, reviews.length - 1));

  return (
    <div className="flex flex-col gap-4 px-10 py-6">

      <div className="flex items-center justify-between">
        <h1
          className={merge(
            "text-2xl",
            getTextStyleClasses(widgetConfig.sectionTitleStyle)
          )}
        >
          {widgetConfig.sectionTitle || t(locale, "reviews")}
        </h1>

        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            aria-label="Previous"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={next}
            disabled={activeIndex === reviews.length - 1}
            aria-label="Next"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          paddingBottom: "4px",
        }}
      >
        {reviews.map((review, idx) => (
          <div
            key={review.id}
            style={{
              scrollSnapAlign: "start",
              flexShrink: 0,
              width: "min(320px, 80vw)",
            }}
            onClick={() => setActiveIndex(idx)}
          >
            <ReviewCardWidget
              review={review}
              config={widgetConfig}
              showProduct={true}
              locale={locale}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            aria-label={`Go to review ${idx + 1}`}
            style={{
              width: idx === activeIndex ? "20px" : "8px",
              height: "8px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              transition: "width 0.3s ease, background-color 0.3s ease",
              backgroundColor: idx === activeIndex ? widgetConfig.starFillColor : widgetConfig.emptyStarColor,
            }}
          />
        ))}
      </div>
    </div>
  );
}

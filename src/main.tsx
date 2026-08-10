import { createRoot } from "react-dom/client";
import { GridReviews } from "./widgets/GridReviews";
import { LastReviews } from "./widgets/LastReviews";
import { ProductRating } from "./widgets/ProductRating";
import { ProductRatingCard } from "./widgets/ProductRatingCard";
import { ReviewGraph } from "./widgets/ReviewGraph";
import { ReviewSlider } from "./widgets/ReviewSlider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";
import styles from "./styles/index.css?inline";
import { useGetConfig } from "./hooks/config/useGetConfig";
import { defaultWidgetStyles } from "./content/defaultConfig";

// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/no-explicit-any
function WidgetBootstrap({ Component, props }: { Component: React.ComponentType<any>; props: any }) {

  const { data, isLoading, error, refetch } = useGetConfig(props.storeId);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          opacity: 0.5,
        }}
      >
        <div
          style={{
            width: "1.5rem",
            height: "1.5rem",
            border: "2px solid #e5e7eb",
            borderTopColor: "#6b7280",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          padding: "1rem",
          color: "#6b7280",
          fontSize: "0.875rem",
        }}
      >
        <span>⚠️ Widget unavailable</span>
        <button
          onClick={() => refetch()}
          style={{
            padding: "0.25rem 0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
            background: "white",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Use widget_styles from API, fall back to defaults if null (new store without config)
  const widgetConfig = data.data.widget_styles ?? defaultWidgetStyles;

  return <Component {...props} widgetConfig={widgetConfig} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mountComponent(Component: any, target: Element, props: any) {

  const host = document.createElement("div");
  target.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: "open" });

  const styleTag = document.createElement("style");
  styleTag.textContent = styles;
  shadowRoot.appendChild(styleTag);

  const mountPoint = document.createElement("div");
  shadowRoot.appendChild(mountPoint);

  const root = createRoot(mountPoint);

  root.render(
    <QueryClientProvider client={queryClient}>
      <WidgetBootstrap Component={Component} props={props} />
    </QueryClientProvider>
  );
}

function mountGridReviews(config: {
  storeId: number | string;
  productId: string;
  productName?: string;
  productUrl?: string;
  productImg?: string;
  locale?: string;
}) {
  const target = document.querySelector("#single-product");
  if (!target) return;

  mountComponent(GridReviews, target, {
    ...config,
    storeId: String(config.storeId),
  });
}

function mountProductRating(config: {
  storeId: number | string;
  productId: string;
  locale?: string;
}) {
  const target = document.querySelector(".price-container");
  if (!target) return;

  mountComponent(ProductRating, target, {
    ...config,
    storeId: String(config.storeId),
  });
}

function mountProductRatingCard(config: {
  storeId: number | string;
  productId: string;
  target: Element;
  locale?: string;
}) {
  mountComponent(ProductRatingCard, config.target, {
    ...config,
    storeId: String(config.storeId),
  });
}

function mountLastReviews(config: {
  storeId: number | string;
  locale?: string;
}) {
  const target = document.querySelector(".js-home-sections-container");
  if (!target) return;

  mountComponent(LastReviews, target, {
    ...config,
    storeId: String(config.storeId),
  });
}

function mountReviewGraph(config: {
  storeId: number | string;
  productId: string;
  locale?: string;
}) {
  const target = document.querySelector("#single-product");
  if (!target) return;

  mountComponent(ReviewGraph, target, {
    ...config,
    storeId: String(config.storeId),
  });
}

function mountReviewSlider(config: {
  storeId: number | string;
  productId: string;
  locale?: string;
}) {
  const target = document.querySelector(".js-home-sections-container");
  if (!target) return;

  mountComponent(ReviewSlider, target, {
    ...config,
    storeId: String(config.storeId),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).Trustview = {
  mountGridReviews,
  mountProductRating,
  mountProductRatingCard,
  mountLastReviews,
  mountReviewGraph,
  mountReviewSlider,
};

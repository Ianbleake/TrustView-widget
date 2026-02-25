import { createRoot } from "react-dom/client";
import { GridReviews } from "./widgets/GridReviews";
import { LastReviews } from "./widgets/LastReviews";
import { ProductRating } from "./widgets/ProductRating";
import { ProductRatingCard } from "./widgets/ProductRatingCard";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryClient";
import styles from "./styles/index.css?inline";


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
      <Component {...props} />
    </QueryClientProvider>
  );
}

function mountGridReviews(config: {
  storeId: number;
  productId: string;
}) {

  const target = document.querySelector("#single-product");
  if (!target) return;

  mountComponent(GridReviews, target, config);
}

function mountProductRating(config: {
  storeId: number;
  productId: string;
}) {

  const target = document.querySelector(".price-container");
  if (!target) return;

  mountComponent(ProductRating, target, config);
}

function mountProductRatingCard(config: {
  storeId: number;
  productId: string;
  target: Element;
}) {

  mountComponent(ProductRatingCard, config.target, config);
}

function mountLastReviews(config: {
  storeId: number;
}) {

  const target = document.querySelector(".js-home-sections-container");
  if (!target) return;

  mountComponent(LastReviews, target, config);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).Trustview = {
  mountGridReviews,
  mountProductRating,
  mountProductRatingCard,
  mountLastReviews
};
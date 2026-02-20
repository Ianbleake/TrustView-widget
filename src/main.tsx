import { createRoot } from "react-dom/client";
import { GridReviews } from "./widgets/GridReviews";
import { ProductRating } from "./widgets/ProductRating";
import { ProductRatingCard } from "./widgets/ProductRatingCard";
import { LastReviews } from "./widgets/LastReviews";

function mountComponent(Component: any, target: Element, props: any) {
  const container = document.createElement("div");
  target.appendChild(container);

  const root = createRoot(container);
  root.render(<Component {...props} />);
}

// 🔹 Grid Reviews (PDP)
function mountGridReviews(config: {
  storeId: number;
  productId: string;
}) {

  console.log("Mounting GridReviews with config:", config);

  const target = document.querySelector("#single-product");
  if (!target) return;

  mountComponent(GridReviews, target, config);
}

// 🔹 Product Rating (PDP)
function mountProductRating(config: {
  storeId: number;
  productId: string;
}) {

  console.log("Mounting ProductRating with config:", config);

  const target = document.querySelector(".price-container");
  if (!target) return;

  mountComponent(ProductRating, target, config);
}

// 🔹 Rating en cards
function mountProductRatingCard(config: {
  storeId: number;
  productId: string;
  target: Element;
}) {

  console.log("Mounting ProductRatingCard with config:", config);

  mountComponent(ProductRatingCard, config.target, config);
}

// 🔹 Last Reviews
function mountLastReviews(config: {
  storeId: number;
}) {

  console.log("Mounting LastReviews with config:", config);

  const target = document.querySelector(".js-home-sections-container");
  if (!target) return;

  mountComponent(LastReviews, target, config);
}

(window as any).Trustview = {
  mountGridReviews,
  mountProductRating,
  mountProductRatingCard,
  mountLastReviews
};
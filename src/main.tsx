import { createRoot } from "react-dom/client";
import { GridReviews } from "./widgets/GridReviews";
import { ProductRating } from "./widgets/ProductRating";
import { ProductRatingCard } from "./widgets/ProductRatingCard";
import { LastReviews } from "./widgets/LastReviews";

function mountComponent(Component: any, target: Element) {
  const container = document.createElement("div");
  target.appendChild(container);
  const root = createRoot(container);
  root.render(<Component />);
}

function mountAll() {

  // 1️⃣ Grid Reviews (producto)
  const productPage = document.querySelector("#single-product");
  if (productPage) {
    mountComponent(GridReviews, productPage);
  }

  // 2️⃣ Product Rating (debajo del precio)
  const price = document.querySelector(".price-container");
  if (price) {
    mountComponent(ProductRating, price);
  }

  // 3️⃣ Rating en cards (varios)
  const productCards = document.querySelectorAll(".js-item-name");
  productCards.forEach(card => {
    mountComponent(ProductRatingCard, card);
  });

  // 4️⃣ Last Reviews en home
  const footer = document.querySelector(".js-home-sections-container");
  if (footer) {
    mountComponent(LastReviews, footer);
  }
}

(window as any).Trustview = {
  mountAll
};
(function () {
  console.log("🟢 TrustView widget loaded");

  function getStoreId() {
    const scripts = document.querySelectorAll<HTMLScriptElement>('script[data-store]');
    
    for (const script of scripts) {
      if (script.src.includes('index')) {
        return script.dataset.store;
      }
    }
  
    return null;
  }
  
  const STORE_ID = getStoreId();  

  console.log("🏪 STORE_ID leído desde data-store:", STORE_ID);

  if (!STORE_ID) {
    console.error("❌ TrustView: store id not provided");
    return;
  }

  async function loadReviews() {
    try {
      console.log("📡 Fetching reviews for store:", STORE_ID);

      const response = await fetch(
        `https://trustview-api.noctis.lat/api/v1/reviews/${STORE_ID}`
      );

      console.log("📥 Response status:", response.status);

      const result = await response.json();

      console.log("📦 Response body:", result);

      if (!result.success) {
        console.error("❌ Error fetching reviews");
        return;
      }

      const approvedReviews = result.data.filter(
        (review: any) => review.status === "approved"
      );

      console.log("✅ Approved reviews:", approvedReviews);

      renderWidget(approvedReviews);

    } catch (error) {
      console.error("💥 TrustView error:", error);
    }
  }

  function renderStars(rating: number) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? "★" : "☆";
    }
    return stars;
  }

  function renderWidget(reviews: any[]) {
    console.log("🧱 Rendering widget with reviews count:", reviews.length);
  
    if (reviews.length === 0) return;
  
    const average =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  
    renderStarsSummary(average, reviews.length);
    renderReviewsGrid(reviews);
  }

  function renderStarsSummary(average: number, total: number) {
    const priceElement = document.querySelector(".price");
  
    if (!priceElement) {
      console.warn("TrustView: price element not found");
      return;
    }
  
    const summary = document.createElement("div");
    summary.style.marginTop = "8px";
    summary.style.fontSize = "14px";
    summary.innerHTML = `
      <span>${renderStars(Math.round(average))}</span>
      <span>(${total} reseñas)</span>
    `;
  
    priceElement.insertAdjacentElement("afterend", summary);
  }
  

  function renderReviewsGrid(reviews: any[]) {
    const description = document.querySelector(".product-description");
  
    if (!description) {
      console.warn("TrustView: description element not found");
      return;
    }
  
    const container = document.createElement("div");
    container.style.marginTop = "40px";
  
    container.innerHTML = `
      <h3>Reseñas</h3>
      ${reviews
        .map(
          (r) => `
        <div style="margin-bottom:16px; padding:10px; border:1px solid #eee;">
          <div>${renderStars(r.rating)}</div>
          <strong>${r.author}</strong>
          <p>${r.content}</p>
        </div>
      `
        )
        .join("")}
    `;
  
    description.insertAdjacentElement("afterend", container);
  }
  
  

  loadReviews();
})();

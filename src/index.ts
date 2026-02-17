(function () {
  console.log("TrustView widget loaded");

  const currentScript = document.currentScript as HTMLScriptElement;
  const STORE_ID = currentScript?.dataset.store;

  if (!STORE_ID) {
    console.error("TrustView: store id not provided");
    return;
  }

  async function loadReviews() {
    try {
      const response = await fetch(
        `https://trustview-api.noctis.lat/api/v1/reviews/${STORE_ID}`
      );

      const result = await response.json();

      if (!result.success) {
        console.error("Error fetching reviews");
        return;
      }

      const approvedReviews = result.data.filter(
        (review: any) => review.status === "approved"
      );

      renderWidget(approvedReviews);

    } catch (error) {
      console.error("TrustView error:", error);
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
    const container = document.createElement("div");

    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.width = "300px";
    container.style.maxHeight = "400px";
    container.style.overflowY = "auto";
    container.style.background = "white";
    container.style.border = "1px solid #ddd";
    container.style.padding = "12px";
    container.style.zIndex = "9999";
    container.style.boxShadow = "0 5px 20px rgba(0,0,0,0.15)";

    container.innerHTML = `
      <h3 style="margin-top:0;">Reseñas</h3>
      ${
        reviews.length === 0
          ? "<p>No hay reseñas aprobadas</p>"
          : reviews
              .map(
                (r) => `
          <div style="margin-bottom:12px;">
            <div>${renderStars(r.rating)}</div>
            <strong>${r.author}</strong>
            <p style="margin:4px 0;">${r.content}</p>
          </div>
        `
              )
              .join("")
      }
    `;

    document.body.appendChild(container);
  }

  loadReviews();
})();

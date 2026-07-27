(function () {

  if (window.TrustviewLoaded) return;
  window.TrustviewLoaded = true;

  console.log("Trustview loader v.3.0");

  function getStoreId() {
    const id = window.LS?.store?.id;
    return id != null ? String(id) : null;
  }

  function getLocale() {
    return document.documentElement.lang || "es";
  }

  function getProductIdFromPDP() {
    const el = document.querySelector('[data-store^="product-info-"]');
    if (!el) return null;

    const match = el.dataset.store.match(/product-info-(\d+)/);
    return match ? match[1] : null;
  }

  function getProductNameFromPDP() {
    const nameElement = document.querySelector(".js-product-name");
    if (!nameElement) return null;

    return nameElement.textContent?.trim() || null;
  }

  function getProductUrl() {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical?.href) return canonical.href;

    return window.location.href;
  }

  function getProductImg() {
    const firstSlide = document.querySelector(
      ".js-swiper-product .swiper-wrapper .js-product-slide a"
    );

    if (!firstSlide) return null;

    let imageUrl = firstSlide.getAttribute("href");

    if (!imageUrl) return null;

    // TiendaNube uses protocol-relative URLs (//)
    if (imageUrl.startsWith("//")) {
      imageUrl = window.location.protocol + imageUrl;
    }

    return imageUrl;
  }

  function getListingProducts() {
    const nodes = document.querySelectorAll('[data-store^="product-item-name-"]');

    return Array.from(nodes).map(node => {
      const match = node.dataset.store.match(/product-item-name-(\d+)/);
      if (!match) return null;

      return {
        productId: match[1],
        element: node,
      };
    }).filter(Boolean);
  }

  function mountTrustview() {

    const storeId = getStoreId();

    if (!storeId) {
      console.warn("Trustview: Could not get store ID from LS.store.id");
      return;
    }

    const locale = getLocale();

    const script = document.createElement("script");
    script.src = "https://trust-view-widget.vercel.app/trustview-widget.bundle.js";
    script.async = true;

    script.onerror = function () {
      console.error("Trustview: Failed to load widget bundle.");
    };

    script.onload = function () {

      const Trustview = window.Trustview;
      if (!Trustview) return;

      // PDP
      const productId = getProductIdFromPDP();
      if (productId) {

        const productName = getProductNameFromPDP();
        const productUrl = getProductUrl();
        const productImg = getProductImg();

        Trustview.mountGridReviews({ storeId, productId, productName, productUrl, productImg, locale });
        Trustview.mountProductRating({ storeId, productId, locale });
        Trustview.mountReviewGraph({ storeId, productId, locale });
        Trustview.mountReviewSlider({ storeId, productId, locale });
      }

      // Last Reviews (home/global)
      Trustview.mountLastReviews({ storeId, locale });

      // Product listing cards
      function mountListing() {
        getListingProducts().forEach(item => {

          if (item.element.dataset.trustviewMounted) return;
          item.element.dataset.trustviewMounted = "true";

          Trustview.mountProductRatingCard({
            storeId,
            productId: item.productId,
            target: item.element,
            locale,
          });
        });
      }

      mountListing();

      const observer = new MutationObserver(mountListing);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountTrustview);
  } else if (window.LS && window.LS.store) {
    mountTrustview();
  } else {
    window.LS?.ready?.then(mountTrustview);
  }

})();

(function () {

  if (window.TrustviewLoaded) return;
  window.TrustviewLoaded = true;

  console.log("Trustview loader iniciado 🚀");

  function mount() {

    const storeId = window.LS?.store?.id;

    if (!storeId) {
      console.warn("Trustview: No se pudo obtener LS.store.id");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://trust-view-widget.vercel.app/trustview-widget.bundle.js";
    script.async = true;

    script.onload = function () {
      window.Trustview?.mountAll({
        storeId
      });
    };

    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

})();
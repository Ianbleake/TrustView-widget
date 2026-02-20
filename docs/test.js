(function () {

  if (window.TrustviewLoaded) return;
  window.TrustviewLoaded = true;

  console.log("Trustview loader iniciado 🚀");

  function mount() {
    const target = document.querySelector("#single-product");
    if (!target) return;

    if (document.getElementById("tv-widget-root")) return;

    const root = document.createElement("div");
    root.id = "tv-widget-root";
    target.appendChild(root);

    const script = document.createElement("script");
    script.src = "https://trust-view-widget.vercel.app/trustview-widget.bundle.js";
    script.async = true;

    script.onload = function () {
      window.Trustview?.mount();
    };

    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

})();
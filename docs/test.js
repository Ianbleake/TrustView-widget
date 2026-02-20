(function () {

  if (window.TrustviewLoaded) return;
  window.TrustviewLoaded = true;

  console.log("Trustview loader iniciado 🚀");

  function mount() {
    const script = document.createElement("script");
    script.src = "https://trust-view-widget.vercel.app/trustview-widget.bundle.js";
    script.async = true;

    script.onload = function () {
      window.Trustview?.mountAll();
    };

    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

})();
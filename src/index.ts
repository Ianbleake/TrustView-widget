(function () {
  console.log("TrustView widget loaded");

  const badge = document.createElement("div");
  badge.innerText = "TrustView esta vivo! its Alive!";
  badge.style.position = "fixed";
  badge.style.bottom = "20px";
  badge.style.left = "20px";
  badge.style.background = "red";
  badge.style.color = "white";
  badge.style.padding = "10px";
  badge.style.zIndex = "9999";

  document.body.appendChild(badge);
})();

export function GridReviews() {
  return (
    <section className="mt-6 rounded-2xl bg-gray-900 p-6 text-white shadow-lg">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Customer Reviews</h2>
        <span className="text-sm text-gray-400">24 reviews</span>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-800 p-4">
          <p className="text-sm text-gray-300">
            “Excelente producto, llegó rápido.”
          </p>
          <span className="mt-2 block text-xs text-gray-500">
            ⭐⭐⭐⭐⭐ – Juan
          </span>
        </div>

        <div className="rounded-xl bg-gray-800 p-4">
          <p className="text-sm text-gray-300">
            “Muy buena calidad, lo recomiendo.”
          </p>
          <span className="mt-2 block text-xs text-gray-500">
            ⭐⭐⭐⭐ – María
          </span>
        </div>
      </div>
    </section>
  );
}
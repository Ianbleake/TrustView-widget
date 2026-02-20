export function LastReviews() {
  return (
    <section className="mb-6 rounded-2xl bg-red-700 p-6 text-white shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Últimas reseñas</h2>

      <ul className="space-y-3 text-sm">
        <li className="rounded-lg bg-red-600 p-3">
          ⭐⭐⭐⭐⭐ – “Me encantó”
        </li>
        <li className="rounded-lg bg-red-600 p-3">
          ⭐⭐⭐⭐ – “Muy buen servicio”
        </li>
      </ul>
    </section>
  );
}
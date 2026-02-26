import { Plus, X, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { merge } from "../../../utils/mergeStyles";

type CreateReviewProps = {
  storeId: string;
  productId: string;
  widgetConfig: WidgetStyles;
};

export const CreateReview = ({
  storeId,
  productId,
  widgetConfig,
}: CreateReviewProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const Modal = () => (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Dejar una reseña</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="opacity-60 hover:opacity-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">
          {/* Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="cursor-pointer opacity-50 hover:opacity-100 transition"
              />
            ))}
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Tu nombre"
            className="border rounded-lg px-3 py-2 outline-none focus:ring-2"
          />

          {/* Review */}
          <textarea
            placeholder="Escribe tu reseña..."
            rows={4}
            className="border rounded-lg px-3 py-2 outline-none focus:ring-2 resize-none"
          />

          {/* Submit */}
          <button
            type="submit"
            className="rounded-lg py-2 font-medium transition hover:opacity-90"
            style={{
              backgroundColor: widgetConfig.avatarBackground,
              color: "#fff",
            }}
          >
            Publicar reseña
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={merge("flex flex-row items-center gap-2")}
        style={{ color: widgetConfig.dateColor }}
      >
        Dejar una reseña
        <Plus size={16} />
      </button>

      {isOpen && createPortal(<Modal />, document.body)}
    </div>
  );
};
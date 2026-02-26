import { X, Star } from "lucide-react";
import { useEffect } from "react";
import { merge } from "../../../../utils/mergeStyles";

type ModalProps = {
  onClose: () => void;
  widgetConfig: WidgetStyles;
};

export const ReviewModal = ({ onClose, widgetConfig }: ModalProps) => {

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const borderRadius = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-xl",
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-200/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={merge("w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in",borderRadius[widgetConfig.border])}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Dejar una reseña</h2>
          <button
            onClick={onClose}
            className="opacity-60 hover:opacity-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="cursor-pointer opacity-50 hover:opacity-100 transition"
              />
            ))}
          </div>

          <input
            type="text"
            placeholder="Tu nombre"
            className="border rounded-lg px-3 py-2 outline-none focus:ring-2"
          />

          <textarea
            placeholder="Escribe tu reseña..."
            rows={4}
            className="border rounded-lg px-3 py-2 outline-none focus:ring-2 resize-none"
          />

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
};
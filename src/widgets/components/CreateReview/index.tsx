import { Plus, X, Star } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { merge } from "../../../utils/mergeStyles";

type CreateReviewProps = {
  storeId: string;
  productId: string;
  widgetConfig: WidgetStyles;
};

type ModalProps = {
  onClose: () => void;
  primaryColor: string;
};

const ReviewModal = ({ onClose, primaryColor }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
              backgroundColor: primaryColor,
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

export const CreateReview = ({
  storeId,
  productId,
  widgetConfig,
}: CreateReviewProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  console.log("data:",{
    storeId,
    productId,
  })

  const getPortalRoot = () => {
    if (!containerRef.current) return document.body;

    const root = containerRef.current.getRootNode();

    // Si estamos dentro de shadow DOM
    if (root instanceof ShadowRoot) {
      return root;
    }

    return document.body;
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={merge("flex flex-row items-center gap-2")}
        style={{ color: widgetConfig.dateColor }}
      >
        Dejar una reseña
        <Plus size={16} />
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <ReviewModal onClose={() => setIsOpen(false)} primaryColor={widgetConfig.avatarBackground}/>
              
            </div>
          </div>,
          // eslint-disable-next-line react-hooks/refs
          getPortalRoot()
        )}
    </div>
  );
};
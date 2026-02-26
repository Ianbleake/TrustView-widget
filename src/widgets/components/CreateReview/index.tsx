import { Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { merge } from "../../../utils/mergeStyles";
import { ReviewModal } from "./ReviewModal";

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
  const containerRef = useRef<HTMLDivElement>(null);

  console.log("data:",{
    storeId,
    productId,
  })

  const getPortalRoot = () => {
    if (!containerRef.current) return document.body;

    const root = containerRef.current.getRootNode();

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
              <ReviewModal onClose={() => setIsOpen(false)} widgetConfig={widgetConfig}/>
              
            </div>
          </div>,
          // eslint-disable-next-line react-hooks/refs
          getPortalRoot()
        )}
    </div>
  );
};
import { X, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { merge } from "../../../../utils/mergeStyles";
import { useForm } from "react-hook-form";

type ModalProps = {
  onClose: () => void;
  widgetConfig: WidgetStyles;
};

type NewReviewValues = {
  rating: number;
  name: string;
  review: string;
}

export const ReviewModal = ({ onClose, widgetConfig }: ModalProps) => {

  const [hoverRating, setHoverRating] = useState<number | null>(null);

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewReviewValues>({
    defaultValues: {
      rating: 1,
      name: "",
      review: "",
    },
    mode: "onSubmit",
  });

  const selectedRating = watch("rating");

  const onSubmit = (data:NewReviewValues) => {
    console.log(data);
  }

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-gray-200/50 backdrop-blur-sm animate-fade-in"
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
            className="opacity-60 hover:opacity-100 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive =
              hoverRating !== null
                ? star <= hoverRating
                : star <= selectedRating;

            return (
              <Star
                key={star}
                size={22}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setValue("rating", star, { shouldValidate: true })}
                className="cursor-pointer transition"
                fill={isActive ? widgetConfig.starFillColor : "transparent"}
                color={isActive ? widgetConfig.starBodyColor : widgetConfig.emptyStarColor}
              />
            );
          })}
        </div>

          <div className="flex flex-col items-start gap-2">
            <input
              type="text"
              placeholder="Tu nombre"
              className="border rounded-lg px-3 py-2 outline-none focus:ring-2 input-tv"
              maxLength={100}
              {
                ...register("name",{
                  required: "Oye no te quedes sin el merito, necesitamos tu nombre!",
                })
              }
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col items-start gap-2">
            <textarea
              placeholder="Escribe tu reseña..."
              rows={4}
              className="border rounded-lg px-3 py-2 outline-none focus:ring-2 resize-none input-tv"
              maxLength={140}
              {
                ...register("review",{
                  required: "No olvides tu reseña!",
                })
              }
            />
            {errors.review && (
              <span className="text-sm text-red-500">
                {errors.review.message}
              </span>
            )}
          </div>

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
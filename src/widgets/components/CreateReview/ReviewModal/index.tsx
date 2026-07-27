import { X, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { merge } from "../../../../utils/mergeStyles";
import { useForm } from "react-hook-form";
import useCreateReview from "../../../../hooks/widgets/useCreateReview";
import { t } from "../../../../i18n/translations";
import { queryClient } from "../../../../services/queryClient";

type ModalProps = {
  onClose: () => void;
  widgetConfig: WidgetStyles;
  locale?: string;
  productData: {
    storeId: string;
    productId: string;
    productName?: string;
    productUrl?: string;
    productImg?: string;
  };
};

type NewReviewValues = {
  rating: number;
  name: string;
  review: string;
};

type SubmitState = "idle" | "success" | "error";

export const ReviewModal = ({ onClose, widgetConfig, productData, locale = "es" }: ModalProps) => {

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
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
    reset,
    formState: { errors },
  } = useForm<NewReviewValues>({
    defaultValues: {
      rating: 1,
      name: "",
      review: "",
    },
    mode: "onSubmit",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedRating = watch("rating");

  const { mutate: createReview, isPending, isSuccess } = useCreateReview();

  const onSubmit = (data: NewReviewValues) => {
    const newReviewPayload: NewReviewPayload = {
      store_external_id: productData.storeId,
      product_external_id: productData.productId,
      product_name: productData.productName,
      product_img: productData.productImg || "",
      author_name: data.name,
      rating: data.rating,
      content: data.review,
      product_url: productData.productUrl || "#",
    };

    createReview(newReviewPayload, {
      onError: () => {
        setSubmitState("error");
      },
      onSuccess: () => {
        setSubmitState("success");
        reset();

        // Invalidate all related caches so widgets refresh automatically
        queryClient.invalidateQueries({ queryKey: ["productReviews"] });
        queryClient.invalidateQueries({ queryKey: ["productRating"] });
        queryClient.invalidateQueries({ queryKey: ["lastReviews"] });

        setTimeout(() => {
          onClose();
        }, 1500);
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex flex-col gap-8 items-center justify-center bg-gray-200/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >

      {submitState === "success" && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
          🎉 {t(locale, "reviewSent")}
        </div>
      )}

      {submitState === "error" && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {t(locale, "error")}
        </div>
      )}

      <div
        className={merge(
          "m-2.5 md:m-0 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in",
          borderRadius[widgetConfig.border]
        )}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t(locale, "modalTitle")}</h2>
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

          <div className="w-full flex flex-col items-start gap-2">
            <input
              type="text"
              placeholder={t(locale, "namePlaceholder")}
              className="border w-full rounded-lg px-3 py-2 outline-none focus:ring-2 input-tv"
              maxLength={100}
              disabled={isPending || isSuccess}
              {
                ...register("name", {
                  required: t(locale, "nameRequired"),
                })
              }
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="w-full flex flex-col items-start gap-2">
            <textarea
              placeholder={t(locale, "reviewPlaceholder")}
              rows={4}
              className="border w-full rounded-lg px-3 py-2 outline-none focus:ring-2 resize-none input-tv"
              maxLength={500}
              disabled={isPending || isSuccess}
              {
                ...register("review", {
                  required: t(locale, "reviewRequired"),
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
            className="rounded-lg py-2 font-medium transition hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: widgetConfig.avatarBackground,
              color: "#fff",
            }}
            disabled={isPending || isSuccess}
          >
            {isPending ? (
              <span>{t(locale, "sending")}</span>
            ) : (
              <span>{t(locale, "submit")}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

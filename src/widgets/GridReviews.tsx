import { useProductReviews } from "../hooks/widgets/useProductReviews";
import { getTextStyleClasses } from "../utils/getTextStyleClasses";
import { merge } from "../utils/mergeStyles";
import { CreateReview } from "./components/CreateReview";
import { ReviewCardWidget } from "./components/ReviewCard";

export function GridReviews({
  storeId,
  productId,
  productName,
  productUrl,
  widgetConfig,
  productImg,
}: GridReviewsProps ) {

  const { data, isLoading } = useProductReviews(storeId, productId);

  if (isLoading || !data?.data.length ) return null;

  return (
    <div className="flex flex-1 flex-col gap-8 px-10 mb-10">

      <div className="flex flex-row items-center justify-between">

        {
          data.data.length ? (
            <h1
              className={merge(
                "text-2xl",
                getTextStyleClasses(widgetConfig.sectionTitleStyle)
              )}
            >
              {widgetConfig.sectionTitle}
            </h1>
          ) : (
            <h1
              className={merge(
                "text-2xl",
                getTextStyleClasses(widgetConfig.sectionTitleStyle)
              )}
            >
              Cuentanos que opinas del producto!
            </h1>
          )
        }

        <CreateReview productName={productName} productUrl={productUrl} widgetConfig={widgetConfig} storeId={storeId} productId={productId} productImg={productImg}/>
      </div>

      {
        data.data.length ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.data.map((review) => (
              <ReviewCardWidget
                key={review.id}
                review={review}
                config={widgetConfig}
                showProduct={false}          />
            ))}
          </div>
        ) : (
          <></>
        )
      }
    </div>
  );
}
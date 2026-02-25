import { widgetRequester } from "../widgetRequester";

export async function getProductReviews(payload:GetProductReviewsPayload): Promise<GetProductReviewsResponse> {

  console.log("fetching product Reviews");
  return widgetRequester({
    method: "POST",
    endpoint: "/widget/product/reviews",
    payload,
  })
}
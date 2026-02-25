import { widgetRequester } from "../widgetRequester";

export async function getProductReviews(payload:GetProductReviewsPayload): Promise<GetProductReviewsResponse> {

  return widgetRequester({
    method: "POST",
    endpoint: "/widget/product/reviews",
    payload,
  })
}
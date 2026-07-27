import { widgetRequester } from "../widgetRequester";

export async function getProductReviews(payload: GetProductReviewsPayload): Promise<GetProductReviewsResponse> {
  return widgetRequester({
    method: "GET",
    endpoint: "/widget/product/reviews",
    params: payload,
  });
}

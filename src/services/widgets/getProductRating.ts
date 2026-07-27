import { widgetRequester } from "../widgetRequester";

export async function getProductRating(payload: GetProductRatingPayload): Promise<GetProductRatingResponse> {
  return widgetRequester({
    method: "GET",
    endpoint: "/widget/product/rating",
    params: payload,
  });
}

import { widgetRequester } from "../widgetRequester";

export async function getProductRating(payload:GetProductRatingPayload): Promise<GetProductRatingResponse>{
  return widgetRequester({
    method: "POST",
    endpoint: "/widget/product/rating",
    payload,
  });
}
import { widgetRequester } from "../widgetRequester";

export async function getProductRating(payload:GetProductRatingPayload): Promise<GetProductRatingResponse>{

  console.log("fetching product Rating");

  return widgetRequester({
    method: "POST",
    endpoint: "/widget/product/rating",
    payload,
  });
}
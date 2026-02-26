import { widgetRequester } from "../widgetRequester";

export async function createReview (payload: NewReviewPayload):Promise<NewReviewResponse>{
  return widgetRequester({
    method: "POST",
    endpoint: "/widget/newReview",
    payload,
  })
}
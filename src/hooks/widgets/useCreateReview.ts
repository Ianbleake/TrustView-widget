import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { createReview } from "../../services/widgets/createReview";

export default function useCreateReview(): UseMutationResult<NewReviewResponse, Error, NewReviewPayload> {

  const createReviewMutation = useMutation<NewReviewResponse,Error,NewReviewPayload>({
    mutationKey: ["newReview"],
    mutationFn: createReview,
  })

  return createReviewMutation
}
type GetProductReviewsPayload = {
  storeId: string;
  productId: string;
}

type GetProductReviewsResponse = {
  success: boolean,
  data: Review[],
  meta: undefined,
}

type GetProductRatingPayload = {
  storeId: string,
  productId: string,
}

type GetProductRatingResponse = {
  success: boolean,
  data: {
    rating: number
  },
  meta: undefined,
}

type GetLastReviewsPayload = {
  storeId: string;
}

type GetLastReviewsResponse = {
  success: boolean,
  data: Review[],
  meta: undefined,
}

type GetConfigPayload = {
  storeId: string; 
}

type GetConfigResponse = {
  success: boolean,
  data: {
    widgetConfig: WidgetStyles;
  },
  meta: undefined
}

type NewReviewPayload = {
  tn_store_id: string;
  product_id: string; 
  product_name?: string | null;
  author_name: string;
  rating: number;
  content?: string;
  product_url: string;
};

type NewReviewResponse = {
	success: boolean;
	data: Review;
	meta: null;
};
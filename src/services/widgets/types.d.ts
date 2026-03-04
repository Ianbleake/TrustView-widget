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
  store_external_id: string;
  product_external_id: string; 
  product_name?: string | null;
  product_url: string;
  product_img: string;
  author_name: string;
  rating: number;
  content?: string;
};

type NewReviewResponse = {
	success: boolean;
	data: Review;
	meta: null;
};
"use server"

import { sdk } from "@lib/config"

export type ProductReview = {
  id: string
  title?: string | null
  content: string
  rating: number
  first_name: string
  last_name: string
  created_at?: string
}

export type ProductReviewsResult = {
  reviews: ProductReview[]
  count: number
  average_rating: number
}

export async function getProductReviews(
  productId: string,
  options?: { limit?: number; offset?: number }
): Promise<ProductReviewsResult> {
  const limit = options?.limit ?? 20
  const offset = options?.offset ?? 0

  try {
    const data = await sdk.client.fetch<{
      reviews: ProductReview[]
      count: number
      average_rating: number
    }>(`/store/products/${productId}/reviews`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
      },
      cache: "no-store",
    })

    return {
      reviews: data.reviews ?? [],
      count: data.count ?? 0,
      average_rating: data.average_rating ?? 0,
    }
  } catch {
    return { reviews: [], count: 0, average_rating: 0 }
  }
}

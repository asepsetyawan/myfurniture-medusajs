import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { createReviewWorkflow } from "../workflows/create-review"

type ExampleReview = {
  productHandle: string
  title?: string
  content: string
  rating: number
  first_name: string
  last_name: string
}

const EXAMPLE_REVIEWS: ExampleReview[] = [
  {
    productHandle: "curve",
    title: "Elegant and comfortable",
    content:
      "The Curve chair looks even better in person. The seat is supportive for long dinners and the finish matches our oak table perfectly.",
    rating: 5,
    first_name: "Aisha",
    last_name: "Rahman",
  },
  {
    productHandle: "curve",
    title: "Great value",
    content:
      "Assembly took about ten minutes. Slight color variation from the photos but still a beautiful piece for the price.",
    rating: 4,
    first_name: "Daniel",
    last_name: "Kusuma",
  },
  {
    productHandle: "can",
    title: "Living room centerpiece",
    content:
      "Deep cushions and clean lines. Delivery was on time and the modular layout fits our narrow apartment well.",
    rating: 5,
    first_name: "Mei",
    last_name: "Lin",
  },
  {
    productHandle: "can",
    title: "Fabric quality",
    content:
      "Very comfortable for daily use. We chose the neutral upholstery — it hides pet hair better than expected.",
    rating: 4.5,
    first_name: "James",
    last_name: "Hartono",
  },
  {
    productHandle: "belt",
    title: "Statement armchair",
    content:
      "The Belt armchair has a strong silhouette without feeling bulky. Perfect reading nook chair.",
    rating: 5,
    first_name: "Sofia",
    last_name: "Wijaya",
  },
  {
    productHandle: "belt",
    title: "Firm but cozy",
    content:
      "Seat is on the firmer side which we prefer. Arm height works well with our side table.",
    rating: 4,
    first_name: "Omar",
    last_name: "Santoso",
  },
  {
    productHandle: "mags",
    title: "Worth the investment",
    content:
      "Our Mags sectional transformed the lounge. Configuration options made it easy to plan around the window wall.",
    rating: 5,
    first_name: "Priya",
    last_name: "Nair",
  },
  {
    productHandle: "navona",
    title: "Solid dining table",
    content:
      "Heavy, stable, and seats six comfortably. Surface wipes clean after family meals.",
    rating: 4,
    first_name: "Luca",
    last_name: "Fernandez",
  },
  {
    productHandle: "navona",
    title: "Beautiful grain",
    content:
      "Wood tone is warm and consistent. Took two people to position but setup was straightforward.",
    rating: 5,
    first_name: "Hana",
    last_name: "Putri",
  },
  {
    productHandle: "albert",
    title: "Compact storage",
    content:
      "Fits a small bedroom and holds more than it looks. Drawers glide smoothly.",
    rating: 4,
    first_name: "Ethan",
    last_name: "Brooks",
  },
]

export default async function seedProductReviews({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const handles = [...new Set(EXAMPLE_REVIEWS.map((r) => r.productHandle))]

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: handles },
  })

  const productIdByHandle = new Map(
    products.map((p) => [p.handle as string, p.id as string])
  )

  const missing = handles.filter((h) => !productIdByHandle.has(h))
  if (missing.length) {
    logger.warn(
      `Skipping reviews for missing products (run seed:woodmart first): ${missing.join(", ")}`
    )
  }

  let created = 0

  for (const review of EXAMPLE_REVIEWS) {
    const productId = productIdByHandle.get(review.productHandle)
    if (!productId) {
      continue
    }

    await createReviewWorkflow(container).run({
      input: {
        title: review.title,
        content: review.content,
        rating: review.rating,
        product_id: productId,
        first_name: review.first_name,
        last_name: review.last_name,
        status: "approved",
      },
    })

    created++
  }

  logger.info(`Seeded ${created} approved product reviews.`)
}

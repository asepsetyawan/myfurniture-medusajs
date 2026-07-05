"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { ProductReview } from "@lib/data/reviews"
import ProductReviews from "@modules/products/components/product-reviews"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
  reviews?: ProductReview[]
  reviewCount?: number
  averageRating?: number
}

const ProductTabs = ({
  product,
  reviews = [],
  reviewCount = 0,
  averageRating = 0,
}: ProductTabsProps) => {
  const tabs = [
    {
      label: "Product Information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: reviewCount > 0 ? `Reviews (${reviewCount})` : "Reviews",
      component: (
        <ProductReviews
          reviews={reviews}
          count={reviewCount}
          averageRating={averageRating}
        />
      ),
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full [&_button]:text-[#2d2d2d] [&_button]:font-medium">
      <Accordion type="multiple" defaultValue={["Product Information"]}>
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="py-4 text-sm text-[#555]">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-[#2d2d2d]">Material</span>
            <p className="mt-1">{product.material ? product.material : "—"}</p>
          </div>
          <div>
            <span className="font-semibold text-[#2d2d2d]">Country of origin</span>
            <p className="mt-1">
              {product.origin_country ? product.origin_country : "—"}
            </p>
          </div>
          <div>
            <span className="font-semibold text-[#2d2d2d]">Type</span>
            <p className="mt-1">{product.type ? product.type.value : "—"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-[#2d2d2d]">Weight</span>
            <p className="mt-1">
              {product.weight ? `${product.weight} g` : "—"}
            </p>
          </div>
          <div>
            <span className="font-semibold text-[#2d2d2d]">Dimensions</span>
            <p className="mt-1">
              {product.length && product.width && product.height
                ? `${product.length}L × ${product.width}W × ${product.height}H`
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="py-4 text-sm text-[#555]">
      <div className="grid grid-cols-1 gap-y-6">
        <div className="flex items-start gap-x-3">
          <FastDelivery />
          <div>
            <span className="font-semibold text-[#2d2d2d]">Fast delivery</span>
            <p className="mt-1 max-w-sm">
              Your package will arrive in 3–5 business days at your pick-up
              location or at home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <Refresh />
          <div>
            <span className="font-semibold text-[#2d2d2d]">Simple exchanges</span>
            <p className="mt-1 max-w-sm">
              Not the right fit? We&apos;ll exchange your product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <Back />
          <div>
            <span className="font-semibold text-[#2d2d2d]">Easy returns</span>
            <p className="mt-1 max-w-sm">
              Return your product for a full refund — hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs

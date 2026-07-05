"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productTitle: string
}

const ImageGallery = ({ images, productTitle }: ImageGalleryProps) => {
  const validImages = images.filter((img) => !!img.url)
  const [activeIndex, setActiveIndex] = useState(0)

  if (validImages.length === 0) {
    return (
      <div className="aspect-[4/5] w-full rounded-xl bg-[#ebebeb] flex items-center justify-center text-sm text-[#999]">
        No image available
      </div>
    )
  }

  const activeImage = validImages[activeIndex] ?? validImages[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#eee]">
        <Image
          src={activeImage.url!}
          alt={`${productTitle} – image ${activeIndex + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {validImages.length > 1 ? (
        <ul className="grid grid-cols-4 gap-3 small:grid-cols-5">
          {validImages.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square w-full overflow-hidden rounded-lg ring-2 transition ${
                  index === activeIndex
                    ? "ring-[#e67e22]"
                    : "ring-transparent hover:ring-[#ddd]"
                }`}
              >
                <Image
                  src={image.url!}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default ImageGallery

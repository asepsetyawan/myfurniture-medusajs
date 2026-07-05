import Image from "next/image"

import { WoodmartBlogArticle } from "@lib/woodmart/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ArticleCard({ article }: { article: WoodmartBlogArticle }) {
  return (
    <article className="group flex flex-col">
      <LocalizedClientLink href={article.href} className="block">
        <div className="relative aspect-[860/532] overflow-hidden rounded-lg">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                <Image
                  src="/images/woodmart/authors/author-1.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="text-sm font-medium text-white">Mr. Mackay</span>
            </div>

            <div className="flex items-center gap-3 text-white/90">
              <span className="flex items-center gap-1">
                <ShareIcon />
              </span>
              <span className="flex items-center gap-1">
                <CommentIcon />
                <span className="text-xs">0</span>
              </span>
            </div>
          </div>
        </div>
      </LocalizedClientLink>

      <div className="mt-4 flex flex-col flex-1">
        <p className="text-xs text-[#999]">
          <span className="text-[#6b6b6b]">{article.category}</span>
          <span className="mx-1.5">/</span>
          {article.date}
        </p>

        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-[#2d2d2d] transition group-hover:text-[#e67e22]">
          <LocalizedClientLink href={article.href}>{article.title}</LocalizedClientLink>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6b6b6b] line-clamp-2">
          {article.excerpt}
        </p>

        <LocalizedClientLink
          href={article.href}
          className="mt-4 inline-block text-sm font-medium text-[#e67e22] hover:underline"
        >
          Continue reading
        </LocalizedClientLink>
      </div>
    </article>
  )
}

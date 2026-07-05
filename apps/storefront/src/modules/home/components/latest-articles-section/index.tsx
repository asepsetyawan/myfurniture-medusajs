import { WOODMART_LATEST_ARTICLES } from "@lib/woodmart/content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import ArticleCard from "./article-card"

export default function LatestArticlesSection() {
  return (
    <section className="bg-white pb-16 pt-20 small:pb-20 small:pt-28">
      <div className="content-container">
        <div className="mb-10 flex flex-col gap-4 small:flex-row small:items-center small:justify-between">
          <h2 className="font-display text-2xl font-semibold text-[#2d2d2d] small:text-3xl">
            Latest articles
          </h2>
          <LocalizedClientLink
            href="/store"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-[#2d2d2d] shadow-md ring-1 ring-[#eee] transition hover:shadow-lg"
          >
            Visit the Blog
            <span aria-hidden>→</span>
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-1 gap-8 small:grid-cols-2 medium:grid-cols-4 small:gap-6">
          {WOODMART_LATEST_ARTICLES.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}

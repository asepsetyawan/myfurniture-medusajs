import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import "styles/globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased text-[#2d2d2d] bg-white">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}

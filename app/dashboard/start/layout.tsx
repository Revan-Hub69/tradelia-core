import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inizia il Percorso | Tradelia - Educazione Crypto Antifuffa",
  description: "Prima di tutto, capiamo una cosa: nel mondo crypto non serve sapere tutto subito. Serve capire come non sbagliare. Inizia dal primo passo.",
  keywords: ["educazione crypto", "antifuffa", "bitcoin", "criptovalute", "formazione", "sicurezza"],
  openGraph: {
    title: "Inizia il Percorso | Tradelia",
    description: "Prima di tutto, capiamo una cosa: nel mondo crypto non serve sapere tutto subito. Serve capire come non sbagliare.",
    type: "website",
    locale: "it_IT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inizia il Percorso | Tradelia",
    description: "Prima di tutto, capiamo una cosa: nel mondo crypto non serve sapere tutto subito. Serve capire come non sbagliare.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/dashboard/start",
  },
}

export default function StartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
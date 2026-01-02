import { Fraunces, Sora } from "next/font/google";

// Configure Sora for interface text
export const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

// Configure Fraunces for headings
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-fraunces",
});

// Font utility classes for consistent usage
export const fontClasses = {
  // Primary UI font (Sora)
  ui: "font-sans",
  
  // Heading font (Fraunces)
  heading: "font-heading",
  
  // Monospace for code/data
  mono: "font-mono",
};

import { Inter, IBM_Plex_Sans } from "next/font/google";

// Configure Inter font for UI elements
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Configure IBM Plex Sans for headings and specific UI elements
export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

// Font utility classes for consistent usage
export const fontClasses = {
  // Primary UI font (Inter)
  ui: "font-sans",
  
  // Heading font (IBM Plex Sans)
  heading: "font-heading",
  
  // Monospace for code/data
  mono: "font-mono",
};
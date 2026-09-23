import "./globals.css";
export const metadata = {
  title: "Orders · ASIG Next.js starter",
  description: "A framework-neutral ASIG worklist with React-owned state.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

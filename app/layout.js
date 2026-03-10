import "./globals.css";

export const metadata = {
  title: "Block Market",
  description: "CMU-only block marketplace login"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

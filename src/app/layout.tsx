import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IMS",
  description: "Information Management System",
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body className={inter.className} style={{ display: "contents" }}>
      <>{children}</>
    </body>
  </html>
);

export default RootLayout;

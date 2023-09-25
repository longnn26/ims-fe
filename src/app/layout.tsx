import React from "react";
import { Inter } from "next/font/google";

import HeaderLayout from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IMS",
  description: "Information Management System",
};

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body className={inter.className}>
      <>{children}</>
    </body>
  </html>
);

export default RootLayout;

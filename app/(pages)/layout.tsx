import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function PagesRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

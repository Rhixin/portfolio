"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    router.push("/about");
  }, [router]);

  return <></>;
}

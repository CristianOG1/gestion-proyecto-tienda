import Image from "next/image";
import { Hero } from "../components/Hero";
import { Categories } from "@/components/Categories";

export const metadata = {
  title: "MiduShop",
  description: "Next.js + Strapi",
}

export default function Home() {
  return (
    <>
    <Hero/> 
    <Categories/>
    </>
  );
}

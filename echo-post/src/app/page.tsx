import Hero from "@/components/Hero";
import Image from "next/image";
import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <>
    <Navbar />
  <div className="bg-pink-50 text-gray-900 px-16 py-20 min-h-screen font-serif">
     
     <Hero/>
  </div>
  </>
  );
}

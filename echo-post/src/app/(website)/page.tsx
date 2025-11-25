import Hero from "@/components/Hero";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
  <div className="bg-pink-50 text-gray-900 px-16 py-20 min-h-screen font-serif">
    <Navbar />
     <Hero/>
     <Footer/>
  </div>
  );
}

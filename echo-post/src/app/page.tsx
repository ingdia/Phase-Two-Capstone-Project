import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-900 py-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <Hero />
        </div>
      </div>
    </>
  );
}

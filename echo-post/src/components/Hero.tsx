import React from "react";
import Image from "next/image";
import Link from "next/link";

function Hero() {
  const authors = [
    {
      name: "Sarah Chen",
      bio: "Tech writer exploring AI and human creativity",
      avatar: "/image/image.png"
    },
    {
      name: "Marcus Johnson", 
      bio: "Storyteller crafting narratives that inspire change",
      avatar: "/image/image.png"
    },
    {
      name: "Elena Rodriguez",
      bio: "Travel writer sharing adventures from around the globe",
      avatar: "/image/image.png"
    }
  ];

  return (
    <section className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
      {/* Hero Image */}
      <div className="flex-shrink-0">
        <Image 
          src="/image/image.png" 
          alt="Hero Image" 
          width={300} 
          height={250} 
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 text-center md:text-left">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            Read, Write, Inspire
          </h1>
          <p className="text-lg text-gray-700">
            Bring your ideas to life and connect with a community of passionate readers.
          </p>
          <p className="text-base text-gray-600">
            Start your journey today and see where your creativity takes you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/register" className="bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition duration-300 shadow-lg">
              Get Started
            </Link>
            <Link href="/login" className="border-2 border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-full hover:border-black hover:text-black transition duration-300">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Authors */}
      <div className="flex-shrink-0 w-full md:w-80">
        <h2 className="text-lg font-bold text-black mb-4">Our Authors</h2>
        <div className="space-y-3">
          {authors.map((author, index) => (
            <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-md border border-gray-100">
              <Image
                src={author.avatar}
                alt={author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-black">
                  {author.name}
                </h4>
                <p className="text-gray-600 text-xs">
                  {author.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;

import React from "react";
import image from "../../public/image/image.png";
import Image from "next/image";

function Hero() {
  return (
    <section className="flex flex-col md:flex-row space-x-2">
      {/* right side */}

      <Image src="/image/image.png" alt="Hero Image" width={300} height={100} />

      <div>
        <div className="flex flex-col items-start justify-center space-y-6 p-8 md:p-6  max-w-xl">
          <h1 className="text-5xl md:text-4xl font-extrabold text-gray-900 leading-snug">
            Read, Write, Inspire
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Bring your ideas to life and connect with a community of passionate
            readers.
          </p>
          <p className="text-md md:text-lg text-gray-600">
            Start your journey today and see where your creativity takes you.
          </p>
          <button className="bg-gradient-to-r from-pink-600 to-black text-white font-bold px-8 py-3 rounded-full shadow-xl hover:scale-105 transform transition duration-300">
            Get Started
          </button>
        </div>
      </div>

      {/* left side */}
      <div className="flex flex-col gap-4">
        <h2> Our Authors</h2>
        <div className=" flex flex-row space-x-2 justify-center items-center bg-white p-4 shadow-2xl rounded-2xl">
          <div className="rounded-full">
            <Image
              src="/image/image.png"
              alt="Hero Image"
              width={30}
              height={10}
            />
          </div>
          <div>
            <h4 className="font-semibold text-lg text-gray-900">
              Diane ingire
            </h4>
            <p className="text-gray-600 text-sm">
              A passionate storyteller and editor who loves bringing ideas to
              life through writing.{" "}
            </p>
          </div>
        </div>
        <div className=" flex flex-row space-x-2 justify-center items-center bg-white p-4 shadow-2xl">
          <div className="rounded-full">
            <Image
              src="/image/image.png"
              alt="Hero Image"
              width={30}
              height={10}
            />
          </div>
          <div>
            <h4 className="font-semibold text-lg text-gray-900">
              Diane ingire
            </h4>
            <p className="text-gray-600 text-sm">
              A passionate storyteller and editor who loves bringing ideas to
              life through writing.{" "}
            </p>
          </div>
        </div>
        <div className=" flex flex-row space-x-2 justify-center items-center rounded-2xl bg-white p-4 shadow-2xl">
          <div className="rounded-full">
            <Image
              src="/image/image.png"
              alt="Hero Image"
              width={30}
              height={10}
            />
          </div>
          <div>
            <h4 className="font-semibold text-lg text-gray-900">
              Diane ingire
            </h4>
            <p className="text-gray-600 text-sm">
              A passionate storyteller and editor who loves bringing ideas to
              life through writing.{" "}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

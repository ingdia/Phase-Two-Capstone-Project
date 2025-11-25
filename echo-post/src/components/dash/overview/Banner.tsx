"use client";
import { Sparkles } from "lucide-react";

const Banner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-pink-900 via-pink-900 to-black rounded-xl lg:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl -mr-16 sm:-mr-24 lg:-mr-32 -mt-16 sm:-mt-24 lg:-mt-32"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-xs sm:text-sm font-medium uppercase tracking-wide">
            Welcome Back
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Discover Stories That Matter</h1>
        <p className="text-white/90 text-sm sm:text-base lg:text-lg">
          Your personalized feed of inspiring content
        </p>
      </div>
    </div>
  );
};

export default Banner;

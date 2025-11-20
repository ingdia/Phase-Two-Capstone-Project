"use client";
import { Sparkles } from "lucide-react";

const Banner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-pink-900 via-pink-900 to-black rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6" />
          <span className="text-sm font-medium uppercase tracking-wide">
            Welcome Back
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Discover Stories That Matter</h1>
        <p className="text-white/90 text-lg">
          Your personalized feed of inspiring content
        </p>
      </div>
    </div>
  );
};

export default Banner;

import React from "react";
import { IoIosArrowBack } from "react-icons/io";

export interface HeroCardProps {
  fadeTitle: string;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  backgroundImage: string;
  className?: string;
}

const HeroCard: React.FC<HeroCardProps> = ({
  fadeTitle,
  title,
  description,
  buttonText,
  onButtonClick,
  backgroundImage,
  className = "",
}) => {
  return (
    <div
      className={`hero-card relative rounded-2xl overflow-hidden shadow-lg flex items-center transition-shadow duration-300 hover:shadow-2xl cursor-pointer ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: '350px'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-red-500/50 to-black/50" />

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 max-w-md text-right text-white w-full">
        <span className="text-red-500 font-bold opacity-35 text-4xl sm:text-6xl">
          {fadeTitle}
        </span>
        <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 -mt-2 sm:-mt-4">
          {title}
        </h2>
        <p className="text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-5 line-clamp-2">
          {description}
        </p>
        <button
          onClick={onButtonClick}
          className="bg-red-500 hover:bg-red-600 transition px-4 sm:px-5 py-2 rounded-lg font-medium text-sm sm:text-base border-none text-white flex items-center gap-2 cursor-pointer"
        >
          {buttonText}
          <IoIosArrowBack />
        </button>
      </div>
    </div>
  );
};

export default HeroCard;
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
export interface HeroCardProps {
  fadeTitle: string;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  width?: string | number;
  height?: string | number;
  backgroundImage: string;
  titleSize?: string;
  descriptionSize?: string;
  buttonSize?: string;
  backGroundFade: string;
}

const HeroCard: React.FC<HeroCardProps> = ({
  fadeTitle,
  title,
  description,
  buttonText,
  onButtonClick,
  width = "100%",
  height = "300px",
  backgroundImage,
  titleSize = "text-2xl",
  descriptionSize = "text-sm",
  buttonSize = "text-sm",
  backGroundFade = "bg-black/50",
}) => {
  return (
    <div
      className="hero-card relative rounded overflow-hidden shadow-lg flex items-center
    transition-shadow duration-300 hover:shadow-2xl cursor-pointer"
      style={{
        width,
        height,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${backGroundFade}`} />

      {/* Content */}
      <div className="relative z-10 p-6 max-w-md text-right text-white">
        <span className="text-red-500 text-6xl font-bold  opacity-35">{fadeTitle}</span>
        <h2 className={`${titleSize} font-bold mb-3 -mt-4`}>{title}</h2>
        <p className={`${descriptionSize} leading-relaxed mb-5`}>
          {description}
        </p>
        <button
          onClick={onButtonClick}
          className={`bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-lg font-medium ${buttonSize} border-none text-white flex items-center gap-2 cursor-pointer`}
        >
          {buttonText}
          <IoIosArrowBack />
        </button>
      </div>
    </div>
  );
};

export default HeroCard;

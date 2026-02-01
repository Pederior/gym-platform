import { FaPlay } from "react-icons/fa";

const VideoOverlay = () => {
  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-3 bg-black/70 text-white px-6 py-4 rounded-full">
      <button className=" bg-red-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition border-none cursor-pointer">
        <FaPlay className="text-white text-lg mr-[-2px] " />
      </button>
        <div className="text-right">
          <p className="font-bold text-lg leading-tight">
            نمایش ژیمناستیک
          </p>
          <p className="text-sm text-gray-300">
            مشاهده ویدئو
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default VideoOverlay;
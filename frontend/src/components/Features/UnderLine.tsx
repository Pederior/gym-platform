
export default function UnderLine() {
  return (
    <div className="ml-2 w-full h-[1px] bg-gray-500/50 mb-5 relative">
      <div className="absolute top-[-2px] inset-0 w-[8px] h-[5px] bg-red-500 "></div>
      <div className="absolute top-[-1px] inset-0 w-1/4 h-[3px] bg-red-500 "></div>
    </div>
  );
}

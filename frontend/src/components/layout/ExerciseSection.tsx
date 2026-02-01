import { FaCheck } from "react-icons/fa6";
interface Exercise {
  name: string;
}

const ExerciseSection: React.FC = () => {
  const exercises: Exercise[] = [
    { name: "تمرینات ABS" },
    { name: "تمرینات هرجا" },
    { name: "تمرینات بازو" },
    { name: "تمرینات بدنسازی" },
    { name: "تمرینات پشت" },
    { name: "تمرینات پا/سیپت" },
    { name: "تمرینات قلبی" },
    { name: "تمرینات قفسه سینه" },
    { name: "تمرینات کراس فیت" },
    { name: "تمرینات کتلبل" },
    { name: "تمرینات سرعتی" },
    { name: "تمرینات ترایسیپت" },
  ];

  const columns = [
    exercises.slice(0, 4),
    exercises.slice(4, 8),
    exercises.slice(8, 12),
  ];

  return (
    <div className="bg-white py-12 px-6 md:px-20 flex flex-col md:flex-row items-center">
      <div className="md:w-1/3 mt-10 md:mt-0 flex justify-center">
        <img
          src="/images/Exercise3.jpg"
          alt="Exercise"
          className="w-96 md:w-96 rounded-lg md:ml-20"
        />
      </div>

      <div className="md:w-2/3">
        <p className="text-gray-400 mb-2">به باشگاه فینیکس خوش آمدید</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          شروع <span className="text-red-500">تمرینات</span> روتین
        </h2>
        <p className="text-black mb-8">
          همه چیزهایی که لازم است برای از بین بردن شکم خود چند فوت مربع است، چه
          در باشگاه یا در اتاق نشیمن برای تکمیل این مدار وزن بدن انفجاری.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {columns.map((col, idx) => (
            <ul key={idx} className="space-y-5">
              {col.map((exercise, i) => (
                <li key={i} className="flex items-center gap-2 text-black">
                  <span className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center transition-all duration-300 transform hover:bg-white hover:text-red-500 hover:rounded-lg hover:scale-150">
                    <FaCheck />
                  </span>
                  {exercise.name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseSection;

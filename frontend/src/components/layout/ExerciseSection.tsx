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

  return (
    <div className="bg-background py-12 px-4 sm:px-6 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* تصویر */}
          <div className="lg:w-2/5 flex justify-center">
            <img
              src="/images/Exercise3.jpg"
              alt="تمرینات"
              className="w-full max-w-md h-auto rounded-xl shadow-lg object-cover"
            />
          </div>

          {/* متن و لیست */}
          <div className="lg:w-3/5">
            <p className="text-muted-foreground mb-2 text-sm">به باشگاه فینیکس خوش آمدید</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              شروع <span className="text-primary">تمرینات</span> روتین
            </h2>
            <p className="text-foreground mb-8 leading-relaxed">
              همه چیزهایی که لازم است برای از بین بردن شکم خود چند فوت مربع است، چه
              در باشگاه یا در اتاق نشیمن برای تکمیل این مدار وزن بدن انفجاری.
            </p>

            {/* لیست تمرینات - responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((exercise, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors border border-border"
                >
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 transform hover:bg-primary/80 hover:scale-110">
                    <FaCheck className="text-xs" />
                  </span>
                  <span className="text-foreground font-medium">{exercise.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSection;
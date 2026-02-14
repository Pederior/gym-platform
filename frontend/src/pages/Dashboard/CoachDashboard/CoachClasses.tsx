import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/ui/Card";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import useDocumentTitle from '../../../hooks/useDocumentTitle';

interface Class {
  _id: string;
  title: string;
  dateTime: string;
  capacity: number;
  reservedBy: any[];
  price: number;
}

export default function CoachClasses() {
  useDocumentTitle("لیست کلاس ها");
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/classes");
        setClasses(res.data.classes);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "خطا در بارگذاری کلاس‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواید این کلاس را حذف کنید؟")) return;
    try {
      await api.delete(`/classes/${id}`);
      setClasses(classes.filter((cls) => cls._id !== id));
      toast.success("کلاس با موفقیت حذف شد");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در حذف کلاس");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">لیست کلاس‌ها</h1>
        <Link
          to="/dashboard/coach/classes/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80"
        >
          ایجاد کلاس جدید
        </Link>
      </div>

      <Card>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="text-right text-sm text-muted-foreground border-b border-border">
                  <th className="py-3 px-2">عنوان</th>
                  <th className="py-3 px-2">تاریخ و ساعت</th>
                  <th className="py-3 px-2">ظرفیت</th>
                  <th className="py-3 px-2">هزینه</th>
                  <th className="py-3 px-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls._id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-2 text-foreground">{cls.title}</td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {new Date(cls.dateTime).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="py-3 px-2 text-foreground">
                      {cls.reservedBy.length}/{cls.capacity}
                    </td>
                    <td className="py-3 px-2 text-foreground">{cls.price.toLocaleString()} تومان</td>
                    <td className="py-3 px-2">
                      <Link
                        to={`/dashboard/coach/classes/edit/${cls._id}`}
                        className="text-primary hover:text-primary/80 ml-3 cursor-pointer"
                      >
                        ویرایش
                      </Link>
                      <button
                        onClick={() => handleDelete(cls._id)}
                        className="text-destructive hover:text-destructive/80 cursor-pointer"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
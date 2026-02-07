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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لیست کلاس‌ها</h1>
        <Link
          to="/dashboard/coach/classes/create"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          ایجاد کلاس جدید
        </Link>
      </div>

      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500 border-b">
                  <th>عنوان</th>
                  <th>تاریخ و ساعت</th>
                  <th>ظرفیت</th>
                  <th>هزینه</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls._id} className="border-b">
                    <td>{cls.title}</td>
                    <td>
                      {new Date(cls.dateTime).toLocaleDateString("fa-IR")}
                    </td>
                    <td>
                      {cls.reservedBy.length}/{cls.capacity}
                    </td>
                    <td>{cls.price.toLocaleString()} تومان</td>
                    <td>
                      <Link
                        to={`/dashboard/coach/classes/edit/${cls._id}`}
                        className="text-blue-600 ml-3 cursor-pointer"
                      >
                        ویرایش
                      </Link>
                      <button
                        onClick={() => handleDelete(cls._id)}
                        className="text-red-600 cursor-pointer"
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

//! not used
import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import { toast } from "react-hot-toast";
import { adminService, type Pricing } from "../../../services/adminService";
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminClubSettings() {
  useDocumentTitle("تنظیمات قیمت‌ها")
  const [pricing, setPricing] = useState<Pricing>({
    monthly: 0,
    quarterly: 0,
    yearly: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await adminService.getPricing();
        setPricing(data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "خطا در بارگذاری قیمت‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setPricing({ ...pricing, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.updatePricing(pricing);
      toast.success("قیمت‌ها با موفقیت به‌روز شد");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در به‌روزرسانی قیمت‌ها");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">تنظیمات قیمت‌ها</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اشتراک ماهانه (تومان)
            </label>
            <input
              type="number"
              name="monthly"
              value={pricing.monthly}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اشتراک سه‌ماهه (تومان)
            </label>
            <input
              type="number"
              name="quarterly"
              value={pricing.quarterly}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اشتراک سالانه (تومان)
            </label>
            <input
              type="number"
              name="yearly"
              value={pricing.yearly}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {submitting ? "در حال ذخیره..." : "ذخیره قیمت‌ها"}
          </button>
        </form>
      </Card>
    </div>
  );
}

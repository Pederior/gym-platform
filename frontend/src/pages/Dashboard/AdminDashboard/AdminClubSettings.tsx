import { useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import { toast } from "react-hot-toast";
import { adminService, type Settings } from "../../../services/adminService";
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function AdminSettings() {
  useDocumentTitle('تنظیمات کلاب');
  const [settings, setSettings] = useState<Settings>({
    clubName: "",
    address: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getSettings();
        setSettings(data);
      } catch (err: any) {
        console.error('Fetch settings error:', err);
        toast.error(err.response?.data?.message || 'خطا در بارگذاری تنظیمات');
        
        setSettings({
          clubName: '',
          address: '',
          phone: '',
          email: ''
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.updateSettings(settings);
      toast.success("تنظیمات با موفقیت ذخیره شد");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ذخیره تنظیمات");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4 sm:p-8 text-center text-muted-foreground">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">تنظیمات کلی</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              نام باشگاه
            </label>
            <input
              type="text"
              name="clubName"
              value={settings.clubName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              آدرس
            </label>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              تلفن
            </label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              ایمیل
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
          >
            {submitting ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </button>
        </form>
      </Card>
    </div>
  );
}
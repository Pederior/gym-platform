import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { financialService, type FinancialReport } from '../../../services/financialService'
import { toast } from 'react-hot-toast'
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminReports() {
  useDocumentTitle('گزارش‌های مالی')
  const [report, setReport] = useState<FinancialReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await financialService.getFinancialReport()
        setReport(data)
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری گزارش')
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="py-8 text-center">در حال بارگذاری گزارش...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">گزارش‌های مالی</h1>
      
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-gray-600">درآمد ماهانه</p>
            <p className="text-2xl font-bold mt-2 text-green-600">
              {report.monthlyRevenue.toLocaleString()} تومان
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600">اشتراک‌های فعال</p>
            <p className="text-2xl font-bold mt-2">{report.activeSubscriptions}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600">کاربران کل</p>
            <p className="text-2xl font-bold mt-2">{report.totalUsers}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600">موفقیت پرداخت</p>
            <p className="text-2xl font-bold mt-2">{report.paymentSuccessRate}%</p>
          </Card>
        </div>
      )}

      <Card>
        <h2 className="text-lg font-bold mb-4">جزئیات گزارش</h2>
        <p className="text-gray-600">در آینده نمودارهای تعاملی و جزئیات بیشتر اضافه خواهد شد.</p>
      </Card>
    </div>
  )
}
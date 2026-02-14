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
      <div className="p-4 sm:p-8">
        <div className="py-8 text-center text-muted-foreground">در حال بارگذاری گزارش...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-6">گزارش‌های مالی</h1>
      
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-muted-foreground">درآمد ماهانه</p>
            <p className="text-lg sm:text-2xl font-bold mt-2 text-accent">
              {report.monthlyRevenue.toLocaleString()} تومان
            </p>
          </Card>
          <Card className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-muted-foreground">اشتراک‌های فعال</p>
            <p className="text-lg sm:text-2xl font-bold mt-2 text-foreground">
              {report.activeSubscriptions}
            </p>
          </Card>
          <Card className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-muted-foreground">کاربران کل</p>
            <p className="text-lg sm:text-2xl font-bold mt-2 text-foreground">
              {report.totalUsers}
            </p>
          </Card>
          <Card className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-muted-foreground">موفقیت پرداخت</p>
            <p className="text-lg sm:text-2xl font-bold mt-2 text-primary">
              {report.paymentSuccessRate}%
            </p>
          </Card>
        </div>
      )}

      <Card>
        <h2 className="text-lg font-bold text-foreground mb-4">جزئیات گزارش</h2>
        <p className="text-muted-foreground">در آینده نمودارهای تعاملی و جزئیات بیشتر اضافه خواهد شد.</p>
      </Card>
    </div>
  )
}
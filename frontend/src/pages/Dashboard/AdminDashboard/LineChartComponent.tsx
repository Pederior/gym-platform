import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'روز ۱', sales: 10000 },
  { name: 'روز ۲', sales: 15000 },
  { name: 'روز ۳', sales: 12000 },
  { name: 'روز ۴', sales: 18000 },
  { name: 'روز ۵', sales: 14000 },
  { name: 'روز ۶', sales: 20000 },
  { name: 'روز ۷', sales: 16000 },
];

const LineChartComponent = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">گزارش فروش</h3>
        <div className="flex space-x-4 rtl:space-x-reverse">
          <div className="text-right">
            <div className="font-bold">۱۵,۰۰۰ تومان</div>
            <div className="text-sm text-gray-500">ماه اخیر</div>
          </div>
          <div className="text-right">
            <div className="font-bold">۱۰,۰۰۰ تومان</div>
            <div className="text-sm text-gray-500">ماه اخیر</div>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#1f77b4" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
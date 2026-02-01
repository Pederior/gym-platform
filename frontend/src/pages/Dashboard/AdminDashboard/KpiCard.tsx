import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const KpiCard = ({ title, value, change, icon }: KpiCardProps) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
      <div>
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isPositive ? <ArrowUpIcon className="w-3 h-3 ml-1" /> : <ArrowDownIcon className="w-3 h-3 ml-1" />}
          {Math.abs(change)}%
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
      <div className="text-3xl text-gray-400">{icon}</div>
    </div>
  );
};

export default KpiCard;
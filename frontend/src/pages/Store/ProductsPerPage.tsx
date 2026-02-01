import { useState } from "react";

interface ProductsPerPageProps {
  onPerPageChange: (value: number) => void;
}

export default function ProductsPerPage({
  onPerPageChange,
}: ProductsPerPageProps) {
  const [selected, setSelected] = useState(16);

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSelected(value);
    onPerPageChange(value);
  };

  return (
    <select
      id="ppp"
      name="ppp"
      value={selected}
      onChange={handlePerPageChange}
      className="border border-gray-300 px-4 py-2 bg-white bg-no-repeat bg-left text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
      aria-label="تعداد محصولات در هر صفحه"
      style={{
        backgroundImage: "url('/images/arrow.svg')",
        backgroundSize: "10px",
      }}
    >
      <option value="6">۶ محصول</option>
      <option value="16">۱۶ محصول</option>
      <option value="32">۳۲ محصول</option>
      <option value="48">۴۸ محصول</option>
      <option value="64">۶۴ محصول</option>
      <option value="128">۱۲۸ محصول</option>
    </select>
  );
}

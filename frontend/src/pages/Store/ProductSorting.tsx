import { useState } from "react";

interface ProductSortingProps {
  onSortChange: (value: string) => void;
}

export default function ProductSorting({ onSortChange }: ProductSortingProps) {
  const [selected, setSelected] = useState("menu_order");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    onSortChange(value);
  };

  return (
    <select
      id="orderby"
      name="orderby"
      value={selected}
      onChange={handleSortChange}
      className="border border-gray-300 px-4 py-2 bg-white bg-no-repeat bg-left text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
      aria-label="مرتب‌سازی محصولات"
      style={{
        backgroundImage: "url('/images/arrow.svg')",
        backgroundSize: "10px",
      }}
    >
      <option value="menu_order">پیش‌فرض</option>
      <option value="popularity">محبوبیت</option>
      <option value="featured">ویژه</option>
      <option value="rating">امتیاز بالا</option>
      <option value="relevance">مرتب‌سازی محصولات</option>
      <option value="date">جدیدترین</option>
      <option value="date-asc">قدیمی‌ترین</option>
      <option value="price">قیمت: کم به زیاد</option>
      <option value="price-desc">قیمت: زیاد به کم</option>
      <option value="discount-desc">بالاترین تخفیف</option>
      <option value="discount-asc">کمترین تخفیف</option>
      <option value="title">الفبا: A-Z</option>
      <option value="title-desc">الفبا: Z-A</option>
    </select>
  );
}

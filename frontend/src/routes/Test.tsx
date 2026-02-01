export default function SideCalendarButton() {
  return (
    <div className="relative">
      
      {/* main sidebar */}
      <div className="h-96 w-64 rounded-l-3xl bg-blue-700"></div>

      {/* half circle button */}
      <div className="relative bg-blue-700 rounded-l-3xl p-6">
  <div
    className="
      absolute -right-4 top-1/2 -translate-y-1/2
      h-16 w-8 bg-blue-700
      rounded-r-full
    "
  />
</div>

    </div>
  );
}

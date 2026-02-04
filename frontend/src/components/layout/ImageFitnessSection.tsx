
export default function ImageFitnessSection() {
  const fitness = [
    "/images/l1-1.jpg",
    "/images/l2-1.jpg",
    "/images/l3-1.jpg",
    "/images/l4-1.jpg",
    "/images/l5-1.jpg",
    "/images/l6-1.jpg",
  ];
  return (
    <section className="w-9/12 grid grid-cols-2 md:grid-cols-6 gap-8 max-w-7xl mx-auto mb-28 mt-10">
      {fitness.map((fit, index) => (
        <img key={index} src={fit} alt="" className="h-20 opacity-50 hover:opacity-100 transition "style={{
      transition: "all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      transformStyle: "preserve-3d",
    }}
    onMouseEnter={(e) => {
      (e.target as HTMLElement).style.transform = "rotateY(360deg)";
    }}
    onMouseLeave={(e) => {
      (e.target as HTMLElement).style.transform = "rotateY(0deg)";
    }}/>
      ))}
    </section>
  );
}

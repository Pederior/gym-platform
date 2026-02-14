import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import useDocumentTitle from "../../../hooks/useDocumentTitle";

interface TrainingVideo {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  category: "nutrition" | "workout" | "lifestyle" | "motivation";
  accessLevel: "bronze" | "silver" | "gold";
}

export default function UserTrainingVideos() {
  useDocumentTitle("ویدیوهای آموزشی");

  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    fetchVideos();
  }, []);
  
  const getFullUrl = (url: string) => {
    if (url && url.startsWith("/uploads/")) {
      return `${window.location.origin}${url}`;
    }
    return url;
  };

  const fetchVideos = async () => {
    try {
      const res = await api.get("/user/videos");
      setVideos(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      workout: "تمرین",
      nutrition: "تغذیه",
      lifestyle: "سبک زندگی",
      motivation: "انگیزشی",
    };
    return labels[category] || category;
  };

  const getAccessLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      bronze: "bg-primary/10 text-primary",
      silver: "bg-muted-foreground/10 text-muted-foreground",
      gold: "bg-accent/10 text-accent",
    };
    return colors[level] || "bg-muted/50 text-muted-foreground";
  };

  const filteredVideos =
    activeCategory === "all"
      ? videos
      : videos.filter((video) => video.category === activeCategory);

  const categories = [
    { id: "all", name: "همه" },
    { id: "workout", name: "تمرین" },
    { id: "nutrition", name: "تغذیه" },
    { id: "lifestyle", name: "سبک زندگی" },
    { id: "motivation", name: "انگیزشی" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground">ویدیوهای آموزشی</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-card p-8 rounded-xl shadow border border-border text-center">
          <div className="text-6xl mb-4 text-muted-foreground">🎬</div>
          <h3 className="font-bold text-foreground mb-2">ویدیویی یافت نشد</h3>
          <p className="text-muted-foreground">
            ممکنه ویدیویی برای سطح اشتراک شما وجود نداشته باشه
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Link
              key={video._id}
              to={`/dashboard/user/videos/${video._id}`}
              className="block"
            >
              <div className="bg-card rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden border border-border">
                <div className="relative">
                  {video.thumbnail ? (
                    <img
                      src={getFullUrl(video.thumbnail)}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <span className="text-4xl text-muted-foreground">🎬</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {Math.floor(video.duration / 60)}:
                    {(video.duration % 60).toString().padStart(2, "0")}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1">
                      {video.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(video.accessLevel)}`}
                    >
                      {video.accessLevel === "gold"
                        ? "طلایی"
                        : video.accessLevel === "silver"
                          ? "نقره‌ای"
                          : "برنز"}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {video.description}
                  </p>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{getCategoryLabel(video.category)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
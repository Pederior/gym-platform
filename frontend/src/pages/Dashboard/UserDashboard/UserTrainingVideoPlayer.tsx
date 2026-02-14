import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

interface TrainingVideo {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  category: string;
  accessLevel: string;
}

export default function UserTrainingVideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<TrainingVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchVideo(id);
    }
  }, [id]);

  const getFullUrl = (url: string) => {
    if (url && url.startsWith("/uploads/")) {
      return `${window.location.origin}${url}`;
    }
    return url;
  };

  const fetchVideo = async (videoId: string) => {
    try {
      const res = await api.get(`/user/videos/${videoId}`);
      setVideo(res.data.data);
    } catch (err: any) {
      console.error("Error fetching video:", err);
      setError(err.response?.data?.message || "خطا در بارگذاری ویدیو");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card p-8 rounded-xl shadow border border-border text-center max-w-2xl mx-auto">
        <div className="text-6xl mb-4 text-destructive">❌</div>
        <h3 className="font-bold text-foreground mb-2">خطا در بارگذاری ویدیو</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button
          onClick={() => navigate("/dashboard/user/videos")}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80"
        >
          بازگشت به لیست ویدیوها
        </button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="bg-card p-8 rounded-xl shadow border border-border text-center max-w-2xl mx-auto">
        <div className="text-6xl mb-4 text-muted-foreground">🎬</div>
        <h3 className="font-bold text-foreground mb-2">ویدیو یافت نشد</h3>
        <button
          onClick={() => navigate("/dashboard/user/videos")}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80"
        >
          بازگشت به لیست ویدیوها
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">{video.title}</h1>
        <button
          onClick={() => navigate("/dashboard/user/videos")}
          className="text-muted-foreground hover:text-foreground"
        >
          بازگشت
        </button>
      </div>

      {/* Video Player */}
      <div className="bg-card rounded-xl shadow border border-border overflow-hidden">
        <div className="aspect-video bg-black">
          {video.videoUrl ? (
            <video
              src={getFullUrl(video.videoUrl)}
              controls
              className="w-full h-full object-contain"
              poster={getFullUrl(video.thumbnail) || undefined}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              ویدیویی برای پخش وجود ندارد
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{video.title}</h2>
              <p className="text-muted-foreground mt-1">{video.description}</p>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {Math.floor(video.duration / 60)}:
              {(video.duration % 60).toString().padStart(2, "0")}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-muted text-foreground rounded text-sm">
              {video.category === "workout"
                ? "تمرین"
                : video.category === "nutrition"
                  ? "تغذیه"
                  : video.category === "lifestyle"
                    ? "سبک زندگی"
                    : "انگیزشی"}
            </span>
            <span className="px-2 py-1 bg-accent/10 text-accent rounded text-sm">
              {video.accessLevel === "gold"
                ? "طلایی"
                : video.accessLevel === "silver"
                  ? "نقره‌ای"
                  : "برنز"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
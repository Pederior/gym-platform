import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { toast } from 'react-hot-toast';

interface TrainingVideo {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  category: 'nutrition' | 'workout' | 'lifestyle' | 'motivation';
  accessLevel: 'bronze' | 'silver' | 'gold';
  isActive: boolean;
}

export default function CoachTrainingVideos() {
  useDocumentTitle('ویدیوهای آموزشی');
  
//   const navigate = useNavigate();
  const [videos, setVideos] = useState<TrainingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/coach/videos');
      setVideos(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      toast.error('خطا در بارگذاری ویدیوها');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) return;
    
    try {
      await api.delete(`/coach/videos/${id}`);
      fetchVideos();
      toast.success('ویدیو با موفقیت حذف شد');
    } catch (err) {
      console.error('Error deleting video:', err);
      toast.error('خطا در حذف ویدیو');
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      workout: 'تمرین',
      nutrition: 'تغذیه',
      lifestyle: 'سبک زندگی',
      motivation: 'انگیزشی'
    };
    return labels[category] || category;
  };

  const getAccessLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      bronze: 'bg-blue-100 text-blue-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getAccessLevelLabel = (level: string) => {
    return level === 'gold' ? 'طلایی' : 
           level === 'silver' ? 'نقره‌ای' : 'برنز';
  };

  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === activeCategory);

  const categories = [
    { id: 'all', name: 'همه' },
    { id: 'workout', name: 'تمرین' },
    { id: 'nutrition', name: 'تغذیه' },
    { id: 'lifestyle', name: 'سبک زندگی' },
    { id: 'motivation', name: 'انگیزشی' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ویدیوهای آموزشی</h1>
        <Link
          to="/dashboard/coach/videos/create"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          + افزودن ویدیو جدید
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="font-bold text-gray-800 mb-2">ویدیویی وجود ندارد</h3>
          <p className="text-gray-600 mb-4">
            هنوز ویدیویی ایجاد نکرده‌اید. برای شروع، روی دکمه "افزودن ویدیو جدید" کلیک کنید.
          </p>
          <Link
            to="/dashboard/coach/videos/create"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            ایجاد ویدیوی اول
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div key={video._id} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative">
                {video.thumbnail ? (
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl">🎬</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </div>
                
                {/* Status Indicator */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    video.isActive 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {video.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                    {video.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(video.accessLevel)}`}>
                    {getAccessLevelLabel(video.accessLevel)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {video.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {getCategoryLabel(video.category)}
                  </span>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/coach/videos/edit/${video._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      ویرایش
                    </Link>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
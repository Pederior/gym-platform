import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import { 
  adminService, 
  type Equipment, 
  type Room 
} from '../../../services/adminService';
import useDocumentTitle from '../../../hooks/useDocumentTitle'

export default function AdminReservations() {
  useDocumentTitle('مدیریت رزرو‌ها')
  const [activeTab, setActiveTab] = useState<'equipment' | 'rooms'>('equipment')
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  
  // مدال‌ها
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false)
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  
  // فرم‌ها
  const [equipmentForm, setEquipmentForm] = useState({ name: '', type: '' })
  const [roomForm, setRoomForm] = useState({ name: '', capacity: 10 })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eqData, roomData] = await Promise.all([
          adminService.getEquipment(), 
          adminService.getRooms()    
        ]);
        setEquipment(eqData);
        setRooms(roomData);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری داده‌ها');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      available: { label: 'در دسترس', color: 'bg-green-500/10 text-green-500' },
      reserved: { label: 'رزرو شده', color: 'bg-yellow-500/10 text-yellow-500' },
      maintenance: { label: 'در حال تعمیر', color: 'bg-destructive/10 text-destructive' }
    }
    const { label, color } = config[status] || config.available
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>
  }

  // --- مدال تجهیزات ---
  const openEquipmentModal = () => setIsEquipmentModalOpen(true)
  const closeEquipmentModal = () => setIsEquipmentModalOpen(false)

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEquipmentForm({ ...equipmentForm, [e.target.name]: e.target.value })
  }

  const handleEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newEquipment = await adminService.createEquipment(equipmentForm);
      setEquipment(prev => [...prev, newEquipment]);
      toast.success('تجهیزات جدید اضافه شد');
      closeEquipmentModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در افزودن تجهیزات');
    } finally {
      setSubmitting(false);
    }
  };

  // --- مدال سالن‌ها ---
  const openRoomModal = () => setIsRoomModalOpen(true)
  const closeRoomModal = () => setIsRoomModalOpen(false)

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'capacity' ? parseInt(e.target.value) || 0 : e.target.value
    setRoomForm({ ...roomForm, [e.target.name]: value })
  }

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newRoom = await adminService.createRoom(roomForm);
      setRooms(prev => [...prev, newRoom]);
      toast.success('سالن جدید اضافه شد');
      closeRoomModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در افزودن سالن');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">رزرو تجهیزات و سالن‌ها</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={openEquipmentModal}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80"
          >
            افزودن تجهیزات
          </button>
          <button
            onClick={openRoomModal}
            className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/80"
          >
            افزودن سالن
          </button>
        </div>
      </div>

      {/* تب‌ها */}
      <div className="flex mb-4 border-b border-border">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'equipment' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('equipment')}
        >
          تجهیزات
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'rooms' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('rooms')}
        >
          سالن‌ها
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
        ) : activeTab === 'equipment' ? (
          <div className="space-y-4">
            {equipment.map(eq => (
              <div key={eq._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border rounded-lg hover:bg-muted">
                <div className="mb-3 sm:mb-0">
                  <h3 className="font-bold text-foreground">{eq.name}</h3>
                  <p className="text-sm text-muted-foreground">نوع: {eq.type}</p>
                </div>
                <div className="flex gap-3">
                  {getStatusBadge(eq.status)}
                  <button className="text-primary hover:text-primary/80">رزرو</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map(room => (
              <div key={room._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border rounded-lg hover:bg-muted">
                <div className="mb-3 sm:mb-0">
                  <h3 className="font-bold text-foreground">{room.name}</h3>
                  <p className="text-sm text-muted-foreground">ظرفیت: {room.capacity} نفر</p>
                </div>
                <div className="flex gap-3">
                  {getStatusBadge(room.status)}
                  <button className="text-primary hover:text-primary/80">رزرو</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal افزودن تجهیزات */}
      {isEquipmentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-md border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">افزودن تجهیزات جدید</h2>
            </div>
            <form onSubmit={handleEquipmentSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">نام تجهیزات</label>
                <input
                  type="text"
                  name="name"
                  value={equipmentForm.name}
                  onChange={handleEquipmentChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">نوع</label>
                <input
                  type="text"
                  name="type"
                  value={equipmentForm.type}
                  onChange={handleEquipmentChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
                >
                  {submitting ? 'در حال افزودن...' : 'افزودن تجهیزات'}
                </button>
                <button
                  type="button"
                  onClick={closeEquipmentModal}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal افزودن سالن */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-md border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">افزودن سالن جدید</h2>
            </div>
            <form onSubmit={handleRoomSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">نام سالن</label>
                <input
                  type="text"
                  name="name"
                  value={roomForm.name}
                  onChange={handleRoomChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">ظرفیت (نفر)</label>
                <input
                  type="number"
                  name="capacity"
                  value={roomForm.capacity}
                  onChange={handleRoomChange}
                  min="1"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background text-foreground"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/80 disabled:opacity-50"
                >
                  {submitting ? 'در حال افزودن...' : 'افزودن سالن'}
                </button>
                <button
                  type="button"
                  onClick={closeRoomModal}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
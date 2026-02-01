import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { toast } from 'react-hot-toast'
import api from '../../../services/api'

interface Equipment {
  _id: string
  name: string
  type: string
  status: 'available' | 'reserved' | 'maintenance'
}

interface Room {
  _id: string
  name: string
  capacity: number
  status: 'available' | 'reserved' | 'maintenance'
}

export default function AdminReservations() {
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
        const [eqRes, roomRes] = await Promise.all([
          api.get('/equipment'),
          api.get('/rooms')
        ])
        setEquipment(eqRes.data.equipment)
        setRooms(roomRes.data.rooms)
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در بارگذاری داده‌ها')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      available: { label: 'در دسترس', color: 'bg-green-100 text-green-800' },
      reserved: { label: 'رزرو شده', color: 'bg-yellow-100 text-yellow-800' },
      maintenance: { label: 'در حال تعمیر', color: 'bg-red-100 text-red-800' }
    }
    const { label, color } = config[status] || config.available
    return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{label}</span>
  }

  // --- مدال تجهیزات ---
  const openEquipmentModal = () => setIsEquipmentModalOpen(true)
  const closeEquipmentModal = () => setIsEquipmentModalOpen(false)

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEquipmentForm({ ...equipmentForm, [e.target.name]: e.target.value })
  }

  const handleEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/equipment', equipmentForm)
      toast.success('تجهیزات جدید اضافه شد')
      // رفرش
      const res = await api.get('/equipment')
      setEquipment(res.data.equipment)
      closeEquipmentModal()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در افزودن تجهیزات')
    } finally {
      setSubmitting(false)
    }
  }

  // --- مدال سالن‌ها ---
  const openRoomModal = () => setIsRoomModalOpen(true)
  const closeRoomModal = () => setIsRoomModalOpen(false)

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'capacity' ? parseInt(e.target.value) || 0 : e.target.value
    setRoomForm({ ...roomForm, [e.target.name]: value })
  }

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/rooms', roomForm)
      toast.success('سالن جدید اضافه شد')
      // رفرش
      const res = await api.get('/rooms')
      setRooms(res.data.rooms)
      closeRoomModal()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در افزودن سالن')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">رزرو تجهیزات و سالن‌ها</h1>
        <div className="flex gap-2">
          <button
            onClick={openEquipmentModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            افزودن تجهیزات
          </button>
          <button
            onClick={openRoomModal}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            افزودن سالن
          </button>
        </div>
      </div>

      {/* تب‌ها */}
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'equipment' 
              ? 'text-red-600 border-b-2 border-red-600' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('equipment')}
        >
          تجهیزات
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'rooms' 
              ? 'text-red-600 border-b-2 border-red-600' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('rooms')}
        >
          سالن‌ها
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="py-8 text-center">در حال بارگذاری...</div>
        ) : activeTab === 'equipment' ? (
          <div className="space-y-4">
            {equipment.map(eq => (
              <div key={eq._id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-bold">{eq.name}</h3>
                  <p className="text-gray-600">نوع: {eq.type}</p>
                </div>
                <div className="flex gap-3">
                  {getStatusBadge(eq.status)}
                  <button className="text-blue-600">رزرو</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map(room => (
              <div key={room._id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-bold">{room.name}</h3>
                  <p className="text-gray-600">ظرفیت: {room.capacity} نفر</p>
                </div>
                <div className="flex gap-3">
                  {getStatusBadge(room.status)}
                  <button className="text-blue-600">رزرو</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal افزودن تجهیزات */}
      {isEquipmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">افزودن تجهیزات جدید</h2>
            </div>
            <form onSubmit={handleEquipmentSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام تجهیزات</label>
                <input
                  type="text"
                  name="name"
                  value={equipmentForm.name}
                  onChange={handleEquipmentChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع</label>
                <input
                  type="text"
                  name="type"
                  value={equipmentForm.type}
                  onChange={handleEquipmentChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'در حال افزودن...' : 'افزودن تجهیزات'}
                </button>
                <button
                  type="button"
                  onClick={closeEquipmentModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">افزودن سالن جدید</h2>
            </div>
            <form onSubmit={handleRoomSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام سالن</label>
                <input
                  type="text"
                  name="name"
                  value={roomForm.name}
                  onChange={handleRoomChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ظرفیت (نفر)</label>
                <input
                  type="number"
                  name="capacity"
                  value={roomForm.capacity}
                  onChange={handleRoomChange}
                  min="1"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {submitting ? 'در حال افزودن...' : 'افزودن سالن'}
                </button>
                <button
                  type="button"
                  onClick={closeRoomModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
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
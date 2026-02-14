const Class = require('../models/Class')
const User = require('../models/User')
const Notification = require('../models/Notification')

const createClass = async (req, res) => {
  try {
    const { title, description, dateTime, capacity, price, coach } = req.body

    // بررسی ظرفیت
    if (capacity <= 0) {
      return res.status(400).json({ success: false, message: 'ظرفیت باید بیشتر از صفر باشد' })
    }

    const newClass = await Class.create({
      title,
      description,
      dateTime,
      capacity,
      price,
      coach: coach || req.user._id
    })

    res.status(201).json({ success: true, class: newClass })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('coach', 'name')
      .sort({ dateTime: 1 })
    res.status(200).json({ success: true, classes })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getClassById = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id)
      .populate('coach', 'name')
      .populate('reservedBy.user', 'name')
    if (!cls) {
      return res.status(404).json({ success: false, message: 'کلاس یافت نشد' })
    }
    res.status(200).json({ success: true, class: cls })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const reserveClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id)
    if (!cls) {
      return res.status(404).json({ success: false, message: 'کلاس یافت نشد' })
    }

    if (cls.reservedBy.length >= cls.capacity) {
      return res.status(400).json({ success: false, message: 'ظرفیت کلاس تکمیل است' })
    }

    const alreadyReserved = cls.reservedBy.find(r => r.user.toString() === req.user._id.toString())
    if (alreadyReserved) {
      return res.status(400).json({ success: false, message: 'شما قبلاً این کلاس را رزرو کرده‌اید' })
    }

    cls.reservedBy.push({ user: req.user._id })
    await cls.save()

    await Notification.create({
      userId: req.user._id,
      type: 'class_registration',
      message: `شما در کلاس '${cls.title}' ثبت‌نام کردید`,
      relatedId: cls._id
    })

    res.status(200).json({ success: true, message: 'کلاس با موفقیت رزرو شد' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getReservedClasses = async (req, res) => {
  try {
    const classes = await Class.find({ 'reservedBy.user': req.user._id })
      .populate('coach', 'name')
    res.status(200).json({ success: true, classes })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    
    // پیدا کردن کلاس
    const classItem = await Class.findById(id);
    if (!classItem) {
      return res.status(404).json({ success: false, message: 'کلاس یافت نشد' });
    }
    
    // بررسی دسترسی (مربی مالک یا ادمین)
    if (req.user.role !== 'admin' && classItem.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' });
    }
    
    // بررسی اینکه کلاس رزرو شده باشه یا نه
    if (classItem.reservedBy.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'این کلاس قبلاً رزرو شده است و قابل حذف نیست' 
      });
    }
    
    await classItem.deleteOne();
    
    res.json({ success: true, message: 'کلاس با موفقیت حذف شد' });
  } catch (err) {
    console.error('Delete class error:', err);
    res.status(500).json({ success: false, message: 'خطا در حذف کلاس' });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, dateTime, capacity, price } = req.body;
    
    if (!title || !dateTime || !capacity || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'تمام فیلدها الزامی هستند' 
      });
    }
    
    const classItem = await Class.findById(id);
    if (!classItem) {
      return res.status(404).json({ success: false, message: 'کلاس یافت نشد' });
    }
    
    if (req.user.role !== 'admin' && classItem.coach.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'دسترسی غیرمجاز' });
    }
    
    if (capacity < classItem.reservedBy.length) {
      return res.status(400).json({ 
        success: false, 
        message: `ظرفیت نمی‌تواند کمتر از ${classItem.reservedBy.length} باشد` 
      });
    }
    
    classItem.title = title;
    classItem.dateTime = new Date(dateTime);
    classItem.capacity = capacity;
    classItem.price = price;
    
    await classItem.save();
    
    res.json({ success: true, class: classItem });
  } catch (err) {
    console.error('Update class error:', err);
    res.status(500).json({ success: false, message: 'خطا در به‌روزرسانی کلاس' });
  }
};

module.exports = { createClass, getClasses, getClassById, reserveClass, getReservedClasses, deleteClass, updateClass }
// routes/adminTicket.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  getAdminTickets,
  getAdminTicketById,
  assignAdminToTicket,
  addAdminMessageToTicket,
  resolveTicket
} = require('../controllers/adminTicket.controller');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getAdminTickets);                       // GET /api/admin/tickets
router.get('/:id', getAdminTicketById);                // GET /api/admin/tickets/:id
router.post('/:id/assign', assignAdminToTicket);       // POST /api/admin/tickets/:id/assign
router.post('/:id/messages', addAdminMessageToTicket); // POST /api/admin/tickets/:id/messages
router.put('/:id/resolve', resolveTicket);             // PUT /api/admin/tickets/:id/resolve

module.exports = router;
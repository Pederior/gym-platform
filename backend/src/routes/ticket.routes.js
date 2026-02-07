const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getUserTickets,
  createTicket,
  getTicketById,
  addMessageToTicket,
  closeTicket
} = require('../controllers/ticket.controller');

const router = express.Router();

router.use(protect);

router.get('/', getUserTickets);                           // GET /api/tickets
router.post('/', createTicket);                          // POST /api/tickets
router.get('/:id', getTicketById);                      // GET /api/tickets/:id
router.post('/:id/messages', addMessageToTicket);       // POST /api/tickets/:id/messages
router.put('/:id/close', closeTicket);                  // PUT /api/tickets/:id/close

module.exports = router;
import mongoose from "mongoose";

export const ParkingTicketSchema = new mongoose.Schema({
  plate: { type: String, required: true, index: true  },
  checkinAt: { type: Date, required: true },
  checkoutAt: { type: Date },
  paid: { type: Boolean },
});

const ParkingTicket = mongoose.model('ParkingTicket', ParkingTicketSchema);

export default ParkingTicket;
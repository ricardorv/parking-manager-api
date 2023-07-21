import ParkingTicketRepository from "../repository/ParkingTicket";
import { formatDistance } from 'date-fns'

class Parking {
  repository: ParkingTicketRepository;

  constructor() {
    this.repository = new ParkingTicketRepository();
  }

  public async checkin (plate: string) {
    const existingTickets = await this.repository.find({plate, checkoutAt: { $exists : false } })
    if (existingTickets.length > 0) {
      throw new Error("There's a pending ticket")
    }

    const ticket = await this.repository.save({
      plate,
      checkinAt: new Date(),
      paid: false
    })

    return {
      id: ticket._id,
      time: ticket.checkoutAt ? formatDistance(ticket.checkoutAt, ticket.checkinAt, { addSuffix: false }) : undefined,
      paid: ticket.paid,
      left: !!ticket.checkoutAt,
    };
  }

  public async checkout(id: string) {
    const ticket = await this.repository.findById(id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    if (!ticket?.paid) {
      throw new Error("Ticket not paided");
    }
    if (ticket?.checkoutAt) {
      throw new Error("Ticket already checked out")
    }

    ticket.checkoutAt = new Date();
    await this.repository.update(ticket);
    return {
      id: ticket._id,
      time: ticket.checkoutAt ? formatDistance(ticket.checkoutAt, ticket.checkinAt, { addSuffix: false }) : undefined,
      paid: ticket.paid,
      left: !!ticket.checkoutAt,
    };
  }

  public async listPlateHistory (plate: string) {
    const ticketList = await this.repository.find({ plate });
    return ticketList.map((ticket) => {
      return {
        id: ticket._id,
        time: ticket.checkoutAt ? formatDistance(ticket.checkoutAt, ticket.checkinAt, { addSuffix: false }) : undefined,
        paid: ticket.paid,
        left: !!ticket.checkoutAt,
      }
    })
  }

}

export default Parking;

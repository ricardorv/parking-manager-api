import ParkingTicketRepository from "../repository/ParkingTicket";

class Payment {
  repository: ParkingTicketRepository;

  constructor() {
    this.repository = new ParkingTicketRepository();
  }

  public async pay (parkingId: string): Promise<void> {
    const ticket = await this.repository.findById(parkingId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    if (ticket?.paid) {
      throw new Error("Ticket already paided");
    }

    ticket.paid = true;
    await this.repository.update(ticket);
  }

}

export default Payment;

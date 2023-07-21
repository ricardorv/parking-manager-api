import { FilterQuery } from "mongoose";
import ParkingTicket from "../model/ParkingTicket";
import { ObjectId } from "mongodb";

class ParkingTicketRepository {

  public async findById (id: string) {
    const ticket = await ParkingTicket.findById(id).exec();
    if (ticket) return ticket.toObject();
    return null;
  }

  public async find (query: FilterQuery<unknown>) {
    return await ParkingTicket.find(query);
  }

  public async save (ticket: unknown) {
    return await new ParkingTicket(ticket).save();
  }

  public async update (ticket: {_id: ObjectId | string} ) {
    return await ParkingTicket.findByIdAndUpdate(ticket._id, ticket).exec();
  } 

}

export default ParkingTicketRepository;

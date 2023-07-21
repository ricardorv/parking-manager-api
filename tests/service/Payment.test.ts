import { ObjectId } from "mongodb";
import ParkingTicketRepository from "../../src/repository/ParkingTicket";
import Payment from "../../src/service/Payment";


describe('payment service', () => {

  test('ticket not found should throw a exception', async () => {

    jest.spyOn(ParkingTicketRepository.prototype, 'findById').mockImplementation((id: string) => {
      return Promise.resolve(null);
    });

    expect.assertions(2);
    try {
      await new Payment().pay('64ba80c27eb5ce7d03f2cdb9');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Ticket not found');
    }

  })

  test('ticket already paied should throw a exception', async () => {

    jest.spyOn(ParkingTicketRepository.prototype, 'findById').mockImplementation((id: string) => {
      return Promise.resolve({
        _id: new ObjectId(id),
        plate: 'AAA-9999',
        checkinAt: new Date(),
        paid: true 
      });
    });

    expect.assertions(2);
    try {
      await new Payment().pay('64ba80c27eb5ce7d03f2cdb9');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Ticket already paided');
    }

  })

  test('ticket payment should save a paid field', async () => {

    const testId = '64ba80c27eb5ce7d03f2cdb9';
    const ticket = {
      plate: 'AAA-9999',
      checkinAt: new Date(),
    }

    jest.spyOn(ParkingTicketRepository.prototype, 'findById').mockImplementation((id: string) => {
      return Promise.resolve({...ticket, _id: new ObjectId(id)});
    });
    const updateSpy = jest.spyOn(ParkingTicketRepository.prototype, 'update').mockImplementation(jest.fn());

    await new Payment().pay(testId);
    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith({...ticket, _id: new ObjectId(testId), paid: true});
  })

});
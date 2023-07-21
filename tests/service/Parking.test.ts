import { ObjectId } from "mongodb";
import ParkingTicketRepository from "../../src/repository/ParkingTicket";
import Payment from "../../src/service/Payment";
import { FilterQuery } from "mongoose";
import Parking from "../../src/service/Parking";


describe('parking service', () => {

  test('checking with a plate how have a pending ticket should throw an exception', async () => {

    jest.spyOn(ParkingTicketRepository.prototype, 'find').mockImplementation((query) => {
      return Promise.resolve([{
        _id: new ObjectId('64ba80c27eb5ce7d03f2cdb9'),
        plate: 'AAA-9999',
        checkinAt: new Date(),
      }]);
    });

    expect.assertions(2);
    try {
      await new Parking().checkin('AAA-9999');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'There\'s a pending ticket');
    }

  })

  test('checking with a new plate should create a new ticket', async () => {

    jest.spyOn(ParkingTicketRepository.prototype, 'find').mockImplementation((query) => {
      return Promise.resolve([]);
    });
    jest.useFakeTimers().setSystemTime(new Date(2020, 1, 1, 1));
    const createSpy = jest.spyOn(ParkingTicketRepository.prototype, 'save').mockImplementation(() => Promise.resolve({
      _id: new ObjectId('64ba80c27eb5ce7d03f2cdb9'),
      plate: 'AAA-9999',
      checkinAt: new Date(),
      paid: false
    })
    );

    
    await new Parking().checkin('AAA-9999');

    expect(createSpy).toBeCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({
      plate: 'AAA-9999',
      checkinAt: new Date(),
      paid: false
    });
  })

  test('checkout with a inexistent ticket should throw an exception', async () => {

    jest.spyOn(ParkingTicketRepository.prototype, 'findById').mockImplementation((query) => {
      return Promise.resolve(null);
    });

    expect.assertions(2);
    try {
      await new Parking().checkout('64ba80c27eb5ce7d03f2cdb9');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Ticket not found');
    }

  })

  test('checkout with a not paied ticket should throw an exception', async () => {

    jest.spyOn(ParkingTicketRepository.prototype, 'findById').mockImplementation((query) => {
      return Promise.resolve({
        _id: new ObjectId('64ba80c27eb5ce7d03f2cdb9'),
        plate: 'AAA-9999',
        checkinAt: new Date(),
      });
    });

    expect.assertions(2);
    try {
      await new Parking().checkout('64ba80c27eb5ce7d03f2cdb9');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Ticket not paided');
    }

  })

  test('checkout with a already checkout ticket should throw an exception', async () => {

    jest.spyOn(ParkingTicketRepository.prototype, 'findById').mockImplementation((query) => {
      return Promise.resolve({
        _id: new ObjectId('64ba80c27eb5ce7d03f2cdb9'),
        plate: 'AAA-9999',
        checkinAt: new Date(),
        paid: true,
        checkoutAt: new Date(),
      });
    });

    expect.assertions(2);
    try {
      await new Parking().checkout('64ba80c27eb5ce7d03f2cdb9');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Ticket already checked out');
    }

  })

  test('checkout with a paided ticket should update the ticket with checkout date', async () => {

    const ticket = {
      _id: new ObjectId('64ba80c27eb5ce7d03f2cdb9'),
      plate: 'AAA-9999',
      checkinAt: new Date(),
      paid: true,
    }

    jest.useFakeTimers().setSystemTime(new Date(2020, 1, 1, 1));
    jest.spyOn(ParkingTicketRepository.prototype, 'findById').mockImplementation((query) => {
      return Promise.resolve(ticket);
    });
    const updateSpy = jest.spyOn(ParkingTicketRepository.prototype, 'update').mockImplementation(jest.fn());

    
    await new Parking().checkout('AAA-9999');

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith({ ...ticket, checkoutAt: new Date()});
  })
  
});
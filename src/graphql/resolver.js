import Event from "../models/event";
import User from "../models/user";
import bcrypt from "bcryptjs";
import mutations from "../graphql/resolvers/mutation";
import queries from "../graphql/resolvers/query";
const users = (userIds) => {
  console.log(userIds);
  return User.find({ _id: { $in: userIds } })
    .then((users) => {
      return users.map((user) => {
        console.log(user);
        //extracting booked events
        const data = user.bookedEvents;
        const bookeduserid = data.map((data) => {
          return data.event;
        });
        return {
          ...user._doc,
          _id: user.id,
          createdEvents: events.bind(this, user._doc.createdEvents),
          bookedEvents: events.bind(this, bookeduserid),
          date_of_birth: user._doc.date_of_birth.toISOString().slice(0, 10),
        };
      });
    })

    .catch((e) => console.log(e));
};
const userbookedEvents = async (userId) => {
  console.log(userId);
  try {
    const user = await User.findById(userId);

    const bookedEvents = user.bookedEvents;
    return bookedEvents.map(async (object) => {
      const event = await Event.findById(object.event);
      const bookingTime = object.bookingTime.toISOString().slice(0, 10);
      const paymentId = object.paymentId;

      const data = {
        _id: object._id,
        event: event,
        bookingTime: bookingTime,
        paymentId: paymentId,
      };
      return data;
    });
  } catch (e) {
    console.log(e);
  }
};

const events = (eventIDs) => {
  return Event.find({ _id: { $in: eventIDs } })
    .then((events) => {
      return events.map((event) => {
        //extracting clients id
        const data = event.clients;
        const clientuserid = data.map((data) => {
          return data.client;
        });
        return {
          ...event._doc,
          _id: event.id,
          creator: users.bind(this, event.creator),
          clients: users.bind(this, clientuserid),
        };
      });
    })
    .catch((e) => console.log(e));
};

const resolvers = {
  ...mutations,
  ...queries,
};
export { users, events, userbookedEvents };
export default resolvers;

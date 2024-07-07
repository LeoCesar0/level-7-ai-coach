import mongoose, { ClientSession } from "mongoose";

export const handleDBSession = async <T>(
  fn: (s: ClientSession) => Promise<T>
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await fn(session);
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

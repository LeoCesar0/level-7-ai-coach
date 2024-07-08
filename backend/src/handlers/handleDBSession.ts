import mongoose, { ClientSession } from "mongoose";

export const handleDBSession = async <T>(
  fn: (s: ClientSession) => Promise<T>
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // console.log("❗❗❗ Here 1");
    const result = await fn(session);
    // console.log("❗❗❗ Here 2");
    await session.commitTransaction();
    await session.endSession();
    // console.log("❗❗❗ Here 3");
    return result;
  } catch (err) {
    // console.log("❗ handleDBSession ERR -->", err);
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

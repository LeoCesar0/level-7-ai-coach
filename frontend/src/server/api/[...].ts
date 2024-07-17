import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";

export default async (req: IncomingMessage, res: ServerResponse) => {
  const { url, method, headers } = req;

  console.log("❗❗❗ Here bff api handler");

  try {
    const data = await axios({
      url: "http://backend:8000/api/playground",
    });

    console.log("❗ data -->", data);

    return data;
  } catch (err) {
    console.log("❗ bff err -->", err);

    return null;
  }
};

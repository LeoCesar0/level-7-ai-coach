// import mongoose from "mongoose";
// import { zCreateMessage } from "./createMessage";
// import { zMongoDocument } from "../../../@schemas/mongoose";
// import { z } from "zod";
// import zodSchema from "@zodyac/zod-mongoose";
// import { zChatRole } from "../../../@schemas/roles";
// import { CHAT_ROLES_LIST } from "@common/static/roles";

// export const zMessage = zCreateMessage.merge(zMongoDocument).merge(
//   z.object({
//     messageEmbedding: z.array(z.array(z.number())).optional(),
//   })
// );

// export type IMessage = z.infer<typeof zMessage>;

// const messageSchema = new mongoose.Schema<IMessage>(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
//     message: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       required: true,
//       enum: CHAT_ROLES_LIST,
//     },
//     messageEmbedding: {
//       type: Array(Array(Number)),
//       // type: zodSchema(z.array(z.number())),
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const MessageModel = mongoose.model<IMessage>("Message", messageSchema);

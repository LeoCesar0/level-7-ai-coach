import type { IChatHistoryMessage } from "@common/schemas/chatHistory";
import type { IPaginationBody } from "@common/schemas/paginateRoute";
import type { ISendChatMessageResponse } from "@common/schemas/sendChatMessageResponse";
import type { IChat, ICreateChat, ICreateMessage } from "~/@types/chat";
import { makeStoreKey } from "~/helpers/makeStoreKey";

export const useChatStore = defineStore(makeStoreKey("chat"), () => {
  const { fetchApi } = useFetchApi();
  const userStore = useUserStore();
  const { currentUser } = storeToRefs(userStore);
  const { toast } = useToast();

  const currentOpenChat = ref<IChat | null>(null);

  const createNewChat = async () => {
    const body: ICreateChat = {
      date: new Date().toISOString(),
      user: currentUser.value?._id ?? "",
    };
    const { response } = await fetchApi<IChat>({
      method: "POST",
      url: "/chats",
      body: body,
    });
    console.log("❗ createNewChat response -->", response);
    return response;
  };
  const sendChatMessage = async ({
    message,
    role = "user",
    user,
  }: ICreateMessage) => {
    let chat = currentOpenChat.value?._id;

    if (!chat) {
      const chatRes = await createNewChat();
      if (!chatRes.data) {
        toast.error("Failed to create chat");
        return;
      }
      chat = chatRes.data._id;
    }

    const body: ICreateMessage = {
      chat,
      message,
      user,
      role,
    };
    const { response } = await fetchApi<ISendChatMessageResponse>({
      method: "POST",
      url: "/chats/send",
      body: body,
    });
    console.log("❗ sendChatMessage response -->", response);
    return response;
  };
  const getChatHistory = async ({ chatId }: { chatId: string }) => {
    const { response } = await fetchApi<IChatHistoryMessage[]>({
      method: "GET",
      url: "/chats/history/" + chatId,
    });
    console.log("❗ getChatHistory response -->", response);
    return response;
  };
  const paginateChats = async (body: IPaginationBody) => {
    const { response } = await fetchApi<ISendChatMessageResponse>({
      method: "POST",
      url: "/chats/paginate",
      body: body,
    });
    console.log("❗ paginateChats response -->", response);
    return response;
  };

  return {
    currentOpenChat,
    createNewChat,
    sendChatMessage,
    getChatHistory,
    paginateChats,
  };
});

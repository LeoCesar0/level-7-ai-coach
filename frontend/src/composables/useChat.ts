import type { IChatHistoryMessage } from "@common/schemas/chatHistory";
import type { IPaginationBody } from "@common/schemas/paginateRoute";
import type { IPaginationResult } from "@common/schemas/pagination";
import type { ISendChatMessageResponse } from "@common/schemas/sendChatMessageResponse";
import type { IChat, ICreateChat, ICreateMessage } from "~/@types/chat";
import { ROUTE } from "~/static/routes";

export const useChat = () => {
  const { fetchApi } = useFetchApi();
  const userStore = useUserStore();
  const { currentUser } = storeToRefs(userStore);
  const { toast } = useToast();

  const currentChat = ref<IChat | null>(null);
  const isLoading = ref(false);
  const aiTyping = ref(false);

  const messages = ref<IChatHistoryMessage[]>([]);

  // --------------------------
  // CRUD API
  // --------------------------

  const createNewChat = async () => {
    const body: ICreateChat = {
      date: new Date().toISOString(),
      user: currentUser.value?._id ?? "",
    };
    const { response } = await fetchApi<IChat>(
      {
        method: "POST",
        url: "/chats",
        body: body,
      },
      {
        loadingRefs: [isLoading],
      }
    );
    console.log("❗ createNewChat response -->", response);

    return response;
  };

  const sendChatMessage = async ({ message }: { message: string }) => {
    const chat = currentChat.value?._id;
    if (!chat) {
      toast("Failed to send message, chat was not created");
      return;
    }
    const body: ICreateMessage = {
      chat,
      message,
      user: currentUser.value?._id!,
      role: "user",
    };
    const { response } = await fetchApi<ISendChatMessageResponse>(
      {
        method: "POST",
        url: "/chats/send",
        body: body,
      },
      {
        loadingRefs: [aiTyping],
      }
    );

    console.log("❗ sendChatMessage response -->", response);
    return response;
  };

  const paginateChats = async <T = any>(body: IPaginationBody<T>) => {
    const response = await fetchApi<IPaginationResult<IChat>>(
      {
        method: "POST",
        url: "/chats/paginate",
        body: body,
      },
      {
        loadingRefs: [isLoading],
      }
    );
    console.log("❗ paginateChats response -->", response);
    return response;
  };

  const getChatHistory = async ({ chatId }: { chatId: string }) => {
    const { response } = await fetchApi<IChatHistoryMessage[]>(
      {
        method: "GET",
        url: "/chats/history/" + chatId,
      },
      {
        loadingRefs: [isLoading],
      }
    );

    console.log("❗ getChatHistory response -->", response);
    return response;
  };
  const getChat = async ({ chatId }: { chatId: string }) => {
    const { response } = await fetchApi<IChat>(
      {
        method: "GET",
        url: "/chats/" + chatId,
      },
      {
        loadingRefs: [isLoading],
      }
    );
    console.log("❗ getChat response -->", response);

    return response;
  };

  const getChats = async () => {
    const { response } = await paginateChats<IChat>({
      limit: 100,
    });
    return response;
  };

  const getOpenChats = async () => {
    const { response } = await paginateChats<IChat>({
      filters: {
        closed: false,
      },
    });
    return response;
  };

  return {
    currentChat,
    isLoading,
    aiTyping,
    messages,
    createNewChat,
    sendChatMessage,
    getChatHistory,
    paginateChats,
    getChats,
    getChat,
    getOpenChats,
  };
};

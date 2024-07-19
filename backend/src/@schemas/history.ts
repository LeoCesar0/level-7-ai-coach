import { Types } from "mongoose";

export type IHistory = {
  sessionId: string;
  messages: IHistoryMessage[];
} & {
  _id: string | Types.ObjectId;
};

export type IHistoryMessage = {
  type: string;
  data: IHistoryMessageData;
};

export type IHistoryMessageData = {
  content: string;
  additional_kwargs?: AdditionalKwargs;
  response_metadata?: ResponseMetadata;
  tool_calls?: any[];
  invalid_tool_calls?: any[];
  id?: string;
};

type AdditionalKwargs = {
  function_call?: any;
  tool_calls?: any;
};

type ResponseMetadata = {
  tokenUsage?: TokenUsage;
  finish_reason?: string;
};

export type TokenUsage = {
  completionTokens: CompletionTokens;
  promptTokens: PromptTokens;
  totalTokens: TotalTokens;
};

type CompletionTokens = {
  $numberInt: string;
};

type PromptTokens = {
  $numberInt: string;
};

type TotalTokens = {
  $numberInt: string;
};



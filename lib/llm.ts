import { ChatOpenAI } from "langchain/chat_models/openai";

export const streamingModel = new ChatOpenAI({
  modelName: "gpt-4o",
  streaming: true,
  temperature: 0.7,
});

export const nonStreamingModel = new ChatOpenAI({
  modelName: "gpt-4o",
  verbose: true,
  temperature: 0.4,
});

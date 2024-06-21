import { ConversationalRetrievalQAChain, VectorDBQAChain } from "langchain/chains";
import {
  StreamingTextResponse,
  experimental_StreamData,
  LangChainStream,
} from "ai-stream-experimental";
import { streamingModel, nonStreamingModel } from "./llm";
import { STANDALONE_QUESTION_TEMPLATE, QA_TEMPLATE } from "./prompt-templates";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { pinecone } from '@/lib/pinecone-client';

type callChainArgs = {
  question: string;
  chatHistory: string;
};

export async function callChain({ question, chatHistory }: callChainArgs , chatbotName:string) {
  try {
    // Open AI recommendation
    const sanitizedQuestion = question.trim().replaceAll("\n", " ");
    const { stream, handlers } = LangChainStream({
      experimental_streamData: true,
    });
    const data = new experimental_StreamData();

    const privateKey = process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY;
    if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    const supabase = createClient(url, privateKey);

    // Fetch document names from chatbots table
    const { data: chatbotsData, error } = await supabase
      .from('chatbots')
      .select('documents').eq('chatbot_name', chatbotName);

    if (error) {
      throw new Error(`Error fetching document names: ${error.message}`);
    }

    console.log('chatbot data are', chatbotsData[0].documents);
    console.log('data type is', typeof (chatbotsData[0].documents));

    // Extract document names from the object
    const pdfNamesArray = Object.values(chatbotsData[0].documents);
    console.log('pdfNamesArray:', pdfNamesArray);

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME ? process.env.PINECONE_INDEX_NAME :''); 


    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        pineconeIndex: index,
        textKey: "text",
        filter: { pdfName: { $in: pdfNamesArray } },
      }
    );

    const retriever = vectorStore.asRetriever();

    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel,
      retriever as any, // Change this to make changes in the number of returning source docs
      {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
        returnSourceDocuments: true, // default 4
        questionGeneratorChainOptions: {
          llm: nonStreamingModel,
        },
      }
    );

    // Question using chat-history
    // Reference https://js.langchain.com/docs/modules/chains/popular/chat_vector_db#externally-managed-memory
    chain
      .call(
        {
          question: sanitizedQuestion,
          chat_history: chatHistory,
        },
        [handlers]
      )
      .then(async (res) => {
        const sourceDocuments = res?.sourceDocuments;
        const firstTwoDocuments = sourceDocuments.slice(0, 10);
        console.log('first two docs', firstTwoDocuments)
        const pageContent = firstTwoDocuments.map(
          ({ pageContent }: { pageContent: any }) => pageContent
        );
        console.log("already appended ", data);
        data.append({
          sources: sourceDocuments,
        });
        data.close();
      });

    // Return the readable stream
    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    console.error(e);
    throw new Error("Call chain method failed to execute!!");
  }
}

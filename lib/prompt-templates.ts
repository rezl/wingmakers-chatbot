// Creates a standalone question from the chat-history and the current question
export const STANDALONE_QUESTION_TEMPLATE = `Given the following conversation and a follow up input question, make it better to understand for a AI model. User is hoping for direct , short and context related answer to the question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

// Actual question you ask the chat and send the response to client
export const QA_TEMPLATE = `You are an AI chatbot assistant. You have to greet back to users' greetings. Please provide a direct , short and context related answer to the questions. Don't makeup anything out of the context\n
       provide the answer with better line spacings.\n
       Context block:
       {context}\n
       Question:
       {question}\n
    Helpful answer:
`;

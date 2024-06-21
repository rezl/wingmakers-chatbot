import { Chat } from "@/components/AI/chat";

interface ChatbotPageProps {
    params: {chatbot: string}
  }
  

  const Preview: React.FC<ChatbotPageProps> = ({ params }) =>  {
    return(
        <div className="w-screen max-w-sm h-screen overflow-hidden p-4">
            <Chat chatbotname={params.chatbot} />
        </div>
    )
}

export default Preview;
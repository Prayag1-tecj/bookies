import { useParams } from 'react-router-dom'
import ChatLayout from '@/layouts/ChatLayout'

function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>()

  return (
    <div className="h-[calc(100vh-5.5rem)] md:h-[calc(100vh-6.5rem)]">
      <ChatLayout initialSessionId={sessionId} />
    </div>
  )
}

export default ChatPage
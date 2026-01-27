import { AdminMessage as messageModel } from '../../../models/adminMessage'
import { useAdminMessages } from '../../hooks/useAdminMessages'
import { CrossSymbol } from './SymbolSvgs'

interface AdminMessageProps {
  message: messageModel
}

export default function AdminMessage({ message }: AdminMessageProps) {
  const { delete: deleteMessage } = useAdminMessages()
  return (
    <div className="relative my-1 rounded-sm border-[1.5px] border-[#d0cbba] bg-[#faf8f1]">
      <div className="border-b border-[#cbcbcb74] bg-[#dad7c250] p-1">
        <button
          className="absolute top-1 right-1 flex items-center justify-center rounded-sm bg-[#eca4a4] p-0.5 active:bg-[#ea8686]"
          onClick={() => deleteMessage.mutate(message.id)}
        >
          <CrossSymbol className="h-5 cursor-pointer" />
        </button>
        <p className="">Deleted content:</p>
        <p className="line-clamp-4">{message.contentDeleted}</p>
      </div>
      <div className="p-1">
        <p>Reason for deletion: </p>
        <p>{message.reasonDeleted}</p>
      </div>
    </div>
  )
}

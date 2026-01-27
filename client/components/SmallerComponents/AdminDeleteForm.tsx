import { useState } from 'react'
import { useAdminMessages } from '../../hooks/useAdminMessages'
import { NewAdminMessage } from '../../../models/adminMessage'

interface Props {
  userId: string
  contentDeleted: string
  onComplete: () => void
}

export default function AdminDeleteForm({
  userId,
  contentDeleted,
  onComplete,
}: Props) {
  const [reason, setReason] = useState('')
  const { add: addAdminMessage } = useAdminMessages()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newMessage: Omit<NewAdminMessage, 'adminId'> = {
      userId,
      contentDeleted,
      reasonDeleted: reason,
    }

    addAdminMessage.mutate(newMessage, {
      onSuccess: () => {
        onComplete()
      },
    })
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-start justify-start gap-2 rounded-md border-[1.5px] bg-[#dad7c267] p-5"
      >
        <label htmlFor="contentdeleted" className="mb-0.5 text-sm">
          Content to be deleted
        </label>
        <input
          type="text"
          name="contentdeleted"
          id="contentdeleted"
          className="mb-2 w-full rounded-sm bg-gray-200 px-1 py-0.5 sm:max-w-sm"
          value={contentDeleted}
          readOnly
        />
        <label htmlFor="reason" className="mb-0.5 text-sm">
          Reason for deletion
        </label>
        <textarea
          name="reason"
          id="reason"
          className="mb-2 w-full rounded-sm px-1 py-0.5"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          required
        />
        <button
          type="submit"
          className="rounded-sm border-[1.5px] bg-[#f8f8ef] px-1 py-0 text-base hover:bg-[#dad7c2c0] disabled:bg-[#bebebd99] disabled:text-[#aca7a7a9]"
          disabled={addAdminMessage.isPending || !reason}
        >
          {addAdminMessage.isPending ? 'Sending...' : 'Send Message & Delete'}
        </button>
      </form>
    </div>
  )
}

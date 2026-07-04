import { useState, type FormEvent } from 'react'
import { Drawer } from 'vaul'
import { MessageCircle, Send, X } from 'lucide-react'
import { PROMPT_MAX_LENGTH } from '../api'
import { useChat } from '../hooks/useChat'
import ChatMessages from './ChatMessages'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, send, isPending } = useChat()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!input.trim() || isPending) return
    send(input)
    setInput('')
  }

  return (
    <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button
          type="button"
          aria-label="Abrir asistente del vivero"
          className="fixed bottom-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-[var(--shadow-md)] transition-[background-color,transform] duration-150 ease-out hover:bg-accent active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <MessageCircle size={24} aria-hidden="true" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-30 bg-black/40" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-line bg-surface"
        >
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <Drawer.Title className="font-semibold text-ink">Asistente del vivero</Drawer.Title>
            <Drawer.Close asChild>
              <button
                type="button"
                aria-label="Cerrar asistente"
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-muted transition-colors duration-150 ease-out hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </Drawer.Close>
          </header>

          <div className="flex flex-1 flex-col overflow-hidden px-4">
            <ChatMessages
              messages={messages}
              isTyping={isPending}
              onNavigate={() => setOpen(false)}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-line p-4"
          >
            <label htmlFor="chat-input" className="sr-only">
              Escribe tu mensaje
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              maxLength={PROMPT_MAX_LENGTH}
              placeholder="¿Qué estás buscando?"
              autoComplete="off"
              className="h-10 w-full rounded-[var(--radius-md)] border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted transition-[border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending}
              aria-label="Enviar mensaje"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary text-on-primary transition-[background-color,transform,opacity] duration-150 ease-out hover:bg-accent active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Send size={20} aria-hidden="true" />
            </button>
          </form>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
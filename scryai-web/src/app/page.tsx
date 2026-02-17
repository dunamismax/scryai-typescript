type ChatRole = "assistant" | "system" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
};

const messages: ChatMessage[] = [
  {
    id: "m1",
    role: "system",
    text: "Session initialized. This starter is intentionally local-first and model-agnostic.",
    timestamp: "08:32",
  },
  {
    id: "m2",
    role: "assistant",
    text: "Ready when you are. Ask for architecture help, bug triage, or implementation support.",
    timestamp: "08:33",
  },
  {
    id: "m3",
    role: "user",
    text: "Create a clean chat web app baseline with clear next steps.",
    timestamp: "08:34",
  },
  {
    id: "m4",
    role: "assistant",
    text: "Done. This is the starter shell. Next step is wiring API routes and streaming responses.",
    timestamp: "08:34",
  },
];

const quickPrompts = [
  "Plan auth + sessions",
  "Design message schema",
  "Wire streaming route",
  "Add conversation history",
];

export default function Home() {
  return (
    <div className="app-shell">
      <main className="workspace">
        <section className="chat-surface" aria-label="Chat workspace">
          <header className="chat-header">
            <div>
              <p className="eyebrow">scryai web</p>
              <h1>Operator Console</h1>
            </div>
            <div className="status-pill" aria-live="polite">
              Local starter
            </div>
          </header>

          <ol className="message-list" aria-label="Conversation messages">
            {messages.map((message) => (
              <li
                className={`message message-${message.role}`}
                key={message.id}
              >
                <div className="meta-row">
                  <span>{message.role}</span>
                  <time>{message.timestamp}</time>
                </div>
                <p>{message.text}</p>
              </li>
            ))}
          </ol>

          <form className="composer" action="#">
            <label className="sr-only" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Message scry..."
              rows={3}
            />
            <div className="composer-footer">
              <fieldset className="quick-prompts">
                <legend className="sr-only">Quick prompts</legend>
                {quickPrompts.map((prompt) => (
                  <button key={prompt} type="button">
                    {prompt}
                  </button>
                ))}
              </fieldset>
              <button className="send-button" type="submit">
                Send
              </button>
            </div>
          </form>
        </section>

        <aside className="context-rail" aria-label="Session context">
          <section className="rail-card">
            <h2>Now</h2>
            <p>
              Interface shell is ready. Connect a route handler for model IO
              next.
            </p>
          </section>
          <section className="rail-card">
            <h2>Planned</h2>
            <ul>
              <li>Conversation persistence</li>
              <li>Streaming assistant output</li>
              <li>Model + temperature controls</li>
            </ul>
          </section>
          <section className="rail-card">
            <h2>Stack</h2>
            <p>Next.js App Router + TypeScript + Tailwind CSS + Biome.</p>
          </section>
        </aside>
      </main>
    </div>
  );
}

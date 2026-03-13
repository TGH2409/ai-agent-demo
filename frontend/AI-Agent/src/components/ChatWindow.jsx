import { useState, useRef, useEffect } from "react"
import "./ChatWindow.css"

function renderResponse(data) {
  if (!data) return <div>⚠️ No response received</div>

  if (data.error) {
    return <div className="error">❌ {data.error}</div>
  }

   if (data.id) {
    return (
      <div>
        <h3>✅ Account Created Successfully</h3>
        {data.Name && <p><b>Name:</b> {data.Name}</p>}
        <p><b>Salesforce ID:</b> {data.id}</p>
      </div>
    )
  }

  if (data.accounts) {
    const accounts = data.accounts
    return (
      <div>
        <h3>Accounts</h3>
        <table className="orderTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th>City</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc, index) => (
              <tr key={index}>
                <td>{acc.Name}</td>
                <td>{acc.Industry || "N/A"}</td>
                <td>{acc.BillingCity || "N/A"}</td>
                <td>{acc.Phone || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="summary">Total Accounts: {accounts.length}</div>
      </div>
    )
  }

  if (data.account && !data.orders) {
    return (
      <div>
        <h3>Account Details</h3>
        <p><b>Name:</b> {data.account.Name}</p>
        <p><b>Industry:</b> {data.account.Industry || "N/A"}</p>
        <p><b>City:</b> {data.account.BillingCity || "N/A"}</p>
        <p><b>Phone:</b> {data.account.Phone || "N/A"}</p>
      </div>
    )
  }

  if (data.account && data.orders) {
    const orders = data.orders.orders || data.orders
    const totalRevenue = orders.reduce((sum, o) => sum + (o.TotalAmount || 0), 0)
    return (
      <div>
        <h3>{data.account.Name}</h3>
        <table className="orderTable">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Status</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i}>
                <td>{order.OrderNumber}</td>
                <td>{order.Status}</td>
                <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                <td>${order.TotalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="summary">
          Total Orders: {orders.length} | Revenue: ${totalRevenue}
        </div>
      </div>
    )
  }

  if (typeof data === "string") return <span>{data}</span>

  return <div>⚠️ Request processed</div>
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: { text: "Hello! I'm your <b>AI assistant</b>. How can I help you today?" },
      time: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatBoxRef = useRef(null)

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input, time: new Date() }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    const sentInput = input
    setInput("")

    try {
      const res = await fetch("https://tgh-ai.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sentInput })
      })
      const data = await res.json()
      setLoading(false)
      setMessages(prev => [...prev, { role: "assistant", content: data, time: new Date() }])
    } catch (err) {
      setLoading(false)
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: { error: "Unable to connect to AI service" }, time: new Date() }
      ])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chatWrapper">
      {/* Header */}
      <div className="chatHeader">
        <div className="headerLeft">
          <div className="headerAvatar">
            <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <div className="headerInfo">
            <span className="headerName">AI Assistant</span>
            <span className="headerStatus">
              <span className="statusDot"></span>
              Online · Ready to help
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chatBox" ref={chatBoxRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chatRow ${m.role}`}>
            {m.role === "assistant" && (
              <div className="botAvatar">
                <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
              </div>
            )}
            <div className="bubbleWrap">
              <div className="bubble">
                {m.role === "assistant"
                  ? (m.content?.text
                      ? <span dangerouslySetInnerHTML={{ __html: m.content.text }} />
                      : renderResponse(m.content))
                  : m.content}
              </div>
              <div className={`msgTime ${m.role}`}>{formatTime(m.time)}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="chatRow assistant">
            <div className="botAvatar">
              <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <div className="bubbleWrap">
              <div className="bubble typingBubble">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="infoBar">
        <span className="infoIcon">ℹ</span>
        Ask about accounts or orders to get started
      </div>

      {/* Input */}
      <div className="inputArea">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading} className="sendBtn" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

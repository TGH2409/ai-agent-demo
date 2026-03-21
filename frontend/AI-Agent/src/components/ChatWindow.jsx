import { useState, useRef, useEffect } from "react"
import "./ChatWindow.css"

function renderResponse(data) {

  if (!data) return <div>⚠️ No response received</div>

  if (data.error) {
    return <div className="error">❌ {data.error}</div>
  }

  /* ✅ ACCOUNT CREATED */
  if (data.id) {
    return (
      <div>
        <h3>✅ Account Created</h3>
        <p><b>Salesforce ID:</b> {data.id}</p>
      </div>
    )
  }

  /* SHOW ALL ACCOUNTS */
  if (data.accounts) {

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
            {data.accounts.map((acc, index) => (
              <tr key={index}>
                <td>{acc.Name}</td>
                <td>{acc.Industry || "N/A"}</td>
                <td>{acc.BillingCity || "N/A"}</td>
                <td>{acc.Phone || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="summary">Total Accounts: {data.accounts.length}</div>
      </div>
    )
  }

  /* ACCOUNT DETAILS */
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

  /* ACCOUNT + ORDERS */
  if (data.account && data.orders) {

    const orders = data.orders.orders || data.orders

    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.TotalAmount || 0),
      0
    )

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
  const [listening, setListening] = useState(false)

  const chatBoxRef = useRef(null)

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages, loading])


  /* NORMAL SEND */

  const sendMessage = async (voiceText) => {

    const messageToSend = voiceText || input

    if (!messageToSend.trim()) return

    const userMessage = {
      role: "user",
      content: messageToSend,
      time: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setInput("")

    try {

      const res = await fetch("https://tgh-ai.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: messageToSend })
      })

      const data = await res.json()

      console.log("Response:", data)

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data, time: new Date() }
      ])

    } catch (err) {

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: { error: "Unable to connect to AI service" },
          time: new Date()
        }
      ])

    }

    setLoading(false)
  }


  /* 🎤 VOICE */

  const startListening = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported")
      return
    }

    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.continuous = false

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = (event) => {

      const transcript = event.results[0][0].transcript

      console.log("🎤 Heard:", transcript)

      setInput(transcript)

      setTimeout(() => {
        sendMessage(transcript)
      }, 300)
    }

    recognition.start()
  }


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }


  return (

    <div className="chatWrapper">

      {/* HEADER */}
      <div className="chatHeader">
        <div className="headerLeft">
          <div className="headerAvatar">🤖</div>
          <div className="headerInfo">
            <span className="headerName">AI Assistant</span>
            <span className="headerStatus">
              <span className="statusDot"></span>
              Online · Ready to help
            </span>
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div className="chatBox" ref={chatBoxRef}>

        {messages.map((m, i) => (

          <div key={i} className={`chatRow ${m.role}`}>

            {m.role === "assistant" && (
              <div className="botAvatar">🤖</div>
            )}

            <div className="bubbleWrap">

              <div className="bubble">
                {m.role === "assistant"
                  ? (m.content?.text
                      ? <span dangerouslySetInnerHTML={{ __html: m.content.text }} />
                      : renderResponse(m.content))
                  : m.content}
              </div>

              <div className={`msgTime ${m.role}`}>
                {formatTime(m.time)}
              </div>

            </div>

          </div>

        ))}

        {loading && (
          <div className="chatRow assistant">
            <div className="botAvatar">🤖</div>
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

      {/* INFO */}
      <div className="infoBar">
        Ask about accounts or orders to get started
      </div>

      {/* INPUT */}
      <div className="inputArea">

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={loading}
        />

        {/* 🎤 MIC BUTTON */}
        <button onClick={startListening} className="micBtn">
          {listening ? "🎙️" : "🎤"}
        </button>

        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="sendBtn"
        >
          ➤
        </button>

      </div>

    </div>
  )
}
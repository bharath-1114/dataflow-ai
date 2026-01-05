import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/DataContext";
import { Upload, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

export default function Chatbot() {
  const { data, columns, fileName } = useData();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (data.length > 0 && messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "bot",
          content: `Hello! I've loaded your dataset "${fileName}" with ${data.length} rows and ${columns.length} columns. What would you like to know about your data?`,
        },
      ]);
    }
  }, [data, fileName, columns, messages.length]);

  const generateResponse = (userMessage: string): string => {
    const lowerQuery = userMessage.toLowerCase();
    const numericColumns = columns.filter((col) =>
      data.some((row) => typeof row[col] === "number")
    );

    if (lowerQuery.includes("how many") && lowerQuery.includes("row")) {
      return `The dataset contains ${data.length} rows.`;
    }

    if (lowerQuery.includes("column")) {
      return `The dataset has ${columns.length} columns: ${columns.join(", ")}`;
    }

    if (lowerQuery.includes("average") || lowerQuery.includes("mean")) {
      if (numericColumns.length > 0) {
        const col = numericColumns[0];
        const vals = data.map((r) => r[col]).filter((v): v is number => typeof v === "number");
        const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
        return `The average of "${col}" is ${avg}.`;
      }
    }

    if (lowerQuery.includes("max") || lowerQuery.includes("highest")) {
      if (numericColumns.length > 0) {
        const col = numericColumns[0];
        const vals = data.map((r) => r[col]).filter((v): v is number => typeof v === "number");
        const max = Math.max(...vals);
        return `The maximum value in "${col}" is ${max.toLocaleString()}.`;
      }
    }

    if (lowerQuery.includes("min") || lowerQuery.includes("lowest")) {
      if (numericColumns.length > 0) {
        const col = numericColumns[0];
        const vals = data.map((r) => r[col]).filter((v): v is number => typeof v === "number");
        const min = Math.min(...vals);
        return `The minimum value in "${col}" is ${min.toLocaleString()}.`;
      }
    }

    if (lowerQuery.includes("summary") || lowerQuery.includes("overview")) {
      return `Dataset: "${fileName}"
• Rows: ${data.length}
• Columns: ${columns.length}
• Column names: ${columns.slice(0, 5).join(", ")}${columns.length > 5 ? "..." : ""}
• Numeric columns: ${numericColumns.length}`;
    }

    return `I can help you with questions about your data like:
• How many rows are there?
• What columns exist?
• What's the average/max/min?
• Give me a summary`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        content: generateResponse(input),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  if (data.length === 0) {
    return (
      <div className="page-section">
        <div className="upload-page">
          <div className="panel text-center p-8">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-4">
              Upload a CSV file to chat about your data
            </p>
            <Button onClick={() => navigate("/upload")}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section animate-fade-in">
      <div className="chatbot-container" style={{ height: "calc(100vh - 100px)" }}>
        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}
            >
              <div className="flex items-start gap-2">
                {msg.role === "bot" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
                {msg.role === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-bot">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-current animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the dataset..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={isTyping}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

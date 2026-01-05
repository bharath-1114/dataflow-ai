import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/DataContext";
import { Upload, FileSpreadsheet, Send, MessageSquare, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const sampleResponses = [
  "Based on your data, I can see there are {rows} rows and {columns} columns in your dataset.",
  "The numeric columns in your data are: {numericColumns}.",
  "I notice the highest value in {firstColumn} is {maxValue}.",
  "Would you like me to generate a chart visualization for this data?",
  "I can help you analyze trends, find patterns, or create custom visualizations.",
];

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
    // Welcome message when data is loaded
    if (data.length > 0 && messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "bot",
          content: `Welcome! I've loaded your dataset "${fileName}" with ${data.length} rows and ${columns.length} columns. What would you like to know about your data?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [data, fileName, columns, messages.length]);

  const generateResponse = (userMessage: string): string => {
    const numericColumns = columns.filter((col) =>
      data.some((row) => typeof row[col] === "number")
    );

    const firstNumericCol = numericColumns[0] || columns[0];
    const values = data
      .map((row) => row[firstNumericCol])
      .filter((v): v is number => typeof v === "number");
    const maxValue = values.length > 0 ? Math.max(...values) : 0;

    const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];

    return randomResponse
      .replace("{rows}", data.length.toString())
      .replace("{columns}", columns.length.toString())
      .replace("{numericColumns}", numericColumns.join(", ") || "None found")
      .replace("{firstColumn}", firstNumericCol)
      .replace("{maxValue}", maxValue.toLocaleString());
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        content: generateResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (data.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-6">
              Upload a CSV file to chat about your data
            </p>
            <Button onClick={() => navigate("/upload")}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          AI Data Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask questions about your dataset in natural language
        </p>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col shadow-soft overflow-hidden">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-secondary" />
            Chat with your data
          </CardTitle>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/20 text-secondary"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.role === "user"
                    ? "chat-bubble-user"
                    : "chat-bubble-bot"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="chat-bubble-bot">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your dataset..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Try: "What are the highest values?" or "Show me the trends"
          </p>
        </div>
      </Card>
    </div>
  );
}

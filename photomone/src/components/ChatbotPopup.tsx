import { Box, Typography, IconButton } from "@mui/material";
import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { ChatIcon, CloseChatIcon, SendIcon } from "@assets/icons/svg";
import { COLORS } from "@constants";
import { ChatbotApis } from "@apis";
import { useAppContext, useLanguage } from "@providers";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
}

const USER_BUBBLE_BG = "#66D9EF";
const BOT_BUBBLE_BG = "#F0F0F0";
const BOT_TEXT_COLOR = "#26262C";
const HEADER_TEXT_COLOR = "#26262C";
const HEADER_DIVIDER = "#E8E8E8";
const CLOSE_ICON_COLOR = "#616161";
const INPUT_BORDER = "#E0E0E0";

/** Parses bot reply: **text** → bold, ## at line start → accent color */
function formatBotMessage(content: string) {
  const lines = content.split("\n");
  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <br key={lineIdx} />;
    }
    if (trimmed.startsWith("##") || trimmed.startsWith("###")) {
      const headingText = trimmed.replace(/^#+\s*/, "");
      return (
        <Typography
          key={lineIdx}
          component="span"
          display="block"
          className=" text-xs sm:text-sm"
          sx={{ color: USER_BUBBLE_BG, fontWeight: 600 }}
        >
          {headingText}
        </Typography>
      );
    }
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
    return (
      <Typography
        key={lineIdx}
        component="span"
        display="block"
        className=" text-xs sm:text-sm whitespace-pre-wrap break-words"
        sx={{ color: BOT_TEXT_COLOR }}
      >
        {parts.map((part, partIdx) => {
          const boldMatch = part.match(/\*\*([^*]+)\*\*/);
          if (boldMatch) {
            return (
              <Box key={partIdx} component="span" sx={{ fontWeight: 700 }}>
                {boldMatch[1]}
              </Box>
            );
          }
          return <Fragment key={partIdx}>{part}</Fragment>;
        })}
      </Typography>
    );
  });
}

export const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const hasSentDefaultRef = useRef(false);
  const { showToast } = useAppContext();
  const { translations } = useLanguage();
  const sendMutation = ChatbotApis.useSendChatbotMessage();
  const greeting = translations?.customerSupport?.chatbotGreeting ?? "Hello!";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("[data-chatbot-trigger]")
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!message.trim() || sendMutation.isPending) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message.trim(),
      };
      setMessages((prev) => [...prev, userMessage]);

      sendMutation.mutate(message.trim(), {
        onSuccess: (reply) => {
          const botMessage: ChatMessage = {
            id: `bot-${Date.now()}`,
            role: "bot",
            content: reply,
          };
          setMessages((prev) => [...prev, botMessage]);
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to get response";
          showToast(errorMessage, "error");
        },
      });
    },
    [sendMutation, showToast]
  );

  // Send default message whenever user opens the chatbot (once per open), in user's selected language
  useEffect(() => {
    if (isOpen && !hasSentDefaultRef.current) {
      hasSentDefaultRef.current = true;
      sendMessage(greeting);
    }
    if (!isOpen) {
      hasSentDefaultRef.current = false;
    }
  }, [isOpen, greeting, sendMessage]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setInputValue("");
    sendMessage(trimmed);
  }, [inputValue, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <Box
      className="fixed bottom-20 right-4 sm:right-6 lg:bottom-6 z-[1100] flex flex-col items-end max-w-[calc(100vw-2rem)]"
      ref={popupRef}
    >
      {/* Popup Panel */}
      {isOpen && (
        <Box
          className="absolute bottom-14 right-0 w-[min(360px,calc(100vw-2rem))] sm:bottom-16 max-h-[80vh] sm:max-h-[min(500px,70vh)] overflow-hidden shadow-lg flex flex-col"
          sx={{
            backgroundColor: COLORS.white,
            borderRadius: "2em",
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header - white, dark text, light grey close button */}
          <Box
            className="flex items-center justify-between px-4 py-3 gap-2"
            sx={{
              backgroundColor: COLORS.white,
              borderBottom: `1px solid ${HEADER_DIVIDER}`,
            }}
          >
            <Typography
              className="text-base flex-1 truncate font-light"
              sx={{ color: HEADER_TEXT_COLOR }}
            >
              <span className="font-bold">Photo</span>Mone{" "}
              <span className="font-bold">Bot </span>
            </Typography>
            <IconButton
              onClick={() => setIsOpen(false)}
              size="small"
              className="!p-1 !shrink-0 !rounded-full"
              sx={{
                backgroundColor: "transparent",
                color: CLOSE_ICON_COLOR,
                "&:hover": {
                  backgroundColor: "#DEDEDE",
                },
              }}
            >
              <CloseChatIcon width={18} height={18} color={CLOSE_ICON_COLOR} />
            </IconButton>
          </Box>

          {/* Content */}
          <Box
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0"
            sx={{ backgroundColor: COLORS.white }}
          >
            {/* Chat messages */}
            <Box className="h-[220px] sm:h-[300px] overflow-y-auto flex flex-col gap-3 shrink-0">
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  className={`rounded-[10px] p-3 max-w-[88%] ${
                    msg.role === "user" ? "self-end" : "self-start"
                  }`}
                  sx={{
                    backgroundColor:
                      msg.role === "user" ? USER_BUBBLE_BG : BOT_BUBBLE_BG,
                  }}
                >
                  {msg.role === "bot" ? (
                    <Box className="flex flex-col gap-1">
                      {formatBotMessage(msg.content)}
                    </Box>
                  ) : (
                    <Typography className="text-white  text-xs sm:text-sm whitespace-pre-wrap break-words">
                      {msg.content}
                    </Typography>
                  )}
                </Box>
              ))}
              {sendMutation.isPending && (
                <Box
                  className="self-start rounded-[14px] p-3"
                  sx={{ backgroundColor: BOT_BUBBLE_BG }}
                >
                  <Typography
                    className=" text-xs sm:text-sm italic"
                    sx={{ color: "#757575" }}
                  >
                    Typing...
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input area - pill-shaped, white, no emoji icon */}
            <Box className="flex gap-2 shrink-0 items-center">
              <input
                type="text"
                placeholder={
                  translations?.customerSupport?.chatbotPlaceholder ??
                  "Type your question..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sendMutation.isPending}
                className="flex-1 min-w-0 rounded-full border px-4 py-2.5  text-sm placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#66D9EF] focus:ring-opacity-30 disabled:opacity-60"
                style={{
                  backgroundColor: COLORS.white,
                  borderColor: INPUT_BORDER,
                  color: BOT_TEXT_COLOR,
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!inputValue.trim() || sendMutation.isPending}
                size="small"
                className="!p-2.5 !rounded-full !shrink-0"
                sx={{
                  backgroundColor: COLORS.primary,
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#52C5DB",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#B0BEC5",
                    color: "white",
                  },
                }}
              >
                <SendIcon width={18} height={18} color="currentColor" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}

      {/* Trigger Button */}
      <Box
        data-chatbot-trigger
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:opacity-90 shadow-lg shrink-0"
        sx={{
          backgroundColor: COLORS.primary,
          boxShadow: "0px 4px 12px rgba(114,69,239,0.4)",
        }}
      >
        {isOpen ? (
          <CloseChatIcon width={20} height={20} color="white" />
        ) : (
          <ChatIcon width={20} height={20} color="white" />
        )}
      </Box>
    </Box>
  );
};

export default ChatbotPopup;

import type { CivicService } from "@/data/services";
import { matchService, services } from "@/data/services";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  service?: CivicService;
  type: "text" | "service-result" | "suggestions" | "not-found";
  timestamp: Date;
}

let messageCounter = 0;

function createId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

export function processUserMessage(input: string, history: ChatMessage[]): ChatMessage[] {
  const userMsg: ChatMessage = {
    id: createId(),
    role: "user",
    content: input,
    type: "text",
    timestamp: new Date(),
  };

  const service = matchService(input);

  if (service) {
    const assistantMsg: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: `I found the right form for you — **${service.serviceName}**. ${service.description}\n\nHere's your document checklist. Complete all items to unlock the downloadable form.`,
      service,
      type: "service-result",
      timestamp: new Date(),
    };
    return [userMsg, assistantMsg];
  }

  // Check for "popular" or "show" requests
  const lower = input.toLowerCase();
  if (lower.includes("popular") || lower.includes("show") || lower.includes("all forms") || lower.includes("list")) {
    const assistantMsg: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: "Here are the forms and services I can help you with. Just tell me which one you need!",
      type: "suggestions",
      timestamp: new Date(),
    };
    return [userMsg, assistantMsg];
  }

  const assistantMsg: ChatMessage = {
    id: createId(),
    role: "assistant",
    content: `I couldn't find a matching service for "${input}". Try describing what you need — for example, "I need an income certificate" or "report garbage problem".`,
    type: "not-found",
    timestamp: new Date(),
  };
  return [userMsg, assistantMsg];
}

export function getPopularServices(): CivicService[] {
  return services.slice(0, 4);
}

export function getAllServices(): CivicService[] {
  return services;
}

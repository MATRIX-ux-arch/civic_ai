import { z } from "zod";
import type { TamboComponent, TamboTool, ContextHelpers } from "@tambo-ai/react";
import TamboServiceResult from "@/components/civic/TamboServiceResult";
import TamboServiceGrid from "@/components/civic/TamboServiceGrid";
import { matchService, services } from "@/data/services";

// ── Tools ──────────────────────────────────────────────────────────────────

export const findCivicServiceTool: TamboTool = {
  name: "findCivicService",
  description:
    "Search for a civic government service by user query. Returns the matching service details including required documents. Always use this tool when the user asks about a specific government form or service.",
  tool: (params: Record<string, unknown>) => {
    const query = params.query as string;
    const service = matchService(query);
    if (service) {
      return service;
    }
    return null;
  },
  inputSchema: z.object({
    query: z
      .string()
      .describe("The user's natural language query describing what service or form they need"),
  }),
  outputSchema: z.object({
    id: z.string(),
    serviceName: z.string(),
    category: z.string(),
    description: z.string(),
    icon: z.string(),
    pdfTemplate: z.string(),
    documents: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
      })
    ),
  }),
};

export const listAllServicesTool: TamboTool = {
  name: "listAllServices",
  description:
    "Get a list of all available civic government services. Use when the user asks to see all forms, popular services, or needs help choosing.",
  tool: () => {
    return services.map((s) => ({
      id: s.id,
      serviceName: s.serviceName,
      category: s.category,
      description: s.description,
      icon: s.icon,
    }));
  },
  inputSchema: z.object({}),
  outputSchema: z.array(
    z.object({
      id: z.string(),
      serviceName: z.string(),
      category: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
};

// ── Components ─────────────────────────────────────────────────────────────

export const tamboComponents: TamboComponent[] = [
  {
    name: "ServiceResult",
    description:
      "Displays a civic service result card with a document checklist, progress ring, and downloadable PDF form. Use this component whenever a specific government service has been found for the user's request.",
    component: TamboServiceResult,
    propsSchema: z.object({
      serviceName: z.string().describe("The name of the civic service, e.g. 'Income Certificate'"),
      category: z
        .string()
        .describe("The category of the service, e.g. 'Revenue', 'Municipal', 'Education'"),
      description: z.string().describe("A brief description of what the service is for"),
      icon: z.string().describe("A single emoji icon representing the service"),
      pdfTemplate: z.string().describe("The PDF template identifier for this service"),
      documents: z
        .array(
          z.object({
            id: z.string().describe("A unique hyphenated document identifier, e.g. 'ic-1'"),
            name: z.string().describe("Name of the required document, e.g. 'Aadhaar Card'"),
            description: z
              .string()
              .describe("Brief description of the document, e.g. 'Government-issued identity proof'"),
          })
        )
        .describe("The list of documents required for this service"),
    }),
    associatedTools: [findCivicServiceTool],
  },
  {
    name: "ServiceGrid",
    description:
      "Displays a grid of all available civic services for the user to browse. Use this when the user asks to see all available forms, popular services, or wants help choosing a service.",
    component: TamboServiceGrid,
    propsSchema: z.object({}),
    associatedTools: [listAllServicesTool],
  },
];

// ── All tools (flat list for TamboProvider) ────────────────────────────────

export const tamboTools: TamboTool[] = [findCivicServiceTool, listAllServicesTool];

// ── Context helpers ────────────────────────────────────────────────────────

export const tamboContextHelpers: ContextHelpers = {
  appContext: () =>
    `You are CIVIC AI, a form discovery and preparation assistant for Indian government services. Your role is to help users find the right civic service form, show them the required documents checklist, and let them download a blank PDF form. Be helpful and concise. When the user describes a need for a specific form or government service, use the findCivicService tool. When they ask to see all services or need suggestions, use the listAllServices tool and render the ServiceGrid component. Available services: ${services
      .map((s) => s.serviceName)
      .join(", ")}.`,
};

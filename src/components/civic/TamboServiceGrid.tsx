import { useTamboThread } from "@tambo-ai/react";
import { ServiceGrid } from "./ServiceGrid";
import { SuggestedActions } from "./SuggestedActions";

export default function TamboServiceGrid() {
  const { sendThreadMessage } = useTamboThread();

  const handleSelect = (query: string) => {
    sendThreadMessage(query, { streamResponse: true });
  };

  return (
    <div>
      <ServiceGrid onSelect={handleSelect} />
      <SuggestedActions onAction={handleSelect} />
    </div>
  );
}

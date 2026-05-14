import { 
  CopilotRuntime, 
  GoogleGenerativeAIAdapter, 
  copilotRuntimeNextJSAppRouterEndpoint 
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

// We use the Gemini model for the brain
const serviceAdapter = new GoogleGenerativeAIAdapter({ 
  model: "gemini-1.5-flash" 
});

const runtime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};

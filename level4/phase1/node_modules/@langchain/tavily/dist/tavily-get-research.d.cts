import { TavilyGetIncompleteResearchResponse, TavilyGetResearchResponse, TavilyResearchAPIWrapper } from "./utils.cjs";
import { CallbackManagerForToolRun } from "@langchain/core/callbacks/manager";
import { StructuredTool, ToolParams } from "@langchain/core/tools";
import { z } from "zod/v3";
import { InferInteropZodOutput } from "@langchain/core/utils/types";

//#region src/tavily-get-research.d.ts
type TavilyGetResearchAPIRetrieverFields = ToolParams & {
  /**
   * The base URL to be used for the Tavily Research API.
   */
  apiBaseUrl?: string;
  /**
   * The API key used for authentication with the Tavily Research API.
   */
  tavilyApiKey?: string;
  /**
   * The name of the tool.
   *
   * @default "tavily_get_research"
   */
  name?: string;
  /**
   * The description of the tool.
   *
   * @default "Retrieves the results of a research task by its request_id. Use this tool after creating a research task to get the completed research report, including the content, sources, and status. Input should be a request_id from a previously created research task."
   */
  description?: string;
  /**
   * Whether to return the tool's output directly.
   *
   * Setting this to true means that after the tool is called,
   * an agent should stop looping.
   *
   * @default false
   */
  returnDirect?: boolean;
  /**
   * An API wrapper that can be used to interact with the Tavily Research API. Useful for testing.
   *
   * If specified, the tool will use this API wrapper instead of creating a new one, and fields used
   * in API Wrapper initialization, like {@link TavilyGetResearchAPIRetrieverFields.tavilyApiKey}, will be
   * ignored.
   */
  apiWrapper?: TavilyResearchAPIWrapper;
};
declare const inputSchema: z.ZodObject<{
  requestId: z.ZodString;
}, "strip", z.ZodTypeAny, {
  requestId: string;
}, {
  requestId: string;
}>;
/**
 * A Tool for retrieving research results by request_id from the Tavily Research API.
 * Extends the StructuredTool class and allows you to check the status and retrieve
 * results of a research task that was previously created.
 *
 * Authentication is handled via an API key, which can be passed during
 * instantiation or set as an environment variable `TAVILY_API_KEY`.
 *
 * Example:
 * ```typescript
 * const tool = new TavilyGetResearch({
 *   tavilyApiKey: "YOUR_API_KEY"
 * });
 * const results = await tool.invoke({
 *   requestId: "abc123-def456-ghi789"
 * });
 * console.log(results);
 * ```
 */
declare class TavilyGetResearch extends StructuredTool<typeof inputSchema> {
  static lc_name(): string;
  description: string;
  name: string;
  schema: z.ZodObject<{
    requestId: z.ZodString;
  }, "strip", z.ZodTypeAny, {
    requestId: string;
  }, {
    requestId: string;
  }>;
  apiBaseUrl?: string;
  private apiWrapper;
  constructor(params?: TavilyGetResearchAPIRetrieverFields);
  _call(input: InferInteropZodOutput<typeof inputSchema>, _runManager?: CallbackManagerForToolRun): Promise<TavilyGetResearchResponse | TavilyGetIncompleteResearchResponse | {
    error: string;
  }>;
}
//#endregion
export { TavilyGetResearch, TavilyGetResearchAPIRetrieverFields };
//# sourceMappingURL=tavily-get-research.d.cts.map
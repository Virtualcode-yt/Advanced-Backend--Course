import { TavilySearchAPIWrapper, TavilySearchResponse } from "./utils.js";
import { StructuredTool, ToolParams } from "@langchain/core/tools";
import { z } from "zod/v3";
import { CallbackManagerForToolRun } from "@langchain/core/callbacks/manager";
import { InferInteropZodOutput } from "@langchain/core/utils/types";

//#region src/tavily-search.d.ts
type SearchDepth = "basic" | "advanced";
type TimeRange = "day" | "week" | "month" | "year";
type TopicType = "general" | "news" | "finance";
/**
 * Options for the TavilySearchResults tool.
 */
type TavilySearchAPIRetrieverFields = ToolParams & {
  /**
   * The base URL to be used for the Tavily Search API.
   *
   *
   */
  apiBaseUrl?: string;
  /**
   * The maximum number of search results to return.
   *
   * @default 5
   */
  maxResults?: number;
  /**
   * The API key used for authentication with the Tavily Search API.
   *
   */
  tavilyApiKey?: string;
  /**
   * Include a list of query-related images in the response.
   *
   * @default false
   */
  includeImages?: boolean;
  /**
   * When includeImages is set to True, this option adds descriptive text for each image.
   *
   * @default false
   */
  includeImageDescriptions?: boolean;
  /**
   * Include a short answer to the original query.
   *
   * @default false
   */
  includeAnswer?: boolean;
  /**
   * Include the cleaned and parsed HTML content of each search result.
   * "markdown" returns search result content in markdown format.
   * "text" returns the plain text from the results and may increase latency.
   * If true, defaults to "markdown"
   *
   * @default false
   */
  includeRawContent?: boolean | "markdown" | "text";
  /**
   * A list of domains to specifically include in the search results.
   *
   * @default []
   */
  includeDomains?: string[];
  /**
   * A list of domains to specifically exclude from the search results.
   *
   * @default []
   */
  excludeDomains?: string[];
  /**
   * The depth of the search. It can be "basic" or "advanced".
   *
   * @default "basic"
   */
  searchDepth?: SearchDepth;
  /**
   * The category of the search. This will determine which of our agents will be used for the search. Currently, only "general" and "news" are supported. See https://docs.tavily.com/docs/rest-api/api-reference
   *
   * @default "general"
   */
  topic?: TopicType;
  /**
   * The time range of the search. This will filter the time range of the results back from the current date. See https://docs.tavily.com/docs/rest-api/api-reference
   *
   * @default "general"
   */
  timeRange?: TimeRange;
  /**
   * Whether to include the favicon URL for each result.
   *
   * @default false
   */
  includeFavicon?: boolean;
  /**
   * Whether to include usage information (credits) in the response.
   *
   * @default false
   */
  includeUsage?: boolean;
  /**
   * The name of the tool.
   *
   * @default "tavily_search"
   */
  name?: string;
  /**
   * The description of the tool.
   *
   * @default "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query."
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
   * An API wrapper that can be used to interact with the Tavily Search API. Useful for testing.
   *
   * If specified, the tool will use this API wrapper instead of creating a new one, and fields used
   * in API Wrapper initialization, like {@link TavilySearchAPIRetrieverFields.tavilyApiKey}, will be
   * ignored.
   */
  apiWrapper?: TavilySearchAPIWrapper;
  /**
   * The number of content chunks to retrieve from each source. Each chunk's length is maximum 500 characters. Available only when searchDepth is advanced. See https://docs.tavily.com/docs/rest-api/api-reference
   *
   * @default 3
   */
  chunksPerSource?: number;
  /**
   * The country to search in. MUST be the full country name in lowercase
   * like "united states" or "united kingdom".
   *
   * @default undefined
   */
  country?: string;
  /**
   * Whether to automatically determine optimal search parameters based on the query.
   * This can only be set during tool instantiation, not at invocation time.
   *
   * @default false
   */
  autoParameters?: boolean;
};
declare const inputSchema: z.ZodObject<{
  query: z.ZodString;
  includeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  excludeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  searchDepth: z.ZodOptional<z.ZodEnum<["basic", "advanced"]>>;
  includeImages: z.ZodOptional<z.ZodBoolean>;
  timeRange: z.ZodOptional<z.ZodEnum<["day", "week", "month", "year"]>>;
  topic: z.ZodOptional<z.ZodEnum<["general", "news", "finance"]>>;
}, "strip", z.ZodTypeAny, {
  query: string;
  includeDomains?: string[] | undefined;
  excludeDomains?: string[] | undefined;
  searchDepth?: "advanced" | "basic" | undefined;
  includeImages?: boolean | undefined;
  timeRange?: "day" | "month" | "week" | "year" | undefined;
  topic?: "finance" | "general" | "news" | undefined;
}, {
  query: string;
  includeDomains?: string[] | undefined;
  excludeDomains?: string[] | undefined;
  searchDepth?: "advanced" | "basic" | undefined;
  includeImages?: boolean | undefined;
  timeRange?: "day" | "month" | "week" | "year" | undefined;
  topic?: "finance" | "general" | "news" | undefined;
}>;
/**
 * A Tool for performing searches with the Tavily Search API and retrieving
 * the results. Extends the StructuredTool class. It includes optional
 * parameters for refining search results, such as specifying domains,
 * search depth, and time ranges.
 *
 * Authentication is handled via an API key, which can be passed during
 * instantiation or set as an environment variable `TAVILY_API_KEY`.
 *
 * Example:
 * ```typescript
 * const tool = new TavilySearch({
 *   maxResults: 3,
 *   tavilyApiKey: "YOUR_API_KEY"
 * });
 * const results = await tool.invoke({ query: "latest AI news" });
 * console.log(results);
 * ```
 */
declare class TavilySearch extends StructuredTool<typeof inputSchema> {
  static lc_name(): string;
  description: string;
  name: string;
  schema: z.ZodObject<{
    query: z.ZodString;
    includeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    excludeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    searchDepth: z.ZodOptional<z.ZodEnum<["basic", "advanced"]>>;
    includeImages: z.ZodOptional<z.ZodBoolean>;
    timeRange: z.ZodOptional<z.ZodEnum<["day", "week", "month", "year"]>>;
    topic: z.ZodOptional<z.ZodEnum<["general", "news", "finance"]>>;
  }, "strip", z.ZodTypeAny, {
    query: string;
    includeDomains?: string[] | undefined;
    excludeDomains?: string[] | undefined;
    searchDepth?: "advanced" | "basic" | undefined;
    includeImages?: boolean | undefined;
    timeRange?: "day" | "month" | "week" | "year" | undefined;
    topic?: "finance" | "general" | "news" | undefined;
  }, {
    query: string;
    includeDomains?: string[] | undefined;
    excludeDomains?: string[] | undefined;
    searchDepth?: "advanced" | "basic" | undefined;
    includeImages?: boolean | undefined;
    timeRange?: "day" | "month" | "week" | "year" | undefined;
    topic?: "finance" | "general" | "news" | undefined;
  }>;
  apiBaseUrl?: string;
  maxResults?: number;
  includeImages?: boolean;
  includeImageDescriptions?: boolean;
  includeAnswer?: boolean;
  includeRawContent?: boolean | "markdown" | "text";
  includeDomains?: string[];
  excludeDomains?: string[];
  searchDepth?: SearchDepth;
  topic?: TopicType;
  days?: number;
  timeRange?: TimeRange;
  chunksPerSource?: number;
  country?: string;
  autoParameters?: boolean;
  includeFavicon?: boolean;
  includeUsage?: boolean;
  handleToolError: boolean;
  apiWrapper: TavilySearchAPIWrapper;
  /**
   * Constructs a new instance of the TavilySearch tool.
   * @param params Optional configuration parameters for the tool.
   *               Includes options like `maxResults`, `tavilyApiKey`,
   *               `includeImages`, `includeAnswer`, `searchDepth`, etc.
   *               See {@link TavilySearchAPIRetrieverFields} for details.
   */
  constructor(params?: TavilySearchAPIRetrieverFields);
  _call(input: InferInteropZodOutput<typeof inputSchema>, _runManager?: CallbackManagerForToolRun): Promise<TavilySearchResponse | {
    error: string;
  }>;
}
//#endregion
export { SearchDepth, TavilySearch, TavilySearchAPIRetrieverFields, TimeRange, TopicType };
//# sourceMappingURL=tavily-search.d.ts.map
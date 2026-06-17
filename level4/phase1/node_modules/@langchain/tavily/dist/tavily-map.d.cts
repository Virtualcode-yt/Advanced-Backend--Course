import { CrawlCategory, TavilyMapAPIWrapper, TavilyMapResponse } from "./utils.cjs";
import { CallbackManagerForToolRun } from "@langchain/core/callbacks/manager";
import { StructuredTool, ToolParams } from "@langchain/core/tools";
import { z } from "zod/v3";
import { InferInteropZodOutput } from "@langchain/core/utils/types";

//#region src/tavily-map.d.ts
type TavilyMapAPIRetrieverFields = ToolParams & {
  /**
   * The base URL to be used for the Tavily Search API.
   *
   *
   */
  apiBaseUrl?: string;
  /**
   * The API key used for authentication with the Tavily Search API.
   *
   */
  tavilyApiKey?: string;
  /**
   * Natural language instructions to guide the crawler
   *
   * @default undefined
   */
  instructions?: string;
  /**
   * The maximum number of hops from the starting URL.
   *
   * @default 3
   */
  maxDepth?: number;
  /**
   * The maximum number of pages to crawl per level.
   *
   * @default 50
   */
  maxBreadth?: number;
  /**
   * The maximum number of pages to crawl.
   *
   * @default 100
   */
  limit?: number;
  /**
   * Only crawl URLs containing these categories.
   *
   * @default undefined
   */
  categories?: CrawlCategory[];
  /**
   * Only crawl URLs containing these paths.
   *
   * @default undefined
   */
  selectPaths?: string[];
  /**
   * Only crawl these domains.
   *
   * @default undefined
   */
  selectDomains?: string[];
  /**
   * Exclude these paths.
   *
   * @default undefined
   */
  excludePaths?: string[];
  /**
   * Exclude these domains.
   *
   * @default undefined
   */
  excludeDomains?: string[];
  /**
   * Allow crawling external domains.
   *
   * @default undefined
   */
  allowExternal?: boolean;
  /**
   * Whether to include usage information (credits) in the response.
   *
   * @default false
   */
  includeUsage?: boolean;
  /**
   * The name of the tool.
   *
   * @default "tavily_map"
   */
  name?: string;
  /**
   * The description of the tool.
   *
   * @default "Creates a site map by crawling a website starting from a given URL."
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
   * An API wrapper that can be used to interact with the Tavily Map API. Useful for testing.
   *
   * If specified, the tool will use this API wrapper instead of creating a new one, and fields used
   * in API Wrapper initialization, like {@link TavilyMapAPIRetrieverFields.tavilyApiKey}, will be
   * ignored.
   */
  apiWrapper?: TavilyMapAPIWrapper;
};
declare const inputSchema: z.ZodObject<{
  url: z.ZodString;
  instructions: z.ZodOptional<z.ZodString>;
  selectPaths: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  selectDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  excludePaths: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  excludeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
  allowExternal: z.ZodOptional<z.ZodBoolean>;
  categories: z.ZodOptional<z.ZodArray<z.ZodEnum<["Documentation", "Blog", "Blogs", "Community", "About", "Contact", "Privacy", "Terms", "Status", "Pricing", "Enterprise", "Careers", "E-Commerce", "Authentication", "Developer", "Developers", "Solutions", "Partners", "Downloads", "Media", "Events", "People"]>, "many">>;
}, "strip", z.ZodTypeAny, {
  url: string;
  instructions?: string | undefined;
  selectPaths?: string[] | undefined;
  selectDomains?: string[] | undefined;
  excludePaths?: string[] | undefined;
  excludeDomains?: string[] | undefined;
  allowExternal?: boolean | undefined;
  categories?: ("About" | "Authentication" | "Blog" | "Blogs" | "Careers" | "Community" | "Contact" | "Developer" | "Developers" | "Documentation" | "Downloads" | "E-Commerce" | "Enterprise" | "Events" | "Media" | "Partners" | "People" | "Pricing" | "Privacy" | "Solutions" | "Status" | "Terms")[] | undefined;
}, {
  url: string;
  instructions?: string | undefined;
  selectPaths?: string[] | undefined;
  selectDomains?: string[] | undefined;
  excludePaths?: string[] | undefined;
  excludeDomains?: string[] | undefined;
  allowExternal?: boolean | undefined;
  categories?: ("About" | "Authentication" | "Blog" | "Blogs" | "Careers" | "Community" | "Contact" | "Developer" | "Developers" | "Documentation" | "Downloads" | "E-Commerce" | "Enterprise" | "Events" | "Media" | "Partners" | "People" | "Pricing" | "Privacy" | "Solutions" | "Status" | "Terms")[] | undefined;
}>;
declare class TavilyMap extends StructuredTool<typeof inputSchema> {
  static lc_name(): string;
  name: string;
  description: string;
  schema: z.ZodObject<{
    url: z.ZodString;
    instructions: z.ZodOptional<z.ZodString>;
    selectPaths: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    selectDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    excludePaths: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    excludeDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    allowExternal: z.ZodOptional<z.ZodBoolean>;
    categories: z.ZodOptional<z.ZodArray<z.ZodEnum<["Documentation", "Blog", "Blogs", "Community", "About", "Contact", "Privacy", "Terms", "Status", "Pricing", "Enterprise", "Careers", "E-Commerce", "Authentication", "Developer", "Developers", "Solutions", "Partners", "Downloads", "Media", "Events", "People"]>, "many">>;
  }, "strip", z.ZodTypeAny, {
    url: string;
    instructions?: string | undefined;
    selectPaths?: string[] | undefined;
    selectDomains?: string[] | undefined;
    excludePaths?: string[] | undefined;
    excludeDomains?: string[] | undefined;
    allowExternal?: boolean | undefined;
    categories?: ("About" | "Authentication" | "Blog" | "Blogs" | "Careers" | "Community" | "Contact" | "Developer" | "Developers" | "Documentation" | "Downloads" | "E-Commerce" | "Enterprise" | "Events" | "Media" | "Partners" | "People" | "Pricing" | "Privacy" | "Solutions" | "Status" | "Terms")[] | undefined;
  }, {
    url: string;
    instructions?: string | undefined;
    selectPaths?: string[] | undefined;
    selectDomains?: string[] | undefined;
    excludePaths?: string[] | undefined;
    excludeDomains?: string[] | undefined;
    allowExternal?: boolean | undefined;
    categories?: ("About" | "Authentication" | "Blog" | "Blogs" | "Careers" | "Community" | "Contact" | "Developer" | "Developers" | "Documentation" | "Downloads" | "E-Commerce" | "Enterprise" | "Events" | "Media" | "Partners" | "People" | "Pricing" | "Privacy" | "Solutions" | "Status" | "Terms")[] | undefined;
  }>;
  apiBaseUrl?: string;
  maxDepth?: number;
  maxBreadth?: number;
  limit?: number;
  instructions?: string;
  selectPaths?: string[];
  selectDomains?: string[];
  excludePaths?: string[];
  excludeDomains?: string[];
  allowExternal?: boolean;
  categories?: CrawlCategory[];
  includeUsage?: boolean;
  private apiWrapper;
  constructor(params?: TavilyMapAPIRetrieverFields);
  _call(input: InferInteropZodOutput<typeof inputSchema>, _runManager?: CallbackManagerForToolRun): Promise<TavilyMapResponse | {
    error: string;
  }>;
}
//#endregion
export { TavilyMap, TavilyMapAPIRetrieverFields };
//# sourceMappingURL=tavily-map.d.cts.map
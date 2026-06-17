const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
const require_utils = require('./utils.cjs');
const __langchain_core_tools = require_rolldown_runtime.__toESM(require("@langchain/core/tools"));
const zod_v3 = require_rolldown_runtime.__toESM(require("zod/v3"));

//#region src/tavily-search.ts
function generateSuggestions(params) {
	const suggestions = [];
	const { timeRange, includeDomains, excludeDomains, searchDepth, topic } = params;
	if (timeRange) suggestions.push("Remove time_range argument");
	if (includeDomains && Array.isArray(includeDomains) && includeDomains.length > 0) suggestions.push("Remove include_domains argument");
	if (excludeDomains && Array.isArray(excludeDomains) && excludeDomains.length > 0) suggestions.push("Remove exclude_domains argument");
	if (searchDepth === "basic") suggestions.push("Try a more detailed search using 'advanced' search_depth");
	if (topic && topic !== "general") suggestions.push("Try a general search using 'general' topic");
	return suggestions;
}
const inputSchema = zod_v3.z.object({
	query: zod_v3.z.string().describe("Search query to look up"),
	includeDomains: zod_v3.z.array(zod_v3.z.string()).optional().describe(`A list of domains to restrict search results to.

Use this parameter when:
1. The user explicitly requests information from specific websites (e.g., "Find climate data from nasa.gov")
2. The user mentions an organization or company without specifying the domain (e.g., "Find information about iPhones from Apple")

In both cases, you should determine the appropriate domains (e.g., ["nasa.gov"] or ["apple.com"]) and set this parameter.

Results will ONLY come from the specified domains - no other sources will be included.
Default is None (no domain restriction).`),
	excludeDomains: zod_v3.z.array(zod_v3.z.string()).optional().describe(`A list of domains to exclude from search results.

Use this parameter when:
1. The user explicitly requests to avoid certain websites (e.g., "Find information about climate change but not from twitter.com")
2. The user mentions not wanting results from specific organizations without naming the domain (e.g., "Find phone reviews but nothing from Apple")

In both cases, you should determine the appropriate domains to exclude (e.g., ["twitter.com"] or ["apple.com"]) and set this parameter.

Results will filter out all content from the specified domains.
Default is None (no domain exclusion).`),
	searchDepth: zod_v3.z.enum(["basic", "advanced"]).optional().describe(`Controls search thoroughness and result comprehensiveness.

Use "basic" (default) for simple queries requiring quick, straightforward answers.

Use "advanced" for complex queries, specialized topics, 
rare information, or when in-depth analysis is needed.`),
	includeImages: zod_v3.z.boolean().optional().describe(`Determines if the search returns relevant images along with text results.

Set to True when the user explicitly requests visuals or when images would 
significantly enhance understanding (e.g., "Show me what black holes look like," 
"Find pictures of Renaissance art").

Leave as False (default) for most informational queries where text is sufficient.`),
	timeRange: zod_v3.z.enum([
		"day",
		"week",
		"month",
		"year"
	]).optional().describe(`Limits results to content published within a specific timeframe.

ONLY set this when the user explicitly mentions a time period 
(e.g., "latest AI news," "articles from last week").

For less popular or niche topics, use broader time ranges 
("month" or "year") to ensure sufficient relevant results.

Options: "day" (24h), "week" (7d), "month" (30d), "year" (365d).

Default is None.`),
	topic: zod_v3.z.enum([
		"general",
		"news",
		"finance"
	]).optional().describe(`Specifies search category for optimized results.

Use "general" (default) for most queries, INCLUDING those with terms like 
"latest," "newest," or "recent" when referring to general information.

Use "finance" for markets, investments, economic data, or financial news.

Use "news" ONLY for politics, sports, or major current events covered by 
mainstream media - NOT simply because a query asks for "new" information.`)
});
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
var TavilySearch = class extends __langchain_core_tools.StructuredTool {
	static lc_name() {
		return "TavilySearch";
	}
	description = "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query.";
	name = "tavily_search";
	schema = inputSchema;
	apiBaseUrl;
	maxResults;
	includeImages;
	includeImageDescriptions;
	includeAnswer;
	includeRawContent;
	includeDomains;
	excludeDomains;
	searchDepth;
	topic;
	days;
	timeRange;
	chunksPerSource;
	country;
	autoParameters;
	includeFavicon;
	includeUsage;
	handleToolError = true;
	apiWrapper;
	/**
	* Constructs a new instance of the TavilySearch tool.
	* @param params Optional configuration parameters for the tool.
	*               Includes options like `maxResults`, `tavilyApiKey`,
	*               `includeImages`, `includeAnswer`, `searchDepth`, etc.
	*               See {@link TavilySearchAPIRetrieverFields} for details.
	*/
	constructor(params = {}) {
		super(params);
		if (params.name) this.name = params.name;
		if (params.description) this.description = params.description;
		if (params.apiWrapper) this.apiWrapper = params.apiWrapper;
		else {
			const apiWrapperParams = {};
			if (params.tavilyApiKey) apiWrapperParams.tavilyApiKey = params.tavilyApiKey;
			if (params.apiBaseUrl) apiWrapperParams.apiBaseUrl = params.apiBaseUrl;
			this.apiWrapper = new require_utils.TavilySearchAPIWrapper(apiWrapperParams);
		}
		this.includeDomains = params.includeDomains;
		this.excludeDomains = params.excludeDomains;
		this.searchDepth = params.searchDepth;
		this.includeImages = params.includeImages;
		this.timeRange = params.timeRange;
		this.maxResults = params.maxResults;
		this.topic = params.topic;
		this.includeAnswer = params.includeAnswer;
		this.includeRawContent = params.includeRawContent;
		this.includeImageDescriptions = params.includeImageDescriptions;
		this.chunksPerSource = params.chunksPerSource;
		this.country = params.country;
		this.autoParameters = params.autoParameters;
		this.includeFavicon = params.includeFavicon;
		this.includeUsage = params.includeUsage;
	}
	async _call(input, _runManager) {
		try {
			const { query, includeDomains, excludeDomains, searchDepth, includeImages, timeRange, topic } = input;
			const effectiveIncludeDomains = this.includeDomains ?? includeDomains;
			const effectiveExcludeDomains = this.excludeDomains ?? excludeDomains;
			const effectiveSearchDepth = this.searchDepth ?? searchDepth;
			const effectiveIncludeImages = this.includeImages ?? includeImages;
			const effectiveTimeRange = this.timeRange ?? timeRange;
			const effectiveTopic = this.topic ?? topic;
			const rawResults = await this.apiWrapper.rawResults({
				query,
				includeDomains: effectiveIncludeDomains,
				excludeDomains: effectiveExcludeDomains,
				searchDepth: effectiveSearchDepth,
				includeImages: effectiveIncludeImages,
				timeRange: effectiveTimeRange,
				topic: effectiveTopic,
				maxResults: this.maxResults,
				includeAnswer: this.includeAnswer,
				includeRawContent: this.includeRawContent,
				includeImageDescriptions: this.includeImageDescriptions,
				chunksPerSource: this.chunksPerSource,
				country: this.country,
				autoParameters: this.autoParameters,
				includeFavicon: this.includeFavicon,
				includeUsage: this.includeUsage
			});
			if (!rawResults || typeof rawResults !== "object" || !("results" in rawResults) || !Array.isArray(rawResults.results) || rawResults.results.length === 0) {
				const searchParams = {
					timeRange: effectiveTimeRange,
					includeDomains: effectiveIncludeDomains,
					excludeDomains: effectiveExcludeDomains,
					searchDepth: effectiveSearchDepth,
					topic: effectiveTopic
				};
				const suggestions = generateSuggestions(searchParams);
				const errorMessage = `No search results found for '${query}'. Suggestions: ${suggestions.join(", ")}. Try modifying your search parameters with one of these approaches.`;
				throw new Error(errorMessage);
			}
			return rawResults;
		} catch (e) {
			const errorMessage = e && typeof e === "object" && "message" in e ? e.message : String(e);
			return { error: errorMessage };
		}
	}
};

//#endregion
exports.TavilySearch = TavilySearch;
//# sourceMappingURL=tavily-search.cjs.map
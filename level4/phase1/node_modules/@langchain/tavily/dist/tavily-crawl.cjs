const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
const require_utils = require('./utils.cjs');
const __langchain_core_tools = require_rolldown_runtime.__toESM(require("@langchain/core/tools"));
const zod_v3 = require_rolldown_runtime.__toESM(require("zod/v3"));

//#region src/tavily-crawl.ts
function generateSuggestions(params) {
	const suggestions = [];
	const { selectPaths, selectDomains, excludeDomains } = params;
	if (!selectPaths || Array.isArray(selectPaths) && selectPaths.length === 0) suggestions.push("Try adding specific path filters using selectPaths");
	if (!selectDomains || Array.isArray(selectDomains) && selectDomains.length === 0) suggestions.push("Try adding domain filters using selectDomains");
	if (!excludeDomains || Array.isArray(excludeDomains) && excludeDomains.length === 0) suggestions.push("Try excluding specific domains using excludeDomains");
	return suggestions;
}
const inputSchema = zod_v3.z.object({
	url: zod_v3.z.string().describe("URL to crawl"),
	instructions: zod_v3.z.string().optional().describe("Natural language instructions for the crawler. Example: 'Python SDK'"),
	selectPaths: zod_v3.z.array(zod_v3.z.string()).optional().describe("Regex patterns to select only URLs with specific path patterns. Example: ['/api/v1.*']"),
	selectDomains: zod_v3.z.array(zod_v3.z.string()).optional().describe("Regex patterns to select only URLs from specific domains or subdomains. Example: ['^docs\\.example\\.com$']"),
	excludePaths: zod_v3.z.array(zod_v3.z.string()).optional().describe("Regex patterns to exclude URLs with specific path patterns. Example: ['/private/.*', '/admin/.*']"),
	excludeDomains: zod_v3.z.array(zod_v3.z.string()).optional().describe("Regex patterns to exclude specific domains or subdomains from crawling. Example: ['^private\\.example\\.com$']"),
	allowExternal: zod_v3.z.boolean().optional().describe("Whether to allow following links that go to external domains."),
	categories: zod_v3.z.array(zod_v3.z.enum([
		"Documentation",
		"Blog",
		"Blogs",
		"Community",
		"About",
		"Contact",
		"Privacy",
		"Terms",
		"Status",
		"Pricing",
		"Enterprise",
		"Careers",
		"E-Commerce",
		"Authentication",
		"Developer",
		"Developers",
		"Solutions",
		"Partners",
		"Downloads",
		"Media",
		"Events",
		"People"
	])).optional().describe("Filter URLs using predefined categories like 'Documentation', 'Blogs', etc.")
});
var TavilyCrawl = class extends __langchain_core_tools.StructuredTool {
	static lc_name() {
		return "tavily_crawl";
	}
	name = "tavily_crawl";
	description = "A powerful web crawler that initiates a structured web crawl starting from a specified base URL. The crawler uses a BFS Depth: refering to the number of link hops from the root URL. A page directly linked from the root is at BFS depth 1, regardless of its URL structure. You can control how deep and wide it goes, and guide it to focus on specific sections of the site.";
	schema = inputSchema;
	apiBaseUrl;
	extractDepth;
	includeImages;
	format;
	maxDepth;
	maxBreadth;
	limit;
	instructions;
	selectPaths;
	selectDomains;
	excludePaths;
	excludeDomains;
	allowExternal;
	categories;
	includeFavicon;
	includeUsage;
	apiWrapper;
	constructor(params = {}) {
		super(params);
		if (typeof params.name === "string") this.name = params.name;
		if (typeof params.description === "string") this.description = params.description;
		if (params.apiWrapper) this.apiWrapper = params.apiWrapper;
		else {
			const apiWrapperParams = {};
			if (params.tavilyApiKey) apiWrapperParams.tavilyApiKey = params.tavilyApiKey;
			if (params.apiBaseUrl) apiWrapperParams.apiBaseUrl = params.apiBaseUrl;
			this.apiWrapper = new require_utils.TavilyCrawlAPIWrapper(apiWrapperParams);
		}
		this.extractDepth = params.extractDepth;
		this.includeImages = params.includeImages;
		this.format = params.format;
		this.maxDepth = params.maxDepth;
		this.maxBreadth = params.maxBreadth;
		this.limit = params.limit;
		this.instructions = params.instructions;
		this.selectPaths = params.selectPaths;
		this.selectDomains = params.selectDomains;
		this.excludePaths = params.excludePaths;
		this.excludeDomains = params.excludeDomains;
		this.allowExternal = params.allowExternal;
		this.categories = params.categories;
		this.includeFavicon = params.includeFavicon;
		this.includeUsage = params.includeUsage;
	}
	async _call(input, _runManager) {
		try {
			const { url, instructions, selectPaths, selectDomains, excludePaths, excludeDomains, allowExternal, categories } = input;
			const effectiveExtractDepth = this.extractDepth;
			const effectiveIncludeImages = this.includeImages;
			const effectiveFormat = this.format;
			const effectiveMaxDepth = this.maxDepth;
			const effectiveMaxBreadth = this.maxBreadth;
			const effectiveLimit = this.limit;
			const effectiveInstructions = this.instructions ?? instructions;
			const effectiveSelectPaths = this.selectPaths ?? selectPaths;
			const effectiveSelectDomains = this.selectDomains ?? selectDomains;
			const effectiveExcludePaths = this.excludePaths ?? excludePaths;
			const effectiveExcludeDomains = this.excludeDomains ?? excludeDomains;
			const effectiveAllowExternal = this.allowExternal ?? allowExternal;
			const effectiveIncludeFavicon = this.includeFavicon;
			const effectiveIncludeUsage = this.includeUsage;
			let effectiveCategories;
			if (this.categories) effectiveCategories = Array.from(new Set(this.categories));
			else if (categories) effectiveCategories = Array.from(new Set(categories));
			else effectiveCategories = categories;
			const rawResults = await this.apiWrapper.rawResults({
				url,
				extractDepth: effectiveExtractDepth,
				includeImages: effectiveIncludeImages,
				format: effectiveFormat,
				maxDepth: effectiveMaxDepth,
				maxBreadth: effectiveMaxBreadth,
				limit: effectiveLimit,
				instructions: effectiveInstructions,
				selectPaths: effectiveSelectPaths,
				selectDomains: effectiveSelectDomains,
				excludePaths: effectiveExcludePaths,
				excludeDomains: effectiveExcludeDomains,
				allowExternal: effectiveAllowExternal,
				categories: effectiveCategories,
				includeFavicon: effectiveIncludeFavicon,
				includeUsage: effectiveIncludeUsage,
				chunksPerSource: 3
			});
			if (!rawResults || typeof rawResults !== "object" || !("results" in rawResults) || !Array.isArray(rawResults.results) || rawResults.results.length === 0) {
				const suggestions = generateSuggestions(input);
				const errorMessage = `No crawl results found for '${url}'. Suggestions: ${suggestions.join(", ")}. Try modifying your crawl parameters with one of these approaches.`;
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
exports.TavilyCrawl = TavilyCrawl;
//# sourceMappingURL=tavily-crawl.cjs.map
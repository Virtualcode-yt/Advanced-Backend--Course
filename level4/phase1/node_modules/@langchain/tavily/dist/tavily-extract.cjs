const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
const require_utils = require('./utils.cjs');
const __langchain_core_tools = require_rolldown_runtime.__toESM(require("@langchain/core/tools"));
const zod_v3 = require_rolldown_runtime.__toESM(require("zod/v3"));

//#region src/tavily-extract.ts
function generateSuggestions(params) {
	const suggestions = [];
	const { extractDepth } = params;
	if (extractDepth === "basic") suggestions.push("Try a more detailed extraction using 'advanced' extractDepth");
	return suggestions;
}
const inputSchema = zod_v3.z.object({
	urls: zod_v3.z.array(zod_v3.z.string()).describe("List of URLs to extract"),
	extractDepth: zod_v3.z.enum(["basic", "advanced"]).optional().describe(`Controls the thoroughness of web content extraction.

Use "basic" for faster extraction of main text content.

Use "advanced" (default) to retrieve comprehensive content including 
tables and embedded elements. Always use "advanced" for LinkedIn 
and YouTube URLs for optimal results.

Better for complex websites but may increase response time.`),
	includeImages: zod_v3.z.boolean().optional().describe(`Determines whether to extract and include images from the source URLs.

Set to True when visualizations are needed for better context or understanding.

Default is False (extracts text content only).`),
	query: zod_v3.z.string().optional().describe("User intent query for reranking extracted content chunks.")
});
var TavilyExtract = class extends __langchain_core_tools.StructuredTool {
	static lc_name() {
		return "tavily_extract";
	}
	name = "tavily_extract";
	description = "Extracts comprehensive content from web pages based on provided URLs. This tool retrieves raw text of a web page, with an option to include images. It supports two extraction depths: 'basic' for standard text extraction and 'advanced' for a more comprehensive extraction with higher success rate. Ideal for use cases such as content curation, data ingestion for NLP models, and automated information retrieval, this endpoint seamlessly integrates into your content processing pipeline. Input should be a list of one or more URLs.";
	schema = inputSchema;
	apiBaseUrl;
	extractDepth;
	includeImages;
	format;
	includeFavicon;
	includeUsage;
	query;
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
			this.apiWrapper = new require_utils.TavilyExtractAPIWrapper(apiWrapperParams);
		}
		this.extractDepth = params.extractDepth;
		this.includeImages = params.includeImages;
		this.format = params.format;
		this.includeFavicon = params.includeFavicon;
		this.includeUsage = params.includeUsage;
		this.query = params.query;
	}
	async _call(input, _runManager) {
		try {
			const { urls, extractDepth, includeImages, query } = input;
			const effectiveExtractDepth = this.extractDepth ?? extractDepth;
			const effectiveIncludeImages = this.includeImages ?? includeImages;
			const effectiveQuery = this.query ?? query;
			const rawResults = await this.apiWrapper.rawResults({
				urls,
				extractDepth: effectiveExtractDepth,
				includeImages: effectiveIncludeImages,
				format: this.format,
				includeFavicon: this.includeFavicon,
				includeUsage: this.includeUsage,
				query: effectiveQuery
			});
			if (!rawResults || typeof rawResults !== "object" || !("results" in rawResults) || !Array.isArray(rawResults.results) || rawResults.results.length === 0 || rawResults.failed_results && Array.isArray(rawResults.failed_results) && rawResults.failed_results.length === urls.length) {
				const searchParams = {
					extractDepth: effectiveExtractDepth,
					includeImages: effectiveIncludeImages,
					format: this.format,
					includeFavicon: this.includeFavicon,
					includeUsage: this.includeUsage
				};
				const suggestions = generateSuggestions(searchParams);
				const errorMessage = `No extracted results found for '${urls.join(", ")}'. Suggestions: ${suggestions.join(", ")}. Try modifying your extract parameters with one of these approaches.`;
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
exports.TavilyExtract = TavilyExtract;
//# sourceMappingURL=tavily-extract.cjs.map
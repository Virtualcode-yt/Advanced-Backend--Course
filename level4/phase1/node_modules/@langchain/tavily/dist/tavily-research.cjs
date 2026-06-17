const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
const require_utils = require('./utils.cjs');
const __langchain_core_tools = require_rolldown_runtime.__toESM(require("@langchain/core/tools"));
const zod_v3 = require_rolldown_runtime.__toESM(require("zod/v3"));

//#region src/tavily-research.ts
const outputSchemaPropertySchema = zod_v3.z.lazy(() => zod_v3.z.object({
	type: zod_v3.z.enum([
		"object",
		"string",
		"integer",
		"number",
		"array"
	]).optional(),
	description: zod_v3.z.string().optional(),
	properties: zod_v3.z.record(outputSchemaPropertySchema).optional(),
	items: zod_v3.z.object({ type: zod_v3.z.enum([
		"object",
		"string",
		"integer",
		"number",
		"array"
	]) }).optional()
}));
const inputSchema = zod_v3.z.object({
	input: zod_v3.z.string().describe("The research task or question to investigate."),
	model: zod_v3.z.enum([
		"mini",
		"pro",
		"auto"
	]).optional().describe(`The model used by the research agent. 
      "mini" is optimized for targeted, efficient research and works best for narrow or well-scoped questions. 
      "pro" provides comprehensive, multi-angle research and is suited for complex topics that span multiple subtopics or domains.
      "auto" lets Tavily automatically determine the appropriate model based on the task complexity.
      Default is "auto".
      `),
	outputSchema: zod_v3.z.object({
		properties: zod_v3.z.record(outputSchemaPropertySchema),
		required: zod_v3.z.array(zod_v3.z.string()).optional()
	}).optional().describe(`
      A JSON Schema object that defines the structure of the research output. 
      When provided, the research response will be structured to match this schema, ensuring a predictable and validated output shape. 
      Must include a 'properties' field, and may optionally include 'required' field.
      `),
	stream: zod_v3.z.boolean().optional().describe(`Whether to stream the research results as they are generated. 
      When 'true', returns a Server-Sent Events (SSE) stream.
      Default is false.
      `),
	citationFormat: zod_v3.z.enum([
		"numbered",
		"mla",
		"apa",
		"chicago"
	]).optional().describe(`The format for citations in the research report.
      Default is "numbered".`)
});
/**
* A Tool for performing comprehensive research with the Tavily Research API.
* Extends the StructuredTool class and provides an intelligent research agent
* that can answer complex questions and gather in-depth information.
*
* Authentication is handled via an API key, which can be passed during
* instantiation or set as an environment variable `TAVILY_API_KEY`.
*
* Example:
* ```typescript
* const tool = new TavilyResearch({
*   model: "pro",
*   citationFormat: "apa",
*   tavilyApiKey: "YOUR_API_KEY"
* });
* const results = await tool.invoke({
*   input: "What are the latest developments in quantum computing?"
* });
* console.log(results);
* ```
*/
var TavilyResearch = class extends __langchain_core_tools.StructuredTool {
	static lc_name() {
		return "TavilyResearch";
	}
	description = "Performs comprehensive research on a given topic using the Tavily Research API. This tool uses an intelligent research agent that can answer complex questions, gather in-depth information from multiple sources, and provide structured outputs. Useful for when you need to answer complex questions or gather comprehensive information about a subject. Input should be a research task or question.";
	name = "tavily_research";
	schema = inputSchema;
	apiBaseUrl;
	model;
	outputSchema;
	enableStream;
	citationFormat;
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
			this.apiWrapper = new require_utils.TavilyResearchAPIWrapper(apiWrapperParams);
		}
		this.model = params.model;
		this.outputSchema = params.outputSchema;
		this.enableStream = params.stream;
		this.citationFormat = params.citationFormat;
	}
	async _call(input, _runManager) {
		try {
			const { input: inputValue, model, outputSchema, stream, citationFormat } = input;
			const effectiveModel = this.model ?? model ?? "auto";
			const effectiveOutputSchema = this.outputSchema ?? outputSchema;
			const effectiveStream = this.enableStream ?? stream ?? false;
			const effectiveCitationFormat = this.citationFormat ?? citationFormat ?? "numbered";
			const result = await this.apiWrapper.rawResults({
				input: inputValue,
				model: effectiveModel,
				outputSchema: effectiveOutputSchema,
				stream: effectiveStream,
				citationFormat: effectiveCitationFormat
			});
			if (effectiveStream) return result;
			const queueResponse = result;
			if (!queueResponse || typeof queueResponse !== "object" || !("request_id" in queueResponse)) {
				const errorMessage = `Invalid research queue response for '${inputValue}'. Please try rephrasing your research question or adjusting the model.`;
				throw new Error(errorMessage);
			}
			return queueResponse;
		} catch (e) {
			const errorMessage = e && typeof e === "object" && "message" in e ? e.message : String(e);
			return { error: errorMessage };
		}
	}
};

//#endregion
exports.TavilyResearch = TavilyResearch;
//# sourceMappingURL=tavily-research.cjs.map
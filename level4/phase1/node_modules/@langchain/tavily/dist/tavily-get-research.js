import { TavilyResearchAPIWrapper } from "./utils.js";
import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod/v3";

//#region src/tavily-get-research.ts
const inputSchema = z.object({ requestId: z.string().describe("The unique identifier of the research task.") });
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
var TavilyGetResearch = class extends StructuredTool {
	static lc_name() {
		return "TavilyGetResearch";
	}
	description = "Retrieves the results of a research task by its request_id. Use this tool after creating a research task to get the completed research report, including the content, sources, and status. Input should be a request_id from a previously created research task.";
	name = "tavily_get_research";
	schema = inputSchema;
	apiBaseUrl;
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
			this.apiWrapper = new TavilyResearchAPIWrapper(apiWrapperParams);
		}
	}
	async _call(input, _runManager) {
		try {
			const { requestId } = input;
			const result = await this.apiWrapper.getResearch(requestId);
			if (!result || typeof result !== "object" || !("request_id" in result) || !("status" in result)) {
				const errorMessage = `Invalid research response for request_id '${requestId}'. Please verify the request_id is correct.`;
				throw new Error(errorMessage);
			}
			return result;
		} catch (e) {
			const errorMessage = e && typeof e === "object" && "message" in e ? e.message : String(e);
			return { error: errorMessage };
		}
	}
};

//#endregion
export { TavilyGetResearch };
//# sourceMappingURL=tavily-get-research.js.map
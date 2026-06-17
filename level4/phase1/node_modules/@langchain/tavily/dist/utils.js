import { getEnvironmentVariable } from "@langchain/core/utils/env";

//#region src/utils.ts
const TAVILY_BASE_URL = "https://api.tavily.com";
/**
* Base wrapper class with shared functionality for Tavily API wrappers.
*/
var BaseTavilyAPIWrapper = class {
	tavilyApiKey;
	apiBaseUrl;
	/**
	* Constructs a new instance of the BaseTavilyAPIWrapper.
	* @param fields The fields used to initialize the wrapper.
	*/
	constructor(fields) {
		const apiKey = fields.tavilyApiKey ?? getEnvironmentVariable("TAVILY_API_KEY");
		if (!apiKey) throw new Error("Tavily API key not found. Please provide it as an argument or set the TAVILY_API_KEY environment variable.");
		this.tavilyApiKey = apiKey;
		this.apiBaseUrl = fields.apiBaseUrl ?? TAVILY_BASE_URL;
	}
	/**
	* Converts camelCase keys to snake_case for API compatibility
	* @param params The parameters with camelCase keys
	* @returns The parameters with snake_case keys only
	*/
	convertCamelToSnakeCase(params) {
		const result = {};
		for (const [key, value] of Object.entries(params)) {
			if (value === void 0) continue;
			let newKey = key.replace(/^[A-Z]/, (letter) => letter.toLowerCase());
			newKey = newKey.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
			result[newKey] = value;
		}
		return result;
	}
};
/**
* A wrapper that encapsulates access to the Tavily Search API. Primarily used for testing.
*/
var TavilySearchAPIWrapper = class extends BaseTavilyAPIWrapper {
	async rawResults(params) {
		const headers = {
			Authorization: `Bearer ${this.tavilyApiKey}`,
			"Content-Type": "application/json"
		};
		const apiParams = this.convertCamelToSnakeCase(params);
		const response = await fetch(`${this.apiBaseUrl}/search`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				...apiParams,
				client_source: "langchain-js"
			})
		});
		if (!response.ok) {
			console.log(response);
			const errorData = await response.json();
			const errorMessage = errorData.detail?.error || "Unknown error";
			throw new Error(`Error ${response.status}: ${errorMessage}`);
		}
		return response.json();
	}
};
/**
* A wrapper that encapsulates access to the Tavily Extract API. Primarily used for testing.
*/
var TavilyExtractAPIWrapper = class extends BaseTavilyAPIWrapper {
	/**
	* Extracts content from one or more URLs using the Tavily Extract API.
	* @param params The parameters for the extraction. See {@link TavilyExtractParams}.
	* @returns The raw response body from the Tavily Extract API. See {@link TavilyExtractResponse}.
	*/
	async rawResults(params) {
		const headers = {
			Authorization: `Bearer ${this.tavilyApiKey}`,
			"Content-Type": "application/json"
		};
		const apiParams = this.convertCamelToSnakeCase(params);
		const response = await fetch(`${this.apiBaseUrl}/extract`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				...apiParams,
				client_source: "langchain-js"
			})
		});
		if (!response.ok) {
			const errorData = await response.json();
			const errorMessage = errorData.detail?.error || "Unknown error";
			throw new Error(`Error ${response.status}: ${errorMessage}`);
		}
		return response.json();
	}
};
/**
* A wrapper that encapsulates access to the Tavily Crawl API. Primarily used for testing.
*/
var TavilyCrawlAPIWrapper = class extends BaseTavilyAPIWrapper {
	/**
	* Crawls a list of URLs using the Tavily Crawl API.
	* @param params The parameters for the crawl. See {@link TavilyCrawlParams}.
	* @returns The raw response body from the Tavily Crawl API. See {@link TavilyCrawlResponse}.
	*/
	async rawResults(params) {
		const headers = {
			Authorization: `Bearer ${this.tavilyApiKey}`,
			"Content-Type": "application/json"
		};
		const apiParams = this.convertCamelToSnakeCase(params);
		const response = await fetch(`${this.apiBaseUrl}/crawl`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				...apiParams,
				client_source: "langchain-js"
			})
		});
		if (!response.ok) {
			const errorData = await response.json();
			const errorMessage = errorData.detail?.error || "Unknown error";
			throw new Error(`Error ${response.status}: ${errorMessage}`);
		}
		return response.json();
	}
};
/**
* A wrapper that encapsulates access to the Tavily Map API. Primarily used for testing.
*/
var TavilyMapAPIWrapper = class extends BaseTavilyAPIWrapper {
	/**
	* Maps a URL using the Tavily Map API.
	* @param params The parameters for the map. See {@link TavilyMapParams}.
	* @returns The raw response body from the Tavily Map API. See {@link TavilyMapResponse}.
	*/
	async rawResults(params) {
		const headers = {
			Authorization: `Bearer ${this.tavilyApiKey}`,
			"Content-Type": "application/json"
		};
		const apiParams = this.convertCamelToSnakeCase(params);
		const response = await fetch(`${this.apiBaseUrl}/map`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				...apiParams,
				client_source: "langchain-js"
			})
		});
		if (!response.ok) {
			const errorData = await response.json();
			const errorMessage = errorData.detail?.error || "Unknown error";
			throw new Error(`Error ${response.status}: ${errorMessage}`);
		}
		return response.json();
	}
};
/**
* A wrapper that encapsulates access to the Tavily Research API. Primarily used for testing.
*/
var TavilyResearchAPIWrapper = class extends BaseTavilyAPIWrapper {
	/**
	* Creates a research task using the Tavily Research API.
	* @param params The parameters for the research.
	* @returns The queued response with request_id, or an async generator if streaming.
	*/
	async rawResults(params) {
		const headers = {
			Authorization: `Bearer ${this.tavilyApiKey}`,
			"Content-Type": "application/json"
		};
		const apiParams = this.convertCamelToSnakeCase(params);
		if (params.stream) {
			const response = await fetch(`${this.apiBaseUrl}/research`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					...apiParams,
					client_source: "langchain-js"
				})
			});
			if (!response.ok) {
				const errorData = await response.json();
				const errorMessage = errorData.detail?.error || "Unknown error";
				throw new Error(`Error ${response.status}: ${errorMessage}`);
			}
			async function* streamGenerator() {
				if (!response.body) throw new Error("Response body is null");
				const reader = response.body.getReader();
				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						if (value) yield Buffer.from(value);
					}
				} finally {
					reader.releaseLock();
				}
			}
			return streamGenerator();
		} else {
			const response = await fetch(`${this.apiBaseUrl}/research`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					...apiParams,
					client_source: "langchain-js"
				})
			});
			if (!response.ok) {
				const errorData = await response.json();
				const errorMessage = errorData.detail?.error || "Unknown error";
				throw new Error(`Error ${response.status}: ${errorMessage}`);
			}
			return response.json();
		}
	}
	/**
	* Gets research results by request_id.
	* @param requestId The request ID from the queued research task.
	* @returns The research results.
	*/
	async getResearch(requestId) {
		const headers = {
			Authorization: `Bearer ${this.tavilyApiKey}`,
			"Content-Type": "application/json"
		};
		const response = await fetch(`${this.apiBaseUrl}/research/${requestId}`, {
			method: "GET",
			headers
		});
		if (!response.ok) {
			const errorData = await response.json();
			const errorMessage = errorData.detail?.error || "Unknown error";
			throw new Error(`Error ${response.status}: ${errorMessage}`);
		}
		return response.json();
	}
};

//#endregion
export { TavilyCrawlAPIWrapper, TavilyExtractAPIWrapper, TavilyMapAPIWrapper, TavilyResearchAPIWrapper, TavilySearchAPIWrapper };
//# sourceMappingURL=utils.js.map
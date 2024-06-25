import {ChatOpenAI} from "@langchain/openai";

export function initModel(model) {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const openaiBaseUrl = process.env.OPENAI_API_BASE;

    if (openaiApiKey) {
        const chatModel = new ChatOpenAI({apiKey: openaiApiKey, model:model,configuration: {
                        baseURL: openaiBaseUrl,}})
        return chatModel;
    } else {
        console.error("OpenAI API Key is not set.");
    }
}
//其他model,langchain只支持python，js还不支持,所以这里也先只支持openai

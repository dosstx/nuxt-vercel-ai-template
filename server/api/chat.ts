import OpenAI from "openai";
import { OpenAIStream } from "ai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import agents from "@/server/utils/agents";

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OpenAI API key");
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  return defineEventHandler(async (event) => {
    // Extract the `prompt` and `agent` from the body of the request
    const { messages, agent } = (await readBody(event)) as {
      messages: ChatCompletionMessageParam[];
      agent: keyof typeof agents; // Expecting one of the keys from the agents object
    };

    // Select the agent's system prompts
    const agentSystemMessages = agents[agent] || [];

    try {
      // Create a chat completion request with the system prompts and messages
      const request = {
        model: "gpt-4",
        stream: true,
        messages: [...agentSystemMessages, ...messages],
        temperature: 0.1,
        top_p: 0.24,
        frequency_penalty: 0,
        presence_penalty: 0.2,
        max_tokens: 430, // set this limit to length of assistants responses
      };

      // Send the request to OpenAI and get a response stream
      const response = await openai.chat.completions.create(request);

      // Return an OpenAIStream object that wraps the response stream
      return OpenAIStream(response);
    } catch (error) {
      console.error(error);
      // Return a 500 Internal Server Error response with a specific message
      return {
        status: 500,
        body: {
          error:
            "An error occurred while processing your request. Please try again later.",
        },
      };
    }
  });
});

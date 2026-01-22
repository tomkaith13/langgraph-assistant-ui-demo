import { GraphStateAnnotation } from '@/types/graph';
import { createOllamaClient } from '@/lib/ollama/client';

export async function chatNode(state: typeof GraphStateAnnotation.State) {
  const llm = createOllamaClient();

  // Get last 10 messages for context window
  const recentMessages = state.messages.slice(-10);

  // Invoke LLM with recent message history
  const response = await llm.invoke(recentMessages);

  return { messages: [response] };
}

// Helper to create streaming chat node
export async function* streamingChatNode(
  state: typeof GraphStateAnnotation.State
) {
  const llm = createOllamaClient();

  // Get last 10 messages for context window
  const recentMessages = state.messages.slice(-10);

  // Stream response from LLM
  const stream = await llm.stream(recentMessages);

  let fullContent = '';
  for await (const chunk of stream) {
    const content = chunk.content.toString();
    fullContent += content;
    yield content;
  }

  return fullContent;
}

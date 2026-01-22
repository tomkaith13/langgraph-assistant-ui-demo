import { StateGraph, START, END } from '@langchain/langgraph';
import { GraphStateAnnotation } from '@/types/graph';
import { chatNode } from './nodes/chatNode';

export function createChatGraph() {
  const graph = new StateGraph(GraphStateAnnotation)
    .addNode('chat', chatNode)
    .addEdge(START, 'chat')
    .addEdge('chat', END);

  return graph.compile();
}

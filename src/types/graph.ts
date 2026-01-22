import { MessagesAnnotation } from '@langchain/langgraph';

/** LangGraph state schema for chat processing */
export const GraphStateAnnotation = MessagesAnnotation;

export type GraphState = typeof GraphStateAnnotation.State;

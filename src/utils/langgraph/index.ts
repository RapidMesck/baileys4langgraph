import { Client } from "@langchain/langgraph-sdk";

const langClient = new Client({ apiUrl: process.env.LANGGRAPH_URL});

export { langClient }

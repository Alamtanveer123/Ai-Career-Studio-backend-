export interface InterviewQuestion {
  id: string;
  role: string;
  category: string;
  difficulty: 'Junior' | 'Mid-Level' | 'Senior' | 'Lead';
  question: string;
  context: string;
  expectedKeywords: string[];
  tips: string[];
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'fe-q1',
    role: 'Frontend Engineering',
    category: 'Architecture & Performance',
    difficulty: 'Senior',
    question: 'How do you diagnose and eliminate layout thrashing and unnecessary re-renders in a high-scale React application?',
    context: 'Users report sluggish scrolling and micro-stutters when monitoring live WebSocket feeds.',
    expectedKeywords: ['React DevTools Profiler', 'useMemo', 'useCallback', 'memo', 'Virtual DOM', 'composite layers', 'requestAnimationFrame', 'batching'],
    tips: ['Structure your response using STAR: Situation, Task, Action, and the measured Result (e.g. FPS improvement).']
  },
  {
    id: 'fe-q2',
    role: 'Frontend Engineering',
    category: 'State Management',
    difficulty: 'Mid-Level',
    question: 'Describe how you structure client-side state between server cache, global client state, and local component state.',
    context: 'Designing a multi-page dashboard with real-time updates and optimistic mutations.',
    expectedKeywords: ['TanStack Query', 'Zustand', 'optimistic updates', 'cache invalidation', 'ephemeral state', 'immutability'],
    tips: ['Distinguish between transient UI state and synchronized remote data.']
  },
  {
    id: 'be-q1',
    role: 'Backend Engineering',
    category: 'Distributed Systems',
    difficulty: 'Senior',
    question: 'How would you architect a distributed rate-limiting and token bucket service handling 500,000 requests per minute across multi-region clusters?',
    context: 'Preventing API abuse while keeping latency under 5 milliseconds.',
    expectedKeywords: ['Redis', 'sliding window', 'token bucket', 'concurrency', 'Lua script', 'latency', 'eventual consistency'],
    tips: ['Highlight how you handle clock skew, cache clustering, and graceful degradation during network partitions.']
  },
  {
    id: 'be-q2',
    role: 'Backend Engineering',
    category: 'Database Optimization',
    difficulty: 'Senior',
    question: 'Walk through how you investigate and optimize a slow query running against a multi-million row table in production PostgreSQL or MongoDB.',
    context: 'P99 read latency spikes to 3.5 seconds during peak traffic hours.',
    expectedKeywords: ['EXPLAIN ANALYZE', 'indexes', 'B-Tree', 'composite index', 'table scan', 'connection pool', 'read replicas'],
    tips: ['Explain the step-by-step diagnostic workflow: monitoring, query plan inspection, index design, and verification.']
  },
  {
    id: 'fs-q1',
    role: 'Full Stack Engineering',
    category: 'System Design',
    difficulty: 'Senior',
    question: 'How do you design an end-to-end real-time collaborative document editor or status tracker from database schema to web socket frontend?',
    context: 'Multiple concurrent users editing shared pipelines simultaneously without data loss.',
    expectedKeywords: ['WebSockets', 'CRDT', 'OT', 'optimistic UI', 'heartbeat', 'reconnection logic', 'PostgreSQL / Redis'],
    tips: ['Focus on conflict resolution and connection recovery on unstable mobile networks.']
  },
  {
    id: 'ai-q1',
    role: 'AI / Machine Learning',
    category: 'LLM Systems & RAG',
    difficulty: 'Senior',
    question: 'How do you design a production-grade Retrieval-Augmented Generation (RAG) pipeline with hybrid search, re-ranking, and low hallucination rates?',
    context: 'Parsing complex PDF enterprise technical documents for customer query resolution.',
    expectedKeywords: ['chunking strategies', 'embeddings', 'vector database', 'hybrid search', 'BM25', 'cross-encoder reranking', 'evaluation framework'],
    tips: ['Discuss semantic chunking, metadata filtering, and continuous guardrails for grounded responses.']
  },
];

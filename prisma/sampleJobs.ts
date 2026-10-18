export interface RawJob {
  id: string;
  title: string;
  company: string;
  companyTagline?: string;
  location: string;
  experienceLevel: string;
  jobType: string;
  category: string;
  salaryMinLpa: number;
  salaryMaxLpa: number;
  postedDate: string;
  skills: string[];
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  matchScore: number;
  isFeatured?: boolean;
}

export const SAMPLE_JOBS: RawJob[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer (React / TypeScript)',
    company: 'Kaveri Cloud Labs',
    companyTagline: 'Distributed high-throughput cloud infrastructure and edge runtime systems',
    location: 'Bengaluru',
    experienceLevel: 'Senior (5-8 yrs)',
    jobType: 'Full-time',
    category: 'Frontend Engineering',
    salaryMinLpa: 28,
    salaryMaxLpa: 42,
    postedDate: '2026-10-12',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'State Machines', 'Performance Optimization'],
    description: 'Lead the frontend architecture of our next-gen cloud telemetry console. You will work on real-time canvas rendering, low-latency WebSocket streams, and modular design systems.',
    requirements: [
      '5+ years crafting large-scale frontend applications with modern React and TypeScript.',
      'Deep understanding of browser rendering pipelines, Web Workers, and bundle optimization.',
      'Experience with design systems, accessible UI patterns (WCAG 2.1 AA), and state management.',
      'Strong intuition for developer UX and micro-frontend federation.'
    ],
    responsibilities: [
      'Architect resilient frontend architectures for 100k+ daily telemetry users.',
      'Collaborate with backend engineers to define ultra-efficient GraphQL/gRPC-web contracts.',
      'Mentor junior and mid-level engineers through code reviews and architecture teardowns.'
    ],
    benefits: ['Comprehensive health insurance (₹15 Lakhs)', 'Annual learning stipend ₹75,000', 'ESOP grants', 'Flexible hybrid (2 days WFH)'],
    matchScore: 96,
    isFeatured: true,
  },
  {
    id: 'job-2',
    title: 'Full Stack AI Product Engineer',
    company: 'Moksha AI Labs',
    companyTagline: 'Multimodal Indic language models and enterprise LLM inference pipelines',
    location: 'Bengaluru',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    jobType: 'Full-time',
    category: 'AI / Machine Learning',
    salaryMinLpa: 22,
    salaryMaxLpa: 35,
    postedDate: '2026-10-14',
    skills: ['React', 'Python', 'FastAPI', 'LangChain', 'Vector DBs', 'PostgreSQL', 'TypeScript'],
    description: 'Build user-facing generative AI copilots and agentic interfaces for enterprise voice and text automation across 12 Indian regional languages.',
    requirements: [
      '3+ years full-stack experience spanning modern React and Python backend services.',
      'Hands-on experience deploying LLM apps (RAG pipelines, embeddings, prompt engineering).',
      'Solid foundations in REST API design, streaming tokens (SSE), and async workflows.',
      'Familiarity with Pinecone, Qdrant, or pgvector.'
    ],
    responsibilities: [
      'Develop reactive streaming chat interfaces and human-in-the-loop review screens.',
      'Implement prompt evaluation benches and latency reduction caches.',
      'Partner with ML researchers to ship prototype models directly into customer hands.'
    ],
    benefits: ['Unlimited wellness days', 'Remote equipment allowance', 'Competitive stock units', 'Premium health cover for family'],
    matchScore: 92,
    isFeatured: true,
  },
  {
    id: 'job-3',
    title: 'Backend Platform Engineer (Go / Distributed Systems)',
    company: 'IndusPay Technologies',
    companyTagline: 'Next-generation UPI merchant infrastructure and cross-border settlement rails',
    location: 'Mumbai',
    experienceLevel: 'Senior (5-8 yrs)',
    jobType: 'Full-time',
    category: 'Backend Engineering',
    salaryMinLpa: 30,
    salaryMaxLpa: 48,
    postedDate: '2026-10-10',
    skills: ['Go', 'Kafka', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes', 'Microservices'],
    description: 'Engineer high-throughput transactional cores handling over 5,000 UPI transactions per second with strict P99 latency guarantees under 120ms.',
    requirements: [
      '5+ years building distributed backend systems in Go or Java.',
      'Strong grasp of distributed consensus, idempotency patterns, and event-driven design.',
      'Experience tuning PostgreSQL queries, partition strategies, and connection pooling.',
      'Hands-on with Apache Kafka or Pulsar in high-volume production setups.'
    ],
    responsibilities: [
      'Design fault-tolerant settlement engines and reconciliation pipelines.',
      'Ensure zero data loss and automated disaster recovery across multi-region VPCs.',
      'Participate in on-call rotation and high-severity incident reviews.'
    ],
    benefits: ['₹50 Lakhs term insurance', 'Relocation assistance to Mumbai', 'Quarterly performance bonuses', 'Gym reimbursement'],
    matchScore: 89,
    isFeatured: true,
  },
  {
    id: 'job-4',
    title: 'Frontend Developer (UI/UX & Design Systems)',
    company: 'Deccan Dynamics',
    companyTagline: 'Autonomous robotics and smart warehouse automation systems',
    location: 'Hyderabad',
    experienceLevel: 'Junior (1-3 yrs)',
    jobType: 'Full-time',
    category: 'Frontend Engineering',
    salaryMinLpa: 12,
    salaryMaxLpa: 18,
    postedDate: '2026-10-13',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Storybook', 'HTML5/CSS3'],
    description: 'Craft visual control dashboards for factory floor robotics fleets. Transform Figma wireframes into interactive, responsive React components.',
    requirements: [
      '1-3 years frontend development experience with React and modern CSS.',
      'Keen eye for aesthetic details, animations, and micro-interactions.',
      'Experience building component libraries in Storybook with Tailwind CSS.',
      'Familiarity with SVG manipulation and responsive web app layout.'
    ],
    responsibilities: [
      'Implement shared UI tokens and reusable design system components.',
      'Build telemetry visualization widgets (gauges, charts, heatmaps).',
      'Optimize bundle size and ensure smooth 60fps rendering across tablets and desktop monitors.'
    ],
    benefits: ['Cab transport within Hyderabad', 'Free catered lunches', 'Annual medical checkup', 'Learning allowance'],
    matchScore: 87,
    isFeatured: true,
  },
  {
    id: 'job-5',
    title: 'DevOps & Cloud Infrastructure Engineer',
    company: 'ZenithOps Cloud',
    companyTagline: 'Zero-trust infrastructure access and Kubernetes observability suite',
    location: 'Bengaluru',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    jobType: 'Full-time',
    category: 'DevOps & Cloud',
    salaryMinLpa: 20,
    salaryMaxLpa: 32,
    postedDate: '2026-10-11',
    skills: ['Terraform', 'AWS', 'Kubernetes', 'CI/CD', 'Prometheus', 'Helm', 'Python'],
    description: 'Automate multi-tenant cloud environments across AWS and GCP using GitOps principles and zero-trust networking.',
    requirements: [
      '3+ years administering Linux environments and Kubernetes clusters.',
      'Strong Terraform scripting skills for multi-account infrastructure.',
      'Experience setting up ArgoCD or GitLab CI pipelines with automated security scans.',
      'Knowledge of Grafana, Prometheus, and distributed tracing.'
    ],
    responsibilities: [
      'Maintain 99.99% uptime for core production Kubernetes clusters.',
      'Implement automated vulnerability scanning and automated compliance rules.',
      'Collaborate with developers to streamline container build times.'
    ],
    benefits: ['WFH setup allowance ₹50,000', 'Internet reimbursement', 'Mental health support sessions', 'Generous equity options'],
    matchScore: 84,
    isFeatured: false,
  },
  {
    id: 'job-6',
    title: 'Data Platform Engineer (Streaming & PySpark)',
    company: 'Sahyadri Data Systems',
    companyTagline: 'Petabyte-scale real-time streaming analytics engine for modern enterprises',
    location: 'Pune',
    experienceLevel: 'Senior (5-8 yrs)',
    jobType: 'Full-time',
    category: 'Backend Engineering',
    salaryMinLpa: 26,
    salaryMaxLpa: 40,
    postedDate: '2026-10-09',
    skills: ['PySpark', 'Apache Flink', 'Kafka', 'Python', 'Delta Lake', 'SQL', 'Airflow'],
    description: 'Construct real-time streaming data ingestion pipelines crunching 20TB+ daily event logs for enterprise fraud prevention.',
    requirements: [
      '5+ years with large-scale data engineering in Spark, Flink, or Trino.',
      'Proficiency in Python and Scala with solid data modeling principles.',
      'Proven experience tuning memory footprints and partition skew in distributed data sets.',
      'Deep expertise in Apache Kafka topic architectures.'
    ],
    responsibilities: [
      'Build end-to-end streaming pipelines with low-latency joins and aggregation.',
      'Manage Apache Airflow DAGs with idempotent processing standards.',
      'Write automated data quality validation suites with Great Expectations.'
    ],
    benefits: ['Hybrid policy (Pune Hinjawadi hub)', 'Flexible work hours', 'Childcare support', 'Annual performance bonus'],
    matchScore: 82,
    isFeatured: false,
  },
  {
    id: 'job-7',
    title: 'Mobile App Engineer (React Native)',
    company: 'Samudra HealthTech',
    companyTagline: 'Connected diagnostic hardware and clinical telemetry workflows',
    location: 'Chennai',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    jobType: 'Full-time',
    category: 'Mobile Development',
    salaryMinLpa: 16,
    salaryMaxLpa: 26,
    postedDate: '2026-10-15',
    skills: ['React Native', 'TypeScript', 'Redux Toolkit', 'Bluetooth Low Energy (BLE)', 'iOS/Android Native'],
    description: 'Develop patient and clinician companion mobile apps interfacing with IoT diagnostic sensors via Bluetooth Low Energy.',
    requirements: [
      '3+ years crafting production mobile apps with React Native.',
      'Experience with BLE protocols, background synchronization, and offline-first storage.',
      'Understanding of App Store and Google Play compliance standards.',
      'Proficiency in native bridging for iOS (Swift) and Android (Kotlin).'
    ],
    responsibilities: [
      'Build intuitive, accessible mobile screens for geriatric health monitoring.',
      'Maintain offline synchronization caches with WatermelonDB or SQLite.',
      'Ensure bulletproof crash-free sessions exceeding 99.8%.'
    ],
    benefits: ['Health coverage for parents and in-laws', 'Annual vacation subsidy', 'Fitness allowance', 'Casual dress code'],
    matchScore: 80,
    isFeatured: false,
  },
  {
    id: 'job-8',
    title: 'Full Stack Software Engineer',
    company: 'BharatLogix Networks',
    companyTagline: 'AI-assisted multimodal freight routing and cold-chain supply intelligence',
    location: 'Delhi NCR',
    experienceLevel: 'Junior (1-3 yrs)',
    jobType: 'Full-time',
    category: 'Full Stack Engineering',
    salaryMinLpa: 14,
    salaryMaxLpa: 20,
    postedDate: '2026-10-13',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'REST APIs', 'Docker'],
    description: 'Build logistics dispatch interfaces and driver milestone tracking portals for Indian interstate trucking routes.',
    requirements: [
      '1-3 years full stack software development experience in Node.js and React.',
      'Comfortable writing clean, modular RESTful APIs and database schemas.',
      'Familiarity with containerization and continuous delivery.',
      'Good communication skills and proactive problem-solving attitude.'
    ],
    responsibilities: [
      'Implement real-time GPS tracking map views using Mapbox/Leaflet and React.',
      'Create backend endpoints for bill of lading document verification.',
      'Write end-to-end and unit tests with Jest and Playwright.'
    ],
    benefits: ['Gurugram cyber hub modern campus', 'Metro pass subsidy', 'Team outings & hackathons', 'Health insurance'],
    matchScore: 85,
    isFeatured: false,
  },
  {
    id: 'job-9',
    title: 'Lead AI & Computer Vision Engineer',
    company: 'Vyom Aeronautics & Satellites',
    companyTagline: 'Commercial payload communications and satellite telemetry software',
    location: 'Bengaluru',
    experienceLevel: 'Lead / Architect (8+ yrs)',
    jobType: 'Full-time',
    category: 'AI / Machine Learning',
    salaryMinLpa: 45,
    salaryMaxLpa: 70,
    postedDate: '2026-10-08',
    skills: ['PyTorch', 'Computer Vision', 'CUDA', 'C++', 'TensorRT', 'Satellite Imagery', 'Docker'],
    description: 'Spearhead Earth observation image segmentation pipelines for agricultural yield estimation and disaster monitoring.',
    requirements: [
      '8+ years developing and deploying machine learning models into production.',
      'Specialized expertise in multi-spectral computer vision, geospatial data (GDAL), and PyTorch.',
      'Experience optimizing deep neural networks for edge inference using TensorRT and ONNX.',
      'Record of patent filings or published research in CVPR/ICCV is a strong plus.'
    ],
    responsibilities: [
      'Direct our 6-person computer vision research and engineering pod.',
      'Architect low-latency tile processing pipelines for terabyte-sized satellite passes.',
      'Collaborate with national space agency partners on payload software specs.'
    ],
    benefits: ['Substantial founder-pool ESOPs', 'Comprehensive health & life coverage', 'Relocation package', 'Conference sponsorship'],
    matchScore: 78,
    isFeatured: false,
  },
  {
    id: 'job-10',
    title: 'Backend Engineer (Node.js & Microservices)',
    company: 'Chola FinTech Core',
    companyTagline: 'Micro-lending algorithmic underwriting and rural banking API platform',
    location: 'Chennai',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    jobType: 'Full-time',
    category: 'Backend Engineering',
    salaryMinLpa: 18,
    salaryMaxLpa: 28,
    postedDate: '2026-10-14',
    skills: ['Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'RabbitMQ', 'TypeScript'],
    description: 'Implement micro-lending loan disbursement rails and credit bureau integration services for Tier 2/3 city borrowers.',
    requirements: [
      '3-5 years backend development in Node.js/NestJS with strict TypeScript.',
      'Experience integrating 3rd party APIs, webhook consumers, and financial data protocols.',
      'Strong command over PostgreSQL transactional boundaries and indexing.',
      'Familiarity with message queues like RabbitMQ or SQS.'
    ],
    responsibilities: [
      'Build automated KYC verification endpoints with e-Sign integrations.',
      'Optimize query throughput on high-cardinality ledger tables.',
      'Maintain rigorous audit logs for compliance with RBI guidelines.'
    ],
    benefits: ['OMR IT corridor office', 'Transport facility', 'Medical insurance for dependents', 'Certification reimbursement'],
    matchScore: 83,
    isFeatured: false,
  },
  {
    id: 'job-11',
    title: 'Senior Product Designer (UI/UX & Design Systems)',
    company: 'Kaveri Cloud Labs',
    companyTagline: 'Distributed high-throughput cloud infrastructure and edge runtime systems',
    location: 'Remote (India)',
    experienceLevel: 'Senior (5-8 yrs)',
    jobType: 'Remote',
    category: 'Product & Design',
    salaryMinLpa: 25,
    salaryMaxLpa: 38,
    postedDate: '2026-10-11',
    skills: ['Figma', 'Design Systems', 'User Research', 'Wireframing', 'Prototyping', 'Design Tokens'],
    description: 'Own the visual and interaction design for developer-facing observability tools. Turn complex infrastructure data into crisp, delightful user interfaces.',
    requirements: [
      '5+ years designing enterprise SaaS or complex technical web applications.',
      'Demonstrated portfolio showing end-to-end design from user interviews to shipped Figma components.',
      'Deep fluency with auto-layout, component variables, and design tokens in Figma.',
      'Ability to communicate clearly with frontend engineers and articulate tradeoffs.'
    ],
    responsibilities: [
      'Maintain and elevate the company design system across all web touchpoints.',
      'Conduct regular customer interviews with cloud architects and SREs.',
      'Prototype animations and interaction patterns for data-dense dashboards.'
    ],
    benefits: ['100% remote anywhere in India', 'Annual co-working pass stipend', 'Top-spec MacBook Pro', 'Flexible hours'],
    matchScore: 79,
    isFeatured: false,
  },
  {
    id: 'job-12',
    title: 'Frontend Engineer (React / Next.js)',
    company: 'Sahyadri Data Systems',
    companyTagline: 'Petabyte-scale real-time streaming analytics engine for modern enterprises',
    location: 'Pune',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    jobType: 'Full-time',
    category: 'Frontend Engineering',
    salaryMinLpa: 18,
    salaryMaxLpa: 28,
    postedDate: '2026-10-12',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'D3.js'],
    description: 'Craft dynamic analytical query visualizers, data lineage graphs, and custom SQL editors for data engineers.',
    requirements: [
      '3+ years crafting responsive web apps with React and TypeScript.',
      'Practical knowledge of data visualization libraries (D3.js, Chart.js, or Recharts).',
      'Solid state management skills with Zustand or Redux.',
      'Appreciation for clean code, automated tests, and accessible UI.'
    ],
    responsibilities: [
      'Build performant interactive graph visualizations for 10,000+ data pipeline nodes.',
      'Integrate Monaco Editor for in-browser SQL authoring with syntax validation.',
      'Optimize bundle size and render times for heavy analytical dashboards.'
    ],
    benefits: ['Pune metro connectivity', 'Annual health checkup', 'Lunch & snacks provided', 'Bonus plan'],
    matchScore: 91,
    isFeatured: false,
  },
  {
    id: 'job-13',
    title: 'Associate Software Engineer - Fresher (React & JS)',
    company: 'Deccan Dynamics',
    companyTagline: 'Autonomous robotics and smart warehouse automation systems',
    location: 'Hyderabad',
    experienceLevel: 'Fresher (0-1 yrs)',
    jobType: 'Full-time',
    category: 'Frontend Engineering',
    salaryMinLpa: 8,
    salaryMaxLpa: 12,
    postedDate: '2026-10-15',
    skills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git', 'Problem Solving'],
    description: 'Exciting opportunity for 2025/2026 graduates to break into software development. Join our accelerator program and work alongside senior architects.',
    requirements: [
      'B.Tech / B.E. / MCA in Computer Science or related degree (2025/2026 batch).',
      'Strong fundamentals in Data Structures, Algorithms, and Object-Oriented principles.',
      'Hands-on personal or academic projects built using React and modern JavaScript.',
      'Eager learner with strong communication and collaborative spirit.'
    ],
    responsibilities: [
      'Assist in developing internal management portals and documentation sites.',
      'Write clean, well-tested unit tests for UI components.',
      'Participate in daily standups and engineering training workshops.'
    ],
    benefits: ['Dedicated 6-month mentorship program', 'Free transport', 'Fast-track promotion cycle', 'Health insurance'],
    matchScore: 88,
    isFeatured: false,
  },
  {
    id: 'job-14',
    title: 'Senior DevOps Architect (Multi-Cloud & Security)',
    company: 'IndusPay Technologies',
    companyTagline: 'Next-generation UPI merchant infrastructure and cross-border settlement rails',
    location: 'Mumbai',
    experienceLevel: 'Senior (5-8 yrs)',
    jobType: 'Full-time',
    category: 'DevOps & Cloud',
    salaryMinLpa: 35,
    salaryMaxLpa: 52,
    postedDate: '2026-10-07',
    skills: ['Kubernetes', 'AWS', 'GCP', 'Terraform', 'Vault', 'PCI-DSS', 'Go'],
    description: 'Lead banking-grade cloud security, zero-trust infrastructure, and automated PCI-DSS compliance audits for our payment switch.',
    requirements: [
      '6+ years in DevOps/Infrastructure roles within FinTech or high-security domains.',
      'Comprehensive expertise with HashiCorp Vault, Kubernetes RBAC, and network policies.',
      'Hands-on experience architecting disaster recovery setups with multi-cloud failover.',
      'Proficiency in scripting in Go or Python.'
    ],
    responsibilities: [
      'Oversee infrastructure security posture and audit compliance.',
      'Design automated ephemeral testing environments for 40+ engineering teams.',
      'Drive cloud cost optimization initiatives across AWS and Azure instances.'
    ],
    benefits: ['Retention bonus', 'Executive health plan', 'Home office budget ₹1,00,000', 'Gratuity benefits'],
    matchScore: 76,
    isFeatured: false,
  },
  {
    id: 'job-15',
    title: 'Generative AI Research Engineer',
    company: 'Moksha AI Labs',
    companyTagline: 'Multimodal Indic language models and enterprise LLM inference pipelines',
    location: 'Bengaluru',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    jobType: 'Full-time',
    category: 'AI / Machine Learning',
    salaryMinLpa: 28,
    salaryMaxLpa: 45,
    postedDate: '2026-10-14',
    skills: ['PyTorch', 'Transformers', 'LoRA', 'vLLM', 'Python', 'Quantization', 'NLP'],
    description: 'Fine-tune small language models (SLMs) and optimize inference latency for edge deployment on low-spec Android devices in rural India.',
    requirements: [
      '3+ years practical NLP experience with Hugging Face transformers.',
      'Proven hands-on work with parameter-efficient fine-tuning (LoRA, QLoRA, AWQ).',
      'Familiarity with high-throughput inference engines like vLLM, TensorRT-LLM, or llama.cpp.',
      'Strong Python coding standards and distributed GPU cluster experience (Slurm/Ray).'
    ],
    responsibilities: [
      'Train and evaluate Indic multilingual tokenizer models.',
      'Implement structured output validation pipelines (JSON schema constrained decoding).',
      'Publish technical blogs and open-source models under permissively licensed repos.'
    ],
    benefits: ['Direct GPU access on top-tier clusters', 'Conference travel grants', 'Flexible work from home', 'Top-tier health cover'],
    matchScore: 94,
    isFeatured: true,
  },
  {
    id: 'job-16',
    title: 'Full Stack Engineer (TypeScript & Next.js)',
    company: 'Samudra HealthTech',
    companyTagline: 'Connected diagnostic hardware and clinical telemetry workflows',
    location: 'Remote (India)',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    jobType: 'Remote',
    category: 'Full Stack Engineering',
    salaryMinLpa: 20,
    salaryMaxLpa: 30,
    postedDate: '2026-10-10',
    skills: ['Next.js', 'React', 'Node.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    description: 'Build web portals used by diagnostic lab technicians and doctors to generate automated pathology reports.',
    requirements: [
      '3-5 years full-stack experience using React/Next.js and Node.js.',
      'Solid schema modeling with PostgreSQL and ORMs like Prisma or Drizzle.',
      'Experience building responsive, intuitive form workflows with client-side validation.',
      'Understanding of data privacy regulations (HIPAA / DISHA).'
    ],
    responsibilities: [
      'Develop dynamic PDF generation pipelines for blood test reports.',
      'Create role-based access control (RBAC) screens for lab admins and radiologists.',
      'Maintain automated integration test suites.'
    ],
    benefits: ['100% remote India-wide', 'Ergonomic chair and desk subsidy', 'Annual team retreats in Goa', 'Health insurance'],
    matchScore: 86,
    isFeatured: false,
  },
  {
    id: 'job-17',
    title: 'Backend Go Engineer (Low-latency APIs)',
    company: 'ZenithOps Cloud',
    companyTagline: 'Zero-trust infrastructure access and Kubernetes observability suite',
    location: 'Bengaluru',
    experienceLevel: 'Junior (1-3 yrs)',
    jobType: 'Full-time',
    category: 'Backend Engineering',
    salaryMinLpa: 14,
    salaryMaxLpa: 22,
    postedDate: '2026-10-13',
    skills: ['Go', 'gRPC', 'Protobuf', 'PostgreSQL', 'Docker', 'Linux'],
    description: 'Work on daemon agents and gRPC gateways collecting node metrics and event traces from customer Kubernetes clusters.',
    requirements: [
      '1-3 years experience writing performant Go services.',
      'Good understanding of concurrency primitives (goroutines, channels, sync packages).',
      'Familiarity with gRPC, Protocol Buffers, and socket communication.',
      'Enthusiastic about systems programming and Linux internals.'
    ],
    responsibilities: [
      'Build lightweight metric collectors with low CPU and memory footprints.',
      'Write comprehensive unit and benchmark tests.',
      'Document API schemas and developer guides.'
    ],
    benefits: ['Koramangala prime office location', 'Snacks and beverages', 'Book allowance', 'Comprehensive health coverage'],
    matchScore: 85,
    isFeatured: false,
  },
  {
    id: 'job-18',
    title: 'Cloud Security Analyst / Engineer',
    company: 'BharatLogix Networks',
    companyTagline: 'AI-assisted multimodal freight routing and cold-chain supply intelligence',
    location: 'Delhi NCR',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    jobType: 'Full-time',
    category: 'DevOps & Cloud',
    salaryMinLpa: 18,
    salaryMaxLpa: 28,
    postedDate: '2026-10-09',
    skills: ['AWS Security', 'SIEM', 'SOC2', 'Vulnerability Assessment', 'Python', 'IAM'],
    description: 'Protect supply-chain logistics infrastructure from cyber threats, unauthorized API calls, and supply chain disruptions.',
    requirements: [
      '3+ years in cloud security, threat monitoring, or penetration testing.',
      'Familiarity with AWS GuardDuty, Security Hub, and CloudTrail analysis.',
      'Knowledge of SOC2 compliance standards and third-party vendor risk assessments.',
      'Ability to write automation scripts in Python or Bash.'
    ],
    responsibilities: [
      'Monitor and triage security alerts in our SIEM platform.',
      'Perform regular dependency vulnerability scans and penetration audits.',
      'Conduct security awareness training for product teams.'
    ],
    benefits: ['Gurugram cyber city shuttle', 'Meal vouchers', 'Parental leave benefits', 'Yearly performance incentive'],
    matchScore: 74,
    isFeatured: false,
  },
  {
    id: 'job-19',
    title: 'Frontend React Developer (Internship)',
    company: 'Kaveri Cloud Labs',
    companyTagline: 'Distributed high-throughput cloud infrastructure and edge runtime systems',
    location: 'Bengaluru',
    experienceLevel: 'Fresher (0-1 yrs)',
    jobType: 'Internship',
    category: 'Frontend Engineering',
    salaryMinLpa: 6,
    salaryMaxLpa: 9,
    postedDate: '2026-10-15',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'Tailwind CSS'],
    description: '6-month full-time internship for final-year students or recent graduates with potential conversion to full-time SDE-1.',
    requirements: [
      'Currently pursuing or recently completed B.E./B.Tech in Computer Science or IT.',
      'Strong grasp of JavaScript ES6+ syntax and React fundamentals (hooks, state, props).',
      'Portfolio of personal web apps or GitHub contributions.',
      'Available to work from our Bengaluru office 3 days a week.'
    ],
    responsibilities: [
      'Assist in implementing UI components using our Tailwind design library.',
      'Fix UI bugs, improve keyboard accessibility, and write unit tests.',
      'Participate in team code reviews.'
    ],
    benefits: ['Monthly stipend ₹50,000 / month', 'PPO opportunity for high performers', 'Free snacks & drinks', 'Certificate of internship'],
    matchScore: 90,
    isFeatured: false,
  },
  {
    id: 'job-20',
    title: 'Senior Python Backend Architect',
    company: 'Deccan Dynamics',
    companyTagline: 'Autonomous robotics and smart warehouse automation systems',
    location: 'Hyderabad',
    experienceLevel: 'Senior (5-8 yrs)',
    jobType: 'Full-time',
    category: 'Backend Engineering',
    salaryMinLpa: 32,
    salaryMaxLpa: 48,
    postedDate: '2026-10-06',
    skills: ['Python', 'FastAPI', 'Redis', 'PostgreSQL', 'Docker', 'Celery', 'System Design'],
    description: 'Architect the fleet coordination orchestration engine for 2,000+ autonomous mobile robots roaming fulfilment centers.',
    requirements: [
      '6+ years developing high-reliability backend systems in Python (FastAPI/Django).',
      'Deep experience with asynchronous programming (asyncio, Celery, Redis queues).',
      'Strong foundation in distributed locking, state synchronization, and graph algorithms.',
      'Familiarity with simulation platforms (ROS, Gazebo) is a major bonus.'
    ],
    responsibilities: [
      'Lead design reviews for the robot navigation command broker.',
      'Optimize database queries and implement multi-layer caching with Redis.',
      'Mentor senior engineers on clean architecture and fault isolation.'
    ],
    benefits: ['Hitec City campus', 'Gym and sports facilities', 'Stock grants', 'Full family medical cover'],
    matchScore: 81,
    isFeatured: false,
  },
  {
    id: 'job-21',
    title: 'Lead Product Manager (FinTech Platform)',
    company: 'Chola FinTech Core',
    companyTagline: 'Micro-lending algorithmic underwriting and rural banking API platform',
    location: 'Chennai',
    experienceLevel: 'Lead / Architect (8+ yrs)',
    jobType: 'Full-time',
    category: 'Product & Design',
    salaryMinLpa: 38,
    salaryMaxLpa: 60,
    postedDate: '2026-10-05',
    skills: ['Product Strategy', 'FinTech', 'API Design', 'Roadmapping', 'User Research', 'Data Analytics'],
    description: 'Drive the product roadmap for our developer-facing open banking APIs and digital identity verification products.',
    requirements: [
      '8+ years in product management with at least 3 years in Indian FinTech/Payments.',
      'Demonstrated success taking API products from zero to scaled adoption.',
      'Solid technical depth to converse comfortably with engineering leads.',
      'Strong analytical mindset with proficiency in SQL and analytics suites.'
    ],
    responsibilities: [
      'Define quarterly OKRs and prioritize backlog for 3 cross-functional pods.',
      'Interface with partner banks, regulators, and enterprise clients.',
      'Translate complex regulatory requirements into intuitive developer specs.'
    ],
    benefits: ['Executive health insurance', 'Performance incentive bonus', 'Car allowance', 'Leadership development coaching'],
    matchScore: 72,
    isFeatured: false,
  },
  {
    id: 'job-22',
    title: 'Full Stack Engineer (React + Go)',
    company: 'Sahyadri Data Systems',
    companyTagline: 'Petabyte-scale real-time streaming analytics engine for modern enterprises',
    location: 'Pune',
    experienceLevel: 'Senior (5-8 yrs)',
    jobType: 'Full-time',
    category: 'Full Stack Engineering',
    salaryMinLpa: 28,
    salaryMaxLpa: 44,
    postedDate: '2026-10-10',
    skills: ['Go', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'GraphQL'],
    description: 'Build enterprise administrative control panels and data governance engines powering petabyte data lakes.',
    requirements: [
      '5+ years hands-on experience across Go backend services and modern React frontends.',
      'Strong grasp of relational modeling, transactional isolation, and schema migrations.',
      'Experience authoring GraphQL schemas and client-side caching strategies.',
      'Commitment to continuous integration and high automated test coverage.'
    ],
    responsibilities: [
      'Deliver end-to-end features spanning database migrations to interactive React screens.',
      'Maintain API backward compatibility for multi-tenant enterprise customers.',
      'Conduct peer code reviews and architectural RFC discussions.'
    ],
    benefits: ['Hybrid work model', 'Health insurance with top-up options', 'Broadband allowance', 'Retirement savings plan'],
    matchScore: 93,
    isFeatured: false,
  },
  {
    id: 'job-23',
    title: 'Senior Site Reliability Engineer (SRE)',
    company: 'Vyom Aeronautics & Satellites',
    companyTagline: 'Commercial payload communications and satellite telemetry software',
    location: 'Bengaluru',
    experienceLevel: 'Senior (5-8 yrs)',
    jobType: 'Full-time',
    category: 'DevOps & Cloud',
    salaryMinLpa: 30,
    salaryMaxLpa: 46,
    postedDate: '2026-10-08',
    skills: ['SRE', 'Linux', 'Kubernetes', 'Prometheus', 'Chaos Engineering', 'Python', 'Networking'],
    description: 'Guarantee high availability and mission assurance for real-time downlinks during satellite orbital passes.',
    requirements: [
      '5+ years dedicated SRE or production engineering experience.',
      'In-depth understanding of Linux networking, TCP/IP, and kernel tuning.',
      'Experience setting up SLI/SLO dashboards and incident management playbooks.',
      'Proficiency writing chaos engineering experiments and automation.'
    ],
    responsibilities: [
      'Lead incident post-mortems with a blameless culture mindset.',
      'Automate self-healing infrastructure patterns across edge ground stations.',
      'Participate in critical mission on-call support.'
    ],
    benefits: ['Satellite tracking mission passes', 'Top-tier medical coverage', 'Catered food', 'Generous equity units'],
    matchScore: 77,
    isFeatured: false,
  },
  {
    id: 'job-24',
    title: 'Mobile Flutter Engineer',
    company: 'IndusPay Technologies',
    companyTagline: 'Next-generation UPI merchant infrastructure and cross-border settlement rails',
    location: 'Remote (India)',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    jobType: 'Remote',
    category: 'Mobile Development',
    salaryMinLpa: 18,
    salaryMaxLpa: 28,
    postedDate: '2026-10-11',
    skills: ['Flutter', 'Dart', 'Bloc', 'REST APIs', 'Offline Storage', 'CI/CD for Mobile'],
    description: 'Build merchant soundbox companion apps and POS reconciliation dashboards running on iOS and Android.',
    requirements: [
      '3+ years crafting cross-platform mobile apps with Flutter and Dart.',
      'Experience with BLoC or Riverpod state management.',
      'Strong grasp of audio playout services and push notification lifecycles.',
      'Experience with mobile automated testing (integration and widget testing).'
    ],
    responsibilities: [
      'Optimize app launch time to under 1.2 seconds on budget Android phones.',
      'Implement multi-lingual voice feedback in 10 Indian vernacular languages.',
      'Deploy automated fastlane pipelines for store publishing.'
    ],
    benefits: ['Work from anywhere in India', 'Annual laptop refresh stipend', 'Wellness allowance', 'Health coverage'],
    matchScore: 84,
    isFeatured: false,
  },
  {
    id: 'job-25',
    title: 'Frontend Lead / Architect (Design Systems & Micro-frontends)',
    company: 'Moksha AI Labs',
    companyTagline: 'Multimodal Indic language models and enterprise LLM inference pipelines',
    location: 'Bengaluru',
    experienceLevel: 'Lead / Architect (8+ yrs)',
    jobType: 'Full-time',
    category: 'Frontend Engineering',
    salaryMinLpa: 42,
    salaryMaxLpa: 65,
    postedDate: '2026-10-14',
    skills: ['React', 'TypeScript', 'Module Federation', 'Web Performance', 'Micro-frontends', 'Architecture'],
    description: 'Architect the unified enterprise interface integrating 6 autonomous AI products into a coherent web studio workspace.',
    requirements: [
      '8+ years in frontend engineering with 2+ years as a Staff / Principal / Architect.',
      'Proven expertise with Webpack/Vite module federation and micro-frontend architectures.',
      'Deep mastery of web performance metrics (Core Web Vitals) and bundle optimization.',
      'Exceptional architectural communication and cross-team alignment capability.'
    ],
    responsibilities: [
      'Define the front-end technical vision and design system governance across 5 squads.',
      'Establish company-wide standards for TypeScript safety, testing, and accessibility.',
      'Work closely with CTO and Head of Product to plan roadmap feasibility.'
    ],
    benefits: ['Significant equity pool', 'Executive wellness program', 'Unlimited book purchases', 'Hybrid Bengaluru hub'],
    matchScore: 95,
    isFeatured: true,
  }
];

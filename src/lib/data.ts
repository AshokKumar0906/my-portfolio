export const profile = {
  name: "Ashok Kumar L",
  title: "AI/ML Engineer",
  location: "Chennai, India",
  email: "ashokkumar0906.ak@gmail.com",
  phone: "+91 99441 82706",
  summary:
    "AI/ML Engineer with 2+ years of experience building production-grade AI automation systems — including presales pipeline automation, autonomous agentic workflows, advanced RAG architectures, and LLM fine-tuning. Skilled across the full AI product lifecycle: system design, event-driven backend development, document intelligence, LLM orchestration, and containerised deployment.",
  links: {
    github: "https://github.com/AshokKumar0906",
    linkedin: "https://www.linkedin.com/in/ashok-kumar-l/",
    medium: "https://medium.com/@ashokkumar0906.ak",
    resume: "/Ashok_Kumar_Resume.pdf",
  },
};

export const stats = [
  { value: "2+", label: "Years experience" },
  { value: "5 min", label: "Presales RFP turnaround" },
  { value: "89%", label: "Model accuracy (LoRA)" },
  { value: "99.9%", label: "SLA compliance" },
];

export const skills = [
  {
    category: "AI / ML & LLM",
    items: [
      "Advanced RAG",
      "Agentic Workflows",
      "LangChain",
      "LangGraph",
      "LoRA / QLoRA Fine-tuning",
      "OpenAI Vector Store",
    ],
  },
  {
    category: "Document Intelligence",
    items: [
      "openpyxl",
      "pdfplumber",
      "reportlab",
      "python-docx",
      "python-pptx",
      "lxml",
    ],
  },
  {
    category: "Event-Driven Systems",
    items: [
      "Apache Kafka (aiokafka)",
      "NiFi ConsumeIMAP → PublishKafka",
      "SMTP Automation",
      "Tenacity Retry",
    ],
  },
  {
    category: "Programming & Frameworks",
    items: [
      "Python (FastAPI, asyncio, SQLAlchemy)",
      "SQL",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
    ],
  },
  {
    category: "Cloud & Infrastructure",
    items: [
      "OCI",
      "Azure Blob Storage",
      "Docker Compose",
      "Google Drive API",
      "CI/CD Pipelines",
    ],
  },
  {
    category: "Databases & Search",
    items: ["MySQL", "Chroma DB", "Elasticsearch", "MariaDB", "PostgreSQL"],
  },
];

export const experience = [
  {
    role: "AI Chatbot Developer",
    company: "Inswit Software Private Limited",
    period: "Mar 2026 – Present",
    bullets: [
      "Architected a multi-tenant, real-time voice agent backend on LiveKit Agents, with per-tenant STT/LLM/TTS provider selection and system prompts/tools/VAD settings loaded from MongoDB at call time — zero per-tenant code. Built a FastAPI WebSocket bridge integrating external Java IVR clients over raw PCM audio via LiveKit/WebRTC, a dynamic HTTP tool-calling layer for LLM function execution, and post-call analysis combining acoustic scoring with automated call-quality metrics.",
      "Built a presales automation pipeline: a Kafka consumer ingests inbound RFP emails, extracts requirements from multi-format attachments (Excel, Word, PDF, PPT, CSV) using AI, generates vendor responses via OpenAI vector store RAG, and writes answers back into the source document with colour-coded compliance labels (FC / PC / NC) — all without human input. Reduced presales response turnaround from ~3 business days to under 5 minutes.",
      "Built a PEFT pipeline using LoRA/QLoRA with 4-bit quantization, boosting model accuracy from 59% to 89% (+30%) on domain-specific tasks while reducing GPU memory usage by ~60%.",
      "Built a FastAPI service (WebPage2PDF) that crawls websites with Selenium JS-rendering fallback and BeautifulSoup4 semantic content extraction, generating professionally formatted PDF and DOCX reports; containerised with Docker Compose and a Streamlit UI frontend.",
    ],
  },
  {
    role: "Machine Learning Engineer",
    company: "Giggso India Pvt Ltd",
    period: "Sep 2024 – Feb 2026",
    bullets: [
      "Designed and deployed an agentic AI system using LangGraph/LangChain, reducing manual task intervention by 35%.",
      "Built an LLM-powered email orchestration system, improving departmental response times by 50%.",
      "Engineered \"NLWeb\", a multimodal RAG pipeline with Chroma DB/Gemini, achieving 90%+ retrieval accuracy across YouTube transcripts and image data.",
      "Managed the AI lifecycle on OCI with automated model switching, ensuring 99.9% SLA compliance.",
      "Optimized a FastAPI/Docker backend for multi-model orchestration, reducing latency by ~200ms.",
    ],
  },
];

export const projects = [
  {
    name: "Presales Automation Pipeline",
    description:
      "End-to-end presales email automation. A Kafka consumer ingests inbound RFP emails, extracts requirements from multi-format attachments, generates vendor responses via OpenAI vector store RAG, and writes answers back into the source document with compliance labels — reducing turnaround from ~3 days to under 5 minutes.",
    stack: ["Apache Kafka", "FastAPI", "OpenAI RAG", "SMTP", "Docker Compose", "MySQL"],
    metric: "3 days → 5 min turnaround",
  },
  {
    name: "LoRA Fine-tuning Pipeline",
    description:
      "PEFT pipeline using LoRA/QLoRA with 4-bit quantization for domain-specific tasks. Boosted model accuracy from 59% to 89% while cutting GPU memory usage by ~60%, covering dataset prep, tokenization, SFT, and evaluation.",
    stack: ["LoRA / QLoRA", "HuggingFace PEFT", "PyTorch", "Transformers"],
    metric: "59% → 89% accuracy",
  },
  {
    name: "WebPage2PDF",
    description:
      "FastAPI service that crawls websites (BFS, depth 1–3, up to 50 pages) with Selenium JS-rendering fallback and semantic content extraction, generating branded PDF and DOCX reports with auto-generated tables of contents.",
    stack: ["FastAPI", "Selenium", "BeautifulSoup4", "Playwright", "Streamlit"],
    metric: "Batch up to 20 URLs",
  },
  {
    name: "LLM-Powered Email Automation",
    description:
      "LangChain-based email orchestration system for intent classification, drafting, and routing across departments, improving response times by 50%.",
    stack: ["LangChain", "FastAPI", "Python", "OCI"],
    metric: "50% faster responses",
  },
  {
    name: "Voice Pipeline",
    description:
      "Multi-tenant, real-time voice agent backend with per-tenant STT/LLM/TTS providers and settings loaded from MongoDB at call time. FastAPI WebSocket bridge for Java IVR integration over WebRTC, with dynamic tool-calling and post-call quality analytics.",
    stack: ["LiveKit", "FastAPI", "WebRTC", "MongoDB"],
    metric: "Zero per-tenant code",
  },
];

export const education = [
  {
    degree: "M.Sc. Data Science",
    school: "Vellore Institute of Technology (VIT), Vellore",
    period: "2022 – 2024",
    detail: "CGPA: 8.44",
  },
  {
    degree: "BCA (Computer Applications)",
    school: "Vellore Institute of Technology (VIT), Vellore",
    period: "2019 – 2022",
    detail: "CGPA: 7.27",
  },
];

export const certifications = [
  {
    name: "Oracle Cloud Infrastructure 2025 Data Science Professional",
    issuer: "Oracle",
    year: "2025",
  },
  {
    name: "AWS Certified AI Practitioner",
    issuer: "Amazon Web Services",
    year: "2025",
  },
];

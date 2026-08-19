import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Work",
    hash: "#work",
  },
  // {
  //   name: "Experience",
  //   hash: "#experience",
  // },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

// Reverse lookup for syncing the URL to whatever section is active — the
// scroll-driven observer only ever knows a SectionName, never the hash.
export const sectionHash: Record<string, string> = Object.fromEntries(
  links.map((l) => [l.name, l.hash])
);

// export const experiencesData = [
//   {
//     title: "Diploma Degree",
//     location: "Nagpur, MH, IN",
//     description:
//       "I recived my diploma degree in Computer Technology.",
//     icon: React.createElement(LuGraduationCap),
//     date: "2021",
//   },
//   {
//     title: "Graduation",
//     location: "Nagpur, MH, IN",
//     description:
//       "Pursuing my graduation in the field of Computer Science and Engineering(B.Tech). So, as a final-year student that loves learning and sees opportunities to learn everywhere. ",
//     icon: React.createElement(LuGraduationCap),
//     date: "2021 - 2024",
//   },
// ] as const;

// Rendered as a git log: a fake short hash is a stylistic device (matching
// the terminal chrome already used in About and Skills), never a claim about
// real commit history. `nodes` is the architecture strip for each entry —
// [label, isHot] pairs — hot marking the piece of the system doing the most
// interesting work, not just naming every box.
export const projectsData = [
  {
    hash: "a3f9c2e",
    when: "current ongoing",
    title: "Microservices Platform",
    body: "Architected a production-grade microservices system with event-driven communication via Apache Kafka, synchronous inter-service calls with OpenFeign, service discovery via Eureka, and centralized configuration with Spring Cloud Config.",
    body2:
      "End-to-end distributed tracing and observability with Micrometer and Zipkin; integrated Spring AI for LLM-powered features across services.",
    tags: ["Spring Boot", "Spring Cloud", "Kafka", "OpenFeign", "Eureka", "Spring AI", "Docker"],
    nodes: [
      ["Client", false],
      ["API Gateway", false],
      ["Services", true],
      ["Kafka", true],
      ["Eureka", false],
      ["Zipkin", false],
    ],
  },
  {
    hash: "e17b04d",
    when: "current ongoing",
    title: "AI Agent",
    body: "Designed and built an autonomous AI agent in Python on Microsoft Azure AI Foundry that classifies customer conversations into resolution and escalation workflows using LLM reasoning, cutting manual intervention by 60%.",
    body2:
      "RAG pipelines with FastAPI, Azure OpenAI embeddings, and a vector database cut response latency by 30% across 500+ weekly conversations.",
    tags: ["Python", "FastAPI", "Azure AI Foundry", "Azure OpenAI", "RAG"],
    nodes: [
      ["Conversation", false],
      ["Classifier", true],
      ["RAG", true],
      ["Route", false],
      ["Resolve / Escalate", true],
    ],
  },
  {
    hash: "9c204b1",
    when: "personal project",
    title: "Socialink",
    body: "Users message one another, upload images, and like the posts and stories of other users.",
    body2: "",
    tags: ["MongoDB", "Express.js", "React", "Node.js"],
    nodes: [
      ["React", false],
      ["Express API", false],
      ["MongoDB", true],
    ],
  },
  {
    hash: "2d61ff8",
    when: "personal project",
    title: "Social's",
    body: "Real-time messaging that enables sending and receiving instant messages is the application's core feature.",
    body2: "",
    tags: ["Java", "XML", "Android", "Firebase", "Material UI"],
    nodes: [
      ["Android client", false],
      ["Firebase", true],
      ["Realtime DB", false],
    ],
  },
] as const;

// Sourced from the resume's Technical Skills section, in the same
// language -> backend -> mobile -> AI -> data -> cloud -> practices order it
// uses. Tooling with no scannable signal (Git, Postman, IntelliJ, Maven) and
// baseline items implied by the frameworks above them (Hibernate, Spring
// MVC, unit testing) are left out — see the same call made for About's
// Stack card, which this list otherwise mirrors.
// Grouped rather than flat: the Skills section renders this as a source
// file, and the category names are the object's keys.
export const skillGroups = [
  { label: "languages", items: ["Java", "Kotlin", "Go", "Python", "TypeScript", "JavaScript", "SQL", "Swift"] },
  {
    label: "backend",
    items: [
      "Spring Boot",
      "Spring Security",
      "FastAPI",
      "Microservices",
      "REST APIs",
      "GraphQL",
      "gRPC",
      "WebSockets",
      "Event-Driven Architecture",
      "Resilience4j",
      "OpenFeign",
    ],
  },
  { label: "mobile", items: ["React Native", "Android (Kotlin)", "iOS (Swift)"] },
  {
    label: "ai",
    items: [
      "Azure AI Foundry",
      "Azure OpenAI",
      "RAG",
      "AI Agents",
      "Vector Embeddings",
      "Prompt Engineering",
      "Spring AI",
      "LangChain",
      "MCP",
    ],
  },
  { label: "data", items: ["PostgreSQL", "Azure SQL", "MongoDB", "Redis", "Kafka", "Elasticsearch"] },
  { label: "cloud", items: ["Azure", "Docker", "Kubernetes", "Terraform", "CI/CD"] },
  { label: "practices", items: ["System Design", "Design Patterns", "Secure Coding", "SDLC", "Agile"] },
] as const;

export const skillsData = skillGroups.flatMap((g) => g.items);

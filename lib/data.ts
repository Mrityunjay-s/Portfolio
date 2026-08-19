import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import corpcommentImg from "@/public/LoginPage.png";
import rmtdevImg from "@/public/social1.png";
// import wordanalyticsImg from "@/public/social2.png";

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
    name: "Projects",
    hash: "#projects",
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

export const projectsData = [
  {
    title: "Socialink (Social Media Application)",
    description:
      "Users are able to message one another, upload images, and like the posts and stories of other users..",
    tags: ["MongoDB", "Express.JS", "React", "Node.JS"],
    imageUrl: corpcommentImg,
  },
  {
    title: "Social's",
    description:
      "Real-time messaging, which enables sending and receiving instant messages, is the application's core feature.",
    tags: ["Java", "XML", "Android", "Firebase", "Material Ui"],
    imageUrl: rmtdevImg,
  },
] as const;

// Sourced from the resume's Technical Skills section, in the same
// language -> backend -> mobile -> AI -> data -> cloud -> practices order it
// uses. Tooling with no scannable signal (Git, Postman, IntelliJ, Maven) and
// baseline items implied by the frameworks above them (Hibernate, Spring
// MVC, unit testing) are left out — see the same call made for About's
// Stack card, which this list otherwise mirrors.
export const skillsData = [
  "Java",
  "Kotlin",
  "Go",
  "Python",
  "TypeScript",
  "JavaScript",
  "SQL",
  "Swift",
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
  "React Native",
  "Android (Kotlin)",
  "iOS (Swift)",
  "Azure AI Foundry",
  "Azure OpenAI",
  "RAG",
  "AI Agents",
  "Vector Embeddings",
  "Prompt Engineering",
  "Spring AI",
  "LangChain",
  "MCP",
  "PostgreSQL",
  "Azure SQL",
  "MongoDB",
  "Redis",
  "Kafka",
  "Elasticsearch",
  "Azure",
  "Docker",
  "Kubernetes",
  "Terraform",
  "CI/CD",
  "System Design",
  "Design Patterns",
  "Secure Coding",
  "SDLC",
  "Agile",
] as const;

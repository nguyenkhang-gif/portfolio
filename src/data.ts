export const links = {
  upwork: "https://www.upwork.com/freelancers/~012e250e7342b02434",
  github: "https://github.com/nguyenkhang-gif",
  linkedin: "https://www.linkedin.com/in/khang-nguyen-nguyen-46456b246/",
  vela: "https://vela-one-sand.vercel.app",
};

export const stats = [
  { value: "2+ yrs", label: "shipping production web apps" },
  { value: "8M+", label: "nodes in the 3D engineering models I work with" },
  { value: "3", label: "product teams: 3D learning, IoT, engineering" },
];

export const featured = {
  name: "Vela One",
  tag: "Concept · Three.js",
  description:
    "A scroll-driven landing page for a fictional over-ear headphone. Every part of the model is generated in code, with no image or 3D files.",
  highlights: [
    "Wireframe-to-solid scan, then an exploded view of seven internal parts",
    "Noise-cancelling waves, a battery ring and rain deflected by a glass bubble",
    "Drag to rotate, hotspots and live finish switching",
  ],
  stack: ["Three.js", "WebGL", "JavaScript", "CSS"],
};

export const projects = [
  {
    name: "Social Media Blog",
    tag: "Full-stack · Live",
    description: "A social blogging platform with image uploads, Google sign-in and a built-in Pomodoro timer.",
    stack: ["Next.js 15", "TypeScript", "MongoDB", "Redis", "OAuth 2.0"],
    link: { label: "Visit site", url: "https://knn-productivity.vercel.app/" },
  },
  {
    name: "Manga Downloader & EPUB/CBZ Converter",
    tag: "Tooling · Open source",
    description: "Scrapes, compresses and packages chapters into EPUB or CBZ, with a live-progress web UI and an in-browser reader.",
    stack: ["Node.js", "Puppeteer", "Express", "Sharp"],
    link: { label: "View on GitHub", url: "https://github.com/nguyenkhang-gif/wattpad-to-epub-converter" },
  },
];

export const experience = [
  {
    company: "Lapis3D",
    role: "Full-Stack Developer",
    period: "Aug 2026 – Present",
    summary: "Browser-based 3D engineering products for large shipbuilding and industrial-plant clients.",
    points: [
      "Maintain and upgrade a Cesium 3D Tiles viewer: model hierarchy of 8M+ nodes, X-Ray, measurement, clipping and saved viewpoints.",
      "Work on issue tracking, a postMessage host API for embedding, and a unified 3D / 2D P&ID / 1D data platform with a Rust engine.",
    ],
    stack: ["React", "Cesium", "Node.js", "PostgreSQL", "Rust", "Docker"],
    links: [] as { label: string; url: string }[],
  },
  {
    company: "IES – Industrial Embedded Solutions",
    role: "Software Developer",
    period: "Jul 2025 – Jul 2026",
    summary: "ThingIQ, an IoT platform for vehicle tracking, fuel monitoring and anomaly detection.",
    points: [
      "Streamed live GPS and vibration-sensor data over MQTT and pushed alerts with Server-Sent Events.",
      "Built cron jobs that aggregate time-series sensor data and owned frontend architecture as data load grew.",
    ],
    stack: ["Nuxt.js", "Node.js", "MySQL", "MQTT", "Chart.js"],
    links: [{ label: "ThingIQ", url: "https://dash.thingiq.ai/" }],
  },
  {
    company: "Plogg",
    role: "Software Developer",
    period: "Jul 2024 – Apr 2025",
    summary: "Synode, a 3D product-learning platform, and the Saby restaurant ordering site.",
    points: [
      "Built interactive 3D lessons and a quiz system with Nuxt.js and Three.js.",
      "Cut a feature from O(n²) to O(n), taking it from 0.8s to 0.3s, and batched requests to reduce round trips.",
      "Built live cart and order sync for Saby with Redux and WebSocket.",
    ],
    stack: ["Vue.js", "Nuxt.js", "Three.js", "Next.js", "WebSocket"],
    links: [
      { label: "Synode", url: "https://www.synode.ai" },
      { label: "Saby", url: "https://saby-restaurant-rs5gdrzboq-uc.a.run.app" },
    ],
  },
];

export const skills = [
  { group: "3D & Graphics", items: ["Three.js", "WebGL", "Cesium", "Chart.js"] },
  { group: "Front-end", items: ["React", "Next.js", "Vue.js", "Nuxt.js", "TypeScript", "Tailwind CSS", "Redux", "TanStack Query"] },
  { group: "Back-end", items: ["Node.js", "NestJS", "Express", "REST", "WebSocket", "MQTT", "SSE", "OAuth 2.0"] },
  { group: "Data & DevOps", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "AWS EC2", "Nginx", "CI/CD"] },
];

export const story = [
  {
    label: "3D & interaction",
    title: "I start from raw geometry.",
    body: "Three.js and WebGL, from wireframe to finished surface: scroll-driven scenes, exploded views and models people can turn over in the browser.",
    tags: ["Three.js", "WebGL", "Cesium"],
  },
  {
    label: "Interface",
    title: "Then the layer people touch.",
    body: "Clean, responsive interfaces in React, Next.js and Vue, taken from the design file to every screen size.",
    tags: ["React", "Next.js", "Vue.js", "Tailwind CSS"],
  },
  {
    label: "Real-time data",
    title: "Data that moves while you watch.",
    body: "Live GPS, sensor streams and alerts over MQTT, WebSocket and Server-Sent Events, as on the ThingIQ IoT platform.",
    tags: ["MQTT", "WebSocket", "SSE"],
  },
  {
    label: "Back-end & engineering",
    title: "And the systems underneath.",
    body: "Node.js and NestJS services on PostgreSQL, MongoDB and Redis, plus 3D engineering viewers for models with 8M+ nodes.",
    tags: ["Node.js", "NestJS", "PostgreSQL", "Docker"],
  },
  {
    label: "One product",
    title: "All of it, put together.",
    body: "One developer who can take a product from the first 3D sketch to the API behind it.",
    tags: ["Full-stack", "Interactive 3D"],
  },
];

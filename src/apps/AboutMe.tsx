"use client";

import React, { useState } from "react";
import OsLink from "@/components/OsLink";
import Rover from "@/components/Rover";

type Section = "identity" | "experience" | "skills" | "achievements";

interface NavItem {
  id: Section;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: "identity", label: "Identity", icon: "👤" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "achievements", label: "Achievements", icon: "🏆" },
];

/* ─────────────────────────────────────────────
   SECTION: Identity
   ───────────────────────────────────────────── */
function IdentitySection() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Card */}
      <div className="flex items-center gap-6">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shrink-0"
          style={{
            background:
              "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            boxShadow:
              "0 4px 16px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          U
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Uganthan M
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>📧</span>
            <span className="text-selectable">uganthanmariappan@gmail.com</span>
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <span>📱</span>
            <span className="text-selectable">+91 8667670398</span>
          </p>
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          🎓 Education
        </h3>
        <div className="flex flex-col gap-3">
          <div
            className="rounded-lg p-4"
            style={{
              background: "rgba(59,130,246,0.05)",
              border: "1px solid rgba(59,130,246,0.12)",
            }}
          >
            <p className="font-semibold text-gray-800 text-sm">
              B.Tech AI &amp; Data Science
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Chennai Institute of Technology
            </p>
            <p className="text-xs text-gray-400 mt-1">
              2023 – present &nbsp;·&nbsp; CGPA 8.8/10
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{
              background: "rgba(59,130,246,0.05)",
              border: "1px solid rgba(59,130,246,0.12)",
            }}
          >
            <p className="font-semibold text-gray-800 text-sm">
              B.Sc Data Science (Foundation)
            </p>
            <p className="text-xs text-gray-500 mt-0.5">IIT Madras</p>
            <p className="text-xs text-gray-400 mt-1">
              Sep 2024 – present &nbsp;·&nbsp; CGPA 7.4/10
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          🔗 Social Links
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            {
              label: "GitHub",
              href: "https://github.com/uganthan2005",
              icon: "🐙",
            },
            {
              label: "LinkedIn",
              href: "https://linkedin.com/in/uganthanm",
              icon: "💼",
            },
            {
              label: "Behance",
              href: "https://www.behance.net/uganthamariapp",
              icon: "🎨",
            },
            {
              label: "LeetCode",
              href: "https://leetcode.com/uganthan2005",
              icon: "🧩",
            },
            {
              label: "CodeChef",
              href: "https://www.codechef.com/users/uganthanmariappan",
              icon: "👨‍🍳",
            },
          ].map((link) => (
            <OsLink
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-150"
              style={{
                background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.12)",
                color: "#1e40af",
                textDecoration: "none",
              }}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </OsLink>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION: Experience
   ───────────────────────────────────────────── */
interface ExperienceEntry {
  title: string;
  org: string;
  period: string;
  bullets: string[];
}

const experiences: ExperienceEntry[] = [
  {
    title: "Intern",
    org: "Crayon'd GenAI Skill Showcase Program",
    period: "May – June 2025",
    bullets: [
      "Built Movie Context Analyzer using Gemini, DeepSeek & Qwen (~25% higher accuracy)",
      "Built RAG-based Document QA Bot with chunking, embeddings, Supabase vector search (35% better retrieval)",
      "Developed LangGraph Report Maker & Analyzer with interactive feedback loops (40% efficiency improvement)",
      "Engineered Voice-Based Multi-Agent System with STT/TTS (30% real-time interaction boost)",
    ],
  },
  {
    title: "Technical Head",
    org: "TALOS 5.0",
    period: "2026",
    bullets: [
      "Architected Next.js/Firebase registration portal for 2,000+ teams",
      "Led operational execution for 10 events and 5 workshops",
      "Delivered MCP and AI workshop on agentic workflows",
    ],
  },
  {
    title: "Graphic Designer",
    org: "Asymmetric",
    period: "2024 – Present",
    bullets: [
      "Designed end-to-end marketing assets for Tech Fiesta and Hacksymmetric",
      "Mentored junior designers for brand consistency",
    ],
  },
];

function ExperienceSection() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Professional Experience
      </h2>
      <div className="ml-2">
        {experiences.map((exp, i) => (
          <div key={i} className="timeline-item">
            <div className="mb-1">
              <span className="font-semibold text-sm text-gray-800">
                {exp.title}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {exp.period}
              </span>
            </div>
            <p className="text-xs font-medium text-blue-600 mb-2">{exp.org}</p>
            <ul className="list-none flex flex-col gap-1.5">
              {exp.bullets.map((b, j) => (
                <li
                  key={j}
                  className="text-xs text-gray-600 leading-relaxed flex items-start gap-2"
                >
                  <span className="text-blue-400 mt-0.5 shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION: Skills
   ───────────────────────────────────────────── */
interface SkillCategory {
  title: string;
  items: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    items: ["Python", "C++", "pgSQL", "JavaScript", "C#", "Go", "Kotlin", "Dart"],
  },
  {
    title: "Web Development",
    items: ["HTML", "CSS", "Tailwind CSS", "React", "Node JS", "FastAPI"],
  },
  {
    title: "ML / Data",
    items: [
      "SciKit Learn",
      "Seaborn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Tableau",
      "Excel",
      "PyTorch",
      "TensorFlow",
    ],
  },
  {
    title: "Database",
    items: ["PostgreSQL", "SQL", "MongoDB", "Supabase", "ChromaDB"],
  },
  {
    title: "Tools",
    items: ["VS Code", "Docker", "Git", "Figma", "Canva", "Jupyter", "Google Colab"],
  },
];

function SkillsSection() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Technical Skills
      </h2>
      {skillCategories.map((cat) => (
        <div key={cat.title}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {cat.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cat.items.map((skill) => (
              <span key={skill} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION: Achievements
   ───────────────────────────────────────────── */
interface Achievement {
  title: string;
  detail: string;
  icon: string;
}

const achievements: Achievement[] = [
  {
    title: "LeetCode Knight",
    detail: "Top 5.48% globally · 450+ solved · Max Rating 1,861",
    icon: "⚔️",
  },
  {
    title: "CodeChef 3-Star",
    detail: "Max Rating 1635 · Best Contest Rank 169",
    icon: "⭐",
  },
  {
    title: "TCS CodeVita Season 13",
    detail: "Global Rank 1304 in Round 1",
    icon: "🏅",
  },
  {
    title: "Smart India Hackathon",
    detail: "Internal Top 25",
    icon: "🚀",
  },
];

const certifications: string[] = [
  "Android Developers (Eduskill)",
  "Parallel Computer Architecture (NPTEL)",
  "CCNA",
  "Data Science Master (Eduskill/Altair)",
  "Algorithms on Strings and Graphs (UC San Diego)",
];

function AchievementsSection() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-800">Achievements</h2>

      <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {achievements.map((a) => (
          <div key={a.title} className="achievement-card flex items-start gap-3">
            <span className="text-2xl shrink-0">{a.icon}</span>
            <div>
              <p className="font-semibold text-sm text-gray-800">{a.title}</p>
              <p className="text-xs text-gray-500 mt-1">{a.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          📜 Certifications
        </h3>
        <div className="flex flex-col gap-2">
          {certifications.map((cert) => (
            <div
              key={cert}
              className="flex items-center gap-2 text-xs text-gray-600 px-3 py-2 rounded-md"
              style={{
                background: "rgba(59,130,246,0.04)",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
            >
              <span className="text-blue-400">✓</span>
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN: AboutMe
   ───────────────────────────────────────────── */
const sectionComponents: Record<Section, React.FC> = {
  identity: IdentitySection,
  experience: ExperienceSection,
  skills: SkillsSection,
  achievements: AchievementsSection,
};

export default function AboutMe() {
  const [activeSection, setActiveSection] = useState<Section>("identity");

  const ActiveComponent = sectionComponents[activeSection];

  return (
    <div className="flex h-full" style={{ fontFamily: "var(--font-system)" }}>
      {/* LEFT SIDEBAR */}
      <nav className="about-sidebar flex flex-col">
        {/* User avatar header */}
        <div className="flex flex-col items-center gap-2 px-4 pb-4 mb-2 border-b border-black/5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
            }}
          >
            U
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Uganthan M</p>
            <p className="text-[11px] text-gray-400">User Account</p>
          </div>
        </div>

        {/* Navigation items */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`about-nav-item ${
              activeSection === item.id ? "about-nav-active" : ""
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        <Rover />
      </nav>

      {/* RIGHT PANEL */}
      <div className="about-content custom-scrollbar">
        <ActiveComponent />
      </div>
    </div>
  );
}

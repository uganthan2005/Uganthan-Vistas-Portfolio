"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaInstagram, FaBehance } from "react-icons/fa";
import { FcBriefcase, FcGraduationCap, FcSettings, FcSportsMode, FcDiploma1 } from "react-icons/fc";
import { SiLeetcode, SiLetterboxd } from "react-icons/si";
import OsLink from "@/components/OsLink";
import Rover from "@/components/Rover";

/* ─────────────────────────────────────────────
   DATA
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
    org: "Crayon'd GenAI Skill Showcase",
    period: "May – June 2025",
    bullets: [
      "Built Movie Context Analyzer using LLMs (~25% higher accuracy)",
      "Built RAG-based Document QA Bot (35% better retrieval)",
      "Developed LangGraph Report Maker (40% efficiency boost)",
      "Engineered Voice-Based Multi-Agent System",
    ],
  },
  {
    title: "Technical Head",
    org: "TALOS 5.0",
    period: "2026",
    bullets: [
      "Architected Next.js/Firebase portal for 2,000+ teams",
      "Led operational execution for 10 events",
      "Delivered MCP and AI workshop",
    ],
  },
  {
    title: "Graphic Designer",
    org: "Asymmetric",
    period: "2024 – Present",
    bullets: [
      "Designed assets for Tech Fiesta",
      "Mentored junior designers",
    ],
  },
];

const education = [
  {
    degree: "B.Tech AI & Data Science",
    school: "Chennai Institute of Technology",
    details: "2023 – present · CGPA 8.8/10",
  },
  {
    degree: "B.Sc Data Science (Foundation)",
    school: "IIT Madras",
    details: "Sep 2024 – present · CGPA 7.4/10",
  },
];

const skillCategories = [
  {
    title: "Languages",
    items: "Python, C++, pgSQL, JavaScript, C#, Go, Kotlin, Dart",
  },
  {
    title: "Web Development",
    items: "HTML, CSS, Tailwind, React, Node JS, FastAPI",
  },
  {
    title: "ML / Data",
    items: "SciKit Learn, Pandas, NumPy, Tableau, PyTorch, TensorFlow",
  },
  {
    title: "Database & Tools",
    items: "PostgreSQL, MongoDB, Supabase, Docker, Git, Figma",
  },
];

const achievements = [
  "LeetCode Knight (Top 5.48%, 450+ solved)",
  "CodeChef 3-Star (Max Rating 1635)",
  "TCS CodeVita Season 13 Global Rank 1304",
  "Smart India Hackathon Internal Top 25",
];

const certifications = [
  "Android Developers (Eduskill)",
  "Parallel Computer Architecture (NPTEL)",
  "CCNA",
  "Data Science Master (Eduskill/Altair)",
];

/* ─────────────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────────────── */

function WelcomeItem({ icon, title, description, isBullet = false }: { icon: React.ReactNode, title: string, description: string | string[], isBullet?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "8px 16px", cursor: "default" }}>
      <div style={{ fontSize: 36, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))", marginTop: 4, display: "flex", alignItems: "flex-start" }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: 13, color: "#003399", fontWeight: 600, margin: "0 0 4px 0", cursor: "pointer" }} className="hover:underline">
          {title}
        </h4>
        {Array.isArray(description) ? (
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#444", listStyleType: isBullet ? "disc" : "none", padding: isBullet ? "0 0 0 16px" : 0 }}>
            {description.map((item, i) => (
              <li key={i} style={{ marginBottom: 2, lineHeight: 1.3 }}>{item}</li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: 12, color: "#444", margin: 0, lineHeight: 1.3 }}>{description}</p>
        )}
      </div>
    </div>
  );
}

export default function AboutMe() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Segoe UI, Tahoma, sans-serif", backgroundColor: "#fff" }}>
      
      {/* ── Top Toolbar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "6px 12px",
        background: "linear-gradient(180deg, #f0f4f8 0%, #dce3ea 100%)",
        borderBottom: "1px solid #b0bec5",
        gap: 8,
      }}>
        {/* Nav Buttons */}
        <div style={{ display: "flex", gap: 4 }}>
          <button style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(180deg, #fff 0%, #eee 100%)", border: "1px solid #b0bec5", color: "#555", cursor: "pointer", fontSize: 14 }}>
            ⮜
          </button>
          <button style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(180deg, #fff 0%, #eee 100%)", border: "1px solid #b0bec5", color: "#aaa", cursor: "default", fontSize: 14 }}>
            ⮞
          </button>
        </div>
        
        {/* Breadcrumbs */}
        <div style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          background: "white",
          border: "1px solid #b0bec5",
          borderRadius: 4,
          height: 28,
          padding: "0 8px",
          fontSize: 12,
          gap: 6,
          color: "#333"
        }}>
          <span>🖥️</span>
          <span>Control Panel</span>
          <span style={{ color: "#888", fontSize: 10 }}>▶</span>
          <span>Welcome Center</span>
        </div>

        {/* Search */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "white",
          border: "1px solid #b0bec5",
          borderRadius: 14,
          height: 28,
          padding: "0 10px",
          width: 200,
        }}>
          <input type="text" placeholder="Search" style={{ border: "none", outline: "none", width: "100%", fontSize: 12, fontStyle: "italic", color: "#666" }} />
          <span style={{ fontSize: 12, color: "#888" }}>🔍</span>
        </div>
      </div>

      {/* ── Banner ── */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #1f6b8a 0%, #3ca096 40%, #7dbd70 100%)",
        padding: "20px",
        color: "white",
        boxShadow: "inset 0 -1px 3px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}>
        {/* "welcome" watermark */}
        <div style={{
          position: "absolute",
          right: "-10px",
          bottom: "-20px",
          fontSize: "120px",
          color: "rgba(255,255,255,0.15)",
          fontWeight: 100,
          fontFamily: "'Segoe UI', sans-serif",
          letterSpacing: "-2px",
          pointerEvents: "none",
        }}>
          welcome
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 20 }}>
          {/* Avatar Area */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: "4px",
              border: "2px solid rgba(255,255,255,0.8)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              position: "relative",
              overflow: "hidden"
            }}>
              <Image src="/profile-picture.jpg" alt="Uganthan" fill className="object-cover" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>Uganthan</span>
          </div>

          {/* System Specs (Details) */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 12, lineHeight: 1.5, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Uganthan M™ Portfolio</div>
              <div>Role: AI & Data Science Engineer</div>
              <div>Education: B.Tech (CIT) / B.Sc (IIT Madras)</div>
              <div>Contact: uganthanmariappan@gmail.com</div>
              <div>Phone: +91 8667670398</div>
            </div>
          </div>

          <div style={{ flex: 1 }} />
          
          <div style={{ fontSize: 12, display: "flex", alignItems: "flex-start", gap: 4, cursor: "pointer", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }} className="hover:underline">
            <span style={{ color: "#a5d6a7" }}>⮞</span> Show more details
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        
        {/* Rover Dog */}
        <div style={{ position: "absolute", bottom: 20, right: 20, zIndex: 10 }}>
          <Rover />
        </div>

        {/* Section 1 */}
        <div>
          <div style={{
            background: "linear-gradient(90deg, #f5f8fa 0%, #fff 100%)",
            borderBottom: "1px solid #e0e6ed",
            padding: "4px 16px",
            fontSize: 12,
            fontWeight: 600,
            color: "#003399",
            display: "flex",
            justifyContent: "space-between",
          }}>
            <span>1. Professional Experience & Education (5)</span>
            <span style={{ color: "#888", transform: "scaleY(0.7)" }}>▲</span>
          </div>
          
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderBottom: "1px solid #e0e6ed" }}>
            {experiences.map((exp, i) => (
              <WelcomeItem 
                key={i}
                icon={<FcBriefcase size={36} />}
                title={`${exp.org} - ${exp.title}`}
                description={[exp.period, ...exp.bullets]}
                isBullet={true}
              />
            ))}
            {education.map((edu, i) => (
              <WelcomeItem 
                key={i}
                icon={<FcGraduationCap size={36} />}
                title={edu.degree}
                description={[edu.school, edu.details]}
              />
            ))}
          </div>
          <div style={{ padding: "4px 16px", fontSize: 11, color: "#003399", cursor: "pointer" }} className="hover:underline">
            Show all 5 items...
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <div style={{
            background: "linear-gradient(90deg, #f5f8fa 0%, #fff 100%)",
            borderTop: "1px solid #e0e6ed",
            borderBottom: "1px solid #e0e6ed",
            padding: "4px 16px",
            fontSize: 12,
            fontWeight: 600,
            color: "#003399",
            display: "flex",
            justifyContent: "space-between",
          }}>
            <span>2. Technical Skills & Achievements (4)</span>
            <span style={{ color: "#888", transform: "scaleY(0.7)" }}>▲</span>
          </div>
          
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {skillCategories.map((cat, i) => (
              <WelcomeItem 
                key={i}
                icon={<FcSettings size={36} />}
                title={cat.title}
                description={cat.items}
              />
            ))}
            <WelcomeItem 
              icon={<FcSportsMode size={36} />}
              title="Key Achievements"
              description={achievements}
              isBullet={true}
            />
            <WelcomeItem 
              icon={<FcDiploma1 size={36} />}
              title="Certifications"
              description={certifications}
              isBullet={true}
            />
          </div>
          <div style={{ padding: "4px 16px", fontSize: 11, color: "#003399", cursor: "pointer" }} className="hover:underline">
            Show all items...
          </div>
        </div>

        {/* Links Section */}
        <div style={{ padding: "20px 36px", display: "flex", gap: 16 }}>
          <OsLink href="https://github.com/uganthan2005" className="hover:underline" style={{ fontSize: 12, color: "#003399", display: "flex", alignItems: "center", gap: 4 }}>
            <FaGithub size={16} color="#333" /> GitHub
          </OsLink>
          <OsLink href="https://linkedin.com/in/uganthanm" className="hover:underline" style={{ fontSize: 12, color: "#003399", display: "flex", alignItems: "center", gap: 4 }}>
            <FaLinkedin size={16} color="#0077b5" /> LinkedIn
          </OsLink>
          <OsLink href="https://www.instagram.com/uganthan_vk?igsh=MXA2cWZremJjN3Z4cw==" className="hover:underline" style={{ fontSize: 12, color: "#003399", display: "flex", alignItems: "center", gap: 4 }}>
            <FaInstagram size={16} color="#E1306C" /> Instagram
          </OsLink>
          <OsLink href="https://leetcode.com/u/uganthan_m/" className="hover:underline" style={{ fontSize: 12, color: "#003399", display: "flex", alignItems: "center", gap: 4 }}>
            <SiLeetcode size={16} color="#FFA116" /> LeetCode
          </OsLink>
          <OsLink href="https://www.behance.net/uganthamariapp" className="hover:underline" style={{ fontSize: 12, color: "#003399", display: "flex", alignItems: "center", gap: 4 }}>
            <FaBehance size={16} color="#053eff" /> Behance
          </OsLink>
          <OsLink href="https://letterboxd.com/_Ben_10__/" className="hover:underline" style={{ fontSize: 12, color: "#003399", display: "flex", alignItems: "center", gap: 4 }}>
            <SiLetterboxd size={16} color="#00E054" /> Letterboxd
          </OsLink>
        </div>

      </div>

      {/* ── Status Bar ── */}
      <div style={{
        background: "#f0f0f0",
        borderTop: "1px solid #ccc",
        padding: "4px 12px",
        fontSize: 11,
        color: "#333",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        <input type="checkbox" defaultChecked id="startup-check" />
        <label htmlFor="startup-check">Run at startup (Welcome Center can be found in Control Panel)</label>
      </div>

    </div>
  );
}

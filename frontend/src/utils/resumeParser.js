import { COMMON_SKILLS } from "./jobmatching";

export function parseResumeText(text = "") {
  if (!text || typeof text !== "string") {
    return {
      name: "",
      email: "",
      phone: "",
      degree: "",
      branch: "",
      year: "",
      skills: "",
      skillsList: [],
      preferredRole: "",
      preferredLocation: "",
      detectedSkillsCount: 0,
    };
  }

  const content = text.toLowerCase();
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Extract Email
  let email = "";
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch) {
    email = emailMatch[0];
  }

  // Extract Phone
  let phone = "";
  const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
  if (phoneMatch) {
    phone = phoneMatch[0];
  }

  // Extract Candidate Name heuristic (first clean line that isn't email, phone, url, or section title)
  let name = "";
  for (const line of lines.slice(0, 8)) {
    const cleanLine = line.replace(/[^a-zA-Z\s.]/g, "").trim();
    const wordCount = cleanLine.split(/\s+/).length;

    const isNonNameKeyword = /resume|cv|curriculum|profile|contact|email|phone|github|linkedin|education|experience|projects|skills|summary|objective/i.test(line);

    if (
      !isNonNameKeyword &&
      !line.includes("@") &&
      !/\d{5,}/.test(line) &&
      wordCount >= 2 &&
      wordCount <= 4 &&
      /^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$/.test(cleanLine)
    ) {
      name = cleanLine;
      break;
    }
  }

  // Fallback name if regex pattern missed capitalized names
  if (!name && lines.length > 0) {
    const line0 = lines[0].replace(/[^a-zA-Z\s]/g, "").trim();
    if (line0.split(/\s+/).length >= 2 && line0.split(/\s+/).length <= 4 && !/resume|cv|profile/i.test(line0)) {
      name = line0;
    }
  }

  // Extract Skills matching COMMON_SKILLS
  const detectedSkills = [];
  COMMON_SKILLS.forEach((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(?:^|[^a-zA-Z0-9+#])${escaped}(?:$|[^a-zA-Z0-9+#])`, "i");
    if (pattern.test(text)) {
      // Normalize skill display name
      let displayName = skill;
      if (skill === "c++") displayName = "C++";
      else if (skill === "c#") displayName = "C#";
      else if (skill === "javascript") displayName = "JavaScript";
      else if (skill === "typescript") displayName = "TypeScript";
      else if (skill === "node.js") displayName = "Node.js";
      else if (skill === "next.js") displayName = "Next.js";
      else if (skill === "rest api") displayName = "REST API";
      else if (skill === "html") displayName = "HTML";
      else if (skill === "css") displayName = "CSS";
      else if (skill === "sql") displayName = "SQL";
      else if (skill === "aws") displayName = "AWS";
      else if (skill === "gcp") displayName = "GCP";
      else if (skill === "ai" || skill === "nlp") displayName = skill.toUpperCase();
      else displayName = skill.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

      if (!detectedSkills.includes(displayName)) {
        detectedSkills.push(displayName);
      }
    }
  });

  // Extract Degree heuristic
  let degree = "";
  if (/b\.?tech|bachelor of technology/i.test(text)) degree = "B.Tech";
  else if (/b\.?e\b|bachelor of engineering/i.test(text)) degree = "B.E.";
  else if (/m\.?tech|master of technology/i.test(text)) degree = "M.Tech";
  else if (/m\.?s\b|master of science/i.test(text)) degree = "M.S.";
  else if (/b\.?sc|bachelor of science/i.test(text)) degree = "B.Sc";
  else if (/m\.?ca|master of computer applications/i.test(text)) degree = "MCA";
  else if (/b\.?ca|bachelor of computer applications/i.test(text)) degree = "BCA";
  else if (/ph\.?d|doctorate/i.test(text)) degree = "Ph.D.";
  else if (/diploma/i.test(text)) degree = "Diploma";

  // Extract Branch heuristic
  let branch = "";
  if (/computer science|cse/i.test(text)) branch = "Computer Science & Engineering";
  else if (/information technology|\bit\b/i.test(text)) branch = "Information Technology";
  else if (/artificial intelligence|\bai\b|machine learning|\bml\b/i.test(text)) branch = "Artificial Intelligence & ML";
  else if (/data science|data analytics/i.test(text)) branch = "Data Science";
  else if (/cyber security|information security/i.test(text)) branch = "Cyber Security";
  else if (/electronics|ece|communication eng/i.test(text)) branch = "Electronics & Communication";
  else if (/electrical|eee/i.test(text)) branch = "Electrical Engineering";
  else if (/mechanical/i.test(text)) branch = "Mechanical Engineering";
  else if (/software engineering/i.test(text)) branch = "Software Engineering";

  // Extract Year heuristic
  let year = "";
  if (/4th year|final year|senior|class of 2025|graduat(ing|ed) (in )?2025/i.test(text)) year = "4th Year";
  else if (/3rd year|penultimate|junior|class of 2026|graduat(ing|ed) (in )?2026/i.test(text)) year = "3rd Year";
  else if (/2nd year|sophomore|class of 2027|graduat(ing|ed) (in )?2027/i.test(text)) year = "2nd Year";
  else if (/1st year|freshman|class of 2028|graduat(ing|ed) (in )?2028/i.test(text)) year = "1st Year";
  else if (/graduated|passout|2024/i.test(text)) year = "Graduated";

  // Extract Target Role heuristic
  let preferredRole = "";
  if (/full stack|frontend|backend|software engineer|sde|web developer|data scientist|machine learning engineer|devops|mobile developer/i.test(text)) {
    const roleMatch = text.match(/(full stack|frontend|backend|software engineer|data scientist|machine learning engineer|sde|web developer|devops engineer|mobile developer)/i);
    if (roleMatch) {
      const rawRole = roleMatch[0];
      const capitalized = rawRole.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      preferredRole = capitalized.toLowerCase().includes("intern") ? capitalized : `${capitalized} Intern`;
    }
  }

  // Extract Location heuristic
  let preferredLocation = "";
  const locationMatch = text.match(/(bangalore|bengaluru|mumbai|pune|hyderabad|delhi|noida|gurgaon|chennai|remote|san francisco|new york|india)/i);
  if (locationMatch) {
    const loc = locationMatch[0].toLowerCase();
    if (loc === "bengaluru") preferredLocation = "Bangalore, India";
    else if (loc === "remote") preferredLocation = "Remote";
    else preferredLocation = `${loc.charAt(0).toUpperCase() + loc.slice(1)}, India`;
  }

  return {
    name,
    email,
    phone,
    degree,
    branch,
    year,
    skills: detectedSkills.join(", "),
    skillsList: detectedSkills,
    preferredRole,
    preferredLocation,
    detectedSkillsCount: detectedSkills.length,
  };
}

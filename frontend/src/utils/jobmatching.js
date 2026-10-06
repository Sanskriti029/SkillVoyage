export const COMMON_SKILLS = [
  // Programming
  "javascript",
  "typescript",
  "java",
  "python",
  "c++",

  // Frontend
  "react",
  "angular",
  "vue",
  "html",
  "css",
  "tailwind",

  // Backend
  "node.js",
  "express",
  "flask",
  "django",
  "rest api",
  "api",

  // Databases
  "sql",
  "mysql",
  "postgresql",
  "mongodb",

  // Development tools
  "git",
  "github",
  "docker",
  "kubernetes",

  // Cloud
  "aws",
  "azure",
  "gcp",

  // Engineering / methodology
  "agile",
  "communication",

  // AI / Data
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",

  // CS fundamentals
  "data structures",
  "algorithms",
];

export function calculateJobMatch(jobDescription, studentSkills) {
  const description = (jobDescription || "").toLowerCase();

  const skills = (studentSkills || "")
    .split(",")
    .map((skill) => skill.trim().toLowerCase())
    .filter((skill) => skill !== "");

  const requiredSkills = COMMON_SKILLS.filter((skill) => {
    const escapedSkill = skill.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const pattern = new RegExp(
      `\\b${escapedSkill}\\b`,
      "i"
    );

    return pattern.test(description);
  });

  const matchedSkills = requiredSkills.filter((skill) =>
    skills.some(
      (studentSkill) =>
        studentSkill.includes(skill) ||
        skill.includes(studentSkill)
    )
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  /*
   * If the job description does not contain
   * enough recognizable skills, don't pretend
   * that the match percentage is reliable.
   */
  const hasEnoughSkillInformation = requiredSkills.length >= 2;

  let matchPercentage = 0;

  if (hasEnoughSkillInformation) {
    matchPercentage = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
    );
  }

  return {
    requiredSkills,
    matchedSkills,
    missingSkills,
    matchPercentage,
    hasEnoughSkillInformation,
  };
}
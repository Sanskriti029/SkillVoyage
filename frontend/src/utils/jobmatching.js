export const COMMON_SKILLS = [
  "javascript",
  "typescript",
  "java",
  "python",
  "c++",
  "react",
  "angular",
  "vue",
  "node.js",
  "express",
  "html",
  "css",
  "tailwind",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "git",
  "github",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "flask",
  "django",
  "rest api",
  "api",
  "data structures",
  "algorithms",
];

export function calculateJobMatch(jobDescription, studentSkills) {
  const description = (jobDescription || "").toLowerCase();

  const skills = (studentSkills || "")
    .split(",")
    .map((skill) => skill.trim().toLowerCase())
    .filter((skill) => skill !== "");

  // Skills mentioned in the job description
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

  // Skills the student has that are required by the job
  const matchedSkills = requiredSkills.filter((skill) =>
    skills.some(
      (studentSkill) =>
        studentSkill.includes(skill) ||
        skill.includes(studentSkill)
    )
  );

  // Skills required by the job but missing from student's profile
  const missingSkills = requiredSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  let matchPercentage = 0;

  if (requiredSkills.length > 0) {
    matchPercentage = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
    );
  }

  return {
    requiredSkills,
    matchedSkills,
    missingSkills,
    matchPercentage,
  };
}
export const COMMON_SKILLS = [
  "javascript",
  "typescript",
  "java",
  "python",
  "c++",
  "c",
  "c#",
  "go",
  "rust",
  "kotlin",
  "swift",
  "php",
  "ruby",
  "react",
  "next.js",
  "angular",
  "vue",
  "node.js",
  "express",
  "flask",
  "django",
  "fastapi",
  "html",
  "css",
  "tailwind",
  "tailwind css",
  "bootstrap",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "redis",
  "firebase",
  "git",
  "github",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "scikit-learn",
  "pandas",
  "numpy",
  "opencv",
  "nlp",
  "rest api",
  "api",
  "graphql",
  "data structures",
  "algorithms",
  "system design",
  "devops",
  "ci/cd",
  "agile",
  "communication",
  "problem solving",
  "teamwork",
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
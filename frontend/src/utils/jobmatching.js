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

export const SKILL_ALIASES = {
  aws: ["aws", "amazon web services", "amazon cloud"],
  react: ["react", "react.js", "reactjs"],
  node: ["node", "node.js", "nodejs", "node js"],
  sql: ["sql", "structured query language"],
  postgresql: ["postgres", "postgresql"],
  mysql: ["mysql", "my sql"],
  mongodb: ["mongo", "mongodb"],
  typescript: ["typescript", "ts"],
  javascript: ["javascript", "js"],
  angular: ["angular", "angular.js"],
  vue: ["vue", "vue.js", "vuejs"],
  "next.js": ["next", "next.js", "nextjs"],
  express: ["express", "express.js"],
  django: ["django", "django framework"],
  flask: ["flask", "flask framework"],
  fastapi: ["fastapi", "fast api"],
  docker: ["docker", "containerization"],
  kubernetes: ["kubernetes", "k8s"],
  azure: ["azure", "microsoft azure"],
  gcp: ["gcp", "google cloud", "google cloud platform"],
  tensorflow: ["tensorflow", "tensor flow"],
  pytorch: ["pytorch", "torch"],
  "machine learning": ["machine learning", "ml", "artificial intelligence", "ai"],
  "deep learning": ["deep learning", "neural networks"],
  graphql: ["graphql", "graph ql"],
  "rest api": ["rest", "rest api", "restful"],
  git: ["git", "version control"],
  github: ["github", "gh"],
};

function normalizeSkill(skill) {
  const lower = skill.toLowerCase().trim();
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (aliases.some(alias => lower.includes(alias) || alias.includes(lower))) {
      return canonical;
    }
  }
  return lower;
}

function skillMatches(description, skill) {
  const lower = description.toLowerCase();
  const skillToSearch = normalizeSkill(skill);
  const aliases = SKILL_ALIASES[skillToSearch] || [skillToSearch];

  return aliases.some(alias => {
    const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b${escapedAlias}\\b`, "i");
    return pattern.test(lower);
  });
}

export function calculateJobMatch(jobDescription, studentSkills) {
  const description = (jobDescription || "").toLowerCase();

  const skills = (studentSkills || "")
    .split(",")
    .map((skill) => skill.trim().toLowerCase())
    .filter((skill) => skill !== "");

<<<<<<< HEAD
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
=======
  // Skills mentioned in the job description (using aliases)
  const requiredSkills = COMMON_SKILLS.filter((skill) =>
    skillMatches(description, skill)
  );

  // Skills the student has that are required by the job
  const matchedSkills = requiredSkills.filter((skill) => {
    const normalizedSkill = normalizeSkill(skill);
    return skills.some((studentSkill) => {
      const normalizedStudentSkill = normalizeSkill(studentSkill);
      return normalizedStudentSkill === normalizedSkill;
    });
  });
>>>>>>> 4728459e34712b4fbc745a178e8cfb9c2bfaaaa7

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

export function calculateOpportunityScore(job, profile) {
  const match = calculateJobMatch(job.description || "", profile.skills);

  const weights = {
    skillMatch: 0.40,
    roleMatch: 0.20,
    experienceMatch: 0.15,
    educationMatch: 0.10,
    locationMatch: 0.10,
    internshipFit: 0.05,
  };

  let skillMatchScore = match.matchPercentage;

  let roleMatchScore = 0;
  const jobTitle = (job.title || "").toLowerCase();
  const preferredRole = (profile.preferredRole || "").toLowerCase();
  if (preferredRole && jobTitle.includes(preferredRole.split(" ")[0])) {
    roleMatchScore = 85;
  } else if (
    jobTitle.includes("intern") ||
    jobTitle.includes("graduate") ||
    jobTitle.includes("trainee")
  ) {
    roleMatchScore = 70;
  }

  let experienceMatchScore = 0;
  const year = profile.year || "";
  if (year.includes("3") || year.includes("4")) {
    experienceMatchScore = 80;
  } else if (year.includes("2")) {
    experienceMatchScore = 60;
  } else {
    experienceMatchScore = 40;
  }

  let educationMatchScore = 0;
  const degree = (profile.degree || "").toLowerCase();
  if (degree.includes("b.tech") || degree.includes("b.e") || degree.includes("mca")) {
    educationMatchScore = 90;
  } else if (degree) {
    educationMatchScore = 70;
  }

  let locationMatchScore = 0;
  const jobLocation = (job.location || "").toLowerCase();
  const preferredLocation = (profile.preferredLocation || "").toLowerCase();
  if (preferredLocation && jobLocation.includes(preferredLocation.split(",")[0])) {
    locationMatchScore = 100;
  } else if (jobLocation.includes("remote")) {
    locationMatchScore = 85;
  } else if (jobLocation && preferredLocation) {
    locationMatchScore = 40;
  } else if (jobLocation) {
    locationMatchScore = 60;
  }

  let internshipFitScore = 0;
  if (job.is_internship) {
    internshipFitScore = 100;
  } else {
    internshipFitScore = 50;
  }

  const totalScore = Math.round(
    skillMatchScore * weights.skillMatch +
    roleMatchScore * weights.roleMatch +
    experienceMatchScore * weights.experienceMatch +
    educationMatchScore * weights.educationMatch +
    locationMatchScore * weights.locationMatch +
    internshipFitScore * weights.internshipFit
  );

  return {
    totalScore: Math.min(Math.max(totalScore, 0), 100),
    skillMatchScore,
    roleMatchScore,
    experienceMatchScore,
    educationMatchScore,
    locationMatchScore,
    internshipFitScore,
    breakdown: {
      "Skill Match": { score: skillMatchScore, weight: "40%" },
      "Role Match": { score: roleMatchScore, weight: "20%" },
      "Experience Match": { score: experienceMatchScore, weight: "15%" },
      "Education Match": { score: educationMatchScore, weight: "10%" },
      "Location Match": { score: locationMatchScore, weight: "10%" },
      "Internship Fit": { score: internshipFitScore, weight: "5%" },
    },
  };
}
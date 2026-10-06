export function generateMockQuestions(job, match) {
  const missing = match.missingSkills || [];
  const matched = match.matchedSkills || [];

  const questions = [
    {
      id: 1,
      category: "Behavioral & Motivation",
      question: `Why are you interested in joining ${job.company || "this company"} for the ${job.title || "internship"} role?`,
      hint: "Highlight your enthusiasm for their engineering domain, company culture, and how this internship matches your career goals.",
      sampleAnswer: `I'm drawn to ${job.company || "the company"} because of your innovative products and engineering culture. This ${job.title || "internship"} aligns perfectly with my background in tech, and I'm eager to contribute while expanding my skills.`,
    },
    {
      id: 2,
      category: "Core Technical",
      question: matched.length > 0
        ? `Can you explain a challenging project you built using ${matched[0]} and how you handled technical edge cases?`
        : "Explain the architectural components of a typical web/software application and how data flows from frontend to backend.",
      hint: "Use the STAR method (Situation, Task, Action, Result) to structure your answer.",
      sampleAnswer: "In my recent project, I structured modular components, handled state updates asynchronously, and benchmarked API request performance to maintain fluid rendering.",
    },
  ];

  if (missing.length > 0) {
    questions.push({
      id: 3,
      category: "Skill Gap Focus",
      question: `This role mentions ${missing[0]}. How would you approach learning and implementing ${missing[0]} on the job?`,
      hint: "Demonstrate fast learning capability, willingness to study documentation, and building small test projects.",
      sampleAnswer: `I have studied the core concepts of ${missing[0]} and am actively working through hands-on roadmaps. I learn rapidly by building functional prototypes and following team best practices.`,
    });
  }

  if (missing.length > 1) {
    questions.push({
      id: 4,
      category: "Technical Concepts",
      question: `How does ${missing[1]} differ from traditional tools in software development, and when should it be used?`,
      hint: "Focus on performance, trade-offs, and scalability.",
      sampleAnswer: `${missing[1]} provides key advantages in modularity and scalability, allowing developers to build decoupled, maintainable code structures.`,
    });
  }

  questions.push({
      id: 5,
      category: "Problem Solving",
      question: "Walk me through how you debug a production bug or unexpected API performance bottleneck.",
      hint: "Discuss log analysis, step-by-step reproduction, isolated testing, and code review.",
      sampleAnswer: "I reproduce the issue in an isolated test environment, inspect application logs and network trace tools, isolate the failing function, apply a fix, and run regression tests before deployment.",
  });

  return questions;
}

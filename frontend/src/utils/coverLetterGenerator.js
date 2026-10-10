export function generateCoverLetter({ job, profile, match }) {
  const studentName = profile.name || "Candidate";
  const degree = profile.degree || "Technology Student";
  const branch = profile.branch ? ` in ${profile.branch}` : "";
  const company = job.company || "Hiring Manager";
  const title = job.title || "Internship Role";
  const matchedSkills = match.matchedSkills || [];

  const skillsText =
    matchedSkills.length > 0
      ? matchedSkills.slice(0, 4).join(", ")
      : "software engineering & technical fundamentals";

  const emailSubject = `Application for ${title} - ${studentName}`;

  const pitchText = `Dear ${company} Hiring Team,

I am writing to express my strong interest in the ${title} position at ${company}. As a ${degree}${branch} with hands-on experience in ${skillsText}, I am eager to contribute to your engineering initiatives and grow alongside your team.

Key Highlights of My Profile:
- Proficiency in core technologies: ${skillsText}.
- Strong academic foundation in problem-solving and software development.
- Verified candidate skill alignment score of ${match.matchPercentage}% for this specific position on SkillVoyage.

I would love the opportunity to discuss how my technical skills and enthusiasm make me a strong fit for ${company}.

Thank you for your time and consideration.

Best regards,
${studentName}
${profile.preferredLocation ? `Location: ${profile.preferredLocation}` : ""}`;

  return {
    subject: emailSubject,
    body: pitchText,
  };
}

export const ALLOWED_DOMAINS = [
  "vitstudent.ac.in",
  "vitbhopal.ac.in",
  "vit.ac.in",
  "vitap.ac.in",
  "vitchennai.ac.in",
  "vitc.ac.in",
];

export function isCollegeEmail(email) {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}

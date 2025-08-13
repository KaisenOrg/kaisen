const PREFIX = "kaizen:intro_seen_v1:"; 
const keyFor = (p?: string) => `${PREFIX}${p ?? "anon"}`;

export const hasSeenIntro = (p?: string) => {
  try { return typeof window !== "undefined" && localStorage.getItem(keyFor(p)) === "1"; }
  catch { return false; }
};

export const markIntroSeen = (p?: string) => {
  try { if (typeof window !== "undefined") localStorage.setItem(keyFor(p), "1"); }
  catch {}
};

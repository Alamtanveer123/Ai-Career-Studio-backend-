/**
 * Computes a dynamic match score (0 - 100) between user profile skills and job required skills.
 * Guarantees zero NaN, handles missing/empty arrays defensively.
 */
export function calculateMatchScore(
  jobSkills: string[] | null | undefined,
  userSkills: string[] | null | undefined,
  fallbackScore?: number
): number {
  const safeJobSkills = Array.isArray(jobSkills)
    ? jobSkills.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    : [];

  const safeUserSkills = Array.isArray(userSkills)
    ? userSkills.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    : [];

  // If candidate has no skills listed yet, use fallback or baseline
  if (safeUserSkills.length === 0) {
    if (typeof fallbackScore === 'number' && Number.isFinite(fallbackScore) && fallbackScore > 0) {
      return Math.min(100, Math.max(0, Math.round(fallbackScore)));
    }
    return 75; // Neutral baseline
  }

  // If job has no skills listed, return high default
  if (safeJobSkills.length === 0) {
    return 80;
  }

  const normalizedUserSkills = safeUserSkills.map((s) => s.trim().toLowerCase());
  let matches = 0;

  for (const jobSkill of safeJobSkills) {
    const normalized = jobSkill.trim().toLowerCase();
    const isDirectMatch = normalizedUserSkills.includes(normalized);
    const isPartialMatch = normalizedUserSkills.some(
      (u) => u.includes(normalized) || normalized.includes(u)
    );

    if (isDirectMatch) {
      matches += 1.0;
    } else if (isPartialMatch) {
      matches += 0.6;
    }
  }

  const ratio = Math.min(1.0, matches / Math.max(1, safeJobSkills.length));
  // Score scales from 45 (base relevance) to 98 (perfect match)
  const score = Math.round(45 + ratio * 53);

  if (!Number.isFinite(score) || Number.isNaN(score)) {
    return 75;
  }

  return Math.min(100, Math.max(0, score));
}

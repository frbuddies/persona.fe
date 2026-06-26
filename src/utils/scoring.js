import { PERSONAS } from '../data/personas';
import { ROLES } from '../data/roles';

export function calcPersonaScores(answers) {
  const t = {};
  PERSONAS.forEach((p) => { t[p.id] = 0; });
  Object.values(answers).forEach((opt) => {
    Object.entries(opt.s).forEach(([key, val]) => {
      t[key] = (t[key] || 0) + val;
    });
  });
  return t;
}

export function getSortedPersonas(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({
      ...PERSONAS.find((p) => p.id === id),
      score,
    }));
}

export function calcRoleScores(personaScores) {
  const t = { hunter: 0, farmer: 0, rancher: 0, ordertaker: 0 };
  PERSONAS.forEach((persona) => {
    const s = personaScores[persona.id] || 0;
    Object.entries(persona.roleAffinity).forEach(([role, val]) => {
      t[role] += s * val;
    });
  });
  return t;
}

export function getSortedRoles(roleScores) {
  return Object.entries(roleScores)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({
      ...ROLES.find((r) => r.id === id),
      score,
    }));
}

export function pct(item, max) {
  return max > 0 ? Math.round((item.score / max) * 100) : 0;
}

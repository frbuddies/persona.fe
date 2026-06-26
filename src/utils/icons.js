import {
  Target, Handshake, Zap, Wrench, Lightbulb, Sprout,
  Crosshair, Trees, LayoutGrid, ClipboardList,
} from 'lucide-react';

const personaIconMap = {
  ce: Target,
  ca: Handshake,
  is: Zap,
  re: Wrench,
  cs: Lightbulb,
  st: Sprout,
};

const roleIconMap = {
  hunter: Crosshair,
  farmer: Trees,
  rancher: LayoutGrid,
  ordertaker: ClipboardList,
};

export function getPersonaIcon(id) {
  return personaIconMap[id] || Sprout;
}

export function getRoleIcon(id) {
  return roleIconMap[id] || ClipboardList;
}

export function getIcon(id) {
  return personaIconMap[id] || roleIconMap[id] || Target;
}

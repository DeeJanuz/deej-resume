function normalizeHex(hex: string) {
  const value = hex.trim();
  if (/^#[0-9a-f]{6}$/i.test(value)) {
    return value;
  }

  if (/^#[0-9a-f]{3}$/i.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }

  return "#4b5563";
}

function clampChannel(value: number) {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex);
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (channel: number) =>
    clampChannel(channel).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function mixHex(base: string, target: string, amount: number) {
  const safeAmount = Math.min(1, Math.max(0, amount));
  const left = hexToRgb(base);
  const right = hexToRgb(target);

  return rgbToHex(
    left.r + (right.r - left.r) * safeAmount,
    left.g + (right.g - left.g) * safeAmount,
    left.b + (right.b - left.b) * safeAmount,
  );
}

export function toRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function computeVisualSeed(input: string) {
  return [...input].reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 1),
    0,
  );
}

export function getInitials(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const palette = {
  light: {
    background: '#f3f0e7',
    card: '#faf8f1',
    foreground: '#1d2922',
    primary: '#6d5231',
    primaryForeground: '#faf8f1',
    mutedForeground: '#626b63',
    secondary: '#2d4236',
    secondaryForeground: '#f8f5eb',
  },
  dark: {
    background: '#111a15',
    card: '#1a2820',
    foreground: '#f4f1e7',
    primary: '#d0b477',
    primaryForeground: '#17211b',
    mutedForeground: '#bdc5b8',
    secondary: '#5b715f',
    secondaryForeground: '#fbf9ef',
  },
};

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16) / 255);
}

function relativeLuminance(hex) {
  const channels = hexToRgb(hex).map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function contrast(foreground, background) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

const checks = [
  ['primary on background', 'primary', 'background'],
  ['primary on card', 'primary', 'card'],
  ['primary foreground on primary', 'primaryForeground', 'primary'],
  ['muted foreground on background', 'mutedForeground', 'background'],
  ['muted foreground on card', 'mutedForeground', 'card'],
  ['secondary foreground on secondary', 'secondaryForeground', 'secondary'],
];

for (const [theme, colours] of Object.entries(palette)) {
  console.log(`\n${theme.toUpperCase()} PALETTE`);
  for (const [label, foreground, background] of checks) {
    const ratio = contrast(colours[foreground], colours[background]);
    const outcome = ratio >= 4.5 ? 'PASS' : 'REVIEW';
    console.log(`${outcome.padEnd(6)} ${ratio.toFixed(2)}:1  ${label}`);
  }
}

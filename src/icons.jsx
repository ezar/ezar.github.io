// Line-art icons + glyph rendering for category & UI affordances.
// Stroke-based, monocrome, 1.4px @ 24x24. Keep them sharp and minimal.

function CatIcon({ cat, size = 24, stroke = 1.5 }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  switch (cat) {
    case 'game':
      // Gamepad / controller silhouette
      return (
        <svg {...props}>
          <path d="M6 9 H4 a3 3 0 0 0 -3 3 v0 a3 3 0 0 0 3 3 h0 l1.5 -1.5 h13 L20 15 h0 a3 3 0 0 0 3 -3 v0 a3 3 0 0 0 -3 -3 H18" />
          <path d="M8 12 h2 M9 11 v2" />
          <circle cx="15" cy="11.5" r=".7" fill="currentColor" stroke="none" />
          <circle cx="17" cy="12.5" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'project':
      // Window / app frame
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9 H21" />
          <circle cx="6" cy="6.5" r=".5" fill="currentColor" stroke="none" />
          <circle cx="8" cy="6.5" r=".5" fill="currentColor" stroke="none" />
          <circle cx="10" cy="6.5" r=".5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'mcp':
      // Plug / socket
      return (
        <svg {...props}>
          <path d="M9 3 v4 M15 3 v4" />
          <rect x="7" y="7" width="10" height="6" rx="1.5" />
          <path d="M12 13 v3 a3 3 0 0 0 3 3 h2" />
        </svg>
      );
    case 'agent':
      // Spark / orbit
      return (
        <svg {...props}>
          <path d="M12 4 L13.5 10.5 L20 12 L13.5 13.5 L12 20 L10.5 13.5 L4 12 L10.5 10.5 Z" />
        </svg>
      );
    default:
      return null;
  }
}

function ChevronIcon({ size = 12, dir = 'right' }) {
  const rot = { right: 0, left: 180, up: -90, down: 90 }[dir] || 0;
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M4 2 L8 6 L4 10" />
    </svg>
  );
}

function ArrowOutIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9 L9 3 M4.5 3 H9 V7.5" />
    </svg>
  );
}

function GithubIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function SunIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="2.5" />
      <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M11.07 2.93l-1.06 1.06M3.99 10.01l-1.06 1.06" />
    </svg>
  );
}
function MoonIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 9A5 5 0 1 1 5 2.5a3.5 3.5 0 0 0 6.5 6.5z" />
    </svg>
  );
}
function CloseIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M3 3 L11 11 M11 3 L3 11" />
    </svg>
  );
}

function SearchIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6" cy="6" r="4" />
      <path d="M9.5 9.5 L12 12" />
    </svg>
  );
}

function DotIcon({ size = 6, filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 6 6">
      <circle cx="3" cy="3" r="2.5" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// Project glyph — rendered as a serif monogram letterpress. Used in `glyph` icon mode.
function ProjectGlyph({ text, size = 40, accent }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Instrument Serif", "Times New Roman", serif',
        fontStyle: 'italic',
        fontSize: size * 0.65,
        lineHeight: 1,
        color: accent,
        letterSpacing: '-0.04em',
        fontWeight: 400,
      }}
    >
      {text}
    </div>
  );
}

// Render the right icon for a project based on `iconMode` tweak.
function ProjectIcon({ project, iconMode, size = 28, accent }) {
  if (iconMode === 'emoji') {
    return (
      <span style={{ fontSize: size, lineHeight: 1, display: 'inline-block' }}>
        {window.CATEGORIES[project.cat].legacyEmoji}
      </span>
    );
  }
  if (iconMode === 'glyph') {
    return <ProjectGlyph text={project.glyph} size={size * 1.4} accent={accent} />;
  }
  // line (default)
  return (
    <span style={{ display: 'inline-flex', color: accent }}>
      <CatIcon cat={project.cat} size={size} stroke={1.4} />
    </span>
  );
}

Object.assign(window, {
  CatIcon,
  ChevronIcon,
  ArrowOutIcon,
  GithubIcon,
  SunIcon,
  MoonIcon,
  CloseIcon,
  SearchIcon,
  DotIcon,
  ProjectGlyph,
  ProjectIcon,
});

// Top-level layout pieces: Hero, Filters, Stack aggregate, Now strip, Footer.

const { useMemo, useState } = React;

function Hero({ totalCount, accent }) {
  return (
    <header className="hero">
      <div className="hero-left">
        <h1 className="hero-name">
          César Ramos
          <span className="hero-handle" style={{ color: accent }}>@ezar</span>
        </h1>
        <p className="hero-tagline">
          Industrial AI &amp; maker · Spain — building where technology meets curiosity.
        </p>
      </div>
      <div className="hero-stats">
        <Stat value={totalCount.total} label="Projects" />
        <Stat value={totalCount.games} label="Games" />
        <Stat value={totalCount.live} label="Live" />
        <Stat value={new Date().getFullYear() - 2023} label="Years shipping" />
      </div>
    </header>
  );
}

function Stat({ value, label }) {
  return (
    <div className="stat">
      <div className="stat-num">{String(value).padStart(2, '0')}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filters bar — multi-category, multi-tech, sort + view switcher.

function FiltersBar({
  cats, activeCats, onToggleCat,
  techs, activeTechs, onToggleTech,
  sort, onSort,
  view, onView,
  filtered, total,
  onReset, onSurprise,
}) {
  return (
    <div className="filters">
      <div className="filters-row">
        <span className="filter-label">Filter</span>
        <button
          className={'chip chip-cat' + (activeCats.size === 0 ? ' active' : '')}
          onClick={() => onToggleCat(null)}
        >
          All
        </button>
        {Object.entries(cats).map(([key, c]) => (
          <button
            key={key}
            className={'chip chip-cat' + (activeCats.has(key) ? ' active' : '')}
            data-cat={key}
            onClick={() => onToggleCat(key)}
          >
            <CatIcon cat={key} size={13} stroke={1.5} />
            {c.plural}
          </button>
        ))}
        <span className="filter-sep" />
        <span className="filter-label">Sort</span>
        <div className="seg">
          {[
            ['recent', 'Recent'],
            ['alpha', 'A→Z'],
            ['demo', 'Live first'],
          ].map(([k, l]) => (
            <button
              key={k}
              className={'seg-btn' + (sort === k ? ' active' : '')}
              onClick={() => onSort(k)}
            >
              {l}
            </button>
          ))}
        </div>
        <span className="filter-sep" />
        <span className="filter-label">View</span>
        <div className="seg">
          {[
            ['grid', 'Grid'],
            ['list', 'List'],
            ['map', 'Map'],
          ].map(([k, l]) => (
            <button
              key={k}
              className={'seg-btn' + (view === k ? ' active' : '')}
              onClick={() => onView(k)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="filters-row filters-row-tech">
        <span className="filter-label">Tech</span>
        {techs.map(t => (
          <button
            key={t}
            className={'chip chip-tech' + (activeTechs.has(t) ? ' active' : '')}
            onClick={() => onToggleTech(t)}
          >
            {t}
          </button>
        ))}
        {(activeCats.size > 0 || activeTechs.size > 0) && (
          <button className="chip chip-clear" onClick={onReset}>
            <CloseIcon size={10} /> Reset
          </button>
        )}
        <span style={{ flex: 1 }} />
        <button className="chip chip-surprise" onClick={onSurprise} title="Open a random project">
          ✦ Sorpréndeme
        </button>
        <span className="filter-count">
          <span style={{ color: 'var(--text)' }}>{filtered}</span>
          <span style={{ opacity: 0.5 }}> / {total}</span>
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Aggregated stack — bars sized by usage frequency, ordered by count.

function StackAggregate({ projects }) {
  const tally = useMemo(() => {
    const m = new Map();
    projects.forEach(p => p.tech.forEach(t => m.set(t, (m.get(t) || 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [projects]);
  const max = tally.length ? tally[0][1] : 1;
  return (
    <section className="stack-agg">
      <div className="section-head">
        <h2 className="section-title">Stack</h2>
        <p className="section-sub">Tools I reach for across {projects.length} projects.</p>
      </div>
      <div className="stack-grid">
        {tally.map(([name, count]) => (
          <div key={name} className="stack-row" title={`${count} project${count > 1 ? 's' : ''}`}>
            <span className="stack-name">{name}</span>
            <div className="stack-bar">
              <div className="stack-bar-fill" style={{ width: `${(count / max) * 100}%` }} />
            </div>
            <span className="stack-count">{String(count).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Now strip — what I'm doing right now. Static; user can edit copy directly.

function NowStrip({ accent }) {
  const items = [
    { kw: 'Building', text: 'Brain Twin — AI second brain that maps your personal knowledge graph.' },
    { kw: 'Building', text: 'Zoom Viewer — meeting intelligence layer: transcripts, summaries, action items.' },
    { kw: 'Reading',  text: 'Designing Data-Intensive Applications · revisiting CRDTs.' },
  ];
  return (
    <section className="now">
      <div className="section-head">
        <h2 className="section-title">Right now</h2>
        <p className="section-sub">Live status. Updated when the world changes.</p>
      </div>
      <ul className="now-list">
        {items.map((it, i) => (
          <li key={i} className="now-item">
            <span className="now-kw" style={{ color: accent }}>{it.kw}</span>
            <span className="now-text">{it.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer — contact + social.

function FooterBlock({ accent }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-cell">
          <div className="footer-label">Elsewhere</div>
          <a className="footer-link" href="https://github.com/ezar" target="_blank" rel="noreferrer">
            <GithubIcon size={14} /> github.com/ezar
          </a>
          <a className="footer-link" href="https://www.linkedin.com/in/cesarramoslopez/" target="_blank" rel="noreferrer">
            <span style={{ width: 14, display: 'inline-flex', justifyContent: 'center' }}>in</span> linkedin.com/in/cesarramoslopez
          </a>
        </div>
        <div className="footer-cell">
          <div className="footer-label">Colophon</div>
          <div className="footer-sub">
            Designed &amp; built by hand in 2026. Type: Geist + Instrument Serif + JetBrains Mono.
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} César Ramos</span>
        <span className="footer-mono">v2.0 · last shipped today</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Hero, FiltersBar, StackAggregate, NowStrip, FooterBlock });

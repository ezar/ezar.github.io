// Card primitives + view layouts (grid bento, list, map by category).

const { useMemo } = React;

const CAT_ACCENT = {
  game:    'oklch(0.78 0.14 70)',   // ember / amber
  project: 'oklch(0.78 0.13 165)',  // mint
  mcp:     'oklch(0.74 0.16 285)',  // iris
  agent:   'oklch(0.72 0.16 25)',   // rose
};

// ── Card ─────────────────────────────────────────────────────────────────────
function ProjectCard({ project, iconMode, onOpen, featured = false }) {
  const accent = CAT_ACCENT[project.cat];
  return (
    <article
      className={'card' + (featured ? ' card-featured' : '')}
      onClick={() => onOpen(project)}
      style={{ '--card-accent': accent }}
    >
      <div className="card-rule" />
      <div className="card-head">
        <ProjectIcon project={project} iconMode={iconMode} size={28} accent={accent} />
        <span className="card-tag" style={{ color: accent, borderColor: accent + '33' }}>
          {window.CATEGORIES[project.cat].label}
        </span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-desc">{project.desc}</p>
      </div>

      <div className="card-tech">
        {project.tech.map(t => (
          <span
            key={t}
            className={'pill' + (window.TECH_HIGHLIGHT.includes(t) ? ' pill-hi' : '')}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="card-foot">
        <span className="card-meta">
          <span className={'status-dot' + (project.live ? ' status-on' : '')} />
          {project.live ? 'Live' : 'Source only'} · {project.year}
        </span>
        <span className="card-cta">
          Open <ChevronIcon size={10} dir="right" />
        </span>
      </div>
    </article>
  );
}

// ── List row ─────────────────────────────────────────────────────────────────
function ProjectRow({ project, iconMode, onOpen }) {
  const accent = CAT_ACCENT[project.cat];
  return (
    <button
      className="row"
      onClick={() => onOpen(project)}
      style={{ '--card-accent': accent }}
    >
      <span className="row-icon">
        <ProjectIcon project={project} iconMode={iconMode} size={20} accent={accent} />
      </span>
      <span className="row-title">{project.title}</span>
      <span className="row-tag" style={{ color: accent }}>
        {window.CATEGORIES[project.cat].label}
      </span>
      <span className="row-desc">{project.desc}</span>
      <span className="row-tech">
        {project.tech.slice(0, 4).map(t => (
          <span key={t} className="pill pill-sm">{t}</span>
        ))}
        {project.tech.length > 4 && (
          <span className="pill pill-sm pill-faint">+{project.tech.length - 4}</span>
        )}
      </span>
      <span className="row-year">{project.year}</span>
      <span className="row-status">
        <span className={'status-dot' + (project.live ? ' status-on' : '')} />
      </span>
      <span className="row-open">
        <ChevronIcon size={11} dir="right" />
      </span>
    </button>
  );
}

// ── Grid view (bento) ────────────────────────────────────────────────────────
function GridView({ projects, iconMode, onOpen }) {
  return (
    <div className="grid grid-bento">
      {projects.map(p => (
        <ProjectCard
          key={p.id}
          project={p}
          iconMode={iconMode}
          onOpen={onOpen}
          featured={p.featured}
        />
      ))}
      {projects.length === 0 && (
        <div className="empty">No projects match the current filters.</div>
      )}
    </div>
  );
}

// ── List view ────────────────────────────────────────────────────────────────
function ListView({ projects, iconMode, onOpen }) {
  return (
    <div className="list">
      <div className="list-header">
        <span></span>
        <span>Project</span>
        <span>Type</span>
        <span>Description</span>
        <span>Stack</span>
        <span>Year</span>
        <span></span>
        <span></span>
      </div>
      {projects.map(p => (
        <ProjectRow key={p.id} project={p} iconMode={iconMode} onOpen={onOpen} />
      ))}
      {projects.length === 0 && (
        <div className="empty">No projects match the current filters.</div>
      )}
    </div>
  );
}

// ── Map view — grouped by category, side by side ────────────────────────────
function MapView({ projects, iconMode, onOpen }) {
  const groups = useMemo(() => {
    const g = { game: [], project: [], mcp: [], agent: [] };
    projects.forEach(p => g[p.cat]?.push(p));
    return g;
  }, [projects]);
  const order = ['project', 'agent', 'mcp', 'game'];
  return (
    <div className="map">
      {order.map(key => {
        const items = groups[key];
        const accent = CAT_ACCENT[key];
        const c = window.CATEGORIES[key];
        return (
          <section
            key={key}
            className="map-lane"
            style={{ '--card-accent': accent }}
          >
            <header className="map-lane-head">
              <div className="map-lane-title">
                <CatIcon cat={key} size={16} stroke={1.5} />
                <span>{c.plural}</span>
              </div>
              <span className="map-lane-count">
                {String(items.length).padStart(2, '0')}
              </span>
            </header>
            <div className="map-lane-body">
              {items.map(p => (
                <button
                  key={p.id}
                  className="map-card"
                  onClick={() => onOpen(p)}
                >
                  <div className="map-card-head">
                    <ProjectIcon project={p} iconMode={iconMode} size={18} accent={accent} />
                    <span className="map-card-title">{p.title}</span>
                    {p.live && (
                      <span className="map-card-live" style={{ color: accent }} title="Live">
                        <DotIcon size={5} />
                      </span>
                    )}
                  </div>
                  <p className="map-card-desc">{p.desc}</p>
                  <div className="map-card-tech">
                    {p.tech.slice(0, 3).map(t => (
                      <span key={t} className="pill pill-sm">{t}</span>
                    ))}
                    {p.tech.length > 3 && (
                      <span className="pill pill-sm pill-faint">+{p.tech.length - 3}</span>
                    )}
                  </div>
                </button>
              ))}
              {items.length === 0 && (
                <div className="map-empty">—</div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

Object.assign(window, { CAT_ACCENT, ProjectCard, ProjectRow, GridView, ListView, MapView });

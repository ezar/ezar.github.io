// PreviewOverlay — opens on card click.
// Desktop pane: tries iframe; user can drop a screenshot to override (persisted in localStorage).
// Mobile pane: same idea, narrower aspect.

const { useEffect, useRef, useCallback, useState, useMemo } = React;

function useLocalShot(projectId, kind) {
  const key = `ezar.shot.${projectId}.${kind}`;
  const [src, setSrc] = useState(() => {
    try { return localStorage.getItem(key) || null; } catch { return null; }
  });
  const save = useCallback((dataUrl) => {
    try {
      if (dataUrl) localStorage.setItem(key, dataUrl);
      else localStorage.removeItem(key);
    } catch {}
    setSrc(dataUrl);
  }, [key]);
  return [src, save];
}

const MOBILE_W = 390;

function BrowserBar({ url }) {
  let host = '';
  try { if (url) host = new URL(url).hostname; } catch {}
  return (
    <div className="browser-bar">
      <span className="browser-dots">
        <span className="browser-dot dot-red" />
        <span className="browser-dot dot-yellow" />
        <span className="browser-dot dot-green" />
      </span>
      <span className="browser-url">{host || 'no live demo'}</span>
    </div>
  );
}

function ScreenSlot({ project, kind, accent }) {
  // kind = 'desktop' | 'mobile'
  const [shot, setShot] = useLocalShot(project.id, kind);
  const isSmallScreen = window.innerWidth <= 780;
  const [iframeOk, setIframeOk] = useState(true);
  const [showIframe, setShowIframe] = useState(!isSmallScreen);
  const [dragOver, setDragOver] = useState(false);
  const [scale, setScale] = useState(1);
  const iframeRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (kind !== 'mobile') return;
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      setScale(e.contentRect.width / MOBILE_W);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [kind]);

  // Reset state when project changes
  useEffect(() => {
    setIframeOk(true);
    setShowIframe(true);
  }, [project.id, kind]);

  // Some hosts block embedding via X-Frame-Options / CSP; we can't detect that
  // synchronously, but onload not firing within ~3.5s = likely blocked.
  useEffect(() => {
    if (!project.live || !showIframe) return;
    let done = false;
    const t = setTimeout(() => { if (!done) setIframeOk(false); }, 3500);
    const f = iframeRef.current;
    if (!f) return;
    const onLoad = () => { done = true; clearTimeout(t); };
    f.addEventListener('load', onLoad);
    return () => { f.removeEventListener('load', onLoad); clearTimeout(t); };
  }, [project.live, project.id, kind, showIframe]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = () => setShot(r.result);
    r.readAsDataURL(file);
  }, [setShot]);

  const handlePick = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setShot(r.result);
    r.readAsDataURL(file);
  }, [setShot]);

  const renderInner = () => {
    if (shot) {
      return (
        <div className="screen-content">
          <img src={shot} alt="" className="screen-img" />
          <button
            className="screen-replace"
            onClick={(e) => { e.stopPropagation(); setShot(null); }}
            title="Clear override"
          >
            <CloseIcon size={10} />
          </button>
        </div>
      );
    }
    if (project.live && showIframe && iframeOk) {
      if (kind === 'mobile') {
        return (
          <div ref={wrapRef} style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
            <iframe
              ref={iframeRef}
              src={project.live}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              referrerPolicy="no-referrer"
              title={project.title + ' preview'}
              style={{
                width: MOBILE_W + 'px',
                height: Math.round(MOBILE_W * 19 / 9) + 'px',
                border: 0,
                display: 'block',
                transformOrigin: 'top left',
                transform: `scale(${scale})`,
              }}
            />
          </div>
        );
      }
      return (
        <iframe
          ref={iframeRef}
          src={project.live}
          className="screen-iframe"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          referrerPolicy="no-referrer"
          title={project.title + ' preview'}
        />
      );
    }
    // Placeholder + drop-zone
    return (
      <label
        className={'screen-drop' + (dragOver ? ' is-drag' : '')}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={(e) => e.stopPropagation()}
      >
        <input type="file" accept="image/*" onChange={handlePick} style={{ display: 'none' }} />
        <div className="screen-drop-inner">
          <div className="screen-drop-glyph" style={{ color: accent }}>
            <ProjectGlyph text={project.glyph} size={kind === 'mobile' ? 28 : 56} accent={accent} />
          </div>
          <div className="screen-drop-msg">
            {project.live
              ? 'Embed blocked · drop a screenshot here'
              : 'No live demo · drop a screenshot here'}
          </div>
          <div className="screen-drop-sub">or click to browse</div>
        </div>
      </label>
    );
  };

  if (kind === 'desktop') {
    return (
      <div className="screen screen-desktop">
        <BrowserBar url={project.live} />
        <div className="screen-content-area">{renderInner()}</div>
      </div>
    );
  }
  return (
    <div className="screen screen-mobile">
      {renderInner()}
      <div className="phone-notch" />
      <div className="phone-home-bar" />
    </div>
  );
}

function PreviewOverlay({ project, iconMode, onClose }) {
  // Escape to close
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;
  const accent = window.CAT_ACCENT[project.cat];
  const c = window.CATEGORIES[project.cat];

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="overlay-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ '--card-accent': accent }}
      >
        <header className="overlay-head">
          <div className="overlay-head-left">
            <ProjectIcon project={project} iconMode={iconMode} size={32} accent={accent} />
            <div>
              <div className="overlay-eyebrow" style={{ color: accent }}>
                <CatIcon cat={project.cat} size={11} stroke={1.5} />
                {c.label} · {project.year}
                <span className="overlay-eyebrow-dot">·</span>
                <span className={'status-dot' + (project.live ? ' status-on' : '')} />
                {project.live ? 'Live' : 'Source only'}
                {project.forked && (
                  <>
                    <span className="overlay-eyebrow-dot">·</span>
                    <span className="overlay-fork">↳ fork of {project.forkedFrom}</span>
                  </>
                )}
              </div>
              <h2 className="overlay-title">{project.title}</h2>
            </div>
          </div>
          <button className="overlay-close" onClick={onClose} aria-label="Close">
            <CloseIcon size={14} />
          </button>
        </header>

        <div className="overlay-body">
          <div className="overlay-screens">
            <ScreenSlot project={project} kind="desktop" accent={accent} />
            <ScreenSlot project={project} kind="mobile" accent={accent} />
          </div>

          <section className="overlay-section">
            <div className="overlay-section-label">Overview</div>
            <p className="overlay-desc">{project.desc}</p>
            {project.longDesc && <p className="overlay-desc overlay-long-desc">{project.longDesc}</p>}
          </section>

          <section className="overlay-section">
            <div className="overlay-section-label">Stack</div>
            <div className="overlay-tech">
              {project.tech.map(t => (
                <span
                  key={t}
                  className={'pill pill-lg' + (window.TECH_HIGHLIGHT.includes(t) ? ' pill-hi' : '')}
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="overlay-actions">
            {project.live && (
              <a className="btn btn-primary" href={project.live} target="_blank" rel="noreferrer"
                 style={{ '--card-accent': accent }}>
                <ArrowOutIcon size={12} /> Open live demo
              </a>
            )}
            {project.repo && (
              <a className="btn btn-ghost" href={project.repo} target="_blank" rel="noreferrer">
                <GithubIcon size={14} /> Source on GitHub
              </a>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PreviewOverlay });

// Root app — state, filtering, tweak wiring.

const { useState, useMemo } = React;

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  const [activeCats, setActiveCats] = useState(() => new Set());
  const [activeTechs, setActiveTechs] = useState(() => new Set());
  const [sort, setSort] = useState('recent'); // recent | alpha | demo
  const [view, setView] = useState('grid');   // grid | list | map
  const [openId, setOpenId] = useState(null);

  // Available tech list — picked from highlights and a few extras present in data.
  const techList = useMemo(() => {
    const counts = new Map();
    window.PORTFOLIO_PROJECTS.forEach(p => p.tech.forEach(x => counts.set(x, (counts.get(x) || 0) + 1)));
    // sort by count desc, take top 10
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k]) => k);
  }, []);

  const filtered = useMemo(() => {
    let list = window.PORTFOLIO_PROJECTS.filter(p => {
      const okCat = activeCats.size === 0 || activeCats.has(p.cat);
      const okTech = activeTechs.size === 0 || [...activeTechs].every(t => p.tech.includes(t));
      return okCat && okTech;
    });
    if (sort === 'alpha') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'demo') list = [...list].sort((a, b) => (b.live ? 1 : 0) - (a.live ? 1 : 0));
    else if (sort === 'recent') list = [...list].sort((a, b) => b.year - a.year);
    return list;
  }, [activeCats, activeTechs, sort]);

  const totals = useMemo(() => {
    const all = window.PORTFOLIO_PROJECTS;
    return {
      total: all.length,
      games: all.filter(p => p.cat === 'game').length,
      live: all.filter(p => p.live).length,
    };
  }, []);

  const toggleCat = (key) => {
    if (key === null) { setActiveCats(new Set()); return; }
    setActiveCats(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  const toggleTech = (key) => {
    setActiveTechs(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  const resetFilters = () => { setActiveCats(new Set()); setActiveTechs(new Set()); };

  const onOpen = (p) => setOpenId(p.id);
  const onClose = () => setOpenId(null);
  const openProject = openId
    ? window.PORTFOLIO_PROJECTS.find(p => p.id === openId)
    : null;

  // Density → CSS scale
  const densityClass = 'density-' + t.density;

  // Accent palette → CSS variable on root
  const styleVars = {
    '--accent': t.accent,
    '--accent-soft': t.accent + '22',
  };

  return (
    <div className={'shell ' + densityClass} style={styleVars}>
      <Hero totalCount={totals} accent={t.accent} />

      <div className="filters-sticky">
        <FiltersBar
          cats={window.CATEGORIES}
          activeCats={activeCats}
          onToggleCat={toggleCat}
          techs={techList}
          activeTechs={activeTechs}
          onToggleTech={toggleTech}
          sort={sort} onSort={setSort}
          view={view} onView={setView}
          filtered={filtered.length}
          total={window.PORTFOLIO_PROJECTS.length}
          onReset={resetFilters}
        />
      </div>

      <main className="main">
        {view === 'grid' && <GridView projects={filtered} iconMode={t.iconMode} onOpen={onOpen} />}
        {view === 'list' && <ListView projects={filtered} iconMode={t.iconMode} onOpen={onOpen} />}
        {view === 'map'  && <MapView  projects={filtered} iconMode={t.iconMode} onOpen={onOpen} />}
      </main>

      <NowStrip accent={t.accent} />
      <StackAggregate projects={window.PORTFOLIO_PROJECTS} />
      <FooterBlock accent={t.accent} />

      <PreviewOverlay project={openProject} iconMode={t.iconMode} onClose={onClose} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={['#a39bff', '#d4f165', '#ffb37a', '#7fd1c4']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'comfy', 'spacious']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakRadio
          label="Icon mode"
          value={t.iconMode}
          options={['line', 'glyph', 'emoji']}
          onChange={(v) => setTweak('iconMode', v)}
        />
        <TweakSection label="Defaults" />
        <TweakSelect
          label="Open view"
          value={view}
          options={[
            { value: 'grid', label: 'Grid (bento)' },
            { value: 'list', label: 'List (dense)' },
            { value: 'map',  label: 'Map (by category)' },
          ]}
          onChange={setView}
        />
      </TweaksPanel>
    </div>
  );
}

window.App = App;

// ===== App root =====
const { useState: useS, useEffect: useE } = React;

const ACCENT_VARIANTS = {
  lime:   { h: 145, c: 0.18, l: 0.82 },
  cyan:   { h: 210, c: 0.16, l: 0.78 },
  coral:  { h: 30,  c: 0.18, l: 0.76 },
  violet: { h: 295, c: 0.17, l: 0.78 },
};

function App() {
  const [lang, setLang] = useS(() => localStorage.getItem('lang') || 'en');
  const [tweaks, setTweaks] = useS(window.__TWEAKS__);
  const [editMode, setEditMode] = useS(false);

  const t = window.CONTENT[lang];

  useE(() => { localStorage.setItem('lang', lang); }, [lang]);

  // Apply accent variant
  useE(() => {
    const v = ACCENT_VARIANTS[tweaks.accentVariant] || ACCENT_VARIANTS.lime;
    const root = document.documentElement;
    root.style.setProperty('--accent', `oklch(${v.l} ${v.c} ${v.h})`);
    root.style.setProperty('--accent-soft', `oklch(${v.l} ${v.c} ${v.h} / 0.12)`);
    document.body.classList.toggle('grain', !!tweaks.showGrain);
  }, [tweaks]);

  // Edit mode wiring
  useE(() => {
    function handler(e) {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    }
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  function updateTweak(patch) {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  }

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />
      <Hero t={t} lang={lang} />
      <Services t={t} />
      <Process t={t} />
      <Stack t={t} />
      <Pricing t={t} />
      <Estimator t={t} lang={lang} />
      <Contact t={t} />
      <Footer t={t} />

      {editMode && (
        <div className="tweaks-panel">
          <h4>Tweaks</h4>
          <div className="tweak-row">
            <label>Accent color</label>
            <div className="tweak-swatches">
              {Object.entries(ACCENT_VARIANTS).map(([name, v]) => (
                <div
                  key={name}
                  className={`tweak-swatch ${tweaks.accentVariant===name?'on':''}`}
                  style={{background: `oklch(${v.l} ${v.c} ${v.h})`}}
                  onClick={() => updateTweak({ accentVariant: name })}
                  title={name}
                />
              ))}
            </div>
          </div>
          <div className="tweak-row">
            <label>
              <input type="checkbox" checked={!!tweaks.showGrain} onChange={e => updateTweak({ showGrain: e.target.checked })} style={{marginRight:8}} />
              Film grain overlay
            </label>
          </div>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

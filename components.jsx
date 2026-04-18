// ===== Shared small components =====
const { useState, useEffect, useRef, useMemo } = React;

function Nav({ lang, setLang, t }) {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
            <rect width="32" height="32" rx="6" fill="var(--accent)"/>
            <polyline points="6,8 11,24 16,14 21,24 26,8" stroke="oklch(0.16 0.012 240)" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
          </svg>
          <span style={{letterSpacing:'0.08em',fontSize:'15px',fontWeight:700}}>WLSN</span>
        </div>
        <div className="nav-links">
          <a href="#services">{t.nav.services}</a>
          <a href="#process">{t.nav.process}</a>
          <a href="#stack">{t.nav.stack}</a>
          <a href="#pricing">{t.nav.pricing}</a>
          <a href="#estimator">{t.nav.estimator}</a>
          <a href="#contact">{t.nav.contact}</a>
        </div>
        <div className="nav-right">
          <div className="lang-toggle">
            <button className={lang==='en'?'on':''} onClick={()=>setLang('en')}>EN</button>
            <button className={lang==='de'?'on':''} onClick={()=>setLang('de')}>DE</button>
          </div>
          <a href="#contact" className="btn btn-primary">{t.ctaPrimary} →</a>
        </div>
      </div>
    </nav>
  );
}

function Hero({ t, lang }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-eyebrow">
          <span className="dot"/>
          <span>{t.hero.eyebrow}</span>
        </div>
        {lang === 'en' ? (
          <h1>
            Software,<br/>systems, and <span className="accent">AI</span><br/>
            that <span className="accent2">actually</span> ship.
          </h1>
        ) : (
          <h1>
            Software,<br/>Systeme und <span className="accent">KI,</span><br/>
            die <span className="accent2">wirklich</span> liefern.
          </h1>
        )}
        <p className="hero-sub">{lang === 'en' ? t.hero.sub : t.heroSub}</p>
        <div className="hero-cta">
          <a href="#contact" className="btn btn-primary">{t.ctaPrimary} →</a>
          <a href="#estimator" className="btn btn-ghost">{lang === 'en' ? 'Try the AI estimator' : 'KI-Rechner testen'}</a>
        </div>
        <div className="hero-stats">
          {t.stats.map((s,i) => (
            <div className="hero-stat" key={i}>
              <div className="num">{s.num}</div>
              <div className="lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ label, title, desc, id }) {
  return (
    <div className="section-head" id={id}>
      <div>
        <div className="section-label">{label}</div>
        <h2 className="section-title">{title}</h2>
      </div>
      {desc && <p className="section-desc">{desc}</p>}
    </div>
  );
}

Object.assign(window, { Nav, Hero, SectionHead });

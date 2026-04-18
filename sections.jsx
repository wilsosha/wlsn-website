// ===== Major sections =====
const { useState: uS, useEffect: uE, useRef: uR } = React;

function Services({ t }) {
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHead label={t.servicesLabel} title={t.servicesTitle} desc={t.servicesDesc} />
        <div className="services">
          {t.services.map((s, i) => (
            <div className="service" key={i}>
              <div className="num">{String(i+1).padStart(2,'0')} / {String(t.services.length).padStart(2,'0')}</div>
              <span className={`tag ${s.tag === 'AI' ? 'ai' : 'core'}`}>{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul>{s.stack.map((x,j) => <li key={j}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ t }) {
  return (
    <section className="section" id="process" style={{background: 'var(--bg-elev)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)'}}>
      <div className="container">
        <SectionHead label={t.processLabel} title={t.processTitle} desc={t.processDesc} />
        <div className="process">
          {t.process.map((p,i) => (
            <div className="process-step" key={i}>
              <div className="step-num">{p.num}</div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
              <div className="duration">{p.duration}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stack({ t }) {
  return (
    <section className="section" id="stack">
      <div className="container">
        <SectionHead label={t.stackLabel} title={t.stackTitle} desc={t.stackDesc} />
        <div className="stack-grid">
          {t.stack.map((col,i) => (
            <div className="stack-col" key={i}>
              <h4>{col.title}</h4>
              <ul>{col.items.map((x,j) => <li key={j}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ t }) {
  return (
    <section className="section" id="pricing" style={{background: 'var(--bg-elev)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)'}}>
      <div className="container">
        <SectionHead label={t.pricingLabel} title={t.pricingTitle} desc={t.pricingDesc} />
        <div className="pricing">
          {t.pricing.map((p,i) => (
            <div className={`price-card ${p.featured ? 'featured' : ''}`} key={i}>
              {p.badge && <span className="badge">{p.badge}</span>}
              <div className="plan-name">{p.plan}</div>
              <h3>{p.name}</h3>
              <div className="range">{p.range}</div>
              <div className="timeline">{p.timeline}</div>
              <hr/>
              <ul>{p.features.map((f,j) => <li key={j}>{f}</li>)}</ul>
              <a href="#contact" className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'}`} style={{justifyContent:'center'}}>
                {p.featured ? 'Start →' : 'Enquire'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Estimator({ t, lang }) {
  const [desc, setDesc] = uS('');
  const [type, setType] = uS(t.est.types[0]);
  const [urg, setUrg] = uS(t.est.urgency[1]);
  const [loading, setLoading] = uS(false);
  const [result, setResult] = uS(null);
  const [err, setErr] = uS(null);

  async function run() {
    if (!desc.trim() || loading) return;
    setLoading(true); setErr(null); setResult(null);
    const prompt = `You are an estimation assistant for an independent IT/AI consultant. Based on this project brief, produce a realistic rough estimate. Respond in ${lang === 'de' ? 'German' : 'English'}. Return ONLY valid JSON (no markdown, no code fences) with this exact shape:
{"range": "e.g. €5.000 – €9.000", "timeline": "e.g. 3–5 weeks", "complexity": "Low | Medium | High", "scope": ["bullet", "bullet", "bullet"], "notes": "one short sentence of caveats"}

Project type: ${type}
Timeline preference: ${urg}
Brief: ${desc}`;
    try {
      const raw = await window.claude.complete(prompt);
      // strip any fences just in case
      const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON found');
      const parsed = JSON.parse(match[0]);
      setResult(parsed);
    } catch (e) {
      setErr(lang === 'de' ? 'Konnte die Antwort nicht parsen. Bitte erneut versuchen.' : "Couldn't parse the response. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" id="estimator">
      <div className="container">
        <SectionHead label={t.estLabel} title={t.estTitle} desc={t.estDesc} />
        <div className="estimator-wrap">
          <div className="estimator-head">
            <div className="live"><span className="dot"/><span>LIVE · claude-haiku-4-5</span></div>
            <div>POST /v1/messages</div>
          </div>
          <div className="estimator-body">
            <div>
              <label>{t.est.descLabel}</label>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder={t.est.descPlaceholder} />

              <div style={{marginTop:18}}>
                <label>{t.est.typeLabel}</label>
                <div className="chip-row">
                  {t.est.types.map(x => (
                    <button key={x} className={`chip ${type===x?'on':''}`} onClick={()=>setType(x)}>{x}</button>
                  ))}
                </div>
              </div>

              <div style={{marginTop:18}}>
                <label>{t.est.urgencyLabel}</label>
                <div className="chip-row">
                  {t.est.urgency.map(x => (
                    <button key={x} className={`chip ${urg===x?'on':''}`} onClick={()=>setUrg(x)}>{x}</button>
                  ))}
                </div>
              </div>

              <button className="estimate-btn" onClick={run} disabled={loading || !desc.trim()}>
                {loading ? <><span className="spinner"/>{t.est.btnLoading}</> : <>✦ {t.est.btn}</>}
              </button>
            </div>

            <div className={`estimate-output ${!result && !loading && !err ? 'empty' : ''}`}>
              {!result && !loading && !err && <div>{t.est.emptyState}</div>}
              {loading && <div style={{display:'flex',alignItems:'center',gap:10,color:'var(--fg-dim)',fontFamily:'var(--font-mono)',fontSize:12.5}}><span className="spinner" style={{borderTopColor:'var(--accent-2)', borderColor:'oklch(0.78 0.17 295 / 0.2)'}}/>Analyzing…</div>}
              {err && <div style={{color:'var(--danger)',fontSize:13}}>{err}</div>}
              {result && (
                <>
                  <div className="field-lbl">{t.est.rangeLbl}</div>
                  <div className="range-big">{result.range}</div>
                  <hr/>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                    <div>
                      <div className="field-lbl">{t.est.timelineLbl}</div>
                      <div className="field-val">{result.timeline}</div>
                    </div>
                    <div>
                      <div className="field-lbl">{t.est.complexityLbl}</div>
                      <div className="field-val">{result.complexity}</div>
                    </div>
                  </div>
                  <hr/>
                  <div className="field-lbl">{t.est.scopeLbl}</div>
                  <ul style={{marginTop:8}}>
                    {(result.scope || []).map((s,i) => <li key={i}>{s}</li>)}
                  </ul>
                  {result.notes && <>
                    <hr/>
                    <div className="field-lbl">{t.est.notesLbl}</div>
                    <div style={{color:'var(--fg-dim)',fontSize:13,marginTop:6,fontStyle:'italic'}}>{result.notes}</div>
                  </>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FORMSPREE = 'https://formspree.io/f/xeevgyga';

function Contact({ t }) {
  const [form, setForm] = uS({name:'',email:'',company:'',budget:t.form.budgetOptions[2],message:''});
  const [formOk, setFormOk] = uS(false);
  const [formSending, setFormSending] = uS(false);

  uE(() => {
    if (window.Calendly) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    document.head.appendChild(script);
  }, []);

  async function submit(e) {
    e.preventDefault();
    setFormSending(true);
    try {
      await fetch('https://formspree.io/f/xeevgyga', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          budget: form.budget,
          message: form.message,
          _subject: `New enquiry from ${form.name} — wlsn.ch`
        })
      });
      setFormOk(true);
    } catch(err) { console.error(err); }
    setFormSending(false);
  }

  return (
    <section className="section" id="contact" style={{background: 'var(--bg-elev)', borderTop:'1px solid var(--border)'}}>
      <div className="container">
        <SectionHead label={t.contactLabel} title={t.contactTitle} desc={t.contactDesc} />
        <div className="contact-grid">
          <form className="contact-form" onSubmit={submit}>
            <div className="field-lbl">{t.form.name}</div>
            <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            <div className="field-lbl">{t.form.email}</div>
            <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            <div className="field-lbl">{t.form.company}</div>
            <input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
            <div className="field-lbl">{t.form.budget}</div>
            <select value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}>
              {t.form.budgetOptions.map(o => <option key={o}>{o}</option>)}
            </select>
            <div className="field-lbl">{t.form.message}</div>
            <textarea required placeholder={t.form.messagePh} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
            <button type="submit" className="btn btn-primary" style={{alignSelf:'flex-start'}} disabled={formSending||formOk}>
              {formOk ? '✓ ' + t.form.submitted : formSending ? '...' : t.form.submit + ' →'}
            </button>
          </form>

          <div className="book-card">
            <h3>{t.book.title}</h3>
            <p>{t.book.desc}</p>
            <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-faint)',marginBottom:16,letterSpacing:'0.06em'}}>{t.book.timezone}</div>
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/shami-wlsn/30min?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=1a1f2e&text_color=f0f0ee&primary_color=c8f53a"
              style={{minWidth:'100%',height:'520px'}}
            />
          </div>
        </div>
      </div>
    </section>
  );
}


function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="brand-col">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
                <rect width="32" height="32" rx="6" fill="var(--accent)"/>
                <polyline points="6,8 11,24 16,14 21,24 26,8" stroke="oklch(0.16 0.012 240)" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
              </svg>
              <span style={{letterSpacing:'0.08em',fontSize:'15px',fontWeight:700}}>WLSN</span>
            </div>
            <p>{t.footer.tagline}</p>
          </div>
          <div className="footer-links">
            {t.footer.cols.map((c,i) => (
              <div className="col" key={i}>
                <h5>{c.h}</h5>
                {c.links.map((l,j) => <a key={j} href="#">{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <div>{t.footer.bottom}</div>
          <div>v2.1 · last deploy today</div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Services, Process, Stack, Pricing, Estimator, Contact, Footer });

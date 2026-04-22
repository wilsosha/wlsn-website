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
    const prompt = `You are an estimation assistant for an independent IT/AI consultant based in Zurich, Switzerland. Prices are in CHF. Based on this project brief, produce a realistic rough estimate. Respond in ${lang === 'de' ? 'German' : 'English'}. Return ONLY valid JSON with NO markdown, NO code fences, NO extra text — just the raw JSON object with this exact shape: {"range": "e.g. CHF 2000 - CHF 5000", "timeline": "e.g. 3-5 weeks", "complexity": "Low or Medium or High", "scope": ["bullet point 1", "bullet point 2", "bullet point 3"], "notes": "one short sentence of caveats"}. Project type: ${type}. Timeline preference: ${urg}. Brief: ${desc}`;
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const parsed = await response.json();
      if (parsed.error) throw new Error(parsed.error);
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

                  <hr/>
                  <button
                    className="estimate-btn"
                    style={{marginTop:4,background:'var(--accent)',color:'oklch(0.16 0.012 240)',border:'none',cursor:'pointer'}}
                    onClick={() => {
                      fetch('https://formspree.io/f/xeevgyga', {
                        method:'POST',
                        headers:{'Content-Type':'application/json','Accept':'application/json'},
                        body: JSON.stringify({
                          _subject: 'Estimate locked in — ' + result.range,
                          estimate_range: result.range,
                          timeline: result.timeline,
                          complexity: result.complexity,
                          scope: (result.scope||[]).join(' | '),
                          notes: result.notes,
                          project_description: desc,
                          project_type: type,
                          urgency: urg
                        })
                      });
                      alert('Estimate sent to shami@wlsn.ch — expect a reply within 48h.');
                    }}
                  >
                    Lock in this estimate →
                  </button>
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

  // Calendly qualifier state
  const [qual, setQual] = uS({name:'',email:'',projectType:'',budget:''});
  const [qualDone, setQualDone] = uS(false);
  const [qualErr, setQualErr] = uS(false);

  uE(() => {
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
          _subject: `New project enquiry from ${form.name} — wlsn.ch`
        })
      });
      setFormOk(true);
    } catch(err) { console.error(err); }
    setFormSending(false);
  }

  function unlockCalendly(e) {
    e.preventDefault();
    if (!qual.name || !qual.email || !qual.projectType || !qual.budget) {
      setQualErr(true);
      return;
    }
    setQualErr(false);
    // Send qualifier info to Formspree too
    fetch('https://formspree.io/f/xeevgyga', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({
        name: qual.name,
        email: qual.email,
        projectType: qual.projectType,
        budget: qual.budget,
        _subject: `Discovery call request from ${qual.name} — wlsn.ch`
      })
    });
    setQualDone(true);
  }

  const projectTypes = ['Landing / website', 'Web app / dashboard', 'AI integration', 'Automation', 'RegTech / compliance', 'Not sure yet'];
  const budgets = ['Under CHF 1k', 'CHF 1k–3k', 'CHF 3k–8k', 'CHF 8k–20k', 'CHF 20k+', 'Not sure yet'];

  return (
    <section className="section" id="contact" style={{background: 'var(--bg-elev)', borderTop:'1px solid var(--border)'}}>
      <div className="container">
        <SectionHead label={t.contactLabel} title={t.contactTitle} desc={t.contactDesc} />
        <div className="contact-grid">

          {/* Left: Project enquiry form */}
          <div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--accent)',marginBottom:16}}>Option A — Send a message</div>
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
          </div>

          {/* Right: Calendly with qualifier */}
          <div className="book-card">
            <div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--accent)',marginBottom:16}}>Option B — Book a call</div>
            <h3 style={{marginBottom:8}}>{t.book.title}</h3>
            <p style={{marginBottom:16}}>{t.book.desc}</p>

            {!qualDone ? (
              <form onSubmit={unlockCalendly} style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-dim)',letterSpacing:'0.06em',marginBottom:4}}>
                  Tell me a bit about your project first — this helps me prepare for our call.
                </div>
                <div className="field-lbl">Your name</div>
                <input required value={qual.name} onChange={e=>setQual({...qual,name:e.target.value})} placeholder="Jane Smith" style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,padding:'10px 12px',color:'var(--fg)',fontFamily:'var(--font-body)',fontSize:14,outline:'none'}} />
                <div className="field-lbl">Your email</div>
                <input type="email" required value={qual.email} onChange={e=>setQual({...qual,email:e.target.value})} placeholder="you@company.com" style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,padding:'10px 12px',color:'var(--fg)',fontFamily:'var(--font-body)',fontSize:14,outline:'none'}} />
                <div className="field-lbl">Project type</div>
                <select required value={qual.projectType} onChange={e=>setQual({...qual,projectType:e.target.value})} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,padding:'10px 12px',color:qual.projectType?'var(--fg)':'var(--fg-faint)',fontFamily:'var(--font-body)',fontSize:14,outline:'none',appearance:'none'}}>
                  <option value="">Select a project type...</option>
                  {projectTypes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="field-lbl">Budget range</div>
                <select required value={qual.budget} onChange={e=>setQual({...qual,budget:e.target.value})} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,padding:'10px 12px',color:qual.budget?'var(--fg)':'var(--fg-faint)',fontFamily:'var(--font-body)',fontSize:14,outline:'none',appearance:'none'}}>
                  <option value="">Select a budget range...</option>
                  {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {qualErr && <div style={{color:'var(--danger)',fontSize:13,fontFamily:'var(--font-mono)'}}>Please fill in all fields to continue.</div>}
                <button type="submit" className="btn btn-primary" style={{justifyContent:'center',marginTop:4}}>
                  Show available slots →
                </button>
              </form>
            ) : (
              <>
                <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--accent)',marginBottom:20,letterSpacing:'0.06em'}}>✓ Thanks {qual.name} — pick a slot below</div>
                <p style={{color:'var(--fg-dim)',fontSize:14,marginBottom:24,lineHeight:1.7}}>
                  Click below to open the booking calendar. Choose a time that works for you — you'll get a confirmation email immediately.
                </p>
                <button
                  className="btn btn-primary"
                  style={{width:'100%',justifyContent:'center',fontSize:15,padding:'14px 20px'}}
                  onClick={()=> window.Calendly && window.Calendly.initPopupWidget({url:'https://calendly.com/shami-wlsn/30min?hide_landing_page_details=1&hide_gdpr_banner=1'})}
                >
                  Open booking calendar →
                </button>
                <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-faint)',marginTop:12,textAlign:'center',letterSpacing:'0.05em'}}>
                  30 min · Phone call · Free · CET timezone
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}


function Footer({ t }) {
  const deployDate = window.__DEPLOY_DATE__ || "—";
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
                {c.links.map((l,j) => {
              const href = l === 'LinkedIn' ? 'https://www.linkedin.com/in/shami-wilson-540b94142/' :
                           l === 'shami@wlsn.ch' ? 'mailto:shami@wlsn.ch' :
                           l === 'Book a call' || l === 'Termin buchen' ? '#contact' :
                           l === 'LinkedIn' ? 'https://www.linkedin.com/in/shami-wilson-540b94142/' : '#';
              return <a key={j} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">{l}</a>;
            })}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <div>{t.footer.bottom}</div>
          <div>v2.1 · deployed {deployDate}</div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Services, Process, Stack, Pricing, Estimator, Contact, Footer });

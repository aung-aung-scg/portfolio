import { profile as p } from "@/data/profile";

function Arrow({ down = false }: { down?: boolean }) {
  return <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={down ? "M12 4v16m-6-6 6 6 6-6" : "M5 19 19 5M5 5h14v14"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Tags({ items }: { items: readonly string[] }) {
  return <ul className="tags">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

function SectionHeading({ number, label, title, note, id }: { number: string; label: string; title: string; note?: string; id: string }) {
  return <div className="section-heading"><div><p className="eyebrow"><span>{number}</span>{label}</p><h2 id={id}>{title}</h2></div>{note && <p className="section-note">{note}</p>}</div>;
}

export default function Home() {
  const [github, linkedin, cv, email] = p.links;

  return <>
    <a className="skip-link" href="#main">{p.labels.skip}</a>
    <header className="shell site-header">
      <a href="#" className="wordmark" aria-label={p.name}>{p.nickname.toLowerCase()}<span>.</span></a>
      <nav aria-label={p.presentation.navigationLabel}>{p.navigation.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}</nav>
      <a className="header-contact" href={p.presentation.primaryCtaHref}>{p.presentation.primaryCta}<Arrow /></a>
    </header>

    <main id="main" className="shell">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-topline"><p className="eyebrow hero-identity"><span>{p.name}</span><span className="identity-divider" aria-hidden="true">/</span><span>{p.presentation.role}</span></p><span className="availability"><span className="status-dot" />{p.presentation.availability}</span></div>
        <h1 id="hero-title">{p.headline.split(". ")[0]}<span className="accent">.</span><br /><span className="hero-headline-secondary">{p.headline.split(". ").slice(1).join(". ")}</span></h1>
        <div className="hero-bottom"><div><p className="intro">{p.introduction}</p><div className="hero-location"><span className="location-mark" aria-hidden="true">◎</span>{p.location}<span className="small-divider" />{p.experienceLabel}</div></div><div className="hero-actions"><a className="button button-primary" href={p.presentation.primaryCtaHref}>{p.presentation.primaryCta}<Arrow /></a>{cv.href && <a className="button" href={cv.href} target="_blank" rel="noopener noreferrer" download="Aung-Aung-CV.pdf">{cv.label}<Arrow /></a>}<a className="text-link explore-link" href="#projects">{p.presentation.workCta}<Arrow down /></a></div></div>
      </section>

      <section className="highlights" aria-labelledby="highlights-title"><h2 id="highlights-title" className="sr-only">{p.presentation.highlightsLabel}</h2>{p.presentation.highlights.map((item, i) => <article className={`highlight highlight-${i}`} key={item.title}><p className="highlight-value">{item.value}<span className="highlight-index" aria-hidden="true">0{i + 1}</span></p><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</article>)}</section>

      <section id="projects" className="section projects-section" aria-labelledby="projects-title">
        <SectionHeading number="01" label={p.labels.projects} title={p.labels.projectsIntro} id="projects-title" />
        <div className="projects-grid grid items-stretch gap-5 md:auto-rows-fr md:grid-cols-2">
          {p.projects.map((project, index) => (
            <article key={project.title} className={`project flex h-full min-w-0 flex-col rounded-2xl border p-6 shadow-sm shadow-black/10 transition-[transform,border-color,box-shadow] duration-200 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-lg [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-black/20 motion-reduce:hover:translate-y-0 ${index === 0 ? "border-lime-400/25 bg-lime-400/[0.035] hover:border-lime-400/45" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}>
              <figure className="mb-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 bg-black/30">
                  <img src={project.image} alt={project.alt} width={project.imageWidth} height={project.imageHeight} loading="lazy" className="h-full w-full object-contain p-3" />
                </div>
                <figcaption className="mt-2 text-[11px] leading-relaxed text-white/60">{project.imageCaption}</figcaption>
              </figure>
              <div className="flex flex-1 flex-col">
                <div className="mb-3 flex min-h-10 flex-wrap content-center items-center gap-2">
                  <p className="text-[11px] font-medium tracking-wide text-white/60">{project.category}</p>
                  {index === 0 && <span className="rounded-full bg-lime-400/15 px-2 py-0.5 text-[11px] font-medium text-lime-300">{p.presentation.featured}</span>}
                </div>
                <h3 className="mb-2 text-[26px] leading-tight font-semibold tracking-tight">{project.title}</h3>
                <p className="mb-4 text-[13px] leading-relaxed text-white/65 md:min-h-11">{project.role}</p>
                <div className="mb-5"><Tags items={project.stack} /></div>
                <dl className="mb-6 space-y-4 text-sm leading-7">
                  <div><dt className="mb-1 text-xs font-medium text-white/60">{p.presentation.projectRoleLabel}</dt><dd className="text-white/80">{project.description}</dd></div>
                  <div><dt className="mb-1 text-xs font-medium text-white/60">{p.presentation.projectImpactLabel}</dt><dd className="text-white/80">{project.result}</dd></div>
                </dl>
                <a href={project.href!} className={`mt-auto flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none ${index === 0 ? "border-lime-400/35 bg-lime-400/10 text-lime-200 hover:border-lime-400/60 hover:bg-lime-400/15" : "border-white/20 text-white hover:border-lime-400/40 hover:bg-lime-400/5"}`}>{p.labels.projectLink}<Arrow /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="section" aria-labelledby="skills-title"><SectionHeading number="02" label={p.labels.skills} title={p.labels.skillsIntro} note={p.presentation.skillsNote} id="skills-title" /><div className="skills-grid">{p.skills.map((s, index) => <article className="skill-group" key={s.group}><div className="skill-heading"><h3>{s.group}</h3><span aria-hidden="true">0{index + 1}</span></div><Tags items={s.items} /></article>)}</div></section>

      <section id="experience" className="section" aria-labelledby="experience-title"><SectionHeading number="03" label={p.labels.experience} title={p.labels.experienceIntro} note={p.presentation.experienceNote} id="experience-title" /><div className="experience-layout"><aside className="performance-note"><span className="note-symbol" aria-hidden="true">↗</span><p className="eyebrow">{p.additional.achievementLabel}</p><p>{p.additional.achievement}</p></aside><ol className="timeline">{p.experience.map((e, index) => <li key={e.company}><span className="timeline-dot" aria-hidden="true" /><div className="timeline-top"><span className="timeline-period">{e.period}</span><span className="timeline-index" aria-hidden="true">0{index + 1}</span></div><h3>{e.href ? <a href={e.href}>{e.company}<Arrow /></a> : e.company}</h3><p className="timeline-role">{e.role}</p><p className="timeline-detail">{e.detail}</p></li>)}</ol></div></section>

      <section id="education" className="section" aria-labelledby="education-title"><SectionHeading number="04" label={p.presentation.educationLabel} title={p.presentation.educationHeading} id="education-title" /><div className="education-grid"><article className="education-card"><p className="eyebrow">{p.additional.educationLabel}</p><p className="education-copy">{p.additional.education}</p></article><article className="education-card"><p className="eyebrow">{p.additional.certificationsLabel}</p><ul className="certifications">{p.additional.certifications.map(c => <li key={c}><span aria-hidden="true">↗</span>{c}</li>)}</ul></article><article className="language-row"><h3>{p.additional.languagesLabel}</h3><p>{p.additional.languages}</p></article></div></section>

      <section id="contact" className="contact section" aria-labelledby="contact-title"><div className="contact-top"><p className="eyebrow"><span>05</span>{p.labels.contact}</p><span className="availability"><span className="status-dot" />{p.location}</span></div><h2 id="contact-title">{p.labels.contactIntro}</h2><div className="contact-bottom"><div><p>{p.labels.contactNote}</p><a className="contact-email" href={email.href!}>{email.href!.replace("mailto:", "")}<Arrow /></a><p className="contact-availability">{p.additional.availability}</p></div><a className="contact-round" href={email.href!} aria-label={p.presentation.contactCta}><Arrow /></a></div><nav className="contact-links" aria-label={p.presentation.socialLabel}>{[github, linkedin].map(l => l.href && <a key={l.label} href={l.href}>{l.label}<Arrow /></a>)}</nav></section>
    </main>

    <footer className="shell site-footer"><a href="#" className="wordmark" aria-label={p.name}>{p.nickname.toLowerCase()}<span>.</span></a><span>© {new Date().getFullYear()} {p.name}</span><span>{p.labels.footer}</span></footer>
  </>;
}

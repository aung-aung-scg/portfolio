import { profile as p } from "@/data/profile";
import { ThemeToggle } from "./site-controls";

function Arrow({ down = false }: { down?: boolean }) {
  return <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={down ? "M12 4v16m-6-6 6 6 6-6" : "M5 19 19 5M5 5h14v14"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Tags({ items }: { items: readonly string[] }) {
  return <ul className="tags">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

function CaseCopy({ project }: { project: (typeof p.projects)[number] }) {
  return <dl className="case-copy"><div><dt>{p.labels.problem}</dt><dd>{project.problem}</dd></div><div><dt>{p.labels.role}</dt><dd>{project.role}</dd></div></dl>;
}

export default function Home() {
  const [manabeat, deltadrop] = p.projects;
  return <>
    <a className="skip-link" href="#main">{p.labels.skip}</a>
    <header className="shell site-header">
      <a className="identity" href="#top" aria-label={p.name}><span className="monogram" aria-hidden="true">{p.initials}</span><span>{p.name}</span></a>
      <div className="header-actions"><nav aria-label={p.labels.navigation}>{p.navigation.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}</nav><ThemeToggle lightLabel={p.labels.themeLight} darkLabel={p.labels.themeDark} /></div>
    </header>

    <main id="main" className="shell">
      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-title-block"><p className="eyebrow">{p.location}</p><h1 id="hero-title"><span>{p.headlineLead}</span><em>{p.headlineRest}</em></h1></div>
        <div className="hero-intro"><p>{p.introduction}</p><div className="hero-actions"><a className="button button-primary" href={p.emailHref}>{p.labels.email}<Arrow /></a><a className="button button-secondary" href={p.cv.href} target="_blank" rel="noopener noreferrer" download={p.cv.filename}>{p.cv.label}<Arrow down /></a></div></div>
      </section>

      <section className="proof-grid" aria-label={p.headline}>
        {p.proof.map((item, index) => <article className={`proof proof-${index}`} key={item.label}><p className="proof-value">{item.value}</p><h2>{item.label}</h2><p className="proof-note">{item.note}</p></article>)}
      </section>

      <section id="work" className="work-section section" aria-labelledby="work-title">
        <div className="section-heading" data-reveal><div><p className="eyebrow">{p.labels.work}</p><h2 id="work-title">{p.labels.workHeading}</h2></div><p className="section-note">{p.labels.workNote}</p></div>

        <article id="manabeat" className="case-study case-primary" aria-labelledby="manabeat-title" data-reveal>
          <header className="case-heading"><div><p className="eyebrow">{manabeat.category}</p><h3 id="manabeat-title">{manabeat.title}</h3></div><div className="case-attribution"><span>{manabeat.employer}</span><span>{manabeat.period}</span></div></header>
          <div className="case-top"><figure className="case-figure"><div className="image-stage manabeat-stage"><img src={manabeat.image} alt={manabeat.imageAlt} width={manabeat.imageWidth} height={manabeat.imageHeight} loading="lazy" /></div><figcaption>{manabeat.imageCaption}</figcaption></figure><CaseCopy project={manabeat} /></div>
          <div className="case-bottom"><div className="implementation"><h4>{p.labels.built}</h4><ul>{manabeat.built.map(item => <li key={item}>{item}</li>)}</ul><Tags items={manabeat.stack} /></div><aside className="result-note"><p className="eyebrow">{p.labels.result}</p><p>{manabeat.result}</p><a className="text-link" href={manabeat.href}>{p.labels.liveLink}<Arrow /></a></aside></div>
          <details className="migration-note"><summary><span className="migration-label">{p.migration.label}</span><span className="migration-version"><span>{p.migration.before}</span><Arrow /><strong>{p.migration.after}</strong></span><svg className="disclosure-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M10 4v12" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></summary><div className="migration-content"><h4>{p.migration.title}</h4>{p.migration.paragraphs.map(text => <p key={text}>{text}</p>)}<p className="coverage-note">{p.migration.coverage}</p></div></details>
        </article>

        <article id="deltadrop" className="case-study case-secondary" aria-labelledby="deltadrop-title" data-reveal>
          <figure className="case-figure"><div className="image-stage deltadrop-stage"><img src={deltadrop.image} alt={deltadrop.imageAlt} width={deltadrop.imageWidth} height={deltadrop.imageHeight} loading="lazy" /></div><figcaption>{deltadrop.imageCaption}</figcaption></figure>
          <div className="secondary-content"><header className="case-heading"><div><p className="eyebrow">{deltadrop.category}</p><h3 id="deltadrop-title">{deltadrop.title}</h3></div></header><p className="secondary-attribution">{deltadrop.employer}<span aria-hidden="true"> / </span>{deltadrop.period}</p><CaseCopy project={deltadrop} /><div className="implementation"><h4>{p.labels.built}</h4><ul>{deltadrop.built.map(item => <li key={item}>{item}</li>)}</ul></div><div className="secondary-result"><h4>{p.labels.result}</h4><p>{deltadrop.result}</p></div><Tags items={deltadrop.stack} /><a className="text-link" href={deltadrop.href}>{p.labels.liveLink}<Arrow /></a></div>
        </article>
      </section>

      <section id="skills" className="skills-section section" aria-labelledby="skills-title" data-reveal><h2 className="eyebrow" id="skills-title">{p.labels.tools}</h2><div className="skills-grid">{p.skills.map(skill => <article className="skill-group" key={skill.group}><h3>{skill.group}</h3><Tags items={skill.items} /></article>)}</div></section>

      <section id="experience" className="section experience-section" aria-labelledby="experience-title"><div className="experience-intro" data-reveal><p className="eyebrow">{p.labels.experience}</p><h2 id="experience-title">{p.labels.experienceHeading}</h2><p className="section-note">{p.labels.experienceNote}</p></div><ol className="timeline">{p.experience.map(entry => <li key={entry.company} data-reveal><div className="timeline-meta"><p>{entry.period}</p>{entry.context && <span>{entry.context}</span>}</div><div className="timeline-copy"><h3>{entry.href ? <a href={entry.href}>{entry.company}<Arrow /></a> : entry.company}</h3><p className="timeline-role">{entry.role}</p><p className="timeline-description">{entry.description}</p></div></li>)}</ol></section>

      <section id="education" className="section education-section" aria-labelledby="education-title" data-reveal><div><p className="eyebrow">{p.labels.education}</p><h2 id="education-title">{p.labels.educationHeading}</h2></div><div className="education-copy"><h3>{p.education.degree}</h3><p>{p.education.institution}<span aria-hidden="true"> · </span>{p.education.year}</p><ul>{p.education.certifications.map(cert => <li key={cert}>{cert}</li>)}</ul></div></section>

      <section id="contact" className="section contact-section" aria-labelledby="contact-title" data-reveal><p className="eyebrow">{p.labels.contact}</p><div className="contact-grid"><div><h2 id="contact-title">{p.labels.contactHeading}</h2><a className="contact-email" href={p.emailHref}>{p.email}<Arrow /></a></div><div className="contact-aside"><p>{p.labels.contactCopy}</p><nav className="social-links" aria-label={p.labels.social}>{p.social.map(link => <a key={link.label} href={link.href}>{link.label}<Arrow /></a>)}</nav><a className="cv-text-link" href={p.cv.href} target="_blank" rel="noopener noreferrer" download={p.cv.filename}>{p.cv.label}<Arrow down /></a></div></div></section>
    </main>

    <footer className="shell site-footer"><span>© {new Date().getFullYear()} {p.labels.footer}</span><span>{p.location}</span></footer>
  </>;
}

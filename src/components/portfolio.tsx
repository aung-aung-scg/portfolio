import type { Profile } from "@/data/profile";
import type { CSSProperties } from "react";
import { CopyEmail, CountUp, ExperienceDisclosure, ProjectShowcase, ScrollEffects, ThemeToggle } from "@/app/site-controls";

function Arrow({ down = false }: { down?: boolean }) {
  return <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={down ? "M12 4v16m-6-6 6 6 6-6" : "M5 19 19 5M5 5h14v14"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Tags({ items }: { items: readonly string[] }) {
  return <ul className="tags">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}
function MigrationNote({ p }: { p: Profile }) {
  return <details className="migration-note"><summary><span className="migration-label">{p.migration.label}</span><span className="migration-version"><span>{p.migration.before}</span><Arrow /><strong>{p.migration.after}</strong></span><svg className="disclosure-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M10 4v12" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></summary><div className="migration-content"><h4>{p.migration.title}</h4>{p.migration.paragraphs.map(text => <p key={text}>{text}</p>)}<p className="coverage-note">{p.migration.coverage}</p></div></details>;
}

export default function Portfolio({ p }: { p: Profile }) {
  return <>
    <ScrollEffects />
    <a className="skip-link" href="#main">{p.labels.skip}</a>
    <header className="shell site-header">
      <a className="identity" href="#top"><span className="wordmark">{p.nickname.toLowerCase()}<span>.</span></span><span className="identity-name">{p.name}</span></a>
      <div className="header-actions"><nav className="main-navigation" aria-label={p.labels.navigation}>{p.navigation.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}</nav><div className="display-controls"><nav className="language-switch" aria-label={p.labels.languageNavigation}>{p.languageLinks.map((link, index) => <span key={link.locale}>{index > 0 && <span className="language-divider" aria-hidden="true">|</span>}<a href={link.href} lang={link.locale} aria-label={link.accessible} aria-current={p.locale === link.locale ? "true" : undefined}>{link.label}</a></span>)}</nav><ThemeToggle lightLabel={p.labels.themeLight} darkLabel={p.labels.themeDark} /></div></div>
    </header>
    <main id="main" className="shell" tabIndex={-1}>
      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-portrait"><img src="/projects/profile.jpg" alt={p.profileImageAlt} width={340} height={340} className="profile-photo" /></div>
        <div className="hero-copy"><div className="hero-title-block"><p className="hero-command">{p.heroCommand}</p><h1 id="hero-title"><span>{p.headlineLead}</span><span className="headline-rest">{p.headlineRest}</span></h1></div>
        <div className="hero-intro"><p>{p.introduction}</p><p className="hero-location">{p.location}</p><div className="hero-actions"><a className="button button-primary" href={p.emailHref}>{p.labels.email}<Arrow /></a><a className="button button-secondary" href={p.cv.href} target="_blank" rel="noopener noreferrer" download={p.cv.filename}>{p.cv.label}<Arrow down /></a></div></div>
        <section className="proof-grid hero-proof" aria-label={p.headline}>{p.proof.map((item, index) => <article className={`proof proof-${index}`} key={item.label}><p className="proof-value"><CountUp value={item.value} delay={480 + index * 60} /></p><h2>{item.label}</h2>{item.bars.length > 0 && <div className="proof-bars" aria-hidden="true">{item.bars.map((bar, barIndex) => <div className={`proof-bar ${bar.tone} ${bar.animate ? "query-bar" : ""}`} key={barIndex} style={{ "--bar-ratio": bar.ratio } as CSSProperties}>{bar.label && <span>{bar.label}</span>}<div className="proof-bar-track"><span className="proof-bar-fill" /></div></div>)}</div>}<p className="proof-note">{item.note}</p></article>)}</section></div>
      </section>

      <section id="work" className="work-section section" aria-labelledby="work-title">
        <div className="section-heading" data-reveal><div><p className="eyebrow">{p.labels.work}</p><h2 id="work-title">{p.labels.workHeading}</h2></div><p className="section-note">{p.labels.workNote}</p></div>
        <ProjectShowcase titles={p.projects.map(project => project.title)} labels={{ region: p.labels.carousel, slides: p.labels.carouselSlides, help: p.labels.carouselHelp, previous: p.labels.previousProject, next: p.labels.nextProject, previousShort: p.labels.previousShort, nextShort: p.labels.nextShort }}>
          {p.projects.map(project => <article id={project.id} key={project.id} className={`case-study project-${project.id}`} aria-labelledby={`${project.id}-title`}>
            <header className="case-heading"><div><p className="eyebrow">{project.category}</p><h3 id={`${project.id}-title`}>{project.title}</h3><p className="case-role">{project.roleTitle}</p></div><div className="case-attribution"><span>{project.employer}</span><span>{project.period}</span></div></header>
            <div className="slide-layout">
              <div className="visual-column"><figure className="case-figure"><div className={`image-stage ${project.id}-stage`}><img src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} loading="lazy" /></div><figcaption>{project.imageCaption}</figcaption></figure>{project.id === "manabeat" && <MigrationNote p={p} />}</div>
              <div className="case-text"><dl className="case-copy"><div><dt>{p.labels.problem}</dt><dd>{project.problem}</dd></div><div><dt>{p.labels.role}</dt><dd>{project.role}</dd></div></dl><div className="implementation"><h4>{p.labels.built}</h4><ul>{project.built.map(item => <li key={item}>{item}</li>)}</ul></div><div className="case-result"><h4>{p.labels.result}</h4><p>{project.result}</p></div><div className="interesting-note"><h4>{p.labels.interesting}</h4><p>{project.interesting}</p></div><Tags items={project.stack} /><a className="text-link" href={project.href}>{p.labels.liveLink}<Arrow /></a></div>
            </div>
          </article>)}
        </ProjectShowcase>
      </section>

      <section id="skills" className="skills-section section" aria-labelledby="skills-title" data-reveal><h2 className="eyebrow" id="skills-title">{p.labels.skills}</h2><ul className="skill-years-grid">{p.skillExperience.map(skill => <li className="skill-years-row" key={skill.name} style={{ "--bar-ratio": Math.min(skill.years / 9, 1) } as CSSProperties}><span className="sr-only">{skill.accessible}</span><div className="skill-years-heading" aria-hidden="true"><span>{skill.name}</span><span>{skill.years} {p.labels.skillYears}</span></div><div className="skill-years-track" aria-hidden="true"><span className="skill-years-fill" /></div></li>)}</ul></section>

      <section id="experience" className="section experience-section" aria-labelledby="experience-title"><div className="experience-intro"><p className="eyebrow">{p.labels.experience}</p><h2 id="experience-title">{p.labels.experienceHeading}</h2><p className="section-note">{p.labels.experienceNote}</p></div><ExperienceDisclosure expandLabel={p.labels.expandAll} collapseLabel={p.labels.collapseAll}><ol className="timeline" id="experience-entries">{p.experience.map(entry => <li key={entry.company} data-reveal><div className="timeline-meta"><p>{entry.period}</p>{entry.context && <span>{entry.context}</span>}</div><div className="timeline-copy"><h3>{entry.href ? <a href={entry.href}>{entry.company}<Arrow /></a> : entry.company}</h3><p className="timeline-role">{entry.role}</p><p className="experience-summary">{entry.summary}</p><details className="experience-details"><summary><span className="label-closed">{p.labels.showMore}</span><span className="label-open">{p.labels.showLess}</span><span className="sr-only"> — {entry.company}</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></summary><p className="timeline-description">{entry.description}</p></details></div></li>)}</ol></ExperienceDisclosure></section>

      <section id="education" className="section education-section" aria-labelledby="education-title" data-reveal><div><p className="eyebrow">{p.labels.education}</p><h2 id="education-title">{p.labels.educationHeading}</h2></div><div className="education-copy"><h3>{p.education.degree}</h3><p>{p.education.institution}<span aria-hidden="true"> · </span>{p.education.year}</p><ul className="education-list">{p.education.certifications.map(cert => <li key={cert}>{cert}</li>)}</ul><ul className="education-list language-proficiency">{p.education.languages.map(language => <li key={language}>{language}</li>)}</ul></div></section>

      <section id="contact" className="section contact-section" aria-labelledby="contact-title" data-reveal><p className="eyebrow">{p.labels.contact}</p><h2 id="contact-title">{p.labels.contactHeading}</h2><div className="contact-grid"><div className="email-area"><div className="email-row"><a className="contact-email" href={p.emailHref}>{p.email}<Arrow /></a><CopyEmail email={p.email} label={p.labels.copyEmail} copiedLabel={p.labels.copiedEmail} failedLabel={p.labels.copyFailed} /></div><a className="cv-text-link" href={p.cv.href} target="_blank" rel="noopener noreferrer" download={p.cv.filename}>{p.cv.label}<Arrow down /></a></div><div className="contact-aside"><p>{p.labels.contactCopy}</p><nav className="social-links" aria-label={p.labels.social}>{p.social.map(link => <a key={link.label} href={link.href}>{link.label}<Arrow /></a>)}</nav></div></div></section>
    </main>
    <footer className="shell site-footer"><span>© {new Date().getFullYear()} {p.labels.footer}</span><span>{p.location}</span></footer>
  </>;
}

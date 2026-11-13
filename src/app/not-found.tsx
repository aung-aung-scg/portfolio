import { en, ja } from "@/data/profile";

export default function NotFound() {
  return <main className="shell not-found-page">
    <a className="identity" href="/" aria-label={en.notFound.home}><span className="wordmark">{en.nickname.toLowerCase()}<span>.</span></span></a>
    <p className="eyebrow">404</p>
    <h1>{en.notFound.heading}</h1>
    <p>{en.notFound.description}</p>
    <p lang="ja">{ja.notFound.heading} {ja.notFound.description}</p>
    <nav aria-label={en.labels.languageNavigation}><a className="button button-primary" href="/" lang="en">{en.notFound.home}</a><a className="button button-secondary" href="/ja/" lang="ja">{en.notFound.japanese}</a></nav>
  </main>;
}

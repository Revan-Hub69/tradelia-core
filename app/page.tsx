import { dictionary } from '@/lib/i18n';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-lg">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <h1 className="mb-6">
            {dictionary.hero.title}
          </h1>
          <p className="mb-8 max-w-xl">
            {dictionary.hero.description}
          </p>
          <a href="#verifica" className="btn-primary">
            {dictionary.hero.cta}
          </a>
        </div>
      </section>

      {/* Contesto Section */}
      <section className="section-md bg-muted/30">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <p className="eyebrow mb-4">{dictionary.context.eyebrow}</p>
          <h2 className="mb-6">
            {dictionary.context.title}
          </h2>
          <div className="space-y-4">
            <p>
              {dictionary.context.description1}
            </p>
            <p>
              {dictionary.context.description2}
            </p>
          </div>
        </div>
      </section>

      {/* Funzionamento Section */}
      <section className="section-md">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <p className="eyebrow mb-4">{dictionary.how.eyebrow}</p>
          <h2 className="mb-8">
            {dictionary.how.title}
          </h2>
          <div className="space-y-6">
            <div className="rounded border border-border/50 bg-background p-5 card-interactive">
              <h3 className="mb-2">{dictionary.how.step1.title}</h3>
              <p className="text-sm text-muted-foreground">
                {dictionary.how.step1.description}
              </p>
            </div>
            <div className="rounded border border-border/50 bg-background p-5 card-interactive">
              <h3 className="mb-2">{dictionary.how.step2.title}</h3>
              <p className="text-sm text-muted-foreground">
                {dictionary.how.step2.description}
              </p>
            </div>
            <div className="rounded border border-border/50 bg-background p-5 card-interactive">
              <h3 className="mb-2">{dictionary.how.step3.title}</h3>
              <p className="text-sm text-muted-foreground">
                {dictionary.how.step3.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Esempi Section */}
      <section className="section-md bg-muted/30">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <p className="eyebrow mb-4">{dictionary.examples.eyebrow}</p>
          <h2 className="mb-8">
            {dictionary.examples.title}
          </h2>
          <ul className="space-y-4">
            <li className="list-item">
              <span className="list-bullet" />
              <div>
                <span className="text-sm text-muted-foreground">
                  {dictionary.examples.example1}
                </span>
                <span className="ml-2 badge">{dictionary.examples.badge}</span>
              </div>
            </li>
            <li className="list-item">
              <span className="list-bullet" />
              <div>
                <span className="text-sm text-muted-foreground">
                  {dictionary.examples.example2}
                </span>
                <span className="ml-2 badge">{dictionary.examples.badge}</span>
              </div>
            </li>
            <li className="list-item">
              <span className="list-bullet" />
              <div>
                <span className="text-sm text-muted-foreground">
                  {dictionary.examples.example3}
                </span>
                <span className="ml-2 badge">{dictionary.examples.badge}</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Metodologia Section */}
      <section id="metodologia" className="section-md">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <p className="eyebrow mb-4">{dictionary.methodology.eyebrow}</p>
          <h2 className="mb-6">
            {dictionary.methodology.title}
          </h2>
          <div className="space-y-4">
            <p>
              {dictionary.methodology.description1}
            </p>
            <p>
              {dictionary.methodology.description2}
            </p>
          </div>
        </div>
      </section>

      {/* Limiti Section */}
      <section className="section-md bg-muted/30">
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <p className="eyebrow mb-4">{dictionary.limits.eyebrow}</p>
          <h2 className="mb-6">{dictionary.limits.title}</h2>
          <ul className="space-y-3">
            <li className="list-item">
              <span className="list-bullet" />
              <span className="text-sm text-muted-foreground">
                {dictionary.limits.limit1}
              </span>
            </li>
            <li className="list-item">
              <span className="list-bullet" />
              <span className="text-sm text-muted-foreground">
                {dictionary.limits.limit2}
              </span>
            </li>
            <li className="list-item">
              <span className="list-bullet" />
              <span className="text-sm text-muted-foreground">
                {dictionary.limits.limit3}
              </span>
            </li>
            <li className="list-item">
              <span className="list-bullet" />
              <span className="text-sm text-muted-foreground">
                {dictionary.limits.limit4}
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA Final Section */}
      <section id="verifica" className="section-lg">
        <div className="mx-auto max-w-2xl px-6 sm:px-8 text-center">
          <h2 className="mb-6">
            {dictionary.cta.title}
          </h2>
          <p className="mb-8 max-w-lg mx-auto">
            {dictionary.cta.description}
          </p>
          <a href="/verifica" className="btn-primary">
            {dictionary.cta.button}
          </a>
        </div>
      </section>
    </>
  );
}
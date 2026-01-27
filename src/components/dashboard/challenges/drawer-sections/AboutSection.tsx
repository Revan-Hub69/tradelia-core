/**
 * ABOUT SECTION - Program Drawer
 * Modular component following best practices 2026
 */

import { CheckCircleIcon } from '../PremiumIcons';

type Program = {
  description?: string | null;
  best_for?: string | null;
  pros?: string[];
  cons?: string[];
};

type AboutSectionProps = {
  program: Program;
};

export function AboutSection({ program }: AboutSectionProps) {
  const hasContent =
    program.description || program.best_for || program.pros || program.cons;

  if (!hasContent) {
    return null;
  }

  return (
    <section>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span>🎯</span>
        About This Challenge
      </h3>

      <div className="space-y-4">
        {/* Description */}
        {program.description && (
          <div>
            <p className="leading-relaxed text-foreground">{program.description}</p>
          </div>
        )}

        {/* Best For */}
        {program.best_for && (
          <div>
            <div className="mb-2 text-sm font-bold text-muted-foreground">BEST FOR</div>
            <p className="leading-relaxed text-foreground">{program.best_for}</p>
          </div>
        )}

        {/* Pros & Cons */}
        {(program.pros || program.cons) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Pros */}
            {program.pros && program.pros.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400">
                  <CheckCircleIcon size={16} />
                  Pros
                </h4>
                <ul className="space-y-2">
                  {program.pros.map(pro => (
                    <li key={pro} className="flex gap-2 text-sm">
                      <span className="mt-0.5 text-green-600 dark:text-green-400">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {program.cons && program.cons.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400">
                  <span>⚠️</span>
                  Cons
                </h4>
                <ul className="space-y-2">
                  {program.cons.map(con => (
                    <li key={con} className="flex gap-2 text-sm">
                      <span className="mt-0.5 text-orange-600 dark:text-orange-400">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

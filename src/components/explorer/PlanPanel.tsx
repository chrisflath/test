import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n';
import { useAchievementStore } from '../../stores/achievementStore';
import { findPlansForEco, findPlansByName } from '../../data/openingPlans';

interface PlanPanelProps {
  eco: string;
  openingName: string;
}

export function PlanPanel({ eco, openingName }: PlanPanelProps) {
  const { locale } = useI18n();
  const plan = findPlansForEco(eco) || findPlansByName(openingName);
  const trackedRef = useRef('');

  // Track plans viewed
  useEffect(() => {
    if (plan && plan.eco !== trackedRef.current) {
      trackedRef.current = plan.eco;
      useAchievementStore.getState().incrementStat('plansViewed');
    }
  }, [plan]);

  if (!plan) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">🗺️</div>
        <p className="text-[var(--color-text-muted)] text-base">
          {locale === 'de'
            ? 'Spiele ein paar Zuege um die Eroeffnung zu erkennen...'
            : 'Play a few moves to identify the opening...'}
        </p>
        <p className="text-[var(--color-text-muted)] text-sm mt-2">
          {locale === 'de'
            ? 'Dann zeigen wir dir die besten Plaene!'
            : 'Then we\'ll show you the best plans!'}
        </p>
      </div>
    );
  }

  const hook = locale === 'de' ? plan.hook_de : plan.hook_en;
  const whitePlans = locale === 'de' ? plan.whitePlans_de : plan.whitePlans_en;
  const blackPlans = locale === 'de' ? plan.blackPlans_de : plan.blackPlans_en;
  const keyIdeas = locale === 'de' ? plan.keyIdeas_de : plan.keyIdeas_en;

  return (
    <div className="p-3 space-y-4">
      {/* Opening hook - exciting intro */}
      <div className="bg-[var(--color-surface-2)] rounded-lg p-3 border border-[var(--color-border)]">
        <div className="flex items-start gap-2">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <h4 className="font-bold text-base text-[var(--color-text)]">
              {plan.opening}
            </h4>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 leading-relaxed">
              {hook}
            </p>
          </div>
        </div>
      </div>

      {/* White's plans */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 bg-white rounded-sm inline-block flex-shrink-0" />
          <h4 className="font-bold text-base">
            {locale === 'de' ? 'Plaene fuer Weiss' : 'Plans for White'}
          </h4>
        </div>
        <ul className="space-y-1.5 ml-7">
          {whitePlans.map((plan, i) => (
            <li key={i} className="text-sm text-[var(--color-text)] leading-relaxed flex gap-2">
              <span className="text-green-400 flex-shrink-0">▸</span>
              {plan}
            </li>
          ))}
        </ul>
      </div>

      {/* Black's plans */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 bg-gray-800 rounded-sm inline-block flex-shrink-0 border border-gray-600" />
          <h4 className="font-bold text-base">
            {locale === 'de' ? 'Plaene fuer Schwarz' : 'Plans for Black'}
          </h4>
        </div>
        <ul className="space-y-1.5 ml-7">
          {blackPlans.map((plan, i) => (
            <li key={i} className="text-sm text-[var(--color-text)] leading-relaxed flex gap-2">
              <span className="text-blue-400 flex-shrink-0">▸</span>
              {plan}
            </li>
          ))}
        </ul>
      </div>

      {/* Key ideas */}
      <div className="bg-[var(--color-bg)] rounded-lg p-3 border border-[var(--color-border)]">
        <h4 className="font-bold text-base mb-2 flex items-center gap-2">
          <span className="text-xl">🔑</span>
          {locale === 'de' ? 'Wichtige Ideen' : 'Key Ideas'}
        </h4>
        <ul className="space-y-1.5">
          {keyIdeas.map((idea, i) => (
            <li key={i} className="text-sm text-[var(--color-text-muted)] leading-relaxed flex gap-2">
              <span className="text-yellow-400 flex-shrink-0">★</span>
              {idea}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

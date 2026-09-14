'use client';

/**
 * The trade, scrolled. The loop stays put while Ben's eight lines go by; each line brings its
 * station into view and rings it. The last line reveals the whole loop and reads the raise.
 */

import { LOOP_H, LOOP_W, ModelLoop } from '@/components/model/model-loop';
import { MODEL_STEPS } from '@/lib/data/story-spine';
import type { StationId } from '@/lib/data/model-placemat';
import { FitBox, Scrolly } from './scrolly';

export function ModelScrolly() {
  const steps = MODEL_STEPS.map((step) => ({
    id: step.id,
    body: (
      <div>
        <h3 className="font-display text-[1.75rem] font-semibold leading-[1.12] text-goods-ink text-balance md:text-[2.1rem]">{step.title}</h3>
        {step.line && <p className="mt-4 text-lg leading-relaxed text-[#5d574c]">{step.line}</p>}
      </div>
    ),
  }));

  return (
    <Scrolly
      steps={steps}
      graphic={(active) => {
        const step = MODEL_STEPS[active];
        const last = active === MODEL_STEPS.length - 1;
        const visible = last ? 'all' : new Set<StationId>(MODEL_STEPS.slice(0, active + 1).flatMap((s) => s.reveal));
        return (
          <FitBox w={LOOP_W} h={LOOP_H}>
            <ModelLoop standalone visible={visible} focus={step?.focus ?? []} />
          </FitBox>
        );
      }}
    />
  );
}

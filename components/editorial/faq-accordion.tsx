import { useTranslations } from "next-intl";

interface FaqItem {
  questionKey: string;
  answerKey: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const t = useTranslations("as");

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.questionKey} className="group py-5 px-0">
          <summary className="list-none flex items-center justify-between cursor-pointer">
            <span className="font-serif text-[18px] text-ink">
              {t(item.questionKey as any)}
            </span>
            <span className="text-mute text-[20px] group-open:rotate-45 transition shrink-0 ml-4">
              +
            </span>
          </summary>
          <p className="text-[14px] text-mute mt-4 max-w-2xl">
            {t(item.answerKey as any)}
          </p>
        </details>
      ))}
    </div>
  );
}

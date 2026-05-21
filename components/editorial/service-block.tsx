import { useTranslations } from "next-intl";

interface ServiceBlockProps {
  number: string;
  titleKey: string;
  descKey: string;
  priceKey: string;
  reversed?: boolean;
}

export function ServiceBlock({
  number,
  titleKey,
  descKey,
  priceKey,
  reversed = false,
}: ServiceBlockProps) {
  const t = useTranslations("sv");

  const image = (
    <div className="lg:col-span-5">
      <div
        className="aspect-[4/5] rounded-[4px] relative"
        style={{
          background:
            "linear-gradient(135deg, rgba(201,168,76,.08) 0%, rgba(26,26,46,.06) 100%)",
        }}
      />
    </div>
  );

  const content = (
    <div className="lg:col-span-7 lg:pt-10">
      <div className="flex items-baseline gap-4 mb-3">
        <span className="text-[10px] uppercase tracking-[0.32em] text-gold">
          {number}
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] tracking-[0.2em] uppercase text-mute">
          {t("from")} {t(priceKey as any)}
        </span>
      </div>
      <h2 className="font-serif text-[36px] sm:text-[44px] text-ink leading-tight">
        {t(titleKey as any)}
      </h2>
      <p className="text-[15px] text-mute mt-4 max-w-lg leading-relaxed">
        {t(descKey as any)}
      </p>
    </div>
  );

  return (
    <article className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {reversed ? (
        <>
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div
              className="aspect-[4/5] rounded-[4px] relative"
              style={{
                background:
                  "linear-gradient(135deg, rgba(201,168,76,.08) 0%, rgba(26,26,46,.06) 100%)",
              }}
            />
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 lg:pt-10">
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-[10px] uppercase tracking-[0.32em] text-gold">
                {number}
              </span>
              <span className="h-px flex-1 bg-line" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-mute">
                {t("from")} {t(priceKey as any)}
              </span>
            </div>
            <h2 className="font-serif text-[36px] sm:text-[44px] text-ink leading-tight">
              {t(titleKey as any)}
            </h2>
            <p className="text-[15px] text-mute mt-4 max-w-lg leading-relaxed">
              {t(descKey as any)}
            </p>
          </div>
        </>
      ) : (
        <>
          {content}
          {image}
        </>
      )}
    </article>
  );
}

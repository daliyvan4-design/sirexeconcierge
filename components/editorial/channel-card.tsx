import { useTranslations } from "next-intl";

interface ChannelCardProps {
  channelKey: "ch1" | "ch2" | "ch3";
  statusBadge: string;
  badgeColor?: string;
  iconBg: string;
}

export function ChannelCard({
  channelKey,
  statusBadge,
  badgeColor = "text-mute",
  iconBg,
}: ChannelCardProps) {
  const t = useTranslations("as");

  return (
    <div className="bg-cream p-8 hover:bg-cream2 transition group">
      <div className="flex items-center justify-between">
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        />
        <span
          className={`text-[10px] uppercase tracking-[0.22em] ${badgeColor}`}
        >
          {statusBadge}
        </span>
      </div>
      <p className="text-[10px] uppercase tracking-[0.28em] text-mute mt-8">
        {t(`${channelKey}.k` as any)}
      </p>
      <h3 className="font-serif text-[26px] text-ink mt-2 leading-tight">
        {t(`${channelKey}.h` as any)}
      </h3>
      <p className="text-[18px] text-ink mt-5 font-semibold tabular-nums break-all">
        {t(`${channelKey}.num` as any)}
      </p>
      <p className="text-[12px] text-mute mt-1">
        {t(`${channelKey}.s` as any)}
      </p>
      <div className="h-px bg-line my-6" />
      <span className="text-[12px] text-ink group-hover:text-gold2 inline-flex items-center gap-2">
        {t(`${channelKey}.cta` as any)}{" "}
        <span className="flip-rtl">&rarr;</span>
      </span>
    </div>
  );
}

"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-5 text-center">
      <p className="font-serif text-[28px] text-ink mb-3">Oops</p>
      <p className="text-mute text-[15px] mb-6 max-w-md">
        Une erreur est survenue. Veuillez reessayer.
      </p>
      <button
        onClick={reset}
        className="bg-gold hover:bg-gold2 text-ink rounded-full px-6 py-3 text-[14px] font-semibold"
      >
        Reessayer
      </button>
    </div>
  );
}

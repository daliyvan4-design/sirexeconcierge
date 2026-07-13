import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-5 text-center">
      <p className="font-serif text-[64px] text-gold mb-2">404</p>
      <p className="text-mute text-[15px] mb-6">Page introuvable</p>
      <Link
        href="/"
        className="bg-ink hover:bg-ink2 text-cream rounded-full px-6 py-3 text-[14px] font-medium"
      >
        Retour
      </Link>
    </div>
  );
}

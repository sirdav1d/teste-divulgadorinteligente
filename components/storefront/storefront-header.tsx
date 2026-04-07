import Image from "next/image";

import StorefrontHeroMedia from "./storefront-hero-media";

type StorefrontHeaderProps = {
  selectedCoupon: string | null;
};

export default function StorefrontHeader({
  selectedCoupon,
}: StorefrontHeaderProps) {
  return (
    <header className="relative min-h-[100svh] overflow-hidden rounded-[2.75rem] bg-brand-primary text-white shadow-[var(--shadow-float)]">
      <StorefrontHeroMedia
        posterSrc="/images/storefront-hero-poster.jpg"
        videoSrc="/videos/storefront-hero.mp4"
      />

      <div className="relative flex min-h-[100svh] flex-col justify-between px-6 py-6 sm:px-8 lg:px-12 lg:py-10">
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center rounded-full border border-white/24 bg-white/88 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
            <Image
              src="/brand/divulgador-inteligente-logo.svg"
              alt="Divulgador Inteligente"
              width={176}
              height={64}
              unoptimized
              priority
              className="h-7 w-auto sm:h-8"
            />
          </div>
          <a
            href="#catalogo"
            className="rounded-full border border-white/24 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/14"
          >
            Explorar vitrine
          </a>
        </div>

        <div className="max-w-3xl pb-6 sm:pb-8 lg:pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/72">
            Curadoria em movimento
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            Ofertas em movimento, com acabamento premium.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            Uma vitrine mais refinada para descobrir produtos, abrir cupons e
            navegar por ofertas com ritmo urbano e leitura limpa.
          </p>
          {selectedCoupon ? (
            <p className="mt-8 inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm text-white/88 backdrop-blur-md">
              Cupom ativo: {selectedCoupon}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}

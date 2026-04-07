type StorefrontHeroMediaProps = {
  posterSrc: string;
  videoSrc: string;
};

export default function StorefrontHeroMedia({
  posterSrc,
  videoSrc,
}: StorefrontHeroMediaProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        className="h-full w-full scale-105 object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        preload="metadata"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}

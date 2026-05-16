type Props = {
  productNoun: string;
  isMachine: boolean;
};

export function SetupVideo({ productNoun, isMachine }: Props) {
  // Bed: existing stretch-bed video. Machine: existing hero clip until we shoot a setup walkthrough.
  const src = isMachine ? '/video/hero-mobile.mp4' : '/video/stretch-bed-mobile.mp4';
  const poster = isMachine ? '/video/hero-poster.jpg' : '/video/stretch-bed-poster.jpg';

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b">
        <p className="font-display text-lg font-bold">
          Setting up your {productNoun.toLowerCase()}
        </p>
        <p className="text-xs text-muted-foreground">
          {isMachine
            ? 'A short look at the machine. Full setup walkthrough is on its way.'
            : 'A short look at how the bed goes together. About a minute.'}
        </p>
      </div>
      <video
        className="w-full bg-black"
        controls
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support video playback.
      </video>
    </div>
  );
}

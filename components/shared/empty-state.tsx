type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center shadow-[var(--shadow-quiet)] backdrop-blur-sm sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
        No matching record
      </p>
      <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
        {description}
      </p>
    </section>
  );
}

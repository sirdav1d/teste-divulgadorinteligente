import type { ComponentPropsWithoutRef, ReactNode } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type EmptyProps = ComponentPropsWithoutRef<"section">;

function Empty({ className, ...props }: EmptyProps) {
  return (
    <section
      data-slot="empty"
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-[2rem] border border-border-strong bg-surface px-6 py-12 text-center shadow-(--shadow-soft) sm:px-10",
        className,
      )}
      {...props}
    />
  );
}

type EmptyHeaderProps = ComponentPropsWithoutRef<"div">;

function EmptyHeader({ className, ...props }: EmptyHeaderProps) {
  return (
    <div
      data-slot="empty-header"
      className={cn("mx-auto flex max-w-3xl flex-col items-center", className)}
      {...props}
    />
  );
}

type EmptyMediaProps = ComponentPropsWithoutRef<"div"> & {
  variant?: "default" | "icon";
};

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: EmptyMediaProps) {
  return (
    <div
      data-slot="empty-media"
      className={cn(
        "mb-5 flex items-center justify-center",
        variant === "icon" &&
          "h-14 w-14 rounded-full border border-border-soft bg-surface-muted text-brand-primary-strong shadow-(--shadow-soft)",
        className,
      )}
      {...props}
    />
  );
}

type EmptyTitleProps = ComponentPropsWithoutRef<"h2">;

function EmptyTitle({ className, ...props }: EmptyTitleProps) {
  return (
    <h2
      data-slot="empty-title"
      className={cn(
        "mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-foreground sm:text-4xl",
        className,
      )}
      {...props}
    />
  );
}

type EmptyDescriptionProps = ComponentPropsWithoutRef<"p">;

function EmptyDescription({
  className,
  ...props
}: EmptyDescriptionProps) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "mx-auto mt-4 max-w-xl text-sm leading-7 text-foreground-muted sm:text-base",
        className,
      )}
      {...props}
    />
  );
}

type EmptyContentProps = ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
};

function EmptyContent({ className, ...props }: EmptyContentProps) {
  return (
    <div
      data-slot="empty-content"
      className={cn("mt-6 flex items-center justify-center gap-3", className)}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};

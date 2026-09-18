import clsx from 'clsx';

export function Card({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'border-border bg-panel rounded-2xl border p-6 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

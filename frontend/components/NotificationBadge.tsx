interface Props {
  delivered: boolean;
  error?: string | null;
}

export default function NotificationBadge({ delivered, error }: Props) {
  if (error) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Failed
      </span>
    );
  }

  if (delivered) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Delivered
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
      Pending
    </span>
  );
}

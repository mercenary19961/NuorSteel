interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusColors: Record<string, string> = {
  // General
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',

  // Career listings
  draft: 'bg-yellow-100 text-yellow-700',
  open: 'bg-green-100 text-green-700',
  closed: 'bg-red-100 text-red-700',

  // Applications
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',

  // Contact
  read: 'bg-gray-100 text-gray-600',
  unread: 'bg-blue-100 text-blue-700',
  archived: 'bg-gray-100 text-gray-500',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`inline-flex items-center font-medium rounded-full capitalize ${colorClass} ${sizeClasses[size]}`}>
      {status}
    </span>
  );
}

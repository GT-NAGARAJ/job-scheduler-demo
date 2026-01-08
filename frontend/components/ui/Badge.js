import { clsx } from 'clsx';

const Badge = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800'
  };
  
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant.toLowerCase()] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
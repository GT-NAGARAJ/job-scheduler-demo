import { clsx } from 'clsx';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={clsx(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
};

const Textarea = ({ className, ...props }) => {
  return (
    <textarea
      className={clsx(
        'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
};

const Select = ({ className, children, ...props }) => {
  return (
    <select
      className={clsx(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

const Label = ({ className, ...props }) => {
  return (
    <label
      className={clsx('text-sm font-medium text-gray-700', className)}
      {...props}
    />
  );
};

export { Input, Textarea, Select, Label };
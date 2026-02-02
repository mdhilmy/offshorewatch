export const Card = ({ children, title, subtitle, action, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {(title || subtitle || action) && (
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0 ml-4">{action}</div>}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

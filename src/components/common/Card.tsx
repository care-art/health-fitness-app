import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'gradient';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  description,
  icon,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-2xl shadow-md transition-all duration-300 overflow-hidden';
  
  const variantStyles = {
    default: '',
    interactive: 'cursor-pointer hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:shadow-md',
    gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100',
  };

  const cardContent = (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {(title || icon) && (
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="px-6 pb-6">
        {children}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 rounded-2xl"
      >
        {cardContent}
      </button>
    );
  }

  return cardContent;
};

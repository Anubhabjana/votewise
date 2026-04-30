export default function Logo({ size = 'small', className = '' }) {
  // small: navbar size, large: hero section size
  const iconSize = size === 'large' ? 48 : 32;
  const textSize = size === 'large' ? 'text-4xl' : 'text-xl';
  const logoColor = size === 'large' ? 'text-[var(--color-navy)]' : 'text-white';
  const margin = size === 'large' ? 'ml-4' : 'ml-2';

  return (
    <div className={`flex items-center ${className}`}>
      {/* Icon */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Circular Ballot Base */}
        <circle cx="50" cy="50" r="45" fill="#000080" />
        <circle cx="50" cy="50" r="40" fill="white" />
        
        {/* Subtle fingerprint pattern (simplified) inside the check field */}
        <path d="M 35 40 Q 50 30 65 40" stroke="#E2E8F0" strokeWidth="2" fill="none" />
        <path d="M 30 50 Q 50 35 70 50" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <path d="M 35 60 Q 50 45 65 60" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="2 4" fill="none" />
        <path d="M 40 70 Q 50 55 60 70" stroke="#E2E8F0" strokeWidth="2" fill="none" />

        {/* Bold Checkmark (Saffron) */}
        <path 
          d="M 30 50 L 45 65 L 75 35" 
          stroke="#FF9933" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Ballot Slip Drop Box Edge */}
        <path d="M 10 90 L 90 90" stroke="#000080" strokeWidth="6" />
      </svg>
      
      {/* Text */}
      <span className={`font-bold tracking-wider ${margin} ${textSize}`}>
        <span className={logoColor}>Vote</span><span className="text-[var(--color-saffron)]">Wise</span>
      </span>
    </div>
  );
}

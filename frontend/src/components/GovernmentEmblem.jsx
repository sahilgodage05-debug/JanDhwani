// Official Government of India State Emblem (Lion Capital of Ashoka) & National DPI Branding
export function IndiaEmblemSvg({ className = "emblem-icon", size = 44, color = "#5d4037" }) {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 100 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="State Emblem of India"
    >
      {/* Central Lion Head */}
      <path 
        d="M50 8C43 8 38 12 37 18C35 22 34 27 34 32C34 37 36 41 39 44C38 46 36 48 35 52C34 56 36 60 39 63C42 66 46 67 50 67C54 67 58 66 61 63C64 60 66 56 65 52C64 48 62 46 61 44C64 41 66 37 66 32C66 27 65 22 63 18C62 12 57 8 50 8Z" 
        fill={color}
      />
      {/* Left Lion Silhouette */}
      <path 
        d="M34 20C28 20 22 25 20 31C18 36 18 43 20 49C22 54 25 58 29 61C32 63 35 64 37 64C35 60 34 55 35 50C36 44 38 40 37 34C36 29 35 24 34 20Z" 
        fill={color}
        opacity="0.88"
      />
      {/* Right Lion Silhouette */}
      <path 
        d="M66 20C72 20 78 25 80 31C82 36 82 43 80 49C78 54 75 58 71 61C68 63 65 64 63 64C65 60 66 55 65 50C64 44 62 40 63 34C64 29 65 24 66 20Z" 
        fill={color}
        opacity="0.88"
      />
      {/* Mane & Facial Detail Accents */}
      <path d="M47 24C47 22 53 22 53 24C53 28 47 28 47 24Z" fill="#ffffff" opacity="0.3" />
      <path d="M44 32C42 32 42 35 44 35C46 35 46 32 44 32Z" fill="#ffffff" opacity="0.5" />
      <path d="M56 32C54 32 54 35 56 35C58 35 58 32 56 32Z" fill="#ffffff" opacity="0.5" />
      <path d="M50 38L47 43H53L50 38Z" fill="#ffffff" opacity="0.6" />
      <path d="M44 48C47 51 53 51 56 48" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Abacus Base Platform */}
      <rect x="22" y="68" width="56" height="5" rx="1.5" fill={color} />
      <rect x="18" y="74" width="64" height="4" rx="1" fill={color} />

      {/* Ashoka Chakra (Dharma Wheel in center of Abacus) */}
      <circle cx="50" cy="85" r="7" stroke={color} strokeWidth="1.8" fill="none" />
      <circle cx="50" cy="85" r="1.5" fill={color} />
      {/* 24-Spokes Representation */}
      <line x1="50" y1="78" x2="50" y2="92" stroke={color} strokeWidth="0.8" />
      <line x1="43" y1="85" x2="57" y2="85" stroke={color} strokeWidth="0.8" />
      <line x1="45" y1="80" x2="55" y2="90" stroke={color} strokeWidth="0.8" />
      <line x1="55" y1="80" x2="45" y2="90" stroke={color} strokeWidth="0.8" />
      <line x1="47.3" y1="78.5" x2="52.7" y2="91.5" stroke={color} strokeWidth="0.6" />
      <line x1="52.7" y1="78.5" x2="47.3" y2="91.5" stroke={color} strokeWidth="0.6" />
      <line x1="43.5" y1="82.3" x2="56.5" y2="87.7" stroke={color} strokeWidth="0.6" />
      <line x1="43.5" y1="87.7" x2="56.5" y2="82.3" stroke={color} strokeWidth="0.6" />

      {/* Flanking Animals on Base (Bull on right, Horse on left) */}
      <path d="M28 82C30 80 34 82 35 85C34 87 31 88 28 87C26 86 26 83 28 82Z" fill={color} opacity="0.7" />
      <path d="M72 82C74 80 66 82 65 85C66 87 69 88 72 87C74 86 74 83 72 82Z" fill={color} opacity="0.7" />

      {/* Bell-shaped Lotus Base */}
      <path 
        d="M20 93C26 95 38 98 50 98C62 98 74 95 80 93C78 97 72 101 50 101C28 101 22 97 20 93Z" 
        fill={color}
      />
      <rect x="26" y="102" width="48" height="3" rx="1.5" fill={color} />

      {/* National Motto: Satyameva Jayate (सत्यमेव जयते) */}
      <text 
        x="50" 
        y="114" 
        textAnchor="middle" 
        fontSize="7.5" 
        fontWeight="800" 
        fontFamily="sans-serif" 
        fill={color}
        letterSpacing="0.6"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
}

export default function GovernmentEmblem({ size = 42, compact = false, theme = 'light' }) {
  const isDark = theme === 'dark';
  const emblemColor = isDark ? '#ffd54f' : '#3e2723';

  return (
    <div className={`gov-emblem-header-wrapper ${compact ? 'compact-emblem' : ''} ${isDark ? 'dark-theme-emblem' : ''}`}>
      <IndiaEmblemSvg size={size} color={emblemColor} />
      <div className="gov-text-block">
        <div className="gov-hindi-line">जनध्वनि प्लेटफॉर्म</div>
        <div className="gov-english-line">JanDhwani Citizen Portal</div>
        {!compact && (
          <div className="gov-dept-subline">
            National Digital Public Infrastructure (DPI)
          </div>
        )}
      </div>
    </div>
  );
}

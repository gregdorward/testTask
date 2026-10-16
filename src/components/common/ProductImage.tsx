interface Props {
  image: string;
  className?: string;
}

/**
 * Self-contained, original vector product mockups (men's & women's t-shirts,
 * shorts, headset, cap) rendered as inline SVG, each carrying the real Waracle
 * logo. No external photography is used, so the catalogue is fully offline and
 * free of any third-party image rights.
 */

function BrandLogo({ cx, cy, w, light }: { cx: number; cy: number; w: number; light: boolean }) {
  const h = w * (122 / 724);
  return (
    <image
      href={light ? '/logo-dark.png' : '/logo-white.png'}
      x={cx - w / 2}
      y={cy - h / 2}
      width={w}
      height={h}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

interface Palette {
  id: string;
  c1: string;
  c2: string;
  c3: string;
  collar: string;
  collarOpacity: number;
  rib: string;
  shade: number;
  fold: string;
  light: boolean; // true => dark logo on light fabric
}

const TEE: Record<string, Palette> = {
  black: { id: 'black', c1: '#2a2a2a', c2: '#141414', c3: '#000000', collar: '#000000', collarOpacity: 0.5, rib: '#444444', shade: 0.16, fold: '#333333', light: false },
  white: { id: 'white', c1: '#ffffff', c2: '#f2f2f4', c3: '#e7e7eb', collar: '#ccccd2', collarOpacity: 0.7, rib: '#d2d2d8', shade: 0.05, fold: '#d6d6dc', light: true },
  grey: { id: 'grey', c1: '#d6d9de', c2: '#bfc2c9', c3: '#a8acb3', collar: '#90949b', collarOpacity: 0.5, rib: '#9aa0a8', shade: 0.1, fold: '#9398a0', light: true },
};

// Men's relaxed-fit crew tee.
function TeeMen({ p }: { p: Palette }) {
  const grad = `teem-${p.id}`;
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <defs>
        <linearGradient id={grad} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={p.c1} /><stop offset="0.45" stopColor={p.c2} /><stop offset="1" stopColor={p.c3} />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="214" rx="66" ry="8" fill="#000" opacity="0.07" />
      <path
        d="M92 50 C100 45 140 45 148 50 C158 51 168 55 178 61 L200 76 C203 78 204 82 201 86 L184 112 C182 115 178 115 175 112 L168 104 L170 198 C170 202 167 205 163 205 L77 205 C73 205 70 202 70 198 L72 104 L65 112 C62 115 58 115 56 112 L39 86 C36 82 37 78 40 76 L62 61 C72 55 82 51 92 50 Z"
        fill={`url(#${grad})`}
      />
      <path d="M92 50 C103 65 137 65 148 50 C143 60 132 65 120 65 C108 65 97 60 92 50 Z" fill={p.collar} opacity={p.collarOpacity} />
      <path d="M95 51 C105 63 135 63 145 51" fill="none" stroke={p.rib} strokeWidth="3" strokeLinecap="round" />
      <path d="M70 104 C76 100 86 99 96 100" stroke="#000" strokeWidth="2" opacity="0.25" fill="none" />
      <path d="M170 104 C164 100 154 99 144 100" stroke="#000" strokeWidth="2" opacity="0.25" fill="none" />
      <path d="M70 104 L72 198 C72 202 75 205 79 205 L94 205 L94 104 Z" fill="#000" opacity={p.shade} />
      <path d="M170 104 L168 198 C168 202 165 205 161 205 L146 205 L146 104 Z" fill="#000" opacity={p.shade} />
      <path d="M104 116 C108 150 108 180 105 202" stroke={p.fold} strokeWidth="2" fill="none" opacity="0.45" />
      <path d="M136 116 C132 150 132 180 135 202" stroke={p.fold} strokeWidth="2" fill="none" opacity="0.45" />
      <BrandLogo cx={120} cy={118} w={88} light={p.light} />
    </svg>
  );
}

// Women's fitted tee: tapered waist, cap sleeves, scooped neck.
function TeeWomen({ p }: { p: Palette }) {
  const grad = `teew-${p.id}`;
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <defs>
        <linearGradient id={grad} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={p.c1} /><stop offset="0.45" stopColor={p.c2} /><stop offset="1" stopColor={p.c3} />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="210" rx="54" ry="8" fill="#000" opacity="0.07" />
      <path
        d="M98 52 C106 47 134 47 142 52 C152 54 162 58 170 64 L188 78 C191 80 192 84 189 88 L174 110 C172 113 168 113 166 110 L160 102 C160 102 158 130 156 152 C154 174 150 190 147 200 C146 203 144 204 141 204 L99 204 C96 204 94 203 93 200 C90 190 86 174 84 152 C82 130 80 102 80 102 L74 110 C72 113 68 113 66 110 L51 88 C48 84 49 80 52 78 L70 64 C78 58 88 54 98 52 Z"
        fill={`url(#${grad})`}
      />
      <path d="M98 52 C107 67 133 67 142 52 C136 62 130 67 120 67 C110 67 104 62 98 52 Z" fill={p.collar} opacity={p.collarOpacity} />
      <path d="M101 53 C109 65 131 65 139 53" fill="none" stroke={p.rib} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M84 152 C86 174 90 190 93 200 C94 203 96 204 99 204 L112 204 L110 112 L86 114 Z" fill="#000" opacity={p.shade} />
      <path d="M156 152 C154 174 150 190 147 200 C146 203 144 204 141 204 L128 204 L130 112 L154 114 Z" fill="#000" opacity={p.shade} />
      <path d="M106 118 C108 152 108 182 106 202" stroke={p.fold} strokeWidth="1.8" fill="none" opacity="0.45" />
      <path d="M134 118 C132 152 132 182 134 202" stroke={p.fold} strokeWidth="1.8" fill="none" opacity="0.45" />
      <BrandLogo cx={120} cy={118} w={78} light={p.light} />
    </svg>
  );
}

interface ShortsPalette {
  id: string;
  c1: string;
  c2: string;
  c3: string;
  band: string;
}
const SHORTS: Record<string, ShortsPalette> = {
  black: { id: 'black', c1: '#262626', c2: '#141414', c3: '#040404', band: '#1e1e1e' },
  heather: { id: 'heather', c1: '#5c6066', c2: '#44474d', c3: '#2b2d31', band: '#3e4146' },
};

function Shorts({ p }: { p: ShortsPalette }) {
  const grad = `shorts-${p.id}`;
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <defs>
        <linearGradient id={grad} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={p.c1} /><stop offset="0.5" stopColor={p.c2} /><stop offset="1" stopColor={p.c3} />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="202" rx="66" ry="8" fill="#000" opacity="0.07" />
      <path
        d="M60 72 C60 67 64 64 69 64 L171 64 C176 64 180 67 180 72 L177 122 C176 152 173 172 169 190 C168 194 165 196 161 196 L139 196 C135 196 132 194 131 190 L123 140 C122 133 118 133 117 140 L109 190 C108 194 105 196 101 196 L79 196 C75 196 72 194 71 190 C67 172 64 152 63 122 Z"
        fill={`url(#${grad})`}
      />
      <path d="M60 72 C60 67 64 64 69 64 L171 64 C176 64 180 67 180 72 L179 88 L61 88 Z" fill={p.band} />
      <rect x="60" y="86" width="120" height="3" fill="#000" opacity="0.4" />
      <path d="M112 88 C110 99 110 108 113 116" stroke="#000" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M128 88 C130 99 130 108 127 116" stroke="#000" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M63 122 C64 152 67 172 71 190 C72 194 75 196 79 196 L92 196 L96 122 Z" fill="#000" opacity="0.2" />
      <path d="M177 122 C176 152 173 172 169 190 C168 194 165 196 161 196 L148 196 L144 122 Z" fill="#000" opacity="0.2" />
      <path d="M86 98 C84 132 84 162 87 188" stroke="#000" strokeWidth="2" fill="none" opacity="0.25" />
      <path d="M154 98 C156 132 156 162 153 188" stroke="#000" strokeWidth="2" fill="none" opacity="0.25" />
      <BrandLogo cx={94} cy={154} w={44} light={false} />
    </svg>
  );
}

function Headset() {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <defs>
        <linearGradient id="hs-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3a3a" /><stop offset="1" stopColor="#0c0c0c" /></linearGradient>
        <linearGradient id="hs-cup" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stopColor="#454545" /><stop offset="0.55" stopColor="#1c1c1c" /><stop offset="1" stopColor="#000" /></linearGradient>
        <radialGradient id="hs-pad" cx="0.42" cy="0.4" r="0.75"><stop offset="0" stopColor="#2e2e2e" /><stop offset="1" stopColor="#000" /></radialGradient>
      </defs>
      <ellipse cx="120" cy="208" rx="60" ry="8" fill="#000" opacity="0.07" />
      <path d="M54 154 L54 116 C54 62 86 38 120 38 C154 38 186 62 186 116 L186 154" fill="none" stroke="url(#hs-band)" strokeWidth="18" strokeLinecap="round" />
      <path d="M62 120 C62 72 88 50 120 50 C152 50 178 72 178 120" fill="none" stroke="#000" strokeWidth="4" opacity="0.3" />
      <path d="M72 60 C92 47 120 45 150 56" stroke="#5a5a5a" strokeWidth="3.5" fill="none" opacity="0.55" strokeLinecap="round" />
      <rect x="47" y="120" width="14" height="40" rx="7" fill="#161616" />
      <rect x="179" y="120" width="14" height="40" rx="7" fill="#161616" />
      <rect x="34" y="140" width="50" height="72" rx="24" fill="url(#hs-cup)" />
      <ellipse cx="59" cy="176" rx="17" ry="28" fill="url(#hs-pad)" />
      <ellipse cx="59" cy="176" rx="17" ry="28" fill="none" stroke="#000" strokeWidth="2" opacity="0.5" />
      <rect x="156" y="140" width="50" height="72" rx="24" fill="url(#hs-cup)" />
      <ellipse cx="181" cy="176" rx="17" ry="28" fill="url(#hs-pad)" />
      <ellipse cx="181" cy="176" rx="17" ry="28" fill="none" stroke="#000" strokeWidth="2" opacity="0.5" />
      <path d="M181 210 C181 222 170 226 158 224" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Cap() {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <defs>
        <linearGradient id="cap-crown" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#222" /><stop offset="0.6" stopColor="#0f0f0f" /><stop offset="1" stopColor="#000" /></linearGradient>
        <linearGradient id="cap-brim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#151515" /><stop offset="1" stopColor="#000" /></linearGradient>
      </defs>
      <ellipse cx="120" cy="184" rx="74" ry="9" fill="#000" opacity="0.06" />
      <path d="M58 150 C70 176 176 176 214 158 C220 155 219 147 212 146 C170 150 120 150 120 150 L92 150 C78 150 64 150 58 150 Z" fill="url(#cap-brim)" />
      <path d="M60 152 C56 104 84 66 120 66 C156 66 184 104 180 152 C150 160 90 160 60 152 Z" fill="url(#cap-crown)" />
      <path d="M120 78 L120 156" stroke="#000" strokeWidth="2.5" opacity="0.4" />
      <path d="M94 80 C88 110 86 132 88 155" stroke="#000" strokeWidth="2" opacity="0.3" fill="none" />
      <path d="M146 80 C152 110 154 132 152 155" stroke="#000" strokeWidth="2" opacity="0.3" fill="none" />
      <circle cx="120" cy="66" r="5" fill="#1a1a1a" />
      <BrandLogo cx={120} cy={116} w={52} light={false} />
    </svg>
  );
}

export default function ProductImage({ image, className = '' }: Props) {
  let art;
  switch (image) {
    case 'tshirt-black':
      art = <TeeMen p={TEE.black} />;
      break;
    case 'tshirt-white':
      art = <TeeMen p={TEE.white} />;
      break;
    case 'tshirt-grey':
      art = <TeeMen p={TEE.grey} />;
      break;
    case 'tee-w-black':
      art = <TeeWomen p={TEE.black} />;
      break;
    case 'tee-w-white':
      art = <TeeWomen p={TEE.white} />;
      break;
    case 'shorts-black':
      art = <Shorts p={SHORTS.black} />;
      break;
    case 'shorts-heather':
      art = <Shorts p={SHORTS.heather} />;
      break;
    case 'headset':
      art = <Headset />;
      break;
    case 'cap':
      art = <Cap />;
      break;
    default:
      art = <TeeMen p={TEE.black} />;
  }

  return (
    <div className={`flex items-center justify-center bg-clay/40 ${className}`}>
      <div className="h-3/4 w-3/4">{art}</div>
    </div>
  );
}

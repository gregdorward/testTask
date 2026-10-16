import Logo from '../common/Logo';

const values = [
  'Raise The Bar',
  'Bring Others With You',
  'Make It Count',
  'Work In The Open',
  'Enjoy The Journey',
];

export default function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden rounded-3xl bg-obsidian p-10 text-white lg:flex">
      <Logo variant="light" />

      <div>
        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight">
          Digital products trusted by millions of people
        </h1>
        <p className="mt-5 max-w-xs text-white/60">
          Official Waracle apparel and gear for the people who build them.
        </p>
      </div>

      <ul className="space-y-3.5">
        {values.map((label) => (
          <li key={label} className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <svg className="h-4 w-4 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
              </svg>
            </span>
            <span className="text-sm font-medium">{label}</span>
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-clay/10 blur-3xl" />
    </div>
  );
}

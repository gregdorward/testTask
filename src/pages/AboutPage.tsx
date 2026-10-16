import { Link } from 'react-router-dom';

const TAGLINE = 'Digital products trusted by millions of people';

const values = [
  { title: 'Raise The Bar', body: 'We treat every brief as a chance to raise the standard, for our clients, our craft and our own growth.' },
  { title: 'Bring Others With You', body: 'We lead with empathy and succeed as one team, lifting the people around us as we go.' },
  { title: 'Make It Count', body: 'We are deliberate about where we spend our effort, focusing on work that delivers genuine value.' },
  { title: 'Work In The Open', body: 'We stay transparent with each other and our partners, showing our thinking and sharing progress early.' },
  { title: 'Enjoy The Journey', body: 'We care about the craft and the people, and we make sure the work is something we enjoy doing.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-obsidian text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">About Waracle</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {TAGLINE}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Waracle is a UK digital product consultancy. For two decades we have designed and engineered
            mobile, web and emerging-technology products for ambitious organisations, with a focus on
            regulated sectors such as financial services, health, energy and the public sector.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight">For us, it is always about the people</h2>
        <div className="mt-6 space-y-5 text-obsidian/70">
          <p>
            We have built a community of expert technologists, designers and AI-enabled craftspeople who
            thrive on creating digital experiences that scale and make a real difference. We collaborate
            closely with our clients' digital, data and technology teams to turn complex challenges into
            products that are secure, effective and genuinely useful.
          </p>
          <p>
            Today we are a team of around 300 people working across the UK and Bulgaria, partnering with
            some of the most innovative businesses in their fields. We are curious, proactive and always
            learning, continuously improving ourselves and our skills, and we measure ourselves by the
            impact our work has for the people who use it.
          </p>
          <p>
            Our culture is values-led. We lead with empathy, build trust, celebrate every contribution and
            create a space where everyone has the opportunity to do their best work, in the open.
          </p>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="scroll-mt-20 bg-clay">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-obsidian/50">Our Values</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">What guides us</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.title} className="rounded-2xl bg-white p-8">
                <span className="text-sm font-bold text-obsidian/40">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-obsidian/60">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-obsidian text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">{TAGLINE}</h2>
          <Link to="/products" className="btn-accent mt-6">Shop the Collection</Link>
        </div>
      </section>
    </div>
  );
}

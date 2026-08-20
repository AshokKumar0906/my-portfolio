import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import JdMatch from "@/components/JdMatch";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { profile } from "@/lib/data";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  description: profile.summary,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.location,
  },
  url: "https://ashok-kumar-l-portfolio.vercel.app",
  sameAs: [profile.links.github, profile.links.linkedin, profile.links.medium],
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="px-4 pt-4 sm:px-6">
        <Nav />
      </div>
      <main className="flex-1">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <JdMatch />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

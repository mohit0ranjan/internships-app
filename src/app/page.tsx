import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import QuickAccess from "@/components/home/QuickAccess";
import Stats from "@/components/home/Stats";
import Domains from "@/components/home/Domains";
import Announcements from "@/components/home/Announcements";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-50 font-sans antialiased text-navy-900">
      <Navbar />
      <main>
        <Hero />
        <QuickAccess />
        <Stats />
        <Domains />
        <Announcements />
      </main>
      <Footer />
    </div>
  );
}

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function GovernmentBar() {
  return (
    <>
      <div className="bg-primary text-primary-foreground h-9 flex items-center px-4 md:px-6 text-xs md:text-sm font-medium">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">Government of India</span>
              <span className="md:hidden">Govt of India</span>
            </div>
            <span className="text-primary-light hidden sm:inline">|</span>
            <div className="hidden sm:block">
              Ministry of Electronics & Information Technology
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#main-content" className="hover:underline hidden sm:block">
              Skip to Main Content
            </Link>
            <button className="hover:underline">हिन्दी</button>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="h-[2px] w-full bg-gradient-to-r from-gov-saffron via-white to-gov-green"></div>
    </>
  );
}

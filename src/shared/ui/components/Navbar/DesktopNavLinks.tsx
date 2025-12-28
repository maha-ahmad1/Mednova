import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { NavLinks, type NavLink } from "./NavLinks";

export function DesktopNavLinks() {
  return (
    <>
        {NavLinks.map((link) => (
          <div key={link.id} className="relative group">
            {link.dropdown ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 text-gray-700 hover:text-[#32A88D]  px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                  >
                    {link.title}
                    <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl p-2"
                >
                  {link.dropdown.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      className="flex items-center gap-2 px-3 py-3 rounded-xl  hover:text-[#32A88D] cursor-pointer transition-all duration-200 text-right"
                      asChild
                    >
                      <Link href={item.link}>
                        <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href={link.link}
                className="flex items-center gap-1 text-gray-700 hover:text-[#32A88D]  px-4 py-2 rounded-xl transition-all duration-200 font-medium"
              >
                {link.title}
              </Link>
            )}
          </div>
        ))}
    </>
  );
}

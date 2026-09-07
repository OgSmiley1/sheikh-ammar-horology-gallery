import { Fragment } from "react";
import { Link } from "wouter";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MORE_NAVIGATION } from "@/lib/navigation";

export function NavigationDropdown() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-muted/50">
          {isRTL ? "المزيد" : "More"}
          <ChevronDown size={16} className="transition-transform group-data-[open]:rotate-180" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute z-50 mt-2 w-56 origin-top-right rounded-lg border border-border bg-card shadow-lg focus:outline-none ${
            isRTL ? "right-0" : "left-0"
          }`}
        >
          <div className="px-1 py-1">
            {MORE_NAVIGATION.map((item) => (
              <Menu.Item key={item.href}>
                {({ active }: { active: boolean }) => (
                  <Link
                    href={item.href}
                    className={`${
                      active ? "bg-primary/10 text-primary" : "text-foreground/80"
                    } group flex w-full items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-primary`}
                  >
                    {isRTL ? item.ar : item.en}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

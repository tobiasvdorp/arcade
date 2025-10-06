"use client";

import { LuMenu } from "react-icons/lu";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { GAMES } from "@/lib/data/games";
import { IconType } from "react-icons/lib";
import { ThemeToggle } from "./theme-toggle";

type MenuItem = {
  title: string;
  url: string;
  description?: string;
  icon?: IconType;
  items?: MenuItem[];
};

type NavbarProps = {
  logo?: {
    url: string;
    src?: string;
    alt?: string;
    title: string;
  };
  menu?: MenuItem[];
};

export const Navbar = ({
  logo = {
    url: "/",
    title: "Mini Game Arcade",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Games",
      url: "/games",
      items: GAMES.map((game) => ({
        title: game.title,
        description: game.menuDescription,
        icon: game.icon,
        url: game.href,
      })),
    },
    {
      title: "Leaderboards",
      url: "/leaderboards",
    },
    {
      title: "Profile",
      url: "/profile",
    },
  ],
}: NavbarProps) => {
  return (
    <header className="py-4">
      <div className="container">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href={logo.url} className="flex items-center gap-2">
              {logo.src && logo.alt && (
                <Image src={logo.src} alt={logo.alt} width={32} height={32} />
              )}
              <span className="text-lg font-semibold">{logo.title}</span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            <Unauthenticated>
              <Button asChild variant="outline">
                <SignInButton mode="modal" />
              </Button>
              <Button asChild>
                <SignUpButton mode="modal" />
              </Button>
            </Unauthenticated>
            <Authenticated>
              <UserButton />
              <Button asChild>
                <SignOutButton />
              </Button>
            </Authenticated>
            <ThemeToggle />
          </div>
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
              {logo.src && logo.alt && (
                <Image
                  src={logo.src}
                  className="w-8"
                  alt={logo.alt}
                  width={32}
                  height={32}
                />
              )}
              <span className="text-lg font-semibold">{logo.title}</span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <LuMenu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2">
                      {logo.src && logo.alt && (
                        <Image
                          src={logo.src}
                          className="w-8"
                          alt={logo.alt}
                          width={32}
                          height={32}
                        />
                      )}
                      <span className="text-lg font-semibold">
                        {logo.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  {/* <div className="border-t py-4">
                    <div className="grid grid-cols-2 justify-start">
                      {mobileExtraLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          href={link.url}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div> */}
                  <div className="flex flex-col gap-3">
                    <Unauthenticated>
                      <Button asChild variant="outline">
                        <SignInButton mode="modal" />
                      </Button>
                      <Button asChild>
                        <SignUpButton mode="modal" />
                      </Button>
                    </Unauthenticated>

                    <Authenticated>
                      <div className="flex items-center gap-2">
                        <UserButton />
                        <Button asChild className="w-full">
                          <SignOutButton />
                        </Button>
                        <ThemeToggle />
                      </div>
                    </Authenticated>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} value={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-background border-none">
          <ul className="w-80 p-3">
            {item.items.map((subItem) => {
              const Icon = subItem.icon;
              return (
                <li key={subItem.title}>
                  <Link
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-muted-foreground"
                    href={subItem.url}
                  >
                    {Icon && <Icon size={24} className="shrink-0 my-auto" />}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <Link
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-muted-foreground"
      href={item.url}
    >
      {item.title}
    </Link>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon && subItem.icon({ width: 24, height: 24 })}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </Link>
  );
};

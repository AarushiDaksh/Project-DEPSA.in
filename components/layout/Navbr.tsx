"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  Galaxy,
  LogOut,
  Menu,
  Settings2,
  UserRound,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const productRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const isDashboard = pathname === "/dashboard";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (productRef.current && !productRef.current.contains(target)) {
        setProductOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <nav className="mx-auto max-w-[1440px]">
        <div
          className="
            flex
            h-[64px]
            items-center
            justify-between
            rounded-[20px]
            border
            border-black/[0.09]
            bg-white/45
            px-3
            shadow-[0_12px_40px_rgba(0,0,0,0.04)]
            backdrop-blur-xl
            sm:h-[68px]
            sm:px-5
            lg:h-[72px]
            lg:px-6
          "
        >
          {/* Logo */}
          <a href="/" className="group flex shrink-0 items-center gap-2 sm:gap-3">
            <div
              className="
                relative
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-[10px]
                bg-[#fffaf4]
                text-[#523d90]
                shadow-[0_6px_20px_rgba(23,21,29,0.16)]
                transition-all
                duration-300
                group-hover:scale-[1.04]
                sm:h-9
                sm:w-9
                sm:rounded-[11px]
              "
            >
              <Galaxy size={22} strokeWidth={1.8} className="sm:hidden" />
              <Galaxy size={25} strokeWidth={1.8} className="hidden sm:block" />

              <span
                className="
                  absolute
                  -right-2
                  -top-2
                  h-5
                  w-5
                  rounded-full
                  bg-[#523d90]
                  blur-[8px]
                "
              />
            </div>

            <span
              className="
                text-[16px]
                font-semibold
                leading-none
                tracking-[-0.06em]
                text-black
                sm:text-[17px]
                lg:text-[20px]
              "
              style={{ fontFamily: "DEPSA, sans-serif" }}
            >
              DePSA
            </span>
          </a>

          {/* Desktop Navigation — only from lg (1024px) up. Below that,
              there isn't reliably enough room for the logo + product menu +
              nav links + auth/profile controls in one row, so we fall back
              to the mobile menu instead of squeezing/wrapping. */}
          <div className="hidden items-center lg:flex">
            <div
              className="
                ml-6
                flex
                items-center
                gap-0.5
                rounded-full
                border
                border-black/[0.07]
                bg-white/50
                p-1
                backdrop-blur-md
                xl:ml-10
                xl:gap-1
              "
            >
              {/* Product */}
              <div ref={productRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProductOpen((open) => !open);
                    setProfileOpen(false);
                  }}
                  className="
                    flex
                    items-center
                    gap-1.5
                    whitespace-nowrap
                    rounded-full
                    px-3
                    py-2
                    text-[12px]
                    font-medium
                    text-black
                    transition
                    hover:bg-black/85
                    hover:text-white
                    xl:px-4
                  "
                >
                  Product
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      productOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {productOpen && (
                  <div
                    className="
                      absolute
                      left-0
                      top-[48px]
                      w-[260px]
                      max-w-[90vw]
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-black/[0.09]
                      bg-white/95
                      p-2
                      shadow-[0_20px_60px_rgba(0,0,0,0.16)]
                      backdrop-blur-2xl
                    "
                  >
                    <ProductItem title="Dependency Graph" description="Map relationships across your org." />
                    <ProductItem title="Impact Analysis" description="Understand what changes affect." />
                    <ProductItem title="Architecture" description="See your Salesforce system clearly." />
                    <ProductItem title="Drift Detection" description="Find structural changes over time." />
                  </div>
                )}
              </div>

              <NavLink href="#explore">Explore</NavLink>
              <NavLink href="#how-it-works">How it works</NavLink>
              <NavLink href="#docs">Docs</NavLink>
              <NavLink href="#github">GitHub</NavLink>
            </div>
          </div>

          {/* Desktop Right Side — matches the lg breakpoint above */}
          <div className="hidden items-center gap-2 lg:flex xl:gap-4">
            {/* Logged Out */}
            {!user ? (
              <a
                href="/login"
                className="
                  group
                  relative
                  flex
                  shrink-0
                  items-center
                  gap-2
                  overflow-hidden
                  whitespace-nowrap
                  rounded-full
                  bg-[#17151d]
                  px-4
                  py-2.5
                  text-[12px]
                  font-medium
                  text-white
                  shadow-[0_8px_24px_rgba(23,21,29,0.15)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_35px_rgba(23,21,29,0.22)]
                  xl:px-5
                  xl:py-3
                "
              >
                <span
                  className="
                    absolute
                    -left-6
                    top-1/2
                    h-10
                    w-10
                    -translate-y-1/2
                    rounded-full
                    bg-[#da785b]
                    opacity-0
                    blur-xl
                    transition-all
                    duration-500
                    group-hover:left-1/2
                    group-hover:opacity-80
                  "
                />
                <span className="relative z-10">Start analyzing</span>
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.8}
                  className="
                    relative
                    z-10
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </a>
            ) : (
              /* Logged In */
              <div className="flex min-w-0 items-center gap-2 xl:gap-3">
                {/* Open Dashboard — icon-only label swap keeps this from
                    fighting the profile pill for space between lg and xl */}
                {!isDashboard && (
                  <a
                    href="/dashboard"
                    className="
                      group
                      relative
                      flex
                      shrink-0
                      items-center
                      gap-2
                      overflow-hidden
                      whitespace-nowrap
                      rounded-full
                      bg-[#17151d]
                      px-3.5
                      py-2.5
                      text-[12px]
                      font-medium
                      text-white
                      shadow-[0_8px_24px_rgba(23,21,29,0.15)]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:shadow-[0_14px_35px_rgba(23,21,29,0.22)]
                      xl:px-5
                      xl:py-3
                    "
                  >
                    <span
                      className="
                        absolute
                        -left-6
                        top-1/2
                        h-10
                        w-10
                        -translate-y-1/2
                        rounded-full
                        bg-[#da785b]
                        opacity-0
                        blur-xl
                        transition-all
                        duration-500
                        group-hover:left-1/2
                        group-hover:opacity-80
                      "
                    />
                    <span className="relative z-10 hidden xl:inline">Open dashboard</span>
                    <span className="relative z-10 xl:hidden">Dashboard</span>
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.8}
                      className="
                        relative
                        z-10
                        transition-transform
                        duration-300
                        group-hover:translate-x-0.5
                        group-hover:-translate-y-0.5
                      "
                    />
                  </a>
                )}

                {/* Profile */}
                <div ref={profileRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen((open) => !open);
                      setProductOpen(false);
                    }}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-black/[0.08]
                      bg-white/55
                      py-1.5
                      pl-1.5
                      pr-2.5
                      shadow-[0_8px_25px_rgba(0,0,0,.05)]
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:bg-white/75
                      hover:shadow-[0_12px_30px_rgba(0,0,0,.08)]
                      xl:pr-3
                    "
                  >
                    {/* Avatar */}
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-[#17151d]
                        text-[10px]
                        font-semibold
                        text-white
                        shadow-[inset_0_1px_0_rgba(255,255,255,.15)]
                      "
                    >
                      {user.image ? (
                        <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
                      ) : (
                        <UserRound size={17} strokeWidth={1.7} className="text-white" />
                      )}
                    </div>

                    {/* Name hides between lg and xl to save room; shows again at xl */}
                    <span className="hidden max-w-[110px] truncate text-[12px] font-semibold text-black xl:inline xl:max-w-[130px]">
                      {user.name || "User"}
                    </span>

                    <ChevronDown
                      size={13}
                      className={`text-black/45 transition-transform duration-200 ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div
                      className="
                        absolute
                        right-0
                        top-[54px]
                        w-[280px]
                        max-w-[90vw]
                        overflow-hidden
                        rounded-[20px]
                        border
                        border-black/[0.08]
                        bg-[#fffaf4]/95
                        p-2
                        shadow-[0_24px_70px_rgba(0,0,0,.15)]
                        backdrop-blur-2xl
                      "
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-3 rounded-[14px] border border-black/[0.05] bg-white/60 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#17151d] text-xs font-semibold text-white">
                          {user.image ? (
                            <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
                          ) : (
                            <UserRound size={17} strokeWidth={1.7} className="text-white" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-black">{user.name || "User"}</p>
                          <p className="mt-0.5 truncate text-[10px] text-black/50">{user.email}</p>
                        </div>
                      </div>

                      <div className="my-2 h-px bg-black/[0.07]" />

                      <a
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[12px] font-medium text-black transition hover:bg-black/[0.045]"
                      >
                        <UserRound size={15} strokeWidth={1.7} />
                        Profile
                      </a>

                      <a
                        href="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[12px] font-medium text-black transition hover:bg-black/[0.045]"
                      >
                        <Settings2 size={15} strokeWidth={1.7} />
                        Settings
                      </a>

                      <div className="my-2 h-px bg-black/[0.07]" />

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-[12px] font-medium text-[#b34f3b] transition hover:bg-[#da785b]/10"
                      >
                        <LogOut size={15} strokeWidth={1.7} />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button — visible on everything below lg, i.e.
              phones AND tablets, matching the nav hidden above. */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-black/10
              bg-white/50
              text-black
              transition
              hover:bg-white/70
              lg:hidden
            "
          >
            {mobileOpen ? <X size={17} strokeWidth={1.8} /> : <Menu size={17} strokeWidth={1.8} />}
          </button>
        </div>

        {/* Mobile Menu — now also serves tablets (< lg) */}
        {mobileOpen && (
          <div
            className="
              mt-2
              max-h-[calc(100vh-96px)]
              overflow-y-auto
              rounded-[18px]
              border
              border-black/[0.08]
              bg-white/90
              p-2
              shadow-[0_20px_60px_rgba(0,0,0,0.12)]
              backdrop-blur-2xl
              sm:rounded-[20px]
              sm:p-3
              lg:hidden
            "
          >
            <div className="rounded-[14px] bg-white/40 p-1">
              <MobileLink href="#explore" onClick={() => setMobileOpen(false)}>Explore</MobileLink>
              <MobileLink href="#how-it-works" onClick={() => setMobileOpen(false)}>How it works</MobileLink>
              <MobileLink href="#docs" onClick={() => setMobileOpen(false)}>Docs</MobileLink>
              <MobileLink href="#github" onClick={() => setMobileOpen(false)}>GitHub</MobileLink>
            </div>

            {/* Logged In Mobile */}
            {user ? (
              <div className="mt-3 rounded-[14px] bg-black/[0.035] p-2">
                <div className="flex items-center gap-3 rounded-[12px] bg-white/60 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#17151d] text-[10px] font-semibold text-white">
                    {user.image ? (
                      <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
                    ) : (
                      <UserRound size={17} strokeWidth={1.7} className="text-white" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-black">{user.name || "User"}</p>
                    <p className="truncate text-[10px] text-black/50">{user.email}</p>
                  </div>
                </div>

                {!isDashboard && (
                  <a
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 flex items-center justify-between rounded-[11px] bg-[#17151d] px-3 py-3 text-[12px] font-medium text-white transition hover:bg-black/90"
                  >
                    <span>Open dashboard</span>
                    <ArrowUpRight size={14} strokeWidth={1.7} />
                  </a>
                )}

                <a
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center gap-3 rounded-[11px] px-3 py-3 text-[12px] font-medium text-black transition hover:bg-white/60"
                >
                  <UserRound size={15} strokeWidth={1.7} />
                  Profile
                </a>

                <a
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-[11px] px-3 py-3 text-[12px] font-medium text-black transition hover:bg-white/60"
                >
                  <Settings2 size={15} strokeWidth={1.7} />
                  Settings
                </a>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-[11px] px-3 py-3 text-left text-[12px] font-medium text-[#b34f3b] transition hover:bg-[#da785b]/10"
                >
                  <LogOut size={15} strokeWidth={1.7} />
                  Sign out
                </button>
              </div>
            ) : (
              /* Logged Out Mobile */
              <div className="mt-3 rounded-[14px] bg-black/[0.035] p-2">
                <a
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="
                    group
                    relative
                    flex
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-full
                    bg-[#17151d]
                    px-4
                    py-3
                    text-[12px]
                    font-medium
                    text-white
                    shadow-[0_8px_24px_rgba(23,21,29,0.12)]
                    transition-all
                    duration-300
                  "
                >
                  <span
                    className="
                      absolute
                      -left-6
                      top-1/2
                      h-10
                      w-10
                      -translate-y-1/2
                      rounded-full
                      bg-[#da785b]
                      opacity-0
                      blur-xl
                      transition-all
                      duration-500
                      group-active:left-1/2
                      group-active:opacity-80
                    "
                  />
                  <span className="relative z-10">Start analyzing</span>
                  <ArrowUpRight size={14} strokeWidth={1.8} className="relative z-10" />
                </a>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="
        whitespace-nowrap
        rounded-full
        px-3
        py-2
        text-[12px]
        font-medium
        text-black
        transition
        hover:bg-white/70
        hover:text-black
        xl:px-4
      "
    >
      {children}
    </a>
  );
}

function ProductItem({ title, description }: { title: string; description: string }) {
  return (
    <a href="#" className="block rounded-[12px] px-3 py-3 transition hover:bg-black/[0.045]">
      <div className="text-[12px] font-medium text-black">{title}</div>
      <div className="mt-1 text-[10px] leading-4 text-black/70">{description}</div>
    </a>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="
        flex
        items-center
        justify-between
        rounded-[11px]
        px-4
        py-3.5
        text-[13px]
        font-medium
        text-black
        transition
        hover:bg-white/50
        hover:text-black
      "
    >
      {children}
      <ArrowUpRight size={14} strokeWidth={1.6} className="text-black" />
    </a>
  );
}
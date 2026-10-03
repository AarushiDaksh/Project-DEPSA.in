
"use client";

import { authClient } from "@/lib/auth-client";
import { ArrowUpRight, LockKeyhole, Galaxy } from "lucide-react";
import { User } from "lucide-react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.2c0-.7-.06-1.37-.18-2H12v3.79h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.7 2.91-4.2 2.91-7.17Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.63 0 4.84-.87 6.45-2.38l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.82A5.86 5.86 0 0 1 6.24 12c0-.63.11-1.24.3-1.82V7.66H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.34l3.24-2.52Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.15c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.24 14.62 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.41l3.24 2.52C7.31 7.87 9.46 6.15 12 6.15Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
      aria-hidden="true"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.22c1.02 0 2.04.14 3 .42 2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.13 3.17.76.84 1.22 1.91 1.22 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.28c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  const handleGithubLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#e7dfd4] text-black">
      <div
        className="depsa-bg-image absolute -inset-[5%] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/photos/login-bg.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-[#fffaf4]/55" />
      <div className="absolute inset-0 bg-[#da785b]/20" />

      <div className="depsa-grid absolute -inset-[100px] opacity-[0.28]" />
      <div className="depsa-grid-fine absolute inset-0 opacity-[0.14]" />

      <div className="depsa-purple-orb absolute -right-[180px] top-[15%] h-[500px] w-[500px] rounded-full bg-[#523d90]/20 blur-[110px]" />

      <div className="depsa-orange-orb absolute -left-[180px] bottom-[5%] h-[500px] w-[500px] rounded-full bg-[#da785b]/30 blur-[110px]" />

      <div className="depsa-scan absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#da785b]/50 to-transparent" />

      <div className="depsa-node-1 absolute left-[12%] top-[35%]">
        <span className="block h-2 w-2 rounded-full bg-[#da785b] shadow-[0_0_18px_rgba(218,120,91,.8)]" />
      </div>

      <div className="depsa-node-2 absolute right-[14%] top-[42%]">
        <span className="block h-1.5 w-1.5 rounded-full bg-black/50 shadow-[0_0_12px_rgba(0,0,0,.35)]" />
      </div>

      <div className="depsa-node-3 absolute bottom-[20%] left-[20%]">
        <span className="block h-1.5 w-1.5 rounded-full bg-[#da785b] shadow-[0_0_14px_rgba(218,120,91,.8)]" />
      </div>

      <header className="depsa-header relative z-30 px-5 pt-5 sm:px-8 sm:pt-7">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between">
          <a
            href="/"
            className="group flex shrink-0 items-center gap-2 sm:gap-3"
          >
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
                duration-500
                group-hover:scale-[1.05]
                group-hover:rotate-2
                sm:h-9
                sm:w-9
                sm:rounded-[11px]
              "
            >
              <Galaxy
                size={22}
                strokeWidth={1.8}
                className="sm:hidden"
              />

              <Galaxy
                size={25}
                strokeWidth={1.8}
                className="hidden sm:block"
              />

              <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-[#523d90] blur-[8px]" />
            </div>

            <span
              className="text-[17px] font-semibold leading-none tracking-[-0.06em] text-black sm:text-[20px]"
              style={{ fontFamily: "DEPSA, sans-serif" }}
            >
              DePSA
            </span>
          </a>

          <a
            href="/"
            className="
              group
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/60
              bg-white/40
              px-4
              py-2
              text-xs
              font-medium
              text-black/70
              shadow-[0_8px_30px_rgba(0,0,0,.05)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-white/70
              hover:text-black
              hover:shadow-[0_12px_35px_rgba(0,0,0,.1)]
            "
          >
            Back to home

            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </header>

      <section className="relative z-20 flex min-h-[calc(100vh-90px)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-[470px]">
          <div
            className="
              depsa-card
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-white/70
              bg-[#fffaf4]/62
              p-[3px]
              shadow-[0_35px_100px_rgba(35,22,20,.24)]
              backdrop-blur-[28px]
            "
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            <div
              className="
                relative
                overflow-hidden
                rounded-[27px]
                border
                border-white/55
                bg-[#fffaf4]/48
                px-7
                py-8
                shadow-[inset_0_1px_0_rgba(255,255,255,.8)]
                sm:px-10
                sm:py-10
              "
            >
              <div className="pointer-events-none absolute -right-20 -top-32 h-64 w-64 rounded-full bg-white/35 blur-[70px]" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.25em] text-black/55">
                    DePSA / ACCESS
                  </p>

                  <h1 className="mt-3 text-[43px] font-semibold leading-[0.94] tracking-[-0.055em] sm:text-[48px]">
                    Welcome
                    <br />
                    <span className="text-[#da785bf6]">back.</span>
                  </h1>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,.05)] backdrop-blur-xl">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#da785b] shadow-[0_0_10px_rgba(218,120,91,.85)]" />

                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-black">
                    Secure
                  </span>
                </div>
              </div>

              <p className="relative mt-5 max-w-[350px] text-[14px] leading-6 text-black">
                Sign in to connect your workspace and start mapping your
                Salesforce system.
              </p>

              <div className="my-8 flex items-center gap-3">
                <div className="depsa-line h-px flex-1 bg-black/15" />

                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-black">
                  Continue with
                </span>

                <div className="depsa-line h-px flex-1 bg-black/15" />
              </div>

              <div className="relative space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="
                    group
                    relative
                    flex
                    h-[57px]
                    w-full
                    items-center
                    justify-between
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/70
                    bg-white/72
                    px-4
                    shadow-[0_8px_25px_rgba(0,0,0,.06)]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white/90
                    hover:shadow-[0_18px_40px_rgba(0,0,0,.12)]
                    active:translate-y-0
                  "
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.07] bg-white shadow-[0_3px_12px_rgba(0,0,0,.07)] transition-transform duration-300 group-hover:scale-105">
                      <GoogleIcon />
                    </span>

                    <span className="text-[13px] font-semibold text-black">
                      Continue with Google
                    </span>
                  </span>

                  <ArrowUpRight
                    size={17}
                    className="relative text-black/ transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black"
                  />
                </button>

                <button
                  type="button"
                  onClick={handleGithubLogin}
                  className="
                    group
                    relative
                    flex
                    h-[57px]
                    w-full
                    items-center
                    justify-between
                    overflow-hidden
                    rounded-2xl
                    border
                    border-black/80
                    bg-[#111111]
                    px-4
                    text-white
                    shadow-[0_12px_30px_rgba(0,0,0,.20)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-[#171717]
                    hover:shadow-[0_20px_45px_rgba(0,0,0,.28)]
                    active:translate-y-0
                  "
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] transition-transform duration-300 group-hover:scale-105">
                      <GithubIcon />
                    </span>

                    <span className="text-[13px] font-semibold">
                      Continue with GitHub
                    </span>
                  </span>

                  <ArrowUpRight
                    size={17}
                    className="relative text-white/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </button>
              </div>

              <div className="mt-7 flex gap-3 border-t border-black/[0.10] pt-6">
                <LockKeyhole
                  size={14}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-black"
                />

                <p className="text-[11px] leading-5 text-black">
                  Authentication is handled securely. DePSA
                  never asks for your Google or GitHub password.
                </p>
              </div>

              <div className="mt-7 flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-black">
                  System Intelligence
                </span>

               
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#da785b]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-black">
              Understand your system before you change it
            </span>

            <span className="h-1 w-1 rounded-full bg-[#da785b]" />
          </div>
        </div>
      </section>
    </main>
  );
}


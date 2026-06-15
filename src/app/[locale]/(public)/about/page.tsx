import { CheckCircle, Heart } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <div className="w-full space-y-16 py-10 md:py-16">
      <section className="relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-zinc-900/50 py-20 px-6 sm:px-12 md:px-20 text-center border border-slate-100 dark:border-zinc-800">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400 bg-slate-200/60 dark:bg-zinc-800 rounded-full">
            Big Boy Restaurant
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-slate-50">
            {t("title")}
          </h1>
          <p className="max-w-xl mx-auto text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium">
            {t("address")}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-slate-900 dark:after:bg-slate-50 after:mt-3">
            {t("ourStory.title")}
          </h2>
        </div>
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
          <p className="text-base text-slate-600 dark:text-slate-300 leading-8 whitespace-pre-line">
            {t("ourStory.description")}
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t("ourValues.title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="group p-6 bg-slate-50/50 dark:bg-zinc-900/40 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("ourValues.description")}
            </p>
          </div>

          <div className="group p-6 bg-slate-50/50 dark:bg-zinc-900/40 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("ourCommitment.description")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-r from-slate-900 via-slate-850 to-zinc-800 dark:from-zinc-950 dark:to-black rounded-2xl p-8 md:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {t("ourCommitment.title")}
          </h2>
          <p className="text-zinc-300 text-base md:text-lg leading-8 font-medium">
            {t("ourCommitment.description")}
          </p>
        </div>
      </section>
    </div>
  );
}

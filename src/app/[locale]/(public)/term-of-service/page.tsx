import { FileCode, Info, Mail, RefreshCw, ShieldAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function TermsOfServicePage() {
  const t = await getTranslations("TermsOfService");

  return (
    <div className="w-full space-y-16 py-10 md:py-16">
      <section className="relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-zinc-900/50 py-16 px-6 sm:px-12 md:px-20 text-center border border-slate-100 dark:border-zinc-800">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-slate-50">
            {t("title")}
          </h1>
          <p className="max-w-md mx-auto text-sm text-slate-400 dark:text-zinc-500">
            {t("description")}
          </p>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-slate-900 dark:after:bg-slate-50 after:mt-3">
            <Info className="w-5 h-5 shrink-0" />
            {t("introduction.title")}
          </h2>
        </div>
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
          <p className="text-base text-slate-600 dark:text-slate-300 leading-8 whitespace-pre-line">
            {t("introduction.description")}
          </p>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-slate-900 dark:after:bg-slate-50 after:mt-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            {t("serviceUsage.title")}
          </h2>
        </div>
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
          <p className="text-base text-slate-600 dark:text-slate-300 leading-8 whitespace-pre-line">
            {t("serviceUsage.description")}
          </p>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-slate-900 dark:after:bg-slate-50 after:mt-3">
            <FileCode className="w-5 h-5 shrink-0" />
            {t("intellectualProperty.title")}
          </h2>
        </div>
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
          <p className="text-base text-slate-600 dark:text-slate-300 leading-8 whitespace-pre-line">
            {t("intellectualProperty.description")}
          </p>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-slate-900 dark:after:bg-slate-50 after:mt-3">
            <RefreshCw className="w-5 h-5 shrink-0" />
            {t("changes.title")}
          </h2>
        </div>
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
          <p className="text-base text-slate-600 dark:text-slate-300 leading-8 whitespace-pre-line">
            {t("changes.description")}
          </p>
        </div>
      </section>
      <section className="bg-linear-to-r from-slate-900 via-slate-850 to-zinc-800 dark:from-zinc-950 dark:to-black rounded-2xl p-8 md:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-zinc-400">
            <Mail className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t("contact.title")}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {t("contact.description")}
          </h2>
          <p className="text-zinc-300 text-base md:text-lg leading-8 font-medium">
            {t("contact.description")}
          </p>
        </div>
      </section>
    </div>
  );
}

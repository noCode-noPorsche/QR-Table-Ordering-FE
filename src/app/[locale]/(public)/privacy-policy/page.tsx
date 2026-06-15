import { CheckCircle2, FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("PrivacyPolicy");

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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-slate-900 dark:after:bg-slate-50 after:mt-3">
            {t("dataCollection.title")}
          </h2>
        </div>
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
          <p className="text-base text-slate-600 dark:text-slate-300 leading-8 whitespace-pre-line">
            {t("dataCollection.description")}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 relative after:content-[''] after:block after:w-12 after:h-1 after:bg-slate-900 dark:after:bg-slate-50 after:mt-3">
            {t("purpose.title")}
          </h2>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
            <p className="text-base text-slate-600 dark:text-slate-300 leading-8">
              {t("purpose.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-zinc-900/40 rounded-xl border border-slate-100 dark:border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-zinc-100 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                {t("purpose.processOrders")}
              </span>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-zinc-900/40 rounded-xl border border-slate-100 dark:border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-zinc-100 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                {t("purpose.customerService")}
              </span>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-zinc-900/40 rounded-xl border border-slate-100 dark:border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-zinc-100 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                {t("purpose.marketing")}
              </span>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-zinc-900/40 rounded-xl border border-slate-100 dark:border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-zinc-100 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                {t("purpose.improvement")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-r from-slate-900 via-slate-850 to-zinc-800 dark:from-zinc-950 dark:to-black rounded-2xl p-8 md:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-zinc-400">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t("securityCommitment.badge")}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {t("securityCommitment.title")}
          </h2>
          <p className="text-zinc-300 text-sm md:text-base leading-7">
            {t("securityCommitment.description")}
          </p>
        </div>
      </section>
    </div>
  );
}

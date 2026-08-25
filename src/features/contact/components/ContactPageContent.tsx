import ContactForm from "@/features/contact/components/ContactForm";
import type { ContactFormPrefill } from "@/features/contact/types";

type ContactPageContentProps = {
  prefill?: ContactFormPrefill;
};

export default function ContactPageContent({
  prefill,
}: ContactPageContentProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-14">
        <div className="space-y-4 text-start">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            تواصلي معنا
          </h1>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            لو عندكِ سؤال على منتج، مقاس، أو طلب قائم — ابعثي الرسالة من هنا
            وهنرجع لكِ على الموبايل. الفورم بيتحفظ عندنا مباشرة، من غير إيميل
            تلقائي.
          </p>
          <ul className="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground">
            <li>الدفع عند الاستلام فقط.</li>
            <li>التوصيل بالتنسيق اليدوي، وحاليًا للمناطق القريبة.</li>
            <li>لو الطلب مستعجل، اكتبي كده في الرسالة عشان نرتّب معاكِ.</li>
          </ul>
        </div>

        <div className="relative rounded-3xl border border-border bg-brand-50/40 p-4 sm:p-6">
          <ContactForm prefill={prefill} />
        </div>
      </div>
    </section>
  );
}

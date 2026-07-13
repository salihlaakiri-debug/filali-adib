"use client";

import { TextReveal, FadeIn } from "@/components/motion";

export default function TermsPage() {
  return (
    <div className="bg-light min-h-screen">
      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <TextReveal delay={0.2}>
            <h1 className="font-playfair text-4xl font-bold mb-4">الشروط والأحكام</h1>
          </TextReveal>
          <FadeIn direction="up" delay={0.4}>
            <p className="text-gray-300">آخر تحديث: يناير 2026</p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">1. قبول الشروط</h2>
              <p className="text-gray-600 leading-relaxed">
                باستخدام موقع فيلالي عديب والشراء من خلاله، أنت توافق على هذه الشروط والأحكام.
                يُرجى قراءتها بعناية قبل إتمام أي عملية شراء.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">2. المنتجات والأسعار</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
                <li>جميع الأسعار بالدرهم المغربي (د.م) وتشمل الضريبة</li>
                <li>أسعار الذهب قابلة للتغيير حسب السوق العالمية</li>
                <li>نحتفظ بالحق في تعديل الأسعار دون إشعار مسبق</li>
                <li>الصور توضيحية وقد تختلف قليلاً عن المنتج الفعلي</li>
                <li>كل منتج ي accompanies بشهادة أصالة رسمية</li>
              </ul>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">3. الطلبات والتوصيل</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
                <li>الشحن مجاني داخل المغرب للطلبات فوق 1000 د.م</li>
                <li>مدة التوصيل: 2-5 أيام عمل داخل المغرب</li>
                <li>الشحن الدولي متاح - يرجى التواصل للاستفسار</li>
                <li>التوصيل عبر شركات شحن موثوقة مع تأمين شامل</li>
                <li>يجب التوقيع على الطلب عند الاستلام</li>
              </ul>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">4. سياسة الإرجاع والاستبدال</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
                <li>يمكنكم الإرجاع خلال 14 يوماً من تاريخ الاستلام</li>
                <li>يجب أن تكون القطعة في حالتها الأصلية مع جميع الملحقات</li>
                <li>القطع المخصصة (نقش خاص) لا يمكن إرجاعها</li>
                <li>الاستبدال متاح للقطع غير المخصصة فقط</li>
                <li>يتحمل العميل تكلفة الشحن في حالة الإرجاع</li>
              </ul>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">5. الدفع</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
                <li>الدفع عند الاستلام (المغرب فقط)</li>
                <li>الدفع بالبطاقة банكية عبر Stripe</li>
                <li>تحويل بنكي</li>
                <li>جميع المعاملات مشفرة وآمنة 100%</li>
              </ul>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">6. الضمان</h2>
              <p className="text-gray-600 leading-relaxed">
                نقدم ضمان شامل لمدة سنة واحدة على جميع المنتجات يشمل إصلاح أي عيوب في الصناعة.
                الصيانة الدورية مجانية مدى الحياة. الضمان لا يشمل الأضرار الناتجة عن سوء الاستخدام.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">7. القانون الحاكم</h2>
              <p className="text-gray-600 leading-relaxed">
                هذه الشروط محكومة بقوانين المملكة المغربية. أي نزاع يخضع لاختصاص المحاكم المغربية.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">8. التواصل</h2>
              <p className="text-gray-600 leading-relaxed">
                لأي استفسار حول الشروط والأحكام:
              </p>
              <p className="text-gold font-medium mt-2">contact@filaliadib.com | +212 5 35 63 XX XX</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { TextReveal, FadeIn } from "@/components/motion";

export default function PrivacyPage() {
  return (
    <div className="bg-light min-h-screen">
      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <TextReveal delay={0.2}>
            <h1 className="font-playfair text-4xl font-bold mb-4">سياسة الخصوصية</h1>
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
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">1. مقدمة</h2>
              <p className="text-gray-600 leading-relaxed">
                مرحباً بكم في فيلالي عديب ("نحن"، "شركتنا"). نحن ملتزمون بحماية خصوصيتك وبياناتكم الشخصية.
                تصفح موقعنا يعني موافقتك على سياسة الخصوصية هذه.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">2. المعلومات التي نجمعها</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
                <li>الاسم الكامل والبريد الإلكتروني ورقم الهاتف</li>
                <li>عناوين الشحن و Facturation</li>
                <li>سجل الطلبات والمعاملات</li>
                <li>معلومات استخدام الموقع (عنوان IP، نوع المتصفح)</li>
                <li>بيانات الدفع (تشفيرها عبر Stripe - لا نخزّن بيانات البطاقات)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">3. كيف نستخدم معلوماتكم</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
                <li>معالجة الطلبات وشحن المنتجات</li>
                <li>التواصل معكم بخصوص طلباتكم</li>
                <li>تحسين تجربة التسوق</li>
                <li>إرسال العروض والتوصيات (بموافقتكم)</li>
                <li>الامتثال للقوانين المعمول بها</li>
              </ul>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">4. حماية البيانات</h2>
              <p className="text-gray-600 leading-relaxed">
                نستخدم تقنيات تشفير SSL/TLS لحماية بياناتكم. لا نخزّن بيانات البطاقات البنكية مباشرة -
                جميع المعاملات المالية تتم عبر بوابة الدفع الآمنة Stripe.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">5. مشاركة البيانات</h2>
              <p className="text-gray-600 leading-relaxed">
                لا نبيع بياناتكم لأي طرف ثالث. قد نشارك بياناتكم فقط مع:
              </p>
              <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside mt-2">
                <li>شركات الشحن لتوصيل طلباتكم</li>
                <li>بوابة الدفع Stripe لمعالجة المعاملات</li>
                <li>جهات حكومية إذا طُلب ذلك قانونياً</li>
              </ul>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">6. حقوقكم</h2>
              <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
                <li>الحق في الوصول إلى بياناتكم الشخصية</li>
                <li>الحق في تصحيح البيانات غير الصحيحة</li>
                <li>الحق في حذف بياناتكم</li>
                <li>الحق في الاعتراض على معالجة بياناتكم</li>
                <li>الحق في نقل بياناتكم</li>
              </ul>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">7. ملفات تعريف الارتباط</h2>
              <p className="text-gray-600 leading-relaxed">
                نستخدم ملفات تعريف الارتباط الضرورية لتشغيل الموقع وتحسين تجربتكم.
                يمكنك التحكم في إعدادات المتصفح لرفض ملفات تعريف الارتباط.
              </p>
            </div>

            <div>
              <h2 className="font-playfair text-xl font-bold text-secondary mb-3">8. التواصل</h2>
              <p className="text-gray-600 leading-relaxed">
                لأي استفسار حول سياسة الخصوصية، يرجى التواصل معنا على:
              </p>
              <p className="text-gold font-medium mt-2">contact@filaliadib.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

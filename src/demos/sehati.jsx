/**
 * Demo web de "Sehati" — réplica de la app Flutter original.
 * Los textos en español y árabe son los del diccionario real de la app.
 * Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.
 */
import { useState } from 'react';
import { StatusBar } from '../components/PhoneFrame';

const C = {
  ink: '#14251A',
  inkSoft: '#6B7A6E',
  inkFaint: '#9AA69C',
  canvas: '#F8F7F3',
  cream: '#FCF0E4',
  surface: '#FFFFFF',
  hairline: '#E9E6DE',
  primary: '#245430',
  primaryMid: '#3C7830',
  leaf: '#84A83C',
  lime: '#E4F0CC',
  carrot: '#F06C30',
};

/** [español, árabe] — extraídos del diccionario S de la app. */
const T = {
  appName: ['Sehati', 'صحتي'],
  tagline: ['Tu dieta, paso a paso', 'نظامك الغذائي، خطوة بخطوة'],
  greet: ['Buenos días', 'صباح الخير'],
  navToday: ['Hoy', 'اليوم'],
  navWeek: ['Semana', 'الأسبوع'],
  navGuide: ['Guía', 'الدليل'],
  navSettings: ['Ajustes', 'الإعدادات'],
  nowTitle: ['Ahora te toca', 'حان وقت'],
  todayPlan: ['Plan de hoy', 'خطة اليوم'],
  allDone: ['Día completado', 'اكتمل اليوم'],
  eaten: ['Ya lo he comido', 'لقد أكلته'],
  other: ['العربية', 'Español'],
};

const MEALS = [
  {
    id: 'breakfast',
    time: '07:30',
    slot: ['Desayuno', 'الفطور'],
    items: [
      ['Café con leche desnatada', 'قهوة بحليب خالي الدسم'],
      ['Pan integral', 'خبز قمح كامل'],
      ['Fruta', 'فاكهة'],
    ],
  },
  {
    id: 'midMorning',
    time: '11:00',
    slot: ['Media mañana', 'وجبة الصباح'],
    items: [
      ['Frutos secos tostados sin sal', 'مكسرات محمصة بدون ملح'],
      ['Yogur desnatado', 'زبادي خالي الدسم'],
    ],
  },
  {
    id: 'lunch',
    time: '14:00',
    slot: ['Comida', 'الغداء'],
    items: [
      ['Lentejas guisadas con verduras', 'عدس مطهو بالخضار'],
      ['Pan integral', 'خبز قمح كامل'],
      ['Fruta', 'فاكهة'],
    ],
  },
  {
    id: 'snack',
    time: '17:30',
    slot: ['Merienda', 'وجبة العصر'],
    items: [
      ['Tortilla francesa', 'عجة بيض'],
      ['Fruta', 'فاكهة'],
    ],
  },
  {
    id: 'dinner',
    time: '21:00',
    slot: ['Cena', 'العشاء'],
    items: [
      ['Sopa de verduras', 'شوربة خضار'],
      ['Yogur desnatado', 'زبادي خالي الدسم'],
    ],
  },
];

export default function SehatiDemo() {
  const [lang, setLang] = useState(0); // 0 = es, 1 = ar
  const [tab, setTab] = useState('today');
  const [done, setDone] = useState(() => new Set(['breakfast']));

  const ar = lang === 1;
  const t = (key) => T[key][lang];
  const dir = ar ? 'rtl' : 'ltr';

  const next = MEALS.find((m) => !done.has(m.id));
  const allDone = !next;

  const marcar = (id) =>
    setDone((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });

  return (
    <div
      dir={dir}
      className="flex h-full flex-col"
      style={{ backgroundColor: C.canvas, color: C.ink }}
    >
      <StatusBar />

      {/* Cabecera con el botón de idioma */}
      <div
        className="flex shrink-0 items-center justify-between px-5 pb-3 pt-1"
        style={{ backgroundColor: C.canvas }}
      >
        <div>
          <p className="text-[19px] font-extrabold leading-none">{t('appName')}</p>
          <p className="mt-1 text-[10.5px]" style={{ color: C.inkSoft }}>
            {t('tagline')}
          </p>
        </div>
        <button
          onClick={() => setLang((l) => (l === 0 ? 1 : 0))}
          className="rounded-full px-3.5 py-2 text-[12px] font-bold transition active:scale-95"
          style={{ backgroundColor: C.lime, color: C.primary }}
        >
          {t('other')}
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-5">
        {tab === 'today' && (
          <>
            <p className="text-[12px]" style={{ color: C.inkSoft }}>
              {t('greet')}
            </p>

            {/* Toma actual */}
            <div
              className="mt-3 rounded-[22px] p-5"
              style={{ backgroundColor: allDone ? C.lime : C.primary }}
            >
              {allDone ? (
                <p className="text-[19px] font-extrabold" style={{ color: C.primary }}>
                  {t('allDone')}
                </p>
              ) : (
                <>
                  <div className="flex items-baseline justify-between">
                    <p
                      className="text-[10.5px] font-bold uppercase tracking-wider"
                      style={{ color: C.leaf }}
                    >
                      {t('nowTitle')}
                    </p>
                    <span className="text-[12px] font-bold" style={{ color: C.lime }}>
                      {next.time}
                    </span>
                  </div>
                  <p className="mt-2 text-[22px] font-extrabold" style={{ color: C.surface }}>
                    {next.slot[lang]}
                  </p>
                  <ul className="mt-2.5 space-y-1">
                    {next.items.map((it) => (
                      <li key={it[0]} className="text-[13px]" style={{ color: C.lime }}>
                        {it[lang]}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => marcar(next.id)}
                    className="mt-4 w-full rounded-full py-3 text-[13px] font-extrabold transition active:scale-[0.98]"
                    style={{ backgroundColor: C.carrot, color: C.surface }}
                  >
                    {t('eaten')}
                  </button>
                </>
              )}
            </div>

            {/* Progreso */}
            <div className="mt-4 flex items-center gap-3">
              <div
                className="h-1.5 flex-1 overflow-hidden rounded-full"
                style={{ backgroundColor: C.hairline }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(done.size / MEALS.length) * 100}%`,
                    backgroundColor: C.leaf,
                  }}
                />
              </div>
              <span className="text-[11.5px] font-bold" style={{ color: C.inkSoft }}>
                {ar
                  ? `${done.size} من ${MEALS.length} وجبات`
                  : `${done.size} de ${MEALS.length} tomas`}
              </span>
            </div>

            {/* Plan del día */}
            <p className="mt-5 text-[13px] font-extrabold">{t('todayPlan')}</p>
            <div className="mt-2.5 space-y-2">
              {MEALS.map((m) => {
                const hecho = done.has(m.id);
                return (
                  <div
                    key={m.id}
                    className="rounded-[18px] p-3.5"
                    style={{
                      backgroundColor: C.surface,
                      border: `1px solid ${hecho ? C.leaf : C.hairline}`,
                      opacity: hecho ? 0.6 : 1,
                    }}
                  >
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13.5px] font-bold">{m.slot[lang]}</p>
                      <span className="text-[11px]" style={{ color: C.inkFaint }}>
                        {m.time}
                      </span>
                    </div>
                    <p className="mt-1 text-[11.5px] leading-snug" style={{ color: C.inkSoft }}>
                      {m.items.map((i) => i[lang]).join(ar ? ' · ' : ' · ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'week' && (
          <div className="pt-2">
            <p className="text-[19px] font-extrabold">{t('navWeek')}</p>
            <div className="mt-4 space-y-2">
              {(ar
                ? ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
                : ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
              ).map((d, i) => (
                <div
                  key={d}
                  className="flex items-center justify-between rounded-[16px] p-3.5"
                  style={{
                    backgroundColor: i === 0 ? C.lime : C.surface,
                    border: `1px solid ${i === 0 ? C.leaf : C.hairline}`,
                  }}
                >
                  <span className="text-[13.5px] font-bold">{d}</span>
                  <span className="text-[11px]" style={{ color: C.inkSoft }}>
                    {ar ? '٥ وجبات' : '5 tomas'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'guide' && (
          <div className="pt-2">
            <p className="text-[19px] font-extrabold">{t('navGuide')}</p>
            <div className="mt-4 space-y-2.5">
              {[
                [ar ? 'الطاقة' : 'Energía', '1.850 kcal'],
                [ar ? 'البروتين' : 'Proteínas', '95 g'],
                [ar ? 'الكربوهيدرات' : 'Hidratos', '210 g'],
                [ar ? 'الدهون' : 'Grasas', '62 g'],
                [ar ? 'الألياف' : 'Fibra', '34 g'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-[16px] p-4"
                  style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
                >
                  <span className="text-[13px]" style={{ color: C.inkSoft }}>
                    {k}
                  </span>
                  <span className="text-[15px] font-extrabold" style={{ color: C.primary }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="pt-2">
            <p className="text-[19px] font-extrabold">{t('navSettings')}</p>
            <div className="mt-4 space-y-2.5">
              {[
                [ar ? 'اللغة' : 'Idioma', ar ? 'العربية' : 'Español'],
                [ar ? 'التنبيهات' : 'Avisos', ar ? 'مفعّلة' : 'Activados'],
                [ar ? 'مواعيد الوجبات' : 'Horarios de las comidas', '07:30 · 21:00'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-[16px] p-4"
                  style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
                >
                  <span className="text-[13px]">{k}</span>
                  <span className="text-[12px] font-bold" style={{ color: C.primaryMid }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[10.5px] leading-relaxed" style={{ color: C.inkFaint }}>
              {ar
                ? 'هذا التطبيق ليس بديلاً عن الاستشارة الطبية.'
                : 'Esta aplicación no sustituye el consejo médico.'}
            </p>
          </div>
        )}
      </div>

      <nav
        className="flex shrink-0 items-center px-2 pb-6 pt-2"
        style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.hairline}` }}
      >
        {[
          ['today', 'navToday'],
          ['week', 'navWeek'],
          ['guide', 'navGuide'],
          ['settings', 'navSettings'],
        ].map(([id, key]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 rounded-full py-2 text-[11.5px] transition"
            style={{
              backgroundColor: tab === id ? C.lime : 'transparent',
              color: tab === id ? C.primary : C.inkFaint,
              fontWeight: tab === id ? 800 : 500,
            }}
          >
            {t(key)}
          </button>
        ))}
      </nav>
    </div>
  );
}

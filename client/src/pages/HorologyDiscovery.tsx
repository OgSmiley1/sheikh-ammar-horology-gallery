import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

type QuizQuestion = {
  questionEn: string;
  questionAr: string;
  optionsEn: string[];
  optionsAr: string[];
  answer: number;
  explanationEn: string;
  explanationAr: string;
};

const QUESTIONS: QuizQuestion[] = [
  {
    questionEn: "Which complication is designed to measure elapsed time?",
    questionAr: "أي تعقيد صُمم لقياس الزمن المنقضي؟",
    optionsEn: ["Moonphase", "Chronograph", "Perpetual calendar", "Minute repeater"],
    optionsAr: ["طور القمر", "الكرونوغراف", "التقويم الدائم", "مكرر الدقائق"],
    answer: 1,
    explanationEn: "A chronograph adds a timing function for measuring elapsed intervals.",
    explanationAr: "يضيف الكرونوغراف وظيفة توقيت لقياس الفترات الزمنية المنقضية.",
  },
  {
    questionEn: "What is the purpose of a perpetual calendar?",
    questionAr: "ما الغرض من التقويم الدائم؟",
    optionsEn: ["To indicate a second time zone", "To display a power reserve", "To account for varying month lengths", "To measure water resistance"],
    optionsAr: ["إظهار منطقة زمنية ثانية", "عرض احتياطي الطاقة", "مراعاة اختلاف عدد أيام الأشهر", "قياس مقاومة الماء"],
    answer: 2,
    explanationEn: "A perpetual calendar is engineered to track the different lengths of months and the leap-year cycle.",
    explanationAr: "يُصمم التقويم الدائم لتتبع اختلاف أطوال الأشهر ودورة السنوات الكبيسة.",
  },
  {
    questionEn: "A tourbillon was created to mitigate the positional effects of what force?",
    questionAr: "صُمم التوربيون لتقليل التأثيرات الموضعية لأي قوة؟",
    optionsEn: ["Magnetism", "Gravity", "Water pressure", "Temperature"],
    optionsAr: ["المغناطيسية", "الجاذبية", "ضغط الماء", "الحرارة"],
    answer: 1,
    explanationEn: "The rotating tourbillon carriage was conceived to average gravity-related positional effects in a mechanical watch.",
    explanationAr: "صُمم قفص التوربيون الدوار لمتوسط التأثيرات الموضعية المرتبطة بالجاذبية في الساعة الميكانيكية.",
  },
  {
    questionEn: "What does a watch’s power reserve describe?",
    questionAr: "إلى ماذا يشير احتياطي الطاقة في الساعة؟",
    optionsEn: ["The duration it can run when fully wound", "The number of complications", "The case diameter", "The number of time zones"],
    optionsAr: ["المدة التي تعمل خلالها بعد اكتمال شحنها", "عدد التعقيدات", "قطر العلبة", "عدد المناطق الزمنية"],
    answer: 0,
    explanationEn: "Power reserve indicates how long a fully wound mechanical movement can operate before needing energy again.",
    explanationAr: "يشير احتياطي الطاقة إلى المدة التي تعمل خلالها الحركة الميكانيكية المشحونة بالكامل قبل احتياجها للطاقة مجدداً.",
  },
];

export default function HorologyDiscovery() {
  const { isRTL } = useLanguage();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const question = QUESTIONS[questionIndex];
  const options = isRTL ? question.optionsAr : question.optionsEn;
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const copy = isRTL
    ? {
        eyebrow: "اكتشاف هادئ",
        title: "بوصلة محبّ الساعات",
        intro: "أربع وقفات قصيرة للتعرّف إلى لغة الحرفة، دون تسجيل أو جمع لبياناتك.",
        question: "السؤال",
        next: "السؤال التالي",
        finish: "عرض النتيجة",
        reset: "أعد التجربة",
        correct: "إجابة موفقة",
        review: "للمراجعة",
        resultTitle: "تمت الجولة",
        resultBody: "أجبت بشكل صحيح عن",
        resultSuffix: "من أربع محطات. تبقى كل ساعة دعوة للتأمل في التفاصيل.",
        note: "محتوى تعليمي عام عن مبادئ صناعة الساعات، وليس تقييماً أو نصيحة شراء.",
      }
    : {
        eyebrow: "A quiet discovery",
        title: "The connoisseur’s compass",
        intro: "Four concise prompts to explore the language of craft—without sign-in or visitor data collection.",
        question: "Question",
        next: "Next question",
        finish: "View result",
        reset: "Begin again",
        correct: "Well observed",
        review: "For reflection",
        resultTitle: "The circuit is complete",
        resultBody: "You answered",
        resultSuffix: "of four prompts correctly. Every timepiece remains an invitation to look more closely.",
        note: "General educational material about watchmaking principles; not an appraisal or purchase recommendation.",
      };

  const continueQuiz = () => {
    if (selected === null) return;
    const nextScore = score + (selected === question.answer ? 1 : 0);
    if (questionIndex === QUESTIONS.length - 1) {
      setScore(nextScore);
      setComplete(true);
      return;
    }
    setScore(nextScore);
    setQuestionIndex((index) => index + 1);
    setSelected(null);
  };

  const resetQuiz = () => {
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setComplete(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <main className="pt-24 md:pt-28">
        <section className="border-y border-primary/15 bg-card/20 px-4 py-16 sm:py-24">
          <div className="container mx-auto max-w-3xl">
            <div className={`mx-auto max-w-2xl ${isRTL ? "text-right" : "text-left"}`}>
              <p className="sheikh-title">{copy.eyebrow}</p>
              <h1 className="sheikh-name mt-4 text-gold-gradient">{copy.title}</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{copy.intro}</p>
            </div>

            <div className="luxury-panel mx-auto mt-12 max-w-2xl overflow-hidden">
              {complete ? (
                <div className="p-8 text-center sm:p-12">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                    <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 text-3xl text-primary" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{copy.resultTitle}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{copy.resultBody} <strong className="text-foreground">{score}</strong> {copy.resultSuffix}</p>
                  <button type="button" onClick={resetQuiz} className="mt-8 inline-flex items-center gap-2 rounded-md border border-primary/50 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    {copy.reset}
                  </button>
                </div>
              ) : (
                <div className="p-6 sm:p-10">
                  <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                    <span>{copy.question} {questionIndex + 1} / {QUESTIONS.length}</span>
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all duration-300" style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }} /></div>
                  </div>
                  <h2 className="mt-7 text-3xl leading-snug text-foreground" style={{ fontFamily: isRTL ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}>{isRTL ? question.questionAr : question.questionEn}</h2>
                  <div className="mt-8 grid gap-3">
                    {options.map((option, index) => {
                      const selectedState = selected === index;
                      const reveal = selected !== null;
                      const isCorrect = index === question.answer;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelected(index)}
                          aria-pressed={selectedState}
                          className={`rounded-md border p-4 text-start transition-colors ${reveal && isCorrect ? "border-primary bg-primary/15 text-foreground" : selectedState ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card/40 text-foreground hover:border-primary/60"}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {selected !== null && <p className={`mt-6 rounded-md border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}><strong className="text-primary">{selected === question.answer ? copy.correct : copy.review}: </strong>{isRTL ? question.explanationAr : question.explanationEn}</p>}
                  <div className={`mt-8 flex ${isRTL ? "justify-start" : "justify-end"}`}>
                    <button type="button" disabled={selected === null} onClick={continueQuiz} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-40">
                      {questionIndex === QUESTIONS.length - 1 ? copy.finish : copy.next}
                      <Arrow className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">{copy.note}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

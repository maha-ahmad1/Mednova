const WEEK_POINTS = [12, 20, 16, 24, 2, 20, 28];
const DAYS = ["سبت", "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"];

export const WalletIncomeChart = () => {
  const width = 100;
  const height = 40;
  const max = Math.max(...WEEK_POINTS, 1);

  const coordinates = WEEK_POINTS.map((point, index) => {
    const x = (index / (WEEK_POINTS.length - 1)) * width;
    const y = height - (point / max) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <section className="rounded-3xl border border-[#e6ece9] bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#122523]">الدخل خلال الفترة</h2>
          <p className="text-sm text-[#8d9b97]">متابعة الأرباح من الجلسات بعد خصم العمولة</p>
        </div>

        <div className="rounded-2xl border border-[#e6ece9] bg-[#f9fbfa] p-1 text-sm">
          {[
            { label: "أسبوع", active: true },
            { label: "شهر", active: false },
            { label: "ربع", active: false },
            { label: "سنة", active: false },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={[
                "rounded-xl px-4 py-1.5 transition",
                tab.active ? "bg-white text-[#14312d] shadow-sm" : "text-[#8d9b97] hover:text-[#14312d]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-b from-[#f4fbf8] to-transparent p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full">
          <defs>
            <linearGradient id="income-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#20b486" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#20b486" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 10, 20, 30, 40].map((line) => (
            <line
              key={line}
              x1="0"
              x2={width}
              y1={line}
              y2={line}
              stroke="#dfe8e5"
              strokeDasharray="1 2"
              strokeWidth="0.2"
            />
          ))}

          <polyline
            points={`${coordinates} ${width},${height} 0,${height}`}
            fill="url(#income-area)"
            stroke="none"
          />

          <polyline points={coordinates} fill="none" stroke="#1aae82" strokeWidth="0.8" strokeLinecap="round" />

          {WEEK_POINTS.map((point, index) => {
            const x = (index / (WEEK_POINTS.length - 1)) * width;
            const y = height - (point / max) * height;
            return <circle key={`${point}-${index}`} cx={x} cy={y} r="1" fill="#fff" stroke="#13a274" strokeWidth="0.8" />;
          })}
        </svg>

        <div className="mt-2 grid grid-cols-7 text-center text-xs text-[#95a39f]">
          {DAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

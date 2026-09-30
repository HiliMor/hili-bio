import "./styles.css";

const rangeData = {
  "24h": [
    {
      id: "security",
      title: "ביטחון אזורי",
      category: "ביטחון",
      className: "security",
      share: 28,
      change: 8.4,
      articles: 86,
      sourceCount: 6,
      peak: "19:40",
      x: 51,
      y: 46,
      size: 235,
      summary: "רצף אירועים מדיניים וביטחוניים מרכז את עיקר הסיקור בשעות האחרונות.",
      trajectory: [18, 21, 20, 24, 30, 33, 42, 54, 61, 78, 88, 100],
      headlines: [
        ["כאן", "ההתפתחויות המדיניות והמשמעויות לישראל"],
        ["ynet", "מערכת הביטחון נערכת להמשך האירועים"],
        ["N12", "הדיונים נמשכים: תמונת המצב המעודכנת"],
      ],
    },
    {
      id: "budget",
      title: "תקציב המדינה",
      category: "כלכלה",
      className: "economy",
      share: 17,
      change: 3.1,
      articles: 52,
      sourceCount: 6,
      peak: "11:20",
      x: 25,
      y: 38,
      size: 178,
      summary: "דיוני התקציב והשלכותיהם על משרדי הממשלה מחזירים את הכלכלה למרכז הבמה.",
      trajectory: [22, 28, 32, 45, 58, 72, 85, 71, 64, 70, 68, 73],
      headlines: [
        ["גלובס", "הסעיפים שישפיעו על משקי הבית"],
        ["ישראל היום", "הדיון המכריע על מסגרת התקציב"],
        ["ynet", "המחלוקות האחרונות לפני ההצבעה"],
      ],
    },
    {
      id: "government",
      title: "הממשלה והכנסת",
      category: "פוליטיקה",
      className: "politics",
      share: 14,
      change: -1.8,
      articles: 43,
      sourceCount: 6,
      peak: "09:10",
      x: 74,
      y: 27,
      size: 155,
      summary: "דיונים והצעות חוק ממשיכים לייצר סיקור, אך נדחקו מעט בשעות הערב.",
      trajectory: [75, 82, 86, 79, 74, 68, 63, 61, 55, 48, 42, 39],
      headlines: [
        ["וואלה", "הצעת החוק שתעלה לדיון מחר"],
        ["כאן", "הקואליציה והאופוזיציה נערכות להצבעה"],
        ["N12", "מאחורי המשא ומתן בכנסת"],
      ],
    },
    {
      id: "cost",
      title: "יוקר המחיה",
      category: "כלכלה",
      className: "economy",
      share: 10,
      change: -0.6,
      articles: 31,
      sourceCount: 5,
      peak: "08:30",
      x: 77,
      y: 65,
      size: 130,
      summary: "מחירים וצרכנות נותרים נושא קבוע, ללא אירוע יחיד שמוביל את הסיקור.",
      trajectory: [56, 61, 58, 52, 55, 49, 44, 46, 43, 40, 38, 37],
      headlines: [
        ["גלובס", "השינוי הצפוי במחירי סל הקניות"],
        ["ynet", "משקי הבית מרגישים את ההתייקרות"],
        ["ישראל היום", "התוכנית שנועדה להוריד מחירים"],
      ],
    },
    {
      id: "world",
      title: "חדשות העולם",
      category: "עולם",
      className: "world",
      share: 9,
      change: 1.2,
      articles: 28,
      sourceCount: 5,
      peak: "17:15",
      x: 34,
      y: 72,
      size: 120,
      summary: "בחירות ואירועים בינלאומיים זוכים לנוכחות דומה ברוב המקורות.",
      trajectory: [31, 28, 32, 30, 34, 38, 42, 48, 57, 54, 59, 61],
      headlines: [
        ["כאן", "ההכרעה הפוליטית שמעסיקה את אירופה"],
        ["וואלה", "מנהיגי העולם התכנסו לפסגה"],
        ["N12", "התגובות בעולם להתפתחויות האחרונות"],
      ],
    },
    {
      id: "education",
      title: "מערכת החינוך",
      category: "חברה",
      className: "society",
      share: 7,
      change: -1.9,
      articles: 21,
      sourceCount: 4,
      peak: "07:50",
      x: 12,
      y: 68,
      size: 106,
      summary: "נושאי חינוך שהובילו בשעות הבוקר איבדו מקום עם התפתחות אירועי היום.",
      trajectory: [78, 82, 76, 68, 59, 52, 44, 40, 34, 29, 25, 22],
      headlines: [
        ["ynet", "המהלך החדש במערכת החינוך"],
        ["ישראל היום", "מנהלים והורים מגיבים לשינוי"],
        ["כאן", "הנתונים שמאחורי הוויכוח"],
      ],
    },
    {
      id: "health",
      title: "בריאות",
      category: "חברה",
      className: "society",
      share: 5,
      change: -2.8,
      articles: 15,
      sourceCount: 4,
      peak: "06:40",
      x: 91,
      y: 45,
      size: 92,
      summary: "הסיקור הרפואי הצטמצם משמעותית לעומת חלקו בשעות הבוקר.",
      trajectory: [84, 78, 71, 65, 58, 49, 43, 36, 31, 25, 20, 18],
      headlines: [
        ["וואלה", "המחקר הישראלי החדש שפורסם היום"],
        ["ynet", "בתי החולים נערכים לעומסים"],
        ["ישראל היום", "השירות החדש של קופות החולים"],
      ],
    },
  ],
  "7d": [],
  "30d": [],
};

rangeData["7d"] = rangeData["24h"].map((topic, index) => ({
  ...topic,
  share: [22, 19, 18, 13, 11, 9, 8][index],
  change: [2.1, 4.7, -0.4, 1.3, -1.1, -2.2, -1.7][index],
  size: [210, 187, 181, 149, 137, 120, 112][index],
  x: [49, 23, 74, 77, 34, 12, 91][index],
}));

rangeData["30d"] = rangeData["24h"].map((topic, index) => ({
  ...topic,
  share: [19, 18, 20, 15, 10, 10, 8][index],
  change: [-1.4, 2.8, 1.9, 2.2, -0.8, -2.4, -1.1][index],
  size: [187, 181, 194, 161, 130, 130, 112][index],
  x: [51, 24, 73, 77, 35, 12, 91][index],
}));

const sourceLabels = {
  all: "כל המקורות",
  kan: "כאן",
  ynet: "ynet",
  walla: "וואלה",
  israelhayom: "ישראל היום",
  n12: "N12",
  globes: "גלובס",
};

const elements = {
  map: document.querySelector("#bubble-map"),
  title: document.querySelector("#detail-title"),
  category: document.querySelector("#detail-category"),
  rank: document.querySelector("#detail-rank"),
  summary: document.querySelector("#detail-summary"),
  share: document.querySelector("#detail-share"),
  change: document.querySelector("#detail-change"),
  articles: document.querySelector("#detail-articles"),
  sources: document.querySelector("#detail-sources"),
  peak: document.querySelector("#detail-peak"),
  miniChart: document.querySelector("#mini-chart"),
  headlines: document.querySelector("#headline-list"),
  prototypeBadge: document.querySelector("#prototype-badge"),
  pipelineStatus: document.querySelector("#pipeline-status"),
  pipelineCopy: document.querySelector("#pipeline-copy"),
  pipelineTime: document.querySelector("#pipeline-time"),
};

let activeRange = "24h";
let activeSource = "all";
let selectedTopic = rangeData[activeRange][0];

function scaledTopics() {
  const sourceIndex = Object.keys(sourceLabels).indexOf(activeSource);
  return rangeData[activeRange].map((topic, index) => {
    if (activeSource === "all") return topic;
    const variance = (((index + 2) * (sourceIndex + 3)) % 7) - 3;
    const share = Math.max(3, topic.share + variance);
    return {
      ...topic,
      share,
      size: Math.max(82, topic.size + variance * 5),
      articles: Math.max(4, Math.round(topic.articles / 6 + variance)),
      sourceCount: 1,
    };
  });
}

function renderMap() {
  const topics = scaledTopics();
  elements.map.innerHTML = "";

  topics.forEach((topic, index) => {
    const bubble = document.createElement("button");
    bubble.className = `topic-bubble ${topic.className}${
      selectedTopic.id === topic.id ? " selected" : ""
    }`;
    bubble.style.setProperty("--x", `${topic.x}%`);
    bubble.style.setProperty("--y", `${topic.y}%`);
    bubble.style.setProperty("--size", `${topic.size}px`);
    bubble.style.setProperty("--delay", `${index * 45}ms`);
    bubble.setAttribute(
      "aria-label",
      `${topic.title}, ${topic.share} אחוז מהסיקור, ${
        topic.change >= 0 ? "עלייה" : "ירידה"
      } של ${Math.abs(topic.change)} נקודות`,
    );
    bubble.innerHTML = `
      <span class="bubble-change ${topic.change >= 0 ? "up" : "down"}">
        ${topic.change >= 0 ? "↗" : "↘"} ${Math.abs(topic.change)}
      </span>
      <strong>${topic.title}</strong>
      <span class="bubble-share">${topic.share}%</span>
    `;
    bubble.addEventListener("click", () => {
      selectedTopic = topic;
      renderMap();
      renderDetail(topic);
    });
    elements.map.appendChild(bubble);
  });
}

function renderDetail(topic) {
  const topics = scaledTopics().sort((a, b) => b.share - a.share);
  const rank = topics.findIndex((item) => item.id === topic.id) + 1;
  const sourceText = activeSource === "all" ? `${topic.sourceCount} מתוך 6` : sourceLabels[activeSource];

  elements.title.textContent = topic.title;
  elements.category.textContent = topic.category;
  elements.rank.textContent = `#${rank} בסדר היום`;
  elements.summary.textContent = topic.summary;
  elements.share.textContent = `${topic.share}%`;
  elements.change.textContent = `${topic.change >= 0 ? "↑" : "↓"} ${Math.abs(topic.change)} נק׳`;
  elements.change.className = topic.change >= 0 ? "positive" : "negative-text";
  elements.articles.textContent = topic.articles;
  elements.sources.textContent = sourceText;
  elements.peak.textContent = topic.peak;

  elements.miniChart.innerHTML = topic.trajectory
    .map(
      (value, index) =>
        `<i style="--height:${value}%; --bar-delay:${index * 18}ms" aria-hidden="true"></i>`,
    )
    .join("");

  elements.headlines.innerHTML = topic.headlines
    .map(
      ([source, title]) => `
        <div class="headline-item">
          <span>${source}</span>
          <p>${title}</p>
        </div>
      `,
    )
    .join("");
}

async function loadCollectorStatus() {
  try {
    const response = await fetch("/data/collector-status.json", { cache: "no-store" });
    if (!response.ok) return;
    const status = await response.json();
    if (!status.latestRun || status.latestRun.status === "failed") return;

    const collectedAt = new Date(status.latestRun.finishedAt);
    const time = new Intl.DateTimeFormat("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    }).format(collectedAt);

    elements.prototypeBadge.innerHTML = "<span></span> איסוף פעיל · המפה בהדגמה";
    elements.pipelineCopy.textContent = `${status.totals.uniqueArticles} פריטים ייחודיים נאספו מ־${status.latestRun.successfulSources} מקורות. מפת הנושאים עדיין משתמשת בנתוני הדגמה עד להשלמת הסיווג.`;
    elements.pipelineTime.textContent = `איסוף אחרון · ${time}`;
    elements.pipelineStatus.hidden = false;
  } catch {
    // The wireframe also works without a local collector database.
  }
}

document.querySelectorAll(".range-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeRange = button.dataset.range;
    document.querySelectorAll(".range-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedTopic = rangeData[activeRange].find((item) => item.id === selectedTopic.id);
    renderMap();
    renderDetail(selectedTopic);
  });
});

document.querySelectorAll(".source-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeSource = button.dataset.source;
    document.querySelectorAll(".source-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedTopic = scaledTopics().find((item) => item.id === selectedTopic.id);
    renderMap();
    renderDetail(selectedTopic);
  });
});

renderMap();
renderDetail(selectedTopic);
loadCollectorStatus();

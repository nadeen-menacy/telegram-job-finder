(() => {
  // Prevent duplicate listeners/observers if the popup needs to inject this file
  // after Telegram Web has already been open for a while.
  if (window.__TELEGRAM_JOB_FINDER_CONTENT_READY__) return;
  window.__TELEGRAM_JOB_FINDER_CONTENT_READY__ = true;
  const JOB_WORDS = [
    "job", "jobs", "vacancy", "vacancies", "hiring", "we are hiring", "now hiring",
    "career", "careers", "apply", "application", "recruitment", "position", "opening",
    "opportunity", "opportunities", "salary", "cv", "resume", "internship", "job opening",
    "job vacancy", "join our team", "looking for candidates", "applications are open",
    "مطلوب", "مطلوب موظف", "مطلوب موظفة", "مطلوب موظفين", "وظيفة", "وظائف",
    "وظيفة شاغرة", "وظائف شاغرة", "توظيف", "فرصة عمل", "فرص عمل", "فرصة وظيفية",
    "فرص وظيفية", "فرص توظيف", "شواغر", "شاغر", "إعلان توظيف", "اعلان توظيف",
    "التقديم", "للتقديم", "نبحث عن", "تعلن عن حاجتها", "مطلوب للعمل", "انضم لفريقنا"
  ];

  const ROLE_WORDS = [
    "developer", "engineer", "programmer", "analyst", "specialist", "technician",
    "administrator", "architect", "tester", "intern", "trainee", "consultant",
    "software development", "software engineer", "software developer", "IT support",
    "مطور", "مطورة", "مهندس", "مهندسة", "مبرمج", "مبرمجة", "محلل", "محللة",
    "أخصائي", "اخصائي", "متخصص", "متخصصة", "فني", "فنية", "مسؤول نظم", "مسؤول أنظمة",
    "متدرب", "متدربة", "مطور برمجيات", "مهندس برمجيات", "محلل بيانات", "مهندس بيانات"
  ];

  // Broad words describe a job arrangement, not the user's field.
  // They may be useful context, but must never qualify a post by themselves.
  const GENERIC_KEYWORDS = [
    "job", "jobs", "vacancy", "vacancies", "hiring", "we are hiring", "now hiring",
    "career", "careers", "apply", "application", "recruitment", "position", "opening",
    "opportunity", "opportunities", "salary", "cv", "resume", "internship", "job opening",
    "job vacancy", "join our team", "looking for candidates", "applications are open",
    "fresh graduate", "recent graduate", "graduate", "graduate program", "graduate trainee",
    "entry level", "junior", "trainee", "remote", "hybrid", "full time", "part time",
    "computer science", "computer science graduate", "cs graduate", "it graduate",
    "مطلوب", "مطلوب موظف", "مطلوب موظفة", "مطلوب موظفين", "وظيفة", "وظائف",
    "وظيفة شاغرة", "وظائف شاغرة", "توظيف", "فرصة عمل", "فرص عمل", "فرصة وظيفية",
    "فرص وظيفية", "فرص توظيف", "شواغر", "شاغر", "إعلان توظيف", "اعلان توظيف",
    "التقديم", "للتقديم", "نبحث عن", "تعلن عن حاجتها", "مطلوب للعمل", "انضم لفريقنا",
    "حديث التخرج", "خريج جديد", "خريجة جديدة", "تدريب", "متدرب", "متدربة", "عن بعد",
    "علوم الحاسب", "علوم الكمبيوتر", "علوم الحاسوب", "خريج علوم حاسب", "خريجة علوم حاسب"
  ];

  // These are actual Computer Science / IT job families, not generic seniority or
  // employment words. A match to one of these is strong evidence of relevance.
  const CS_ROLE_TERMS = [
    "software developer", "software engineer", "software development engineer", "developer",
    "junior developer", "junior software developer", "junior software engineer",
    "web developer", "website developer", "frontend developer", "front end developer",
    "front-end developer", "backend developer", "back end developer", "back-end developer",
    "full stack developer", "full-stack developer", "fullstack developer", "mobile developer",
    "mobile app developer", "application developer", "app developer", "programmer",
    "computer programmer", "software programmer", "python developer", "java developer",
    "javascript developer", "react developer", "node.js developer", ".net developer",
    "php developer", "c++ developer", "qa engineer", "quality assurance engineer",
    "software tester", "qa tester", "automation tester", "test automation engineer",
    "software test engineer", "application support analyst", "application support engineer",
    "it support specialist", "it support engineer", "it support technician", "it support",
    "it specialist", "it technician", "it analyst", "information technology specialist",
    "systems analyst", "system analyst", "systems administrator", "system administrator",
    "network administrator", "network engineer", "database administrator", "database developer",
    "database analyst", "devops engineer", "cloud engineer", "cloud architect",
    "cybersecurity analyst", "cyber security analyst", "security analyst", "soc analyst",
    "information security analyst", "security engineer", "cybersecurity engineer",
    "data analyst", "junior data analyst", "data scientist", "data engineer",
    "business intelligence analyst", "bi analyst", "machine learning engineer", "ml engineer",
    "ai engineer", "ai developer", "artificial intelligence engineer", "ai specialist",
    "ai research assistant", "nlp engineer", "computer vision engineer", "deep learning engineer",
    "software internship", "software engineering internship", "developer internship",
    "programming internship", "it internship", "information technology internship",
    "computer science internship", "software intern", "developer intern", "it intern",
    "مطور برمجيات", "مطورة برمجيات", "مهندس برمجيات", "مهندسة برمجيات", "تطوير البرمجيات",
    "تطوير البرامج", "مبرمج", "مبرمجة", "مطور برامج", "مطورة برامج", "مطور تطبيقات",
    "مطورة تطبيقات", "مبرمج تطبيقات", "مطور ويب", "مطورة ويب", "مطور مواقع", "مطورة مواقع",
    "مطور واجهات أمامية", "مطور الواجهة الأمامية", "مطور فرونت إند", "مطور واجهات خلفية",
    "مطور الواجهة الخلفية", "مطور باك إند", "مطور فل ستاك", "مطور كامل", "مطور جافا",
    "مطور بايثون", "مطور جافاسكريبت", "مطور جافا سكريبت", "مطور رياكت", "مطور نود",
    "مهندس تطبيقات", "مهندس حاسوب", "مهندس كمبيوتر", "محلل برمجيات", "محلل نظم", "محلل أنظمة", "مبرمج حاسب", "مبرمج كمبيوتر",
    "دعم فني", "الدعم الفني", "دعم تقني", "الدعم التقني", "فني حاسب", "فني كمبيوتر",
    "فني تقنية معلومات", "أخصائي دعم فني", "اخصائي دعم فني", "مسؤول تقنية معلومات",
    "أخصائي تقنية معلومات", "اخصائي تقنية معلومات", "مسؤول نظم", "مسؤول أنظمة",
    "مسؤول قواعد بيانات", "مدير قواعد بيانات", "مهندس شبكات", "أخصائي شبكات", "اخصائي شبكات",
    "مسؤول شبكات", "مسؤول خوادم", "مهندس نظم", "اختبار البرمجيات", "اختبار البرامج",
    "مختبر برمجيات", "فاحص برمجيات", "مهندس ضمان الجودة", "مهندس اختبار", "اختبار آلي",
    "أتمتة الاختبارات", "محلل بيانات", "محللة بيانات", "عالم بيانات", "مهندس بيانات",
    "مهندسة بيانات", "مهندس ذكاء اصطناعي", "مهندسة ذكاء اصطناعي", "مهندس تعلم آلي",
    "مهندس تعلم الآلة", "محلل أمن سيبراني", "أخصائي أمن سيبراني", "اخصائي أمن سيبراني",
    "أمن المعلومات", "الأمن السيبراني", "متدرب تقنية معلومات", "متدرب برمجة",
    "تدريب تقنية المعلومات", "تدريب علوم الحاسب", "تدريب هندسة البرمجيات"
  ];

  // Technical skills that can support a role match. One skill alone is not enough
  // unless the post is clearly for an IT/CS internship or trainee opportunity.
  const TECH_SKILL_TERMS = [
    "python", "java", "javascript", "typescript", "c++", "c#", "c programming",
    "php", ".net", "html", "html5", "css", "css3", "react", "react.js", "node.js",
    "express.js", "express", "mongodb", "mern", "socket.io", "rest api", "rest apis",
    "restful api", "api development", "git", "github", "data structures", "algorithms",
    "operating systems", "software engineering", "web development", "full stack development",
    "frontend development", "backend development", "sql", "nosql", "database", "databases",
    "authentication", "real-time application", "real time application", "real-time chat",
    "chat application", "debugging", "troubleshooting", "system performance", "angular",
    "vue.js", "next.js", "django", "flask", "fastapi", "spring boot", "kotlin", "swift",
    "dart", "flutter", "react native", "firebase", "postgresql", "mysql", "oracle database",
    "redis", "linux", "windows server", "bash", "powershell", "docker", "kubernetes",
    "aws", "azure", "google cloud", "ci/cd", "jenkins", "jira", "agile", "scrum", "uml",
    "object oriented programming", "oop", "data analysis", "power bi", "tableau", "pandas",
    "numpy", "tensorflow", "pytorch", "scikit-learn", "machine learning", "deep learning",
    "artificial intelligence", "generative ai", "multimodal ai", "ai agents", "agentic ai",
    "anomaly detection", "cybersecurity pipeline", "cybersecurity", "computer vision",
    "natural language processing", "nlp", "llm", "large language models", "prompt engineering",
    "data mining", "information systems", "ذكاء اصطناعي", "تعلم الآلة", "التعلم العميق",
    "بايثون", "جافا", "جافاسكريبت", "سي بلس بلس", "سي++", "سي شارب", "اتش تي ام ال",
    "رياكت", "نود جي اس", "إكسبريس", "مونغو دي بي", "قواعد البيانات", "قاعدة بيانات",
    "واجهات برمجة التطبيقات", "برمجة التطبيقات", "تطوير الويب", "تطوير المواقع",
    "تطوير التطبيقات", "هيكل البيانات", "هياكل البيانات", "الخوارزميات", "أنظمة التشغيل",
    "نظم التشغيل", "تحليل وتصميم الأنظمة", "برمجيات", "تطبيقات ويب", "تطبيقات الهاتف",
    "تطبيقات الجوال", "تطبيقات موبايل", "أمن سيبراني", "كشف الشذوذ", "وكلاء الذكاء الاصطناعي"
  ];

  // Default filters target clearly different job families. These are checked
  // against the vacancy heading/title, not every sentence in the whole bulletin.
  const DEFAULT_EXCLUDED_ROLE_TERMS = [
    "human resources", "hr recruiter", "hr assistant", "hr coordinator", "hr specialist",
    "hr officer", "hr intern", "human resources intern", "human resources assistant",
    "recruiter", "talent acquisition", "recruitment coordinator", "recruitment specialist",
    "personnel officer", "موارد بشرية", "الموارد البشرية", "مسؤول موارد بشرية",
    "أخصائي موارد بشرية", "اخصائي موارد بشرية", "منسق موارد بشرية", "مسؤول توظيف",
    "أخصائي توظيف", "اخصائي توظيف", "منسق توظيف", "استقطاب المواهب",
    "sales representative", "sales associate", "sales executive", "sales manager",
    "sales coordinator", "مندوب مبيعات", "موظف مبيعات", "مسؤول مبيعات", "أخصائي مبيعات",
    "marketing executive", "marketing specialist", "digital marketing", "social media specialist",
    "content creator", "مسوق", "مسوقة", "التسويق الإلكتروني", "أخصائي تسويق", "اخصائي تسويق",
    "customer service representative", "customer service agent", "customer service officer",
    "call center agent", "contact center agent", "خدمة العملاء", "ممثل خدمة عملاء",
    "محاسب", "محاسبة", "accountant", "accounting clerk", "accounts payable", "accounts receivable",
    "finance officer", "financial accountant", "administrative assistant", "office assistant",
    "office clerk", "secretary", "data entry clerk", "سكرتير", "سكرتيرة", "مدخل بيانات",
    "مساعد إداري", "مساعد اداري", "منسق إداري", "منسق اداري",
    "warehouse assistant", "warehouse coordinator", "warehouse worker", "logistics coordinator",
    "supply chain coordinator", "delivery driver", "driver", "سائق", "مندوب توصيل",
    "أمين مخزن", "امين مخزن", "منسق مخازن", "عامل مخازن", "موظف مستودع",
    "waiter", "waitress", "chef", "cook", "barista", "housekeeping", "hotel receptionist",
    "كاشير", "بائع", "بائعة", "طباخ", "شيف", "نادل", "عامل نظافة",
    "nurse", "doctor", "pharmacist", "dentist", "ممرض", "ممرضة", "طبيب", "طبيبة", "صيدلي",
    "civil engineer", "mechanical engineer", "electrical engineer", "chemical engineer",
    "مهندس مدني", "مهندس ميكانيكي", "مهندس كهربائي", "مهندس كيميائي"
  ];

  const MESSAGE_SELECTORS = [
    "[data-message-id]",
    "[data-mid]",
    '[id^="message-"]',
    'div[class*="Message"]',
    'div[class*="message"]',
    'div[class*="bubble"]',
    ".im_message_wrap"
  ];

  let lastScanAt = 0;
  let scanTimer = null;
  let isScanning = false;

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase()
      .normalize("NFKC")
      .replace(/[\u200e\u200f\u202a-\u202e]/g, "")
      .replace(/[\u064b-\u065f\u0670\u0640]/g, "")
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
      .replace(/\s+/g, " ")
      .trim();
  }

  function splitWords(value) {
    return String(value || "")
      .split(/[,;\n]+/)
      .map((word) => word.trim())
      .filter(Boolean);
  }

  function stripUrls(value) {
    return String(value || "").replace(/https?:\/\/[^\s<>"]+/gi, " ");
  }

  function hasToken(text, term) {
    const normalizedText = normalize(text);
    const normalizedTerm = normalize(term);
    if (!normalizedTerm) return false;

    // Very short Latin keywords (AI, IT, HTML, CSS, etc.) must be whole tokens.
    // This prevents matches inside URLs such as filenames ending in .html.
    if (/^[a-z0-9]{1,5}$/i.test(normalizedTerm)) {
      const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, "i").test(normalizedText);
    }
    return normalizedText.includes(normalizedTerm);
  }

  function hasPhrase(text, term) {
    const normalizedText = normalize(text);
    const normalizedTerm = normalize(term);
    if (!normalizedText || !normalizedTerm) return false;
    const escaped = normalizedTerm
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\s+/g, "\\s+");
    try {
      return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, "iu").test(normalizedText);
    } catch (error) {
      return (` ${normalizedText} `).includes(` ${normalizedTerm} `);
    }
  }

  function isGenericKeyword(keyword) {
    const value = normalize(keyword);
    return GENERIC_KEYWORDS.some((term) => normalize(term) === value);
  }

  function getOpeningLines(text, titleText) {
    const title = String(titleText || "").trim();
    if (title && title !== "Job listing") return title;
    return String(text || "").split(/\r?\n/)
      .map((line) => line.replace(/https?:\/\/[^\s<>\"]+/gi, " ").trim())
      .filter((line) => line.length >= 3)
      .slice(0, 4)
      .join(" ");
  }

  function findExcludedRole(titleProbe, customExcludedRoles) {
    const probe = normalize(titleProbe);
    if (!probe) return [];
    const terms = [...DEFAULT_EXCLUDED_ROLE_TERMS, ...customExcludedRoles];
    return [...new Set(terms.filter((term) => hasPhrase(probe, term)))];
  }

  function cleanUrl(value) {
    return String(value || "")
      .trim()
      .replace(/[),\]}>.!?؛،]+$/g, "");
  }

  function isSocialInviteUrl(value) {
    try {
      const host = new URL(value).hostname.toLowerCase();
      return host === "t.me" || host.endsWith(".t.me") ||
        host === "telegram.me" || host.endsWith(".telegram.me") ||
        host === "chat.whatsapp.com" || host.endsWith(".whatsapp.com") ||
        host === "wa.me";
    } catch (error) {
      return true;
    }
  }

  function isGenericListingLine(line) {
    const value = normalize(line).replace(/^[*•|\-–—\s]+|[*•|\-–—\s]+$/g, "");
    if (!value || value.length < 4 || value.length > 180) return true;
    if (/^(advertised benefit|benefit|salary|من المزايا المعلنه|راتب|المزايا المعلنه)\b/i.test(value)) return true;
    return /^(english career opportunities|career opportunities|job opportunities|فرص العمل بالعربيه|فرص العمل بالعربية|انضم لمجموعه التخصص|انضم لمجموعة التخصص|تابع جديد تخصصك|more opportunities|discover opportunities that match your skills|your expertise deserves the right opportunity|follow your specialty for more relevant career opportunities)$/i.test(value);
  }

  function titleBeforeUrl(text, url) {
    const raw = String(text || "");
    const urlIndex = raw.indexOf(url);
    if (urlIndex < 0) return "Job listing";
    const before = raw.slice(0, urlIndex);
    const lines = before.split(/\r?\n/).map((line) => line
      .replace(/https?:\/\/[^\s<>"]+/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/^[*•|\-–—\s]+|[*•|\-–—\s]+$/g, "")
      .trim());

    for (let i = lines.length - 1; i >= 0; i -= 1) {
      const candidate = lines[i].replace(/\s+/g, " ").trim();
      if (!isGenericListingLine(candidate)) return candidate.slice(0, 220);
    }
    return "Job listing";
  }

  function extractListingCandidates(text, element) {
    const links = [];
    const seen = new Set();

    // Prefer actual anchor destinations when Telegram exposes them in the message DOM.
    if (element) {
      element.querySelectorAll("a[href]").forEach((anchor) => {
        const href = cleanUrl(anchor.href || anchor.getAttribute("href"));
        if (!/^https?:\/\//i.test(href) || isSocialInviteUrl(href) || seen.has(href)) return;
        seen.add(href);
        links.push({
          url: href,
          anchorText: String(anchor.innerText || anchor.textContent || "").trim(),
          index: String(text || "").indexOf(href)
        });
      });
    }

    // Also parse plain-text URLs; many job channels post the raw URL as a separate line.
    const urlPattern = /https?:\/\/[^\s<>"']+/gi;
    let match;
    while ((match = urlPattern.exec(String(text || ""))) !== null) {
      const href = cleanUrl(match[0]);
      if (!/^https?:\/\//i.test(href) || isSocialInviteUrl(href) || seen.has(href)) continue;
      seen.add(href);
      links.push({ url: href, anchorText: "", index: match.index });
    }

    links.sort((a, b) => {
      if (a.index < 0 && b.index < 0) return 0;
      if (a.index < 0) return 1;
      if (b.index < 0) return -1;
      return a.index - b.index;
    });

    const rawText = String(text || "");
    return links.map((link, index) => {
      const previous = links[index - 1];
      const next = links[index + 1];
      const start = previous && previous.index >= 0
        ? previous.index + previous.url.length
        : 0;
      const end = next && next.index >= 0 ? next.index : rawText.length;
      const contextText = link.index >= 0 ? rawText.slice(start, end) : rawText;
      const foundTitle = titleBeforeUrl(contextText, link.url);
      return {
        title: foundTitle !== "Job listing" ? foundTitle : (link.anchorText || "Job listing"),
        url: link.url,
        contextText
      };
    });
  }

  function getText(element) {
    return String(element?.innerText || element?.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/[\t ]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function isVisible(element) {
    if (!element || !element.isConnected) return false;
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return false;
    return element.getClientRects().length > 0;
  }

  function getElementClassName(element) {
    return typeof element.className === "string" ? element.className : "";
  }

  function messageScore(element) {
    const className = getElementClassName(element);
    const id = element.id || "";
    let score = 0;
    if (element.hasAttribute("data-message-id") || element.hasAttribute("data-mid")) score += 100;
    if (/^message[-_]/i.test(id)) score += 80;
    if (/(^|\s)Message(\s|$)/.test(className)) score += 60;
    if (/message/i.test(className)) score += 45;
    if (/bubble/i.test(className)) score += 25;
    if (/im_message_wrap/i.test(className)) score += 25;
    if (/(container|list|wrapper|composer|input|preview|reply|header|footer)/i.test(className)) score -= 70;
    return score;
  }

  function getMessageId(element) {
    let current = element;
    let depth = 0;
    while (current && current !== document.body && depth < 4) {
      const dataId = current.getAttribute("data-message-id") || current.getAttribute("data-mid");
      if (dataId) return dataId;
      if (current.id && /^message[-_]/i.test(current.id)) return current.id;
      current = current.parentElement;
      depth += 1;
    }
    return "";
  }

  function collectMessageElements() {
    const found = new Set();
    for (const selector of MESSAGE_SELECTORS) {
      try {
        document.querySelectorAll(selector).forEach((element) => found.add(element));
      } catch (error) {
        // Ignore selectors that are not supported by a particular Telegram Web version.
      }
    }

    const candidates = [...found]
      .filter((element) => {
        if (!isVisible(element)) return false;
        if (element.closest("[contenteditable='true'], textarea, input")) return false;
        const text = getText(element);
        if (text.length < 18 || text.length > 9000) return false;
        return messageScore(element) > 0;
      })
      .map((element) => ({ element, text: getText(element), score: messageScore(element), id: getMessageId(element) }))
      .sort((a, b) => b.score - a.score || b.text.length - a.text.length);

    const chosen = new Map();
    for (const candidate of candidates) {
      const key = candidate.id ? `id:${candidate.id}` : `text:${normalize(candidate.text)}`;
      const previous = chosen.get(key);
      if (!previous || candidate.score > previous.score || (candidate.score === previous.score && candidate.text.length > previous.text.length)) {
        chosen.set(key, candidate);
      }
    }

    return [...chosen.values()].filter((item) => item.text.length >= 18);
  }

  function getChatTitle() {
    const selectors = [
      ".chat-info .peer-title",
      ".topbar-title",
      '[class*="Topbar"] [class*="title"]',
      '[class*="ChatInfo"] [class*="title"]',
      'header [dir="auto"]'
    ];
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      const text = getText(element);
      if (text && text.length < 120) return text;
    }
    return document.title.replace(/\s*[|–-]\s*Telegram.*$/i, "").trim() || "Telegram chat";
  }


  const CV_SKILLS = [
    "java", "javascript", "python", "c++", "c", "react", "node.js", "express.js",
    "mongodb", "socket.io", "rest api", "git", "github", "html", "css",
    "deep learning", "ai agents", "multimodal models", "anomaly detection", "cybersecurity"
  ];

  function detectCategory(text, title) {
    const probe = normalize(`${title || ""} ${text || ""}`);
    const hasAny = (terms) => terms.some((term) => hasPhrase(probe, term));
    if (hasAny(["cybersecurity", "cyber security", "information security", "soc analyst", "امن سيبراني", "الأمن السيبراني", "أمن المعلومات"])) return "Cybersecurity";
    if (hasAny(["machine learning", "deep learning", "artificial intelligence", "ai engineer", "ai developer", "generative ai", "ai agents", "ذكاء اصطناعي", "تعلم الآلة", "التعلم العميق", "وكلاء الذكاء الاصطناعي"])) return "AI & Machine Learning";
    if (hasAny(["data analyst", "data scientist", "data engineer", "business intelligence", "bi analyst", "محلل بيانات", "عالم بيانات", "مهندس بيانات", "تحليل البيانات"])) return "Data & Analytics";
    if (hasAny(["qa engineer", "quality assurance", "software tester", "qa tester", "test automation", "software testing", "مختبر برمجيات", "اختبار البرمجيات", "ضمان الجودة"])) return "QA & Testing";
    if (hasAny(["devops", "cloud engineer", "cloud architect", "aws", "azure", "kubernetes", "docker", "مهندس سحابة", "الحوسبة السحابية"])) return "Cloud & DevOps";
    if (hasAny(["database administrator", "database developer", "database analyst", "sql developer", "مسؤول قواعد بيانات", "قواعد البيانات"])) return "Databases";
    if (hasAny(["it support", "technical support", "help desk", "service desk", "network engineer", "systems administrator", "system administrator", "it specialist", "it technician", "دعم فني", "الدعم الفني", "مهندس شبكات", "مسؤول نظم", "مسؤول أنظمة"])) return "IT Support & Systems";
    if (hasAny(["software", "web developer", "frontend", "front-end", "backend", "back-end", "full stack", "programmer", "application developer", "مطور", "مبرمج", "مهندس برمجيات", "تطوير البرمجيات", "مطور ويب"])) return "Software Development";
    return "Computer Science / IT";
  }

  function detectLanguage(text) {
    const value = String(text || "");
    const arabic = (value.match(/[\u0600-\u06FF]/g) || []).length;
    const latin = (value.match(/[A-Za-z]/g) || []).length;
    if (arabic > 0 && latin > 0) return "Bilingual";
    if (arabic > 0) return "Arabic";
    return "English";
  }

  function detectLocation(text) {
    const value = normalize(text);
    const isRemote = ["remote", "work from home", "work remotely", "عن بعد", "العمل عن بعد", "من المنزل"].some((term) => hasPhrase(value, term));
    const isKuwait = ["kuwait", "الكويت", "الكويتية", "kwd", "k.d."].some((term) => hasPhrase(value, term));
    if (isKuwait && isRemote) return "Kuwait / Remote";
    if (isKuwait) return "Kuwait";
    if (isRemote) return "Remote";
    return "Not specified";
  }

  function getCvSkillMatches(text) {
    return CV_SKILLS.filter((skill) => hasPhrase(text, skill));
  }

  function getListingTitle(text, candidateTitle) {
    if (candidateTitle && candidateTitle !== "Job listing") return candidateTitle;
    const lines = String(text || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    return (lines.find((line) => !/^https?:\/\//i.test(line) && line.length >= 5) || "Job opportunity").slice(0, 180);
  }

  function calculateMatch(text, keywords, excluded, excludedRoles, minimumScore, titleText = "") {
    // URLs are removed before all matching so link filenames such as .html do
    // not masquerade as skills. Generic terms like "internship" are context only.
    const searchableText = stripUrls(text);
    const normalizedText = normalize(searchableText);
    const matchedAllKeywords = keywords.filter((keyword) => hasToken(normalizedText, keyword));
    if (matchedAllKeywords.length === 0) return null;

    const excludedWords = excluded.filter((word) => hasToken(normalizedText, word));
    if (excludedWords.length > 0) return null;

    const titleProbe = getOpeningLines(searchableText, titleText);
    const excludedRolesFound = findExcludedRole(titleProbe, excludedRoles);
    if (excludedRolesFound.length > 0) return null;

    const roleMatches = CS_ROLE_TERMS.filter((term) => hasPhrase(searchableText, term));
    const technicalMatches = TECH_SKILL_TERMS.filter((term) => hasPhrase(searchableText, term));
    const specificCustomKeywords = matchedAllKeywords.filter((keyword) => !isGenericKeyword(keyword));
    const technicalCandidates = [...technicalMatches, ...specificCustomKeywords];
    const uniqueTechnicalMatches = [...new Map(technicalCandidates.map((term) => [normalize(term), term])).values()];

    const hasInternshipContext = [
      "internship", "intern", "trainee", "graduate trainee", "graduate program",
      "تدريب", "متدرب", "متدربة", "حديث التخرج", "خريج جديد"
    ].some((term) => hasPhrase(titleProbe, term) || hasPhrase(searchableText, term));
    const hasJobLanguage = JOB_WORDS.some((word) => hasPhrase(searchableText, word));
    const hasRoleInTitle = CS_ROLE_TERMS.some((term) => hasPhrase(titleProbe, term));

    // Relevance gate:
    // 1) A specific CS/IT role is enough; OR
    // 2) two or more technical skills plus job-post context; OR
    // 3) one technical skill plus an explicitly technical internship/trainee context.
    // A generic word such as "internship", "remote", or "graduate" never qualifies alone.
    const hasSpecificRole = roleMatches.length > 0;
    const hasMultipleSkills = uniqueTechnicalMatches.length >= 2 && hasJobLanguage;
    const hasTechnicalInternship = hasInternshipContext && uniqueTechnicalMatches.length >= 1;
    if (!hasSpecificRole && !hasMultipleSkills && !hasTechnicalInternship) return null;
    if (!hasJobLanguage && !hasRoleInTitle && !hasInternshipContext) return null;

    const usefulKeywords = [...new Set(specificCustomKeywords)].slice(0, 18);
    const reasons = [];
    if (roleMatches.length) reasons.push(`CS/IT role: ${roleMatches.slice(0, 3).join(", ")}`);
    if (uniqueTechnicalMatches.length) reasons.push(`Technical skills: ${uniqueTechnicalMatches.slice(0, 6).join(", ")}`);
    if (hasInternshipContext) reasons.push("Internship / graduate opportunity");

    const score = Math.min(
      98,
      35 + (hasSpecificRole ? 32 : 0) + Math.min(uniqueTechnicalMatches.length, 4) * 5 +
      (hasJobLanguage ? 8 : 0) + (hasInternshipContext ? 5 : 0)
    );

    if (score < minimumScore) return null;
    return {
      score,
      matchedKeywords: usefulKeywords.length ? usefulKeywords : uniqueTechnicalMatches.slice(0, 12),
      matchReasons: reasons
    };
  }

  function createStableId(chatUrl, messageId, text) {
    const source = `${chatUrl}|${messageId || normalize(text).slice(0, 180)}`;
    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `tjf-${(hash >>> 0).toString(16)}`;
  }

  function addHighlight(element, score) {
    element.classList.add("tjf-job-match-highlight");
    element.setAttribute("data-tjf-score", String(score));
    element.title = `Telegram Job Finder: ${score}% keyword match`;
  }

  function addHighlightStyles() {
    if (document.getElementById("tjf-highlight-styles")) return;
    const style = document.createElement("style");
    style.id = "tjf-highlight-styles";
    style.textContent = `
      .tjf-job-match-highlight {
        outline: 2px solid #21966b !important;
        outline-offset: 2px !important;
        border-radius: 8px !important;
        background-color: rgba(44, 170, 112, 0.10) !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function storageIdentity(job) {
    const candidate = Array.isArray(job.listingCandidates) ? job.listingCandidates[0] : null;
    if (candidate?.url) return `${job.url || ""}|${candidate.url}`;
    return job.id || `${job.url || ""}|${normalize(job.text || "").slice(0, 180)}`;
  }

  async function storeMatches(newJobs) {
    if (!newJobs.length) return 0;
    const saved = await chrome.storage.local.get("jobs");
    const existing = Array.isArray(saved.jobs) ? saved.jobs : [];
    const byIdentity = new Map(existing.map((job) => [storageIdentity(job), job]));
    let added = 0;

    for (const job of newJobs) {
      const identity = storageIdentity(job);
      if (!byIdentity.has(identity)) added += 1;
      const previous = byIdentity.get(identity) || {};
      byIdentity.set(identity, {
        ...previous,
        ...job,
        id: previous.id || job.id,
        status: previous.status || job.status || "to_review",
        notes: previous.notes || job.notes || ""
      });
    }

    const merged = [...byIdentity.values()]
      .sort((a, b) => String(b.savedAt || "").localeCompare(String(a.savedAt || "")))
      .slice(0, 1000);
    await chrome.storage.local.set({ jobs: merged });
    return added;
  }

  async function scanChat() {
    if (isScanning) return { ok: true, scanned: 0, matches: 0, note: "A scan is already running." };
    isScanning = true;
    try {
      const stored = await chrome.storage.local.get("settings");
      const settings = stored.settings || {};
      const keywords = splitWords(settings.keywords);
      const excluded = splitWords(settings.excludeWords);
      const excludedRoles = splitWords(settings.excludeRoles || "");
      const minimumScore = Number(settings.minScore ?? 50);

      if (keywords.length === 0) {
        return { ok: false, error: "Add at least one job title or skill in the extension first." };
      }

      addHighlightStyles();
      document.querySelectorAll(".tjf-job-match-highlight").forEach((element) => {
        element.classList.remove("tjf-job-match-highlight");
        element.removeAttribute("data-tjf-score");
        element.removeAttribute("title");
      });

      const messages = collectMessageElements();
      const chat = getChatTitle();
      const chatUrl = location.href;
      const matches = [];

      for (const item of messages) {
        const listingCandidates = extractListingCandidates(item.text, item.element);

        if (listingCandidates.length) {
          // Evaluate each linked vacancy separately so a technical job in a
          // multi-vacancy bulletin does not make unrelated links look relevant.
          let messageHadMatch = false;
          let bestMessageScore = 0;
          for (const candidate of listingCandidates) {
            const result = calculateMatch(candidate.contextText || item.text, keywords, excluded, excludedRoles, minimumScore, candidate.title);
            if (!result) continue;
            messageHadMatch = true;
            bestMessageScore = Math.max(bestMessageScore, result.score);
            matches.push({
              id: createStableId(chatUrl, `${item.id}|${candidate.url}`, item.text),
              chat,
              url: chatUrl,
              messageId: item.id || "",
              text: item.text.slice(0, 5000),
              title: getListingTitle(candidate.contextText || item.text, candidate.title),
              category: detectCategory(candidate.contextText || item.text, candidate.title),
              language: detectLanguage(candidate.contextText || item.text),
              location: detectLocation(candidate.contextText || item.text),
              cvSkillsMatched: getCvSkillMatches(candidate.contextText || item.text),
              listingCandidates: [{
                title: getListingTitle(candidate.contextText || item.text, candidate.title),
                url: candidate.url,
                category: detectCategory(candidate.contextText || item.text, candidate.title),
                language: detectLanguage(candidate.contextText || item.text),
                location: detectLocation(candidate.contextText || item.text)
              }],
              matchedKeywords: result.matchedKeywords,
              matchReasons: result.matchReasons,
              score: result.score,
              status: "to_review",
              notes: "",
              savedAt: new Date().toISOString()
            });
          }
          if (messageHadMatch) addHighlight(item.element, bestMessageScore);
          continue;
        }

        // Keep supporting posts that contain a vacancy but no direct external link.
        const result = calculateMatch(item.text, keywords, excluded, excludedRoles, minimumScore, "");
        if (!result) continue;
        addHighlight(item.element, result.score);
        matches.push({
          id: createStableId(chatUrl, item.id, item.text),
          chat,
          url: chatUrl,
          messageId: item.id || "",
          text: item.text.slice(0, 5000),
          title: getListingTitle(item.text, ""),
          category: detectCategory(item.text, ""),
          language: detectLanguage(item.text),
          location: detectLocation(item.text),
          cvSkillsMatched: getCvSkillMatches(item.text),
          listingCandidates: [],
          matchedKeywords: result.matchedKeywords,
          matchReasons: result.matchReasons,
          score: result.score,
          status: "to_review",
          notes: "",
          savedAt: new Date().toISOString()
        });
      }

      const added = await storeMatches(matches);
      lastScanAt = Date.now();
      return { ok: true, scanned: messages.length, matches: matches.length, added };
    } catch (error) {
      return { ok: false, error: error?.message || "The scan failed." };
    } finally {
      isScanning = false;
    }
  }

  function scheduleAutomaticScan() {
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(async () => {
      const stored = await chrome.storage.local.get("settings");
      const settings = stored.settings || {};
      if (!settings.autoScan || !String(settings.keywords || "").trim()) return;
      if (Date.now() - lastScanAt < 1200) return;
      await scanChat();
    }, 1400);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "TJF_SCAN") {
      scanChat().then(sendResponse);
      return true;
    }
    return false;
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.settings) scheduleAutomaticScan();
  });

  const observer = new MutationObserver((mutations) => {
    const hasAddedContent = mutations.some((mutation) => mutation.addedNodes && mutation.addedNodes.length > 0);
    if (hasAddedContent) scheduleAutomaticScan();
  });

  function startObserver() {
    if (!document.body) {
      setTimeout(startObserver, 500);
      return;
    }
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleAutomaticScan();
  }

  startObserver();
})();

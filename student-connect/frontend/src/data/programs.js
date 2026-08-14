export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"];

export const CAMPUSES = {
  Vellore: {
    label: "VIT Vellore",
    tone: "blue",
    levels: {
      "B.Tech": [
        "Biotechnology","Chemical Engineering","Civil Engineering",
        "Civil Engineering — In Collaboration with L&T","Computer Science & Engineering (CSE)",
        "CSE — Artificial Intelligence & Data Engineering","CSE — Artificial Intelligence & Machine Learning",
        "CSE — Bioinformatics","CSE & Business Systems — In Collaboration with TCS",
        "CSE — Cyber Security","CSE — Data Science","Electrical & Electronics Engineering (EEE)",
        "Electronics & Communication Engineering (ECE)","Electronics & Computer Engineering (ECM)",
        "Electronics & Instrumentation Engineering (EIE)","Electronics Engineering — VLSI Design & Technology",
        "Health Sciences & Technology","Information Technology (IT)","Mechanical Engineering"
      ],
      "Other UG": [
        "B.Des","B.Arch","B.Sc. (Hons.) Agriculture","B.Sc. Hospitality & Hotel Administration",
        "B.Sc. Computer Science","B.Sc. Multimedia & Animation","B.Sc. Visual Communication","BBA",
        "BBA — Financial Analytics (2+2)"
      ],
      "5-Year / Integrated": [
        "Integrated M.Tech CSE — Data Science","Integrated M.Tech CSE — Software Engineering",
        "Integrated M.Tech CSE — in collaboration with Virtusa","Integrated M.Sc Biotechnology",
        "Integrated M.Sc Food Science & Technology","Integrated M.Sc Data Science",
        "Integrated M.Sc Physics","Integrated M.Sc Chemistry","Integrated M.Sc Mathematics"
      ],
      "PG": [
        "M.Tech CAD/CAM","M.Tech Construction Technology & Management","M.Tech Control & Automation",
        "M.Tech IoT & Sensor Systems","M.Tech Mechatronics","M.Tech Power Electronics & Drives",
        "M.Tech Structural Engineering","M.Tech AI & Machine Learning — LTIMindtree",
        "M.Tech Automotive Electronics","M.Tech VLSI Design","MCA","MBA","M.Des Industrial Design",
        "M.Sc Applied Microbiology","M.Sc Biomedical Genetics"
      ]
    }
  },
  Chennai: {
    label: "VIT Chennai",
    tone: "green",
    levels: {
      "B.Tech": [
        "Biotechnology","Civil Engineering","Civil Engineering — In Collaboration with L&T",
        "Computer Science & Engineering","CSE — Artificial Intelligence & Machine Learning",
        "CSE — Artificial Intelligence & Robotics","CSE — Cyber Security","CSE — Data Science",
        "CSE — Quantum Computing","Electrical & Electronics Engineering",
        "Electrical & Computer Science Engineering","Electronics & Communication Engineering",
        "Electronics & Computer Engineering","Electronics Engineering — VLSI Design & Technology",
        "Fashion Technology","Mechanical Engineering","Mechanical Engineering — Electric Vehicles",
        "Mechatronics & Automation"
      ],
      "Other UG": [
        "B.Sc. Computer Science","B.Sc. Fashion Design","B.Sc. Economics (Hons.)",
        "B.Sc. Multimedia & Animation","B.Sc. Visual Communication","BBA (Hons.)",
        "BBA (Hons.) — 2+2 with RIT","B.Com (Hons.)","B.A. LL.B. (Hons.)","B.B.A. LL.B. (Hons.)"
      ],
      "5-Year / Integrated": [
        "Integrated M.Tech CSE — Data Science","Integrated M.Tech CSE — Software Engineering",
        "Integrated M.Sc Applied Psychology"
      ],
      "PG": [
        "M.Tech Mechatronics","M.Tech Structural Engineering",
        "M.Tech AI & Machine Learning — LTIMindtree","M.Tech VLSI Design",
        "M.Tech Electric Mobility","M.E. Automation & Mechatronics — Valeo","MCA","MBA"
      ]
    }
  },
  Amravati: {
    label: "VIT-AP — Amaravati",
    tone: "yellow",
    levels: {
      "B.Tech": [
        "Computer Science & Engineering","CSE — Artificial Intelligence & Machine Learning",
        "CSE — Blockchain","CSE — Cyber Security","CSE — Data Analytics","CSE — Software Engineering",
        "Computer Science & Business Systems","Biotechnology","Electronics & Communication Engineering",
        "ECE — Embedded Systems","ECE — VLSI","Electrical & Electronics Engineering",
        "Electronics & Computer Engineering","Mechanical Engineering",
        "Mechanical Engineering — Automotive Design","Mechanical Engineering — Robotics"
      ],
      "Other UG": [
        "BBA","BBA (Hons.)","BBA — Business Analytics","BBA — Digital Marketing","BBA — FinTech",
        "BBA — General Management","BBA 2+2 — Arizona State University",
        "BBA 2+2 — University of Michigan-Dearborn","B.Com — Finance",
        "B.Sc. Applied Statistics & Analytics","B.Sc. Psychology","Dual Degree M.Sc. Data Science",
        "Dual Degree MA Public Services","B.A. LL.B. (Hons.)","B.B.A. LL.B. (Hons.)"
      ],
      "5-Year / Integrated": [
        "Integrated M.Tech CSE — in collaboration with Virtusa",
        "Integrated M.Tech CSE — Software Engineering"
      ],
      "PG": ["M.Tech VLSI Design","MCA","MBA"]
    }
  },
  Bhopal: {
    label: "VIT Bhopal",
    tone: "red",
    levels: {
      "B.Tech": [
        "Aerospace Engineering","Bioengineering","Computer Science & Engineering",
        "CSE — Artificial Intelligence & Machine Learning","CSE — Cloud Computing & Automation",
        "CSE — Cyber Security & Digital Forensics","CSE — E-Commerce Technology",
        "CSE — Education Technology","CSE — Gaming Technology","CSE — Health Informatics",
        "Electronics & Communication Engineering","ECE — Artificial Intelligence & Cybernetics",
        "Mechanical Engineering","Mechanical Engineering — Artificial Intelligence & Robotics","B.Arch"
      ],
      "5-Year / Integrated": [
        "Integrated M.Tech Artificial Intelligence","Integrated M.Tech CSE — Cyber Security",
        "Integrated M.Tech CSE — Computational & Data Science","Integrated M.Tech AI & Bioinformatics"
      ],
      "PG": [
        "M.Tech VLSI Design","M.Tech CSE — Cyber Security & Digital Forensics",
        "M.Tech Artificial Intelligence & Data Science","MCA","MBA"
      ]
    }
  }
};

export const CAMPUS_OPTIONS = Object.entries(CAMPUSES).map(([value, data]) => ({
  value,
  label: data.label
}));

export function getLevels(campus) {
  return campus && CAMPUSES[campus] ? Object.keys(CAMPUSES[campus].levels) : [];
}

export function getProgrammes(campus, level) {
  return campus && level && CAMPUSES[campus]?.levels[level]
    ? CAMPUSES[campus].levels[level]
    : [];
}

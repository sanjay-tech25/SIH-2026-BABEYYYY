export const manifest = {
  screens: {
    scr_cl6d43: { name: "Today", route: "/", state: { "view": "dashboard" }, position: { "x": 0, "y": 0 }, isDefaultRow: true },
    scr_ghley5: { name: "Courses", route: "/", state: { "view": "courses" }, position: { "x": 160, "y": 1820 } },
    scr_nrwknv: { name: "Learning path", route: "/", state: { "view": "path" }, position: { "x": 1560, "y": 1820 } },
    scr_hbdwmn: { name: "Lesson", route: "/", state: { "view": "lesson" }, position: { "x": 2960, "y": 1820 } },
    scr_j842cj: { name: "Practice question", route: "/", state: { "view": "practice" }, position: { "x": 4360, "y": 1820 } },
    scr_ft3fk4: { name: "Practice results", route: "/", state: { "view": "results" }, position: { "x": 5760, "y": 1820 } },
    scr_47g3x5: { name: "Assessments", route: "/", state: { "view": "assessments" }, position: { "x": 1400, "y": 0 }, isDefaultRow: true },
    scr_2g886o: { name: "Ask the tutor", route: "/", state: { "view": "tutor" }, position: { "x": 2800, "y": 0 }, isDefaultRow: true },
    scr_w4glnf: { name: "Progress", route: "/", state: { "view": "progress" }, position: { "x": 160, "y": 3800 } },
    scr_mylm8o: { name: "Milestones", route: "/", state: { "view": "achievements" }, position: { "x": 1560, "y": 3800 } }
  },
  sections: {
    sec_ynp11k: { name: "Learning journey", x: 0, y: 1600, width: 7120, height: 1180 },
    sec_oz000z: { name: "Progress tracking", x: 0, y: 3580, width: 2920, height: 1180 }
  },
  layers: [
  { kind: "screen", id: "scr_cl6d43" },
  { kind: "screen", id: "scr_47g3x5" },
  { kind: "screen", id: "scr_2g886o" },
  { kind: "section", id: "sec_ynp11k", children: [
    { kind: "screen", id: "scr_ghley5" },
    { kind: "screen", id: "scr_nrwknv" },
    { kind: "screen", id: "scr_hbdwmn" },
    { kind: "screen", id: "scr_j842cj" },
    { kind: "screen", id: "scr_ft3fk4" }]
  },
  { kind: "section", id: "sec_oz000z", children: [
    { kind: "screen", id: "scr_w4glnf" },
    { kind: "screen", id: "scr_mylm8o" }]
  }]

};
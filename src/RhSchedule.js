// RICHMOND HILL JIU-JITSU — the weekly timetable.
//
// Mirrored from richmondhill-next/src/data/schedule.js, which is what rhbjj.ca
// actually renders. Keep them identical: a schedule board that disagrees with
// the website sends people to a class that is not running.
//
// `maple: true` means the class runs at the Maple location, not at King Rd.
// The morning and lunch mats are all Maple; everything in the evening is
// Richmond Hill. A board that does not say so is telling someone to drive to
// the wrong address.
//
// `short` is a narrow-screen label for a name that would otherwise wrap.
const schedule = {
  Monday: [
    { name: "BJJ - NoGi", start: 7.5, end: 8.5, maple: true },
    { name: "BJJ - NoGi", start: 12.5, end: 13.5, maple: true },
    { name: "Muay Thai", start: 18, end: 19 },
    { name: "BJJ - NoGi", start: 19, end: 20 },
  ],
  Tuesday: [
    { name: "BJJ - Gi", start: 7.5, end: 8.5, maple: true },
    { name: "BJJ - Gi", start: 12.5, end: 13.5, maple: true },
    { name: "Kids BJJ", start: 18, end: 19 },
    { name: "Teens BJJ", start: 19, end: 20 },
  ],
  Wednesday: [
    { name: "BJJ - NoGi", start: 7.5, end: 8.5, maple: true },
    { name: "BJJ - NoGi", start: 12.5, end: 13.5, maple: true },
    { name: "Muay Thai", start: 18, end: 19 },
    { name: "BJJ - NoGi", start: 19, end: 20 },
  ],
  Thursday: [
    { name: "BJJ - Gi", start: 7.5, end: 8.5, maple: true },
    { name: "BJJ - Gi", start: 12.5, end: 13.5, maple: true },
    { name: "Kids BJJ", start: 18, end: 19 },
    { name: "Teens BJJ", start: 19, end: 20 },
  ],
  Friday: [
    { name: "BJJ - NoGi", start: 7.5, end: 8.5, maple: true },
    { name: "BJJ - NoGi", start: 12.5, end: 13.5, maple: true },
    { name: "Kids Muay Thai", short: "Kids MT", start: 17, end: 18 },
    { name: "Muay Thai", start: 18, end: 19 },
    { name: "BJJ - NoGi", start: 19, end: 20 },
  ],
  Saturday: [
    { name: "Kids BJJ", start: 11.5, end: 12.5 },
    { name: "Wrestling", start: 12.5, end: 13.5 },
  ],
};

export default schedule;

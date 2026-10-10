// MAPLE JIU-JITSU — the weekly timetable.
//
// Mirrored from maple-next/objects/ScheduleObject.js, which is what maplebjj.com
// renders. Keep them identical. Sunday is gone and the evenings now run to 9pm.

 import nogi from "./Images/nogi.jpeg"
 
import wrestling from "./Images/Used/wrestling.webp"
import gi from "./Images/bjj.jpg"
import kids from "./Images/637d4b8a924a943ea9dc07dbd37f4e84a923d401-2160x2227.jpg"
import mt from "./Images/mt.jpg"

const schedule = {
  Monday: [
    { name: "BJJ - NoGi", start: 7.5, end: 8.5 },
    { name: "BJJ - NoGi", start: 12.5, end: 13.5 },
    { name: "Kids MT", start: 17, end: 18, pic: kids },
    { name: "Muay Thai", start: 18, end: 19, pic: mt },
    { name: "Wrestling", start: 19, end: 20, pic: wrestling },
    { name: "BJJ - NoGi", start: 20, end: 21, pic: nogi },
  ],
  Tuesday: [
    { name: "BJJ - Gi", start: 7.5, end: 8.5, pic: gi },
    { name: "BJJ - Gi", start: 12.5, end: 13.5, pic: gi },
    { name: "Kids BJJ", start: 17, end: 18, pic: kids },
    { name: "Muay-Thai", start: 18, end: 19, pic: mt },
    { name: "Wrestling", start: 19, end: 20, pic: wrestling },
    { name: "BJJ - Gi", start: 20, end: 21, pic: gi },
  ],
  Wednesday: [
    { name: "BJJ - NoGi", start: 7.5, end: 8.5, pic: nogi },
    { name: "BJJ - NoGi", start: 12.5, end: 13.5, pic: nogi },
    { name: "Kids MT", start: 17, end: 18, pic: kids },
    { name: "Muay Thai", start: 18, end: 19, pic: mt },
    { name: "Wrestling", start: 19, end: 20, pic: wrestling },
    { name: "BJJ - NoGi", start: 20, end: 21, pic: nogi },
  ],
  Thursday: [
    { name: "BJJ - Gi", start: 7.5, end: 8.5, pic: gi },
    { name: "BJJ - Gi", start: 12.5, end: 13.5, pic: gi },
    { name: "Kids BJJ", start: 17, end: 18, pic: kids },
    { name: "Muay-Thai", start: 18, end: 19, pic: mt },
    { name: "Wrestling", start: 19, end: 20, pic: wrestling },
    { name: "BJJ - Gi", start: 20, end: 21, pic: gi },
  ],
  Friday: [
    { name: "BJJ - NoGi", start: 7.5, end: 8.5, pic: nogi },
    { name: "BJJ - NoGi", start: 12.5, end: 13.5, pic: nogi },
    { name: "Kids BJJ", start: 17, end: 18, pic: kids },
    { name: "Muay Thai", start: 18, end: 19, pic: mt },
    { name: "Wrestling", start: 19, end: 20, pic: wrestling },
    { name: "BJJ - NoGi", start: 20, end: 21, pic: nogi },
  ],
  Saturday: [
    { name: "Kids MT", start: 12, end: 13, pic: kids },
    { name: "Muay-Thai", start: 13, end: 14, pic: mt },
    { name: "Wrestling", start: 14, end: 15, pic: wrestling },
    { name: "Open Mat", start: 15, end: 16, pic: nogi },
  ],
};

export default schedule;

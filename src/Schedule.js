 import nogi from "./Images/nogi.jpeg"
 import mma from "./Images/mmazuck.jpg"
 
import wrestling from "./Images/Used/wrestling.webp"

const schedule = {
  Monday: [
    { name: "BJJ - NoGi", start: 7.5, end: 8.5, pic:nogi},
    { name: "BJJ - NoGi", start: 12.5, end: 13.5, pic:nogi },
        { name: "MMA", start: 17.5, end: 18.5, pic:mma },
    { name: "Wrestling", start: 18.5, end: 19.5, pic:wrestling},
    { name: "BJJ - NoGi", start: 19.5, end: 20.5, pic:nogi }
  ],
  Tuesday: [
    { name: "BJJ - Gi", start: 7.5, end: 8.5 },
    { name: "BJJ - Gi", start: 12.5, end: 13.5 },
    { name: "Kids", start: 17.5, end: 18.5},
    { name: "Muay Thai", start: 18.5, end: 19.5 },
    { name: "BJJ - Gi", start: 19.5, end: 20.5 }
  ],
  Wednesday: [
    { name: "BJJ - NoGi", start: 7.5, end: 8.5 },
    { name: "BJJ - NoGi", start: 12.5, end: 13.5 },
    { name: "MMA", start: 17.5, end: 18.5 },
    { name: "Wrestling", start: 18.5, end: 19.5 },
    { name: "BJJ - NoGi", start: 19.5, end: 20.5 }
  ],
  Thursday: [
    { name: "BJJ - Gi", start: 7.5, end: 8.5 },
    { name: "BJJ - Gi", start: 12.5, end: 13.5 },
        { name: "Kids", start: 17.5, end: 18.5},
    { name: "Muay Thai", start: 18.5, end: 19.5},
    { name: "BJJ - Gi", start: 19.5, end: 20.5 }
  ],
  Friday: [
    { name: "BJJ - NoGi", start: 7.5, end: 8.5 },
    { name: "BJJ - NoGi", start: 12.5, end: 13.5 },
 
        { name: "MMA", start: 17.5, end: 18.5 },
    { name: "Wrestling", start: 18.5, end: 19.5 },
    { name: "BJJ - NoGi", start: 19.5, end: 20.5 }
  ],
  Saturday: [ 
 
    { name: "BJJ - Gi", start: 12, end: 13},
      { name: "Kids", start: 14, end: 15},
  ]
  ,
  Sunday: [
    { name: "Kids", start: 11, end: 12},
    { name: "Open Mat", start: 12, end: 13
      
    },
  ]
};
export default schedule  
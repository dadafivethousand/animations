 import nogi from "./Images/nogi.jpeg"
 import mma from "./Images/mmazuck.jpg"
 
import wrestling from "./Images/Used/wrestling.webp"
import gi from "./Images/bjj.jpg"
import kids from "./Images/637d4b8a924a943ea9dc07dbd37f4e84a923d401-2160x2227.jpg"
import mt from "./Images/mt.jpg"

const schedule = {
  Monday: [
    { name: "BJJ - NoGi", start: 7.5, end: 8.5, },
    { name: "BJJ - NoGi", start: 12.5, end: 13.5, },
        { name: "MMA", start: 17.5, end: 18.5,  },
    { name: "Wrestling", start: 18.5, end: 19.5, },
    { name: "BJJ - NoGi", start: 19.5, end: 20.5, }
  ],
  Tuesday: [
    { name: "BJJ - Gi", start: 7.5, end: 8.5, pic:gi  },
    { name: "BJJ - Gi", start: 12.5, end: 13.5, pic:gi  },
    { name: "Kids", start: 17.5, end: 18.5, pic:kids },
    { name: "Muay Thai", start: 18.5, end: 19.5 ,pic:mt  },
    { name: "BJJ - Gi", start: 19.5, end: 20.5, pic:gi   }
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
    { name: "Women's Jiu-Jitsu", start: 19.5, end: 20.5 }
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
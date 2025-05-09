import kids from "./Images/kids.jpg"
import Wrestling from "./Images/wrestling.webp"
import openmat from "./Images/openmat.webp"
const schedule = {
    Monday: [
      { name: "BJJ NoGi", start: 7.5, end: 8.5 },
      { name: "BJJ NoGi", start: 12, end: 13 },
      { name: "MMA", start: 17.25, end: 18.25 },
      { name: "Wrestling", start: 18.25, end: 19.25 },
      { name: "BJJ NoGi", start: 19.25, end: 20.25 }
    ],
    Tuesday: [
      { name: "BJJ Gi", start: 7.5, end: 8.5 },
      { name: "BJJ Gi", start: 12, end: 13 },
      { name: "Kids", start: 17.25, end: 18.25},
      { name: "Muay Thai", start: 18.25, end: 19.25 },
      { name: "BJJ Gi", start: 19.25, end: 20.25 }
    ],
    Wednesday: [
      { name: "BJJ NoGi", start: 7.5, end: 8.5 },
      { name: "BJJ NoGi", start: 12, end: 13 },
      { name: "MMA", start: 17.25, end: 18.25 },
      { name: "Wrestling", start: 18.25, end: 19.25 },
      { name: "BJJ NoGi", start: 19.25, end: 20.25 }
    ],
    Thursday: [
      { name: "BJJ Gi", start: 7.5, end: 8.5 },
      { name: "BJJ Gi", start: 12, end: 13 },
      { name: "Kids", start: 17.25, end: 18.25},
      { name: "Muay Thai", start: 18.25, end: 19.25},
      { name: "BJJ Gi", start: 19.25, end: 20.25 }
    ],
    Friday: [
      { name: "BJJ NoGi", start: 7.5, end: 8.5 },
      { name: "BJJ NoGi", start: 12, end: 13 },
          { name: "MMA", start: 17.25, end: 18.25 },
      { name: "Wrestling", start: 18.25, end: 19.25 },
      { name: "BJJ NoGi", start: 19.25, end: 20.25 }
    ],
    Saturday: [ 
      { name: "MMA", start: 11, end: 12},
      { name: "BJJ NoGi", start: 12, end: 13},
        { name: "Kids", start: 14, end: 15},
    ]
    ,
    Sunday: [
      { name: "Kids", start: 11, end: 12, image:kids, description: "Building confidence & discipline."},
      { name: "Wrestling", start: 12, end: 13, image:Wrestling, description: "Learn takedowns & takedown defense."},
      { name: "Open Mat", start: 13, end: 14, image:openmat, description: "Practice techniques and roll."},
    ]
  }; 

  export default schedule
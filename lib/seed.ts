import type { SchoolData } from "./types";

export type SeedSchool = {
  slug: string; name: string; locality: string; address: string; kind: "preschool" | "school";
  lat: number; lng: number; min_age_months: number | null; has_daycare: boolean; fee_from: number | null;
  partner: boolean; data: SchoolData;
};

const img = (slug: string, ns: number[]) => ns.map((n) => `/schools/${slug}/${n}.jpg`);

const appleBlossomCommon = {
  established: 2010,
  curriculum: "Reggio Emilia inspired, with Montessori learning",
  network:
    "Backed by the Trinity Wisdom Education, Welfare and Cultural Society, the group behind Delhi Public School Sushant Lok.",
  programs: [
    { name: "Toddlers", age: "6 months to 2 years" },
    { name: "Pre Nursery", age: "2 to 3 years" },
    { name: "Nursery", age: "3 to 4 years" },
    { name: "Junior KG", age: "4 to 5 years" },
    { name: "Senior KG", age: "5 to 6 years" },
  ],
  daycare: {
    hours: "8:00 am to 8:00 pm, Monday to Saturday",
    ages: "8 months to 8 years",
    note: "Three daycare groups: Discovering Me (8 months to 2 years), Exploring My World (2 to 4 years) and Creative Explorers (4 to 8 years).",
  },
  hours: "8:00 am to 8:00 pm, Monday to Saturday (daycare)",
  safety: ["24x7 CCTV surveillance", "Regular sanitation", "Child-safe amenities"],
  meals: "Nutritious meals are provided at the centre.",
  awards: [
    "Ranked #1 preschool in Delhi-NCR for Health, Nutrition & Safety at the Education World Preschool Grand Jury Awards 2021-22",
  ],
  phones: ["+91 96433 08841", "+91 99106 38882"],
  email: "info@appleblossom.net.in",
  social: {
    facebook: "https://www.facebook.com/appleblossomggn/",
    instagram: "https://www.instagram.com/appleblossomggn/",
  },
  admission: {
    steps: [
      "Share your interest here or call the centre",
      "Visit the campus and meet the centre team",
      "Choose a programme and daycare plan that fits your child",
      "Complete the admission formalities with the centre",
    ],
  },
};

export const SEED_SCHOOLS: SeedSchool[] = [
  {
    slug: "apple-blossom-sector-46",
    name: "Apple Blossom Early Learning & Day Care Centre",
    locality: "Sector 46",
    address: "NS-02, Block E, Greenwood City, Sector 46, Gurugram 122003",
    kind: "preschool", lat: 28.4366, lng: 77.0563, min_age_months: 6, has_daycare: true, fee_from: null, partner: true,
    data: {
      ...appleBlossomCommon,
      tagline: "Flagship centre. Preschool and full-day daycare from 6 months.",
      about:
        "Apple Blossom is an early learning and daycare centre that opened in 2010, and Sector 46 is its flagship branch. Teaching follows the Reggio Emilia way, so children are encouraged to find and follow their own interests rather than fit one mould. The timetable mixes circle time, Montessori learning and science experiments with activities such as taekwondo, skating and Kathak, and French is introduced as a third language. More than 3,100 families have enrolled with Apple Blossom since it opened.",
      facilities: ["Sensory park", "Auditorium", "Indoor playground", "Outdoor play area", "Toy train", "Daycare", "Sports training", "Special educators"],
      activities: ["Circle time", "Brain gym", "Montessori learning", "Science experiments", "Kinder dance", "Music", "Skating", "Taekwondo", "Pottery", "Hockey", "Role play & puppet shows", "Flameless cooking", "Gardening", "Art & craft", "Kathak"],
      highlights: {
        works: [
          "Takes children from 6 months, with daycare up to 8 years",
          "Long daycare hours: 8 am to 8 pm, six days a week",
          "Award for health, nutrition and safety (Education World, 2021-22)",
          "Same group as DPS Sushant Lok",
        ],
        watch: [
          "Fees are not published online, so ask for the full fee card",
          "Daycare and preschool timings can differ by plan, confirm yours",
        ],
        ask: [
          "What is the caregiver to child ratio for my child's age group?",
          "Is the meal plan included in the fee?",
          "How does the move to Nursery at a K-12 school work after Senior KG?",
        ],
      },
      images: img("apple-blossom-sector-46", [1, 2, 3, 4, 5, 6]),
      website: "https://appleblossom.net.in/sector-46",
      sources: ["https://appleblossom.net.in/sector-46", "https://appleblossom.net.in/about-us"],
    },
  },
  {
    slug: "apple-blossom-palam-vihar",
    name: "Apple Blossom Early Learning & Day Care Centre",
    locality: "Palam Vihar",
    address: "NS-1, A Block, Near Vita Park, Palam Vihar, Gurugram 122017",
    kind: "preschool", lat: 28.5079, lng: 77.0375, min_age_months: 6, has_daycare: true, fee_from: null, partner: true,
    data: {
      ...appleBlossomCommon,
      tagline: "Preschool and full-day daycare in Palam Vihar, with a splash pool and sensory ground.",
      about:
        "This is Apple Blossom's second branch, serving families in and around Palam Vihar. Like the flagship centre, it follows the Reggio Emilia way of teaching, with circle time, Montessori learning and science experiments alongside activities such as skating, pottery, chess and gardening. The centre runs preschool classes from Toddlers to Senior KG and daycare for children up to 8 years. Apple Blossom has been operating since 2010.",
      facilities: ["Sensory park", "Sensory ground", "Auditorium", "Indoor playground", "Outdoor play area", "Toy train", "Splash pool", "Daycare", "Sports training", "Special educators"],
      activities: ["Circle time", "Brain gym", "Montessori learning", "Science experiments", "Kinder dance", "Music", "Skating", "Taekwondo", "Pottery", "Hockey", "Role play & puppet shows", "Flameless cooking", "Chess", "Horse riding", "Gardening", "Art & craft", "Gymnastics"],
      highlights: {
        works: [
          "Takes children from 6 months, with daycare up to 8 years",
          "Long daycare hours: 8 am to 8 pm, six days a week",
          "Splash pool, sensory ground and toy train on campus",
          "Same group as DPS Sushant Lok",
        ],
        watch: [
          "Fees are not published online, so ask for the full fee card",
          "Check which activities run every week and which are occasional",
        ],
        ask: [
          "What is the caregiver to child ratio for my child's age group?",
          "Is the meal plan included in the fee?",
          "Is transport available from my area?",
        ],
      },
      images: img("apple-blossom-palam-vihar", [1, 4, 2, 6, 5, 3]),
      website: "https://appleblossom.net.in/palam-vihar",
      sources: ["https://appleblossom.net.in/palam-vihar", "https://appleblossom.net.in/about-us"],
    },
  },
  {
    slug: "dps-sushant-lok",
    name: "Delhi Public School, Sushant Lok",
    locality: "Sushant Lok Phase 1",
    address: "B-Block, Sushant Lok Phase I, Sector 27 (behind Max Hospital), Gurugram 122009",
    kind: "school", lat: 28.4612, lng: 77.0737, min_age_months: null, has_daycare: false, fee_from: 14700, partner: true,
    data: {
      tagline: "CBSE school from Pre-Nursery to Class XII on a 5-acre campus.",
      about:
        "Delhi Public School Sushant Lok was established in April 2005 under the Delhi Public School Society and is affiliated with CBSE. The entry class is Pre-Nursery and the school runs through to Class XII with Science, Commerce and Humanities streams. The Pre-Primary wing covers Nursery to Class II, and early years activities include clay modelling, art and craft, dance, music and aerobics. The campus has CCTV coverage, two medical clinics and a fleet of air-conditioned buses.",
      established: 2005,
      curriculum: "CBSE",
      grades: "Pre-Nursery to Class XII",
      programs: [
        { name: "Pre-Nursery", note: "Entry-level class. Admission is based on age criteria and an interaction with parents." },
        { name: "Nursery" },
        { name: "Prep" },
        { name: "Class I to XII", note: "Science, Commerce and Humanities in Classes XI and XII" },
      ],
      facilities: ["5-acre campus", "Smart classes", "Laboratories", "Activity rooms", "Two medical clinics with nurses on duty", "School canteen", "Counsellors", "Sports facilities", "Rainwater harvesting"],
      activities: ["Clay modelling", "Art & craft", "Dance", "Music", "Aerobics"],
      safety: ["CCTV coverage across the school", "Trained guards and monitored visitor entry", "Three nurses on duty during school hours", "Patient transport vehicle on campus"],
      meals: "Optional mid-day meal for Pre-Nursery to Class I. The canteen serves light snacks at recess.",
      transport: "57 air-conditioned buses with app-based GPS tracking. A separate junior route covers Nursery to Class I.",
      fees: {
        items: [
          { label: "Prospectus & application form", amount: "₹100 (one time)" },
          { label: "Registration fee", amount: "₹1,000 (one time)" },
          { label: "Admission fee (non-refundable)", amount: "₹1,00,000 (one time)" },
          { label: "Caution deposit (refundable)", amount: "₹70,000 (one time)" },
          { label: "Pre-Nursery composite fee", amount: "₹14,700 / month" },
          { label: "Nursery composite fee", amount: "₹17,955 / month" },
          { label: "Prep composite fee", amount: "₹18,120 / month" },
          { label: "Activity charges (Pre-Nursery to Prep)", amount: "₹1,055 / month" },
          { label: "Mid-day meal, optional (Pre-Nursery to Class I)", amount: "₹1,900 / month for 11 months" },
        ],
        note: "From the school's published fee structure for session 2026-27. Transport is charged separately.",
        source: "https://resources.edunexttechnologies.com/web-data/dpssl/pdf/Fee-Structure-2026-27.pdf",
      },
      admission: {
        status: "Admissions open for Pre-Nursery and Nursery for session 2027-28",
        steps: [
          "Register online or collect the form from the School Admission Office (registration usually opens in August)",
          "The school emails the next steps after registration",
          "Interaction with parents",
          "Admission is granted based on age criteria and seat availability",
        ],
        documents: ["Attested copy of the child's birth certificate (Municipal Corporation)", "Photocopy of the child's Aadhaar card", "Photocopy of both parents' Aadhaar cards"],
      },
      highlights: {
        works: [
          "One school from Pre-Nursery to Class XII, so no second admission later",
          "Fee structure is published openly by the school",
          "CCTV, guards, two clinics and nurses on campus",
          "Large AC bus fleet with GPS tracking",
        ],
        watch: [
          "One-time costs are high: ₹1 lakh admission fee plus ₹70,000 refundable deposit",
          "No daycare is listed, so plan after-school care separately",
          "Seats in early years are limited and registration opens around August",
        ],
        ask: [
          "What is the exact age cut-off for Pre-Nursery this session?",
          "What are the school timings for Pre-Nursery?",
          "Does the bus route cover my address, and what does it cost?",
        ],
      },
      images: img("dps-sushant-lok", [2, 1, 3, 4]),
      phones: ["+91 96433 08832", "+91 96433 08834", "+91 70428 11433", "0124-4041221"],
      email: "admission@dpssl.net",
      website: "https://dpssl.net/",
      social: {
        facebook: "https://www.facebook.com/Delhi-Public-School-Sushant-Lok-105210084463013",
        instagram: "https://www.instagram.com/Dpssushantlok/",
        youtube: "https://www.youtube.com/channel/UCuPFU0-tOp_jTOhdzC24gPA",
        linkedin: "https://www.linkedin.com/school/delhi-public-school-sushant-lok/",
      },
      sources: ["https://dpssl.net/", "https://dpssl.net/pre-nursery", "https://dpssl.net/infrastructure.php", "https://dpssl.net/faq.php"],
    },
  },
  {
    slug: "vedanya-international-school",
    name: "Vedanya International School",
    locality: "Sector 48",
    address: "Central Park Resorts, Sector 48, Gurugram, Haryana 122018",
    kind: "school", lat: 28.4147, lng: 77.0405, min_age_months: 24, has_daycare: false, fee_from: null, partner: true,
    data: {
      tagline: "CBSE school with an Early Years programme from age 2.",
      about:
        "Vedanya International School's Sector 48 campus offers Early Years to Grade V on the CBSE curriculum, following the NEP 2020 structure with a focus on experiential learning. The Early Years programme welcomes children aged two to three and is built around play, with four themed units each month taught across cognitive, art, music, reading and role-play spaces. The school describes a trilingual approach and a Head, Heart and Hands model of development. Vedanya also runs a second campus, The Vedanya School, at Flower Valley in Sohna.",
      curriculum: "CBSE, following the NEP 2020 structure",
      grades: "Early Years to Grade V",
      programs: [
        { name: "Early Years", age: "2 to 3 years", note: "Play-based programme with a gentle home-to-school transition" },
        { name: "Pre-Primary", note: "Nursery and Kindergarten" },
        { name: "Primary", note: "Grades I to V" },
      ],
      facilities: ["Music and movement room", "Multi-sensory resource library", "Creators' Lab", "Indoor play pen", "Outdoor playground", "Pretend play circles"],
      activities: ["Born to Move", "Capoeira", "Dance and theatre", "Storytelling", "Art and craft", "Role play"],
      admission: {
        status: "Admissions open for Playgroup to Grade VIII across Vedanya campuses",
        steps: ["Submit an enquiry with your child's details", "Take a personalised campus tour", "Age-appropriate interaction and observation", "Complete enrolment"],
      },
      highlights: {
        works: [
          "Takes children from age 2 and continues to Grade V on the same campus",
          "Dedicated early years spaces: indoor play pen, pretend play circles, Creators' Lab",
          "Indoor play area for days when outdoor play is not possible",
        ],
        watch: [
          "Fees are not published online, so ask for the full fee schedule",
          "The daycare programme on the website is described for the Flower Valley (Sohna) campus. Confirm what is offered at Sector 48",
          "This campus currently goes up to Grade V",
        ],
        ask: [
          "Is daycare or extended care available at the Sector 48 campus?",
          "What happens after Grade V?",
          "What is the class size in Early Years?",
        ],
      },
      images: img("vedanya-international-school", [1, 4, 2]),
      phones: ["+91 74286 97080"],
      email: "admissions@vedanya.edu.in",
      website: "https://vedanya.edu.in/vedanya-international-sector-48/",
      social: {
        facebook: "https://www.facebook.com/VedanyaInternational/",
        instagram: "https://www.instagram.com/vedanyaedu/",
        youtube: "https://www.youtube.com/channel/UCNgAAdE4hwMr2dLdYDOCamg",
        linkedin: "https://www.linkedin.com/company/vedanya/",
      },
      sources: ["https://vedanya.edu.in/vedanya-international-sector-48/", "https://vedanya.edu.in/early-years/", "https://vedanya.edu.in/admissions/"],
    },
  },
  {
    slug: "footprints-dlf-phase-4",
    name: "Footprints Preschool & Daycare",
    locality: "DLF Phase 4",
    address: "Site 4109, DLF-4, Sector 28, Near DCP Traffic Office, Gurugram 122002",
    kind: "preschool", lat: 28.4672, lng: 77.0853, min_age_months: 12, has_daycare: true, fee_from: null, partner: false,
    data: {
      tagline: "HighScope curriculum with live CCTV access for parents.",
      about:
        "Footprints is a preschool and daycare chain, and this centre serves DLF Phase 4 and nearby sectors. It follows the HighScope curriculum, which is built around active, hands-on learning. The centre gives parents secure live CCTV access during school and daycare hours, serves meals on site and offers a 30-day trial.",
      curriculum: "HighScope",
      programs: [
        { name: "Toddlers", age: "12 to 24 months" },
        { name: "Play Group" },
        { name: "Pre-Nursery", age: "36 to 48 months" },
        { name: "LKG" },
        { name: "UKG" },
        { name: "After School" },
      ],
      daycare: { note: "Flexible daycare timings and extended care options for working parents." },
      facilities: ["Live CCTV access for parents", "Daycare", "Meals on site", "Child-safe infrastructure"],
      safety: ["Secure entry and exit system", "CCTV surveillance", "Daily cleaning and sanitisation", "Trained staff"],
      meals: "Well-balanced, nutritious meals are provided.",
      highlights: {
        works: ["Parents can watch live CCTV during the day", "30-day trial before you commit", "Daycare with flexible timings"],
        watch: ["Fees are shared on request through a fee card", "Confirm the centre's exact opening hours"],
        ask: ["What does the 30-day trial cover?", "What is the adult to child ratio for my child's group?", "Which meals are included?"],
      },
      images: [],
      phones: [],
      website: "https://www.footprintseducation.in/pre-school-daycare-dlf-phase4-gurgaon",
      sources: ["https://www.footprintseducation.in/pre-school-daycare-dlf-phase4-gurgaon"],
    },
  },
  {
    slug: "klay-malibu-town",
    name: "KLAY Preschool & Daycare",
    locality: "Malibu Town, Sector 47",
    address: "B-Block, Malibu Town, Sector 47, Gurugram, Haryana 122018",
    kind: "preschool", lat: 28.4243, lng: 77.0484, min_age_months: 6, has_daycare: true, fee_from: null, partner: false,
    data: {
      tagline: "Play-based preschool and daycare from 6 months, with after-school care.",
      about:
        "KLAY's Malibu Town centre offers preschool and daycare for children from six months to six years, plus after-school care for older children. The curriculum is play-based, and programmes are grouped by age from infant care to kindergarten. Parents can choose full-day or half-day daycare, and the centre offers live CCTV access and meals.",
      curriculum: "Play-based",
      programs: [
        { name: "Infant care", age: "6 to 18 months" },
        { name: "Toddlers", age: "1.5 to 2.5 years" },
        { name: "Preschool", age: "2.5 to 4 years" },
        { name: "Kindergarten", age: "4 to 6 years" },
        { name: "After-school care", note: "For older children" },
      ],
      daycare: { hours: "8:30 am to 7:30 pm on weekdays", note: "Full-day and half-day options." },
      hours: "8:30 am to 7:30 pm, Monday to Friday",
      facilities: ["Live CCTV access", "Daycare", "Nutritious meals", "Spacious classrooms"],
      highlights: {
        works: ["Takes infants from 6 months", "Full-day or half-day daycare", "After-school care for older siblings"],
        watch: ["Fees vary by programme and hours and are not published", "Weekend hours are limited, confirm before planning"],
        ask: ["What is the fee for my child's programme and hours?", "How do you settle a new child in the first weeks?", "Which meals are provided?"],
      },
      images: [],
      phones: [],
      website: "https://klay.co.in/?p=43190",
      sources: ["https://klay.co.in/?p=43190"],
    },
  },
  {
    slug: "ipsaa-sector-51",
    name: "Ipsaa Day Care & Preschool",
    locality: "Sector 51",
    address: "Plot No. 21A, Opposite Nirvana Country, Block J, Mayfield Garden, Sector 51, Gurugram 122018",
    kind: "preschool", lat: 28.4288, lng: 77.0638, min_age_months: 4, has_daycare: true, fee_from: null, partner: false,
    data: {
      tagline: "Daycare from 4 months, open 8 am to 8 pm, six days a week.",
      about:
        "Ipsaa runs company-owned daycare and preschool centres, with none franchised. Infant care is for children from 4 months to 2 years and the preschool programme covers ages 2 to 6. Days are built around stories, music, movement and play, with creative sessions such as baking, puppetry and robotics. Meals are vegetarian and cooked in the centre's own kitchen.",
      programs: [
        { name: "Infant & toddler care", age: "4 months to 2 years" },
        { name: "Preschool", age: "2 to 6 years" },
      ],
      daycare: { hours: "8 am to 8 pm, six days a week" },
      hours: "8 am to 8 pm, six days a week",
      facilities: ["Daycare", "In-house kitchen", "Art and yoga", "Storytelling"],
      meals: "Fresh vegetarian meals from an in-house kitchen.",
      ratio: "1 caregiver for every 3 children aged 6 months to 1 year",
      highlights: {
        works: ["Takes babies from 4 months", "Open 8 am to 8 pm, six days a week", "Company-run centre, not a franchise", "Published caregiver ratio for infants"],
        watch: ["Fees are not published", "Unwell children are asked to stay home, so keep a backup plan"],
        ask: ["What is the caregiver ratio for my child's age?", "What is the monthly fee for full-day care?", "How are naps and feeds handled for infants?"],
      },
      images: [],
      phones: ["1800-1212-467"],
      email: "admissions@ipsaa.in",
      website: "https://www.ipsaa.in/",
      sources: ["https://www.ipsaa.in/"],
    },
  },
  {
    slug: "pumpkin-house-sushant-lok",
    name: "Pumpkin House Play School",
    locality: "Sushant Lok Phase 1",
    address: "A Block, Sushant Lok Phase 1 (opposite Traffic Tower), Gurugram",
    kind: "preschool", lat: 28.4625, lng: 77.0789, min_age_months: 18, has_daycare: false, fee_from: null, partner: false,
    data: {
      tagline: "Play school and activity home for children from around 18 months.",
      about:
        "Pumpkin House is a play school and activity home in Sushant Lok. The school's view is that around eighteen to twenty months a child is ready for a wider space to explore and play with other children, and its programme is designed around that step. It is accepting applications for the 2026-27 session.",
      programs: [{ name: "Play school", age: "From around 18 months" }],
      facilities: [],
      admission: { status: "Accepting applications for session 2026-27", note: "For registration, the school lists Alka Gujral as the contact." },
      highlights: {
        works: ["Small, focused play school", "Starts from around 18 months"],
        watch: ["Fees and timings are not published", "Daycare is not listed, confirm if you need it"],
        ask: ["What are the daily timings?", "What is the class size and teacher ratio?", "Is there a settling-in period for new children?"],
      },
      images: [],
      phones: ["+91 98102 20014"],
      website: "https://www.pumpkinhouseplayschool.com/",
      sources: ["https://www.pumpkinhouseplayschool.com/"],
    },
  },
  {
    slug: "the-shri-ram-early-years-sector-48",
    name: "The Shri Ram Early Years",
    locality: "Sector 48",
    address: "Behind Vipul Greens, Sohna Road, Sector 48, Gurugram 122018",
    kind: "preschool", lat: 28.4129, lng: 77.0368, min_age_months: null, has_daycare: false, fee_from: null, partner: false,
    data: {
      tagline: "Preschool from the Shri Educare family, starting at playgroup.",
      about:
        "The Shri Ram Early Years (TSEY) is a preschool in Sector 48. Its playgroup class is called Nanhe Kadam. Admission to the preschool does not guarantee admission to The Shri Ram Schools.",
      programs: [{ name: "Nanhe Kadam", note: "Playgroup" }, { name: "Pre-Nursery" }],
      facilities: [],
      highlights: {
        works: ["Associated with the Shri Ram name through Shri Educare"],
        watch: ["A seat here does not guarantee a seat at The Shri Ram Schools", "Fees and timings are not published"],
        ask: ["Which classes do you run this year, and what are the timings?", "What is the fee for playgroup?", "Where do most children go after finishing here?"],
      },
      images: [],
      phones: [],
      email: "admission.tsey@shrieducare.com",
      sources: ["https://www.schoolmykids.com/school/the-shri-ram-early-years-sector-48-gurugram-gurgaon-haryana-india-s1004812"],
    },
  },
  {
    slug: "kids-kingdom-sector-49",
    name: "Kids Kingdom Preschool & Daycare",
    locality: "Sector 49",
    address: "Bestech Park View 2, Sohna Road, Vatika City, Block W, Sector 49, Gurugram",
    kind: "preschool", lat: 28.4085, lng: 77.0452, min_age_months: null, has_daycare: true, fee_from: null, partner: false,
    data: {
      tagline: "Preschool and daycare on Sohna Road.",
      about: "Kids Kingdom is a preschool and daycare in Sector 49, off Sohna Road. Bus transport is available.",
      programs: [{ name: "Preschool" }, { name: "Daycare" }],
      daycare: {},
      facilities: ["Daycare", "Bus transport"],
      transport: "Bus facility is available.",
      highlights: {
        works: ["Preschool and daycare in one place", "Bus transport available"],
        watch: ["Fees, timings and age groups are not published"],
        ask: ["What ages do you take, and what are the daycare hours?", "What is the monthly fee?", "Which areas does the bus cover?"],
      },
      images: [],
      phones: [],
      sources: ["https://www.schoolsuniverse.com/school/kids-kingdom-preschool-daycare-gurugram"],
    },
  },
];

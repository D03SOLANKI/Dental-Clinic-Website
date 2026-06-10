export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  long_description: string;
  icon_name: string;
  price_range: string;
  duration_minutes: number;
  is_featured: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  bio: string;
  photo_url: string;
  qualifications: string[];
  languages: string[];
  available_days: string[];
}

export interface Testimonial {
  id: string;
  patient_name: string;
  rating: number;
  review: string;
  service_name: string;
  doctor_name: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const services: Service[] = [
  {
    id: "s1",
    name: "General Dentistry",
    slug: "general-dentistry",
    category: "Preventative",
    short_description: "Comprehensive oral checkups, scaling, cleaning, and fluoride treatments.",
    long_description: "Keep your teeth healthy and clean with our comprehensive checkups, professional cleanings, and preventative treatments customized for your family.",
    icon_name: "Activity",
    price_range: "₹1,000 - ₹3,000",
    duration_minutes: 30,
    is_featured: true,
  },
  {
    id: "s2",
    name: "Orthodontics",
    slug: "orthodontics",
    category: "Alignment",
    short_description: "Metal and ceramic braces to align teeth and restore bite harmony.",
    long_description: "Traditional and custom ceramic alignment options for children and adults to correct misalignments and build beautiful structures.",
    icon_name: "Grid",
    price_range: "₹25,000 - ₹75,000",
    duration_minutes: 45,
    is_featured: true,
  },
  {
    id: "s3",
    name: "Dental Implants",
    slug: "dental-implants",
    category: "Restoration",
    short_description: "Permanent, surgical-grade implants for replacing missing teeth.",
    long_description: "Restore your bite and face structure with state-of-the-art titanium implants that feel, look, and perform like natural teeth.",
    icon_name: "Shield",
    price_range: "₹20,000 - ₹50,000",
    duration_minutes: 60,
    is_featured: true,
  },
  {
    id: "s4",
    name: "Teeth Whitening",
    slug: "teeth-whitening",
    category: "Cosmetic",
    short_description: "Advanced laser teeth whitening that brightens smiles in under an hour.",
    long_description: "Get a bright, dazzling smile with our safe in-office laser whitening treatments, returning teeth up to 8 shades lighter.",
    icon_name: "Sparkles",
    price_range: "₹5,000 - ₹12,000",
    duration_minutes: 45,
    is_featured: true,
  },
  {
    id: "s5",
    name: "Root Canal Treatment",
    slug: "root-canal-treatment",
    category: "Therapy",
    short_description: "Pain-free root canals to save infected teeth and remove decay.",
    long_description: "Experience fully painless root canals conducted under high-resolution magnification, resolving deep decay while preserving your natural tooth.",
    icon_name: "HeartPulse",
    price_range: "₹4,000 - ₹8,000",
    duration_minutes: 60,
    is_featured: true,
  },
  {
    id: "s6",
    name: "Pediatric Dentistry",
    slug: "pediatric-dentistry",
    category: "Preventative",
    short_description: "Specialized, gentle dental care designed for children and infants.",
    long_description: "A warm, child-friendly environment led by specialists to give your children a positive introduction to dental care.",
    icon_name: "Smile",
    price_range: "₹1,200 - ₹4,000",
    duration_minutes: 30,
    is_featured: true,
  },
  {
    id: "s7",
    name: "Cosmetic Dentistry",
    slug: "cosmetic-dentistry",
    category: "Cosmetic",
    short_description: "Veneers, crowns, and composite bonding for a beautiful smile.",
    long_description: "Enhance your appearance with minor or major cosmetic refinements, customized exactly to your desired facial structure.",
    icon_name: "Crown",
    price_range: "₹8,000 - ₹30,000",
    duration_minutes: 60,
    is_featured: false,
  },
  {
    id: "s8",
    name: "Emergency Dental Care",
    slug: "emergency-dental-care",
    category: "Emergency",
    short_description: "Immediate treatment for toothaches, damage, and oral trauma.",
    long_description: "Get immediate attention for critical situations like tooth trauma, severe bleeding, fractures, or intense pain. Same-day bookings guaranteed.",
    icon_name: "Flame",
    price_range: "Varies",
    duration_minutes: 45,
    is_featured: false,
  },
  {
    id: "s9",
    name: "Smile Makeover",
    slug: "smile-makeover",
    category: "Cosmetic",
    short_description: "Complete facial and dental makeover combining custom veneers.",
    long_description: "Transform your confidence with a unified, state-of-the-art smile layout combining teeth alignments, veneers, and contours.",
    icon_name: "Sparkles",
    price_range: "₹80,000 - ₹2,500,000",
    duration_minutes: 90,
    is_featured: false,
  },
  {
    id: "s10",
    name: "Invisible Aligners",
    slug: "invisible-aligners",
    category: "Alignment",
    short_description: "Clear, custom, and removable dental trays for invisible alignment.",
    long_description: "Modern, comfortable orthodontic alignments using transparent plastic trays that are completely removable for easy maintenance.",
    icon_name: "Layers",
    price_range: "₹60,000 - ₹150,000",
    duration_minutes: 45,
    is_featured: false,
  },
];

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Aarav Mehta",
    slug: "dr-aarav-mehta",
    specialty: "Cosmetic Dentist",
    bio: "Dr. Aarav Mehta specializes in advanced smile makeovers, porcelain veneers, and modern dental ceramics. He has 12+ years of experience restoring visual aesthetics.",
    photo_url: "/images/doctors/aarav-mehta.jpg",
    qualifications: ["BDS", "MDS in Prosthodontics & Cosmetic Dentistry"],
    languages: ["English", "Hindi", "Gujarati"],
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  {
    id: "d2",
    name: "Dr. Riya Shah",
    slug: "dr-riya-shah",
    specialty: "Orthodontist",
    bio: "Dr. Riya Shah specializes in invisible aligners, metal-free orthodontic braces, and jaw-growth therapies. She designs dental alignments for both children and adults.",
    photo_url: "/images/doctors/riya-shah.jpg",
    qualifications: ["BDS", "MDS in Orthodontics"],
    languages: ["English", "Hindi", "Gujarati"],
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    id: "d3",
    name: "Dr. Kunal Patel",
    slug: "dr-kunal-patel",
    specialty: "Implant Specialist",
    bio: "Dr. Kunal Patel is a leading oral surgeon specializing in single-tooth and full-mouth dental implants. He has placed over 3,000 successful titanium implants.",
    photo_url: "/images/doctors/kunal-patel.jpg",
    qualifications: ["BDS", "MDS in Oral & Maxillofacial Surgery", "Diplomate ICOI (USA)"],
    languages: ["English", "Hindi"],
    available_days: ["Monday", "Wednesday", "Friday", "Saturday"],
  },
  {
    id: "d4",
    name: "Dr. Neha Desai",
    slug: "dr-neha-desai",
    specialty: "Pediatric Dentist",
    bio: "Dr. Neha Desai offers warm, friendly, and gentle children's dentistry. She specializes in preventive care, milk tooth restorations, and nitrous oxide conscious sedation.",
    photo_url: "/images/doctors/neha-desai.jpg",
    qualifications: ["BDS", "MDS in Pediatric & Preventive Dentistry"],
    languages: ["English", "Hindi", "Gujarati"],
    available_days: ["Tuesday", "Thursday", "Saturday"],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    patient_name: "Priya Sharma",
    rating: 5,
    review: "Amazing experience! The doctors were extremely professional, detailed, and friendly. The teeth whitening treatment yielded immediate results.",
    service_name: "Teeth Whitening",
    doctor_name: "Dr. Aarav Mehta",
  },
  {
    id: "t2",
    patient_name: "Rahul Verma",
    rating: 5,
    review: "Best dental clinic in Ahmedabad. Dr. Kunal explained the full implant procedure and made me feel completely comfortable during the implant surgery.",
    service_name: "Dental Implants",
    doctor_name: "Dr. Kunal Patel",
  },
  {
    id: "t3",
    patient_name: "Sneha Patel",
    rating: 5,
    review: "Very clean clinic with state-of-the-art digital technology. My daughter felt completely safe and happy during her cavity cleaning session.",
    service_name: "Pediatric Dentistry",
    doctor_name: "Dr. Neha Desai",
  },
];

export const faqs: FAQItem[] = [
  {
    id: "f1",
    question: "How often should I visit the dentist?",
    answer: "We recommend visiting Aura Dental Care every six months for a routine cleaning and comprehensive checkup to prevent oral health issues.",
    category: "General",
  },
  {
    id: "f2",
    question: "Do you offer pain-free dental treatments?",
    answer: "Yes, we specialize in pain-free dentistry using advanced local anesthetics and micro-treatment techniques to ensure your complete comfort.",
    category: "Comfort",
  },
  {
    id: "f3",
    question: "What is a smile makeover, and how long does it take?",
    answer: "A smile makeover combines treatments like veneers, whitening, and alignment to enhance your smile. The duration varies from 2 visits to a few weeks.",
    category: "Cosmetic",
  },
  {
    id: "f4",
    question: "How do invisible aligners work compared to braces?",
    answer: "Invisible aligners are clear, removable custom trays that gently shift your teeth. They are nearly invisible and easier to clean than traditional braces.",
    category: "Orthodontics",
  },
  {
    id: "f5",
    question: "Are dental implants safe and permanent?",
    answer: "Yes, dental implants are the safest, most durable, and permanent solution for replacing missing teeth, lasting a lifetime with proper care.",
    category: "Restoration",
  },
  {
    id: "f6",
    question: "What should I do in case of a dental emergency?",
    answer: "Call our emergency line (+91 99999 88888) immediately. We offer same-day emergency appointments for urgent care.",
    category: "Emergency",
  },
  {
    id: "f7",
    question: "Do you provide child-friendly dental care?",
    answer: "Absolutely. Our pediatric specialists, led by Dr. Neha Desai, create a fun, stress-free, and gentle environment for children.",
    category: "Pediatric",
  },
  {
    id: "f8",
    question: "What is the cost of teeth whitening at Aura Dental Care?",
    answer: "Teeth whitening costs vary based on in-office vs. take-home treatments. Contact us for a personalized pricing details.",
    category: "Cosmetic",
  },
  {
    id: "f9",
    question: "How do I know if I need a root canal treatment?",
    answer: "Symptoms include severe toothache, prolonged sensitivity to hot or cold, and gum swelling. A digital X-ray will confirm if a root canal is needed.",
    category: "General",
  },
  {
    id: "f10",
    question: "Do you accept cashless insurance?",
    answer: "Yes, we offer cashless insurance support with major providers. Our admin desk will assist you with the pre-authorization process.",
    category: "Billing",
  },
];

export const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

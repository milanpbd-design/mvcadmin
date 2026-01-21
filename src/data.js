const defaultData = {
  site: {
    name: "My Vet Corner",
    tagline: "Expert Pet & Poultry Health Resources",
    description:
      "Your trusted source for expert veterinary information on pets and poultry.",
  },
  adminPassword: "Master@47",
  slides: [
    {
      tag: "Featured Article",
      title: "The Ultimate Guide to Chicken Coop Hygiene",
      excerpt:
        "Learn essential biosecurity practices and cleaning protocols to keep your flock healthy and productive year-round.",
      image:
        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=500&fit=crop",
      readTime: "5 min read",
    },
    {
      tag: "Latest Research",
      title: "Latest Research on Canine Parvovirus Prevention",
      excerpt:
        "New studies reveal breakthrough vaccination protocols that could significantly reduce parvovirus cases in puppies.",
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=500&fit=crop",
      readTime: "7 min read",
    },
    {
      tag: "Pet Nutrition",
      title: "Understanding Your Cat's Nutritional Needs",
      excerpt:
        "Expert veterinarians share insights on optimal feline nutrition for every life stage.",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=500&fit=crop",
      readTime: "6 min read",
    },
  ],
  stats: [
    { value: "500+", label: "Vet-Reviewed Articles", icon: "shield" },
    { value: "Latest", label: "Poultry Research", icon: "book" },
    { value: "50,000+", label: "Trusted Owners", icon: "users" },
    { value: "Expert", label: "Medical Board", icon: "lab" },
  ],
  articles: [
    {
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
      category: "Dog Health",
      categoryColor: "blue",
      title: "Latest Research on Canine Parvovirus Prevention",
      excerpt:
        "New studies reveal breakthrough vaccination protocols that could significantly reduce parvovirus cases in puppies.",
      date: "Dec 15, 2024",
      readTime: "7 min read",
      published: true,
    },
    {
      image:
        "https://images.unsplash.com/photo-1569396116180-210c182bedb8?w=600&h=400&fit=crop",
      category: "Poultry Nutrition",
      categoryColor: "green",
      title: "Optimal Layer Feed Formulations for Maximum Egg Production",
      excerpt:
        "Expert nutritionists share their recommended calcium and protein ratios for healthy laying hens.",
      date: "Dec 14, 2024",
      readTime: "5 min read",
      published: true,
    },
    {
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop",
      category: "Cat Care",
      categoryColor: "purple",
      title: "Understanding Feline Kidney Disease: Early Detection Signs",
      excerpt:
        "Recognize the subtle symptoms of CKD in cats and learn preventive care strategies from veterinary experts.",
      date: "Dec 13, 2024",
      readTime: "6 min read",
      published: true,
    },
  ],
  experts: [
    {
      name: "Dr. Sarah Mitchell",
      title: "DVM, DACVIM",
      specialty: "Small Animal Internal Medicine",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    },
    {
      name: "Dr. James Chen",
      title: "PhD, Poultry Science",
      specialty: "Avian Health & Nutrition",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    },
    {
      name: "Dr. Emily Rodriguez",
      title: "DVM, MS",
      specialty: "Veterinary Nutrition",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face",
    },
  ],
  categories: [
    { name: "Dogs", count: "", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80" },
    { name: "Cats", count: "", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80" },
    { name: "Small Mammals", count: "", image: "https://images.unsplash.com/photo-1585110396063-7a9a0427d2c0?auto=format&fit=crop&w=800&q=80" },
    { name: "Chickens", count: "", image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80" },
    { name: "Ducks", count: "", image: "https://images.unsplash.com/photo-1555852095-64e7428df0fa?auto=format&fit=crop&w=800&q=80" },
    { name: "Turkeys", count: "", image: "https://images.unsplash.com/photo-1560709409-d7790b53d4c5?auto=format&fit=crop&w=800&q=80" },
    { name: "Disease Management", count: "", image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80" },
    { name: "Pet Nutrition", count: "", image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=800&q=80" },
    { name: "Poultry Nutrition", count: "", image: "https://images.unsplash.com/photo-1563514227147-6d22fc0293ec?auto=format&fit=crop&w=800&q=80" },
    { name: "Research & Journals", count: "", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80" },
    { name: "Vet Finder", count: "", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80" },
    { name: "Drug Index", count: "", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80" },
  ],
  research: [
    {
      type: "Peer Reviewed",
      typeColor: "blue",
      year: "2024",
      title:
        "Efficacy of Novel Vaccination Protocols in Preventing Marek's Disease in Commercial Layer Flocks",
      authors: "Chen, J., Thompson, M., et al.",
      journal: "Journal of Avian Medicine and Surgery, Vol. 38(2)",
      abstract:
        "This study evaluates protocols against Marek's disease in commercial layer operations...",
    },
    {
      type: "Clinical Study",
      typeColor: "green",
      year: "2024",
      title:
        "Gut Microbiome Diversity and Its Impact on Canine Digestive Health",
      authors: "Mitchell, S., Rodriguez, E., et al.",
      journal: "Veterinary Internal Medicine Journal, Vol. 42(4)",
      abstract:
        "This longitudinal study examines microbiome composition and digestive health outcomes...",
    },
  ],
  newsletter: {
    title: "Stay Updated",
    subtitle:
      "Get the latest vet-reviewed pet and poultry health articles delivered to your inbox weekly.",
    buttonText: "Subscribe Now",
    footerText:
      "Join 50,000+ pet and poultry owners. Unsubscribe anytime.",
  },
  footer: {
    description:
      "Your trusted source for expert veterinary information on pets and poultry.",
    socialLinks: [
      { platform: 'Twitter', url: '#' },
      { platform: 'Facebook', url: '#' },
      { platform: 'Instagram', url: '#' },
    ],
    quickLinks: [
      "Pet Health",
      "Poultry Health",
      "Nutrition Guides",
      "Research & Journals",
      "Vet Finder",
    ],
    companyLinks: [
      "About Us",
      "Editorial Policy",
      "Medical Review Board",
      "Contact Us",
      "Careers",
    ],
    legalLinks: [
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
      "Disclaimer",
    ],
    copyright: "© 2024 My Vet Corner. All rights reserved.",
    disclaimerText:
      "Content is for informational purposes only and does not replace professional veterinary advice.",
  },
  navigation: [
    { label: "Pet Health", dropdown: ["Dogs", "Cats", "Small Mammals"] },
    {
      label: "Poultry Health",
      dropdown: ["Chickens", "Ducks", "Turkeys", "Disease Management"],
    },
    { label: "Nutrition", dropdown: ["Pet Nutrition", "Poultry Nutrition"] },
    { label: "Research & Journals", dropdown: [] },
    { label: "Resources", dropdown: ["Vet Finder", "Drug Index"] },
  ],
  tags: ["health", "nutrition", "research"],
  media: [],
  comments: [
    { author: "Guest", text: "Great article!", at: "2024-12-01", status: "pending" },
  ],
  users: [
    { name: "Admin", email: "admin@example.com", role: "admin", twoFA: false },
  ],
  versions: [],
  settings: { injectScript: "" },
  homeLayout: ["hero", "stats", "articles", "experts", "categories", "research", "newsletter", "footer"],
  theme: { primary: "#1e40af", secondary: "#374151", radius: 12 },
  integrations: { gaId: "", fbPixel: "" },
  locales: ["en"],
  defaultLocale: "en",
  translations: {},
  security: { twoFARequired: false },
  performance: { lazyImages: true, prefetchRoutes: false },
  logs: [],
};

export default defaultData;

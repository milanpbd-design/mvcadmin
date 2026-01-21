export function labelToPath(name) {
  const routes = {
    Dogs: "/dogs",
    Cats: "/cats",
    "Small Mammals": "/small-mammals",
    Chickens: "/chickens",
    Ducks: "/ducks",
    Turkeys: "/turkeys",
    "Disease Management": "/disease-management",
    "Pet Nutrition": "/pet-nutrition",
    "Poultry Nutrition": "/poultry-nutrition",
    "Research & Journals": "/research-journals",
    "Pet Health": "/pet-health",
    "Poultry Health": "/poultry-health",
    Nutrition: "/nutrition",
    Resources: "/resources",
    "Vet Finder": "/vet-finder",
    "Drug Index": "/drug-index",
    "Dog Health": "/dogs",
    "Cat Care": "/cats",
    "Backyard Poultry": "/backyard-poultry",
    "Research Archive": "/research-journals",
    "Editorial Policy": "/editorial-policy",
    "Medical Review Board": "/medical-review-board",
    Careers: "/careers",
  };
  const p = routes[name];
  if (p) return p;
  return (
    "/" +
    name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );
}

export function footerLinkToPath(name) {
  const routes = {
    "Pet Health": "/pet-health",
    "Poultry Health": "/poultry-health",
    "Nutrition Guides": "/nutrition-guides",
    "Research & Journals": "/research-journals",
    "Vet Finder": "/vet-finder",
    "Drug Index": "/drug-index",
    "About Us": "/about-us",
    "Editorial Policy": "/editorial-policy",
    "Medical Review Board": "/medical-review-board",
    "Contact Us": "/contact-us",
    Careers: "/careers",
    "Privacy Policy": "/privacy-policy",
    "Terms of Service": "/terms-of-service",
    "Cookie Policy": "/cookie-policy",
    Disclaimer: "/disclaimer",
  };
  return routes[name] || "/";
}

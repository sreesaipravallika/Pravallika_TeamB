/**
 * ============================================
 * SERVICE PROVIDERS DATA
 * ============================================
 * 
 * Predefined array of service providers
 * with all necessary information
 */

const serviceProviders = [
    // Plumbers
    {
        id: 1,
        providerName: "QuickFix Plumbing",
        serviceName: "Plumber",
        category: "Home Services",
        location: "Mumbai, Maharashtra",
        price: "₹299",
        priceUnit: "/hr",
        rating: 4.8,
        reviews: 234
    },
    {
        id: 2,
        providerName: "FlowMaster Services",
        serviceName: "Plumber",
        category: "Home Services",
        location: "Delhi, Delhi",
        price: "₹349",
        priceUnit: "/hr",
        rating: 4.9,
        reviews: 189
    },
    {
        id: 3,
        providerName: "PipePro Solutions",
        serviceName: "Plumbing Services",
        category: "Home Services",
        location: "Bangalore, Karnataka",
        price: "₹279",
        priceUnit: "/hr",
        rating: 4.7,
        reviews: 156
    },

    // Electricians
    {
        id: 4,
        providerName: "PowerUp Electricals",
        serviceName: "Electrician",
        category: "Home Services",
        location: "Mumbai, Maharashtra",
        price: "₹399",
        priceUnit: "/hr",
        rating: 4.9,
        reviews: 312
    },
    {
        id: 5,
        providerName: "Spark Solutions",
        serviceName: "Electrician",
        category: "Home Services",
        location: "Pune, Maharashtra",
        price: "₹329",
        priceUnit: "/hr",
        rating: 4.8,
        reviews: 267
    },
    {
        id: 6,
        providerName: "Volt Masters",
        serviceName: "Electrical Services",
        category: "Home Services",
        location: "Hyderabad, Telangana",
        price: "₹359",
        priceUnit: "/hr",
        rating: 4.7,
        reviews: 198
    },

    // Tutors
    {
        id: 7,
        providerName: "EduExcel Tutoring",
        serviceName: "Tutor",
        category: "Education",
        location: "Delhi, Delhi",
        price: "₹499",
        priceUnit: "/hr",
        rating: 4.9,
        reviews: 445
    },
    {
        id: 8,
        providerName: "BrightMinds Academy",
        serviceName: "Math Tutor",
        category: "Education",
        location: "Mumbai, Maharashtra",
        price: "₹599",
        priceUnit: "/hr",
        rating: 5.0,
        reviews: 523
    },
    {
        id: 9,
        providerName: "LearnPro Tutors",
        serviceName: "Science Tutor",
        category: "Education",
        location: "Bangalore, Karnataka",
        price: "₹549",
        priceUnit: "/hr",
        rating: 4.8,
        reviews: 389
    },
    {
        id: 10,
        providerName: "SmartStudy Hub",
        serviceName: "English Tutor",
        category: "Education",
        location: "Chennai, Tamil Nadu",
        price: "₹449",
        priceUnit: "/hr",
        rating: 4.7,
        reviews: 276
    },

    // AC Repair
    {
        id: 11,
        providerName: "CoolAir Services",
        serviceName: "AC Repair",
        category: "Home Services",
        location: "Mumbai, Maharashtra",
        price: "₹449",
        priceUnit: "/visit",
        rating: 4.8,
        reviews: 567
    },
    {
        id: 12,
        providerName: "ChillTech AC Solutions",
        serviceName: "AC Repair & Maintenance",
        category: "Home Services",
        location: "Delhi, Delhi",
        price: "₹499",
        priceUnit: "/visit",
        rating: 4.9,
        reviews: 623
    },
    {
        id: 13,
        providerName: "FrostFix AC Services",
        serviceName: "AC Installation & Repair",
        category: "Home Services",
        location: "Bangalore, Karnataka",
        price: "₹399",
        priceUnit: "/visit",
        rating: 4.7,
        reviews: 412
    },

    // Cleaning Services
    {
        id: 14,
        providerName: "SparkleClean Services",
        serviceName: "Cleaning",
        category: "Home Services",
        location: "Mumbai, Maharashtra",
        price: "₹999",
        priceUnit: "/session",
        rating: 4.8,
        reviews: 789
    },
    {
        id: 15,
        providerName: "FreshHome Cleaners",
        serviceName: "Deep Cleaning",
        category: "Home Services",
        location: "Pune, Maharashtra",
        price: "₹1199",
        priceUnit: "/session",
        rating: 4.9,
        reviews: 856
    },
    {
        id: 16,
        providerName: "PureSpace Cleaning",
        serviceName: "House Cleaning",
        category: "Home Services",
        location: "Hyderabad, Telangana",
        price: "₹899",
        priceUnit: "/session",
        rating: 4.7,
        reviews: 634
    },

    // Carpenters
    {
        id: 17,
        providerName: "WoodCraft Masters",
        serviceName: "Carpenter",
        category: "Home Services",
        location: "Bangalore, Karnataka",
        price: "₹349",
        priceUnit: "/hr",
        rating: 4.8,
        reviews: 234
    },
    {
        id: 18,
        providerName: "TimberPro Services",
        serviceName: "Carpentry",
        category: "Home Services",
        location: "Chennai, Tamil Nadu",
        price: "₹299",
        priceUnit: "/hr",
        rating: 4.7,
        reviews: 189
    },

    // Painters
    {
        id: 19,
        providerName: "ColorPerfect Painters",
        serviceName: "Painter",
        category: "Home Services",
        location: "Mumbai, Maharashtra",
        price: "₹399",
        priceUnit: "/hr",
        rating: 4.9,
        reviews: 445
    },
    {
        id: 20,
        providerName: "BrushMasters Painting",
        serviceName: "Painting Services",
        category: "Home Services",
        location: "Delhi, Delhi",
        price: "₹429",
        priceUnit: "/hr",
        rating: 4.8,
        reviews: 378
    },

    // Pest Control
    {
        id: 21,
        providerName: "BugBusters India",
        serviceName: "Pest Control",
        category: "Home Services",
        location: "Bangalore, Karnataka",
        price: "₹699",
        priceUnit: "/visit",
        rating: 4.9,
        reviews: 512
    },
    {
        id: 22,
        providerName: "SafeHome Pest Solutions",
        serviceName: "Pest Control Services",
        category: "Home Services",
        location: "Mumbai, Maharashtra",
        price: "₹749",
        priceUnit: "/visit",
        rating: 4.8,
        reviews: 467
    },

    // Salon Services
    {
        id: 23,
        providerName: "Glamour Studio",
        serviceName: "Salon",
        category: "Beauty & Wellness",
        location: "Mumbai, Maharashtra",
        price: "₹599",
        priceUnit: "/service",
        rating: 4.9,
        reviews: 892
    },
    {
        id: 24,
        providerName: "Style Lounge",
        serviceName: "Hair Salon",
        category: "Beauty & Wellness",
        location: "Delhi, Delhi",
        price: "₹549",
        priceUnit: "/service",
        rating: 4.8,
        reviews: 734
    },

    // Appliance Repair
    {
        id: 25,
        providerName: "FixIt Fast",
        serviceName: "Appliance Repair",
        category: "Home Services",
        location: "Pune, Maharashtra",
        price: "₹299",
        priceUnit: "/visit",
        rating: 4.7,
        reviews: 345
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = serviceProviders;
}

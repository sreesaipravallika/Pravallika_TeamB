/**
 * ProviderBooking.tsx - Advanced Provider Booking System
 * Integrated with Dashboard Services with Limitations & Constraints
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";

// ===== SYSTEM LIMITATIONS & CONSTRAINTS =====
const BOOKING_CONSTRAINTS = {
  // Date constraints
  MIN_BOOKING_DAYS_ADVANCE: 1,      // Earliest booking: 1 day from now
  MAX_BOOKING_DAYS_ADVANCE: 30,     // Latest booking: 30 days from now
  
  // Cancellation constraints
  CANCELLATION_WINDOW_HOURS: 2,     // Can't cancel within 2 hours of booking
  REFUND_PERCENTAGE_EARLY: 100,     // 100% refund if cancelled >2 hours before
  REFUND_PERCENTAGE_LATE: 50,       // 50% refund if cancelled <2 hours before
  
  // Review constraints
  MIN_REVIEW_LENGTH: 10,            // Minimum characters in review
  MAX_REVIEW_LENGTH: 500,           // Maximum characters in review
  MIN_REVIEW_RATING: 1,             // Minimum star rating
  MAX_REVIEW_RATING: 5,             // Maximum star rating
  REVIEW_ONLY_AFTER_DAYS: 0,       // Can review immediately after booking
  
  // Search constraints
  MAX_SEARCH_RESULTS: 50,           // Maximum providers per search
  SEARCH_THROTTLE_MS: 500,          // Minimum time between searches
  
  // API constraints
  API_TIMEOUT_MS: 8000,             // API timeout duration
  API_RETRY_ATTEMPTS: 2,            // Number of retry attempts
  
  // Filtering constraints
  MIN_RATING_FILTER: 0,             // Minimum selectable rating
  MAX_RATING_FILTER: 5,             // Maximum selectable rating
  MIN_PRICE_FILTER: 0,              // Minimum selectable price
  MAX_PRICE_FILTER: 9999,           // Maximum selectable price
  
  // Image loading
  IMAGE_LOAD_TIMEOUT_MS: 3000,      // Image load timeout
  IMAGE_MAX_RETRIES: 3,             // Image load retry attempts
  
  // Booking frequency
  PREVENT_DUPLICATE_BOOKINGS: true, // Prevent same provider/date/time bookings
  MAX_CONCURRENT_BOOKINGS: 5,       // Max active bookings per user
};

// Image Handling Utilities
const IMAGE_CACHE = new Map<string, string>();
const IMAGE_RETRY_COUNTS = new Map<string, number>();
const LOADING_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3C/svg%3E";
const FALLBACK_EMOJI = "🖼️";

// Image utility functions
const getOptimizedImageUrl = (url: string | undefined, defaultCategory?: string): string => {
  if (!url) {
    // Return fallback image based on category
    const fallbackMap: Record<string, string> = {
      "Quick Repairs": "🔧",
      "Emergency Electrician": "⚡",
      "Urgent Plumbing": "🔧",
      "Haircut & Styling": "💇",
      "Facial Treatment": "💆",
      "Body Massage": "💆‍♀️"
    };
    return fallbackMap[defaultCategory || ""] || FALLBACK_EMOJI;
  }
  
  // Return cached URL if available
  if (IMAGE_CACHE.has(url)) {
    return IMAGE_CACHE.get(url) || url;
  }
  
  return url;
};

const preloadImage = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    if (IMAGE_CACHE.has(url)) {
      resolve(IMAGE_CACHE.get(url) || url);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      IMAGE_CACHE.set(url, url);
      resolve(url);
    };
    img.onerror = () => {
      IMAGE_CACHE.set(url, FALLBACK_EMOJI);
      resolve(FALLBACK_EMOJI);
    };
    img.src = url;
  });
};

// Provider Data Structure
interface TimeSlot {
  time: string;
  price: number;
  label: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  date: string;
  helpfulCount: number;
}

interface Provider {
  id: number;
  providerName: string;
  brandName: string;
  category: string;
  serviceArea: string;
  rating: number;
  priceRange: string;
  timeSlots: TimeSlot[];
  image?: string;
  verified?: boolean;
}

interface Booking {
  id: number;
  providerId: number;
  providerName: string;
  brandName: string;
  category: string;
  serviceArea: string;
  timeSlot: string;
  price: number;
  bookingDate: string;
  status: string;
  image?: string;
}

// Service Providers - Now fetched from backend, with fallback data for demo
const SERVICE_PROVIDERS: Provider[] = [
  // InstaHelp - Quick Repairs
  {
    id: 1,
    providerName: "FixIt Fast",
    brandName: "FixIt Fast",
    category: "Quick Repairs",
    serviceArea: "Koramangala",
    rating: 4.8,
    priceRange: "₹199 - ₹299",
    verified: true,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "8:00 AM - 10:00 AM", price: 219, label: "Morning" },
      { time: "12:00 PM - 2:00 PM", price: 249, label: "Afternoon" },
      { time: "5:00 PM - 7:00 PM", price: 299, label: "Evening" }
    ]
  },
  {
    id: 2,
    providerName: "Rapid Repair Services",
    brandName: "Rapid Repair",
    category: "Quick Repairs",
    serviceArea: "Indiranagar",
    rating: 4.7,
    priceRange: "₹189 - ₹249",
    verified: true,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "9:00 AM - 11:00 AM", price: 199, label: "Morning" },
      { time: "1:00 PM - 3:00 PM", price: 229, label: "Afternoon" },
      { time: "6:00 PM - 8:00 PM", price: 249, label: "Evening" }
    ]
  },
  // InstaHelp - Emergency Electrician
  {
    id: 3,
    providerName: "PowerUp Electricals",
    brandName: "PowerUp Pro",
    category: "Emergency Electrician",
    serviceArea: "Jayanagar",
    rating: 4.9,
    priceRange: "₹299 - ₹399",
    verified: true,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "8:00 AM - 10:00 AM", price: 329, label: "Morning" },
      { time: "12:00 PM - 2:00 PM", price: 349, label: "Afternoon" },
      { time: "5:00 PM - 7:00 PM", price: 399, label: "Evening" }
    ]
  },
  {
    id: 4,
    providerName: "Spark Solutions",
    brandName: "Spark Pro",
    category: "Emergency Electrician",
    serviceArea: "BTM Layout",
    rating: 4.7,
    priceRange: "₹279 - ₹349",
    verified: true,
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "9:00 AM - 11:00 AM", price: 299, label: "Morning" },
      { time: "1:00 PM - 3:00 PM", price: 319, label: "Afternoon" },
      { time: "6:00 PM - 8:00 PM", price: 349, label: "Evening" }
    ]
  },
  // InstaHelp - Urgent Plumbing
  {
    id: 5,
    providerName: "FlowFix Plumbers",
    brandName: "FlowFix Pro",
    category: "Urgent Plumbing",
    serviceArea: "Malleshwaram",
    rating: 4.8,
    priceRange: "₹349 - ₹449",
    verified: true,
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "8:00 AM - 10:00 AM", price: 379, label: "Morning" },
      { time: "12:00 PM - 2:00 PM", price: 399, label: "Afternoon" },
      { time: "5:00 PM - 7:00 PM", price: 449, label: "Evening" }
    ]
  },
  {
    id: 6,
    providerName: "AquaCare Services",
    brandName: "AquaCare",
    category: "Urgent Plumbing",
    serviceArea: "Rajajinagar",
    rating: 4.7,
    priceRange: "₹329 - ₹429",
    verified: true,
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "9:00 AM - 11:00 AM", price: 349, label: "Morning" },
      { time: "1:00 PM - 3:00 PM", price: 379, label: "Afternoon" },
      { time: "6:00 PM - 8:00 PM", price: 429, label: "Evening" }
    ]
  },
  // Women's Salon & Spa - Haircut & Styling
  {
    id: 7,
    providerName: "Glamour Studio",
    brandName: "Glamour Studio",
    category: "Haircut & Styling",
    serviceArea: "Koramangala",
    rating: 4.8,
    priceRange: "₹299 - ₹499",
    verified: true,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "10:00 AM - 12:00 PM", price: 299, label: "Morning" },
      { time: "2:00 PM - 4:00 PM", price: 349, label: "Afternoon" },
      { time: "6:00 PM - 8:00 PM", price: 449, label: "Evening" }
    ]
  },
  {
    id: 8,
    providerName: "Tress & Trends",
    brandName: "Tress & Trends",
    category: "Haircut & Styling",
    serviceArea: "Koramangala",
    rating: 4.6,
    priceRange: "₹259 - ₹459",
    verified: true,
    image: "https://images.unsplash.com/photo-1520549298678-5c8df26dcd6f?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "10:00 AM - 12:00 PM", price: 279, label: "Morning" },
      { time: "2:00 PM - 4:00 PM", price: 329, label: "Afternoon" },
      { time: "6:00 PM - 8:00 PM", price: 429, label: "Evening" }
    ]
  },
  // Women's Salon & Spa - Facial Treatment
  {
    id: 9,
    providerName: "Style Lounge",
    brandName: "Style Lounge",
    category: "Facial Treatment",
    serviceArea: "Whitefield",
    rating: 4.7,
    priceRange: "₹399 - ₹599",
    verified: true,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "10:00 AM - 12:00 PM", price: 449, label: "Morning" },
      { time: "2:00 PM - 4:00 PM", price: 499, label: "Afternoon" },
      { time: "6:00 PM - 8:00 PM", price: 599, label: "Evening" }
    ]
  },
  {
    id: 10,
    providerName: "Radiance Beauty",
    brandName: "Radiance Beauty",
    category: "Facial Treatment",
    serviceArea: "Indira Nagar",
    rating: 4.6,
    priceRange: "₹379 - ₹579",
    verified: true,
    image: "https://images.unsplash.com/photo-1552852081-c8fa8b9b4eb9?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "10:00 AM - 12:00 PM", price: 429, label: "Morning" },
      { time: "2:00 PM - 4:00 PM", price: 479, label: "Afternoon" },
      { time: "6:00 PM - 8:00 PM", price: 579, label: "Evening" }
    ]
  },
  // Women's Salon & Spa - Body Massage
  {
    id: 11,
    providerName: "Zen Wellness Spa",
    brandName: "Zen Wellness",
    category: "Body Massage",
    serviceArea: "Indiranagar",
    rating: 4.8,
    priceRange: "₹499 - ₹799",
    verified: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d5c1c47a22?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "10:00 AM - 12:00 PM", price: 599, label: "Morning" },
      { time: "2:00 PM - 4:00 PM", price: 699, label: "Afternoon" },
      { time: "6:00 PM - 8:00 PM", price: 799, label: "Evening" }
    ]
  },
  {
    id: 12,
    providerName: "Serenity Spa",
    brandName: "Serenity Spa",
    category: "Body Massage",
    serviceArea: "Marathahalli",
    rating: 4.7,
    priceRange: "₹479 - ₹779",
    verified: true,
    image: "https://images.unsplash.com/photo-1600333669505-3a7b9fe0d068?w=600&h=400&fit=crop",
    timeSlots: [
      { time: "10:00 AM - 12:00 PM", price: 579, label: "Morning" },
      { time: "2:00 PM - 4:00 PM", price: 679, label: "Afternoon" },
      { time: "6:00 PM - 8:00 PM", price: 779, label: "Evening" }
    ]
  }
];

export default function ProviderBooking() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<Record<number, TimeSlot>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [uniqueServices, setUniqueServices] = useState<string[]>([]);
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
  
  // Advanced filters
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(999);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Dynamic booking
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDateSlots, setSelectedDateSlots] = useState<Record<number, TimeSlot>>({});
  
  // Provider profile
  const [showProviderProfile, setShowProviderProfile] = useState(false);
  const [selectedProviderProfile, setSelectedProviderProfile] = useState<Provider | null>(null);
  // Reviews and ratings
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedProviderForReview, setSelectedProviderForReview] = useState<Provider | null>(null);
  const [providerReviews, setProviderReviews] = useState<Record<number, Review[]>>({});
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  
  // Booking management
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  
  // Image handling
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, "loading" | "loaded" | "error">>({});
  const [providerImageUrls, setProviderImageUrls] = useState<Record<number, string>>({});
  const imageObserverRef = useRef<IntersectionObserver | null>(null);;

  // Service images mapping
  const serviceImages: Record<string, string> = {
    "Quick Repairs": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    "Emergency Electrician": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    "Urgent Plumbing": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop",
    "Haircut & Styling": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop",
    "Facial Treatment": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop",
    "Body Massage": "https://images.unsplash.com/photo-1573496359142-b8d5c1c47a22?w=600&h=400&fit=crop"
  };

  // Fallback providers for demo purposes (when backend is not available)
  const fallbackProviders = SERVICE_PROVIDERS;

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    loadBookings();
  }, [navigate]);

  useEffect(() => {
    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/api/provider/search');
      
      if (response.ok) {
        const data = await response.json();
        setAllProviders(data);
        
        // Preload all provider images in background
        data.forEach((provider: Provider) => {
          if (provider.image) {
            preloadImage(provider.image).then(url => {
              setProviderImageUrls(prev => ({ ...prev, [provider.id]: url }));
            });
          }
        });
        
        // Extract unique services and locations
        const services = Array.from(new Set(data.map((p: Provider) => p.category))).sort() as string[];
        const locations = Array.from(new Set(data.map((p: Provider) => p.serviceArea))).sort() as string[];
        
        setUniqueServices(services);
        setUniqueLocations(locations);
      } else {
        // Fallback to demo data if backend fails
        setAllProviders(fallbackProviders);
        
        // Preload fallback images
        fallbackProviders.forEach((provider: Provider) => {
          if (provider.image) {
            preloadImage(provider.image).then(url => {
              setProviderImageUrls(prev => ({ ...prev, [provider.id]: url }));
            });
          }
        });
        
        const services = Array.from(new Set(fallbackProviders.map(p => p.category))).sort() as string[];
        const locations = Array.from(new Set(fallbackProviders.map(p => p.serviceArea))).sort() as string[];
        setUniqueServices(services);
        setUniqueLocations(locations);
      }
    } catch (error) {
      console.warn("Backend unavailable, using fallback data:", error);
      setAllProviders(fallbackProviders);
      
      // Preload fallback images
      fallbackProviders.forEach((provider: Provider) => {
        if (provider.image) {
          preloadImage(provider.image).then(url => {
            setProviderImageUrls(prev => ({ ...prev, [provider.id]: url }));
          });
        }
      });
      
      const services = Array.from(new Set(fallbackProviders.map(p => p.category))).sort() as string[];
      const locations = Array.from(new Set(fallbackProviders.map(p => p.serviceArea))).sort() as string[];
      setUniqueServices(services);
      setUniqueLocations(locations);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = () => {
    const saved = localStorage.getItem("qs_bookings");
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  };

  // Image loading handler with error handling
  const handleImageLoad = useCallback((providerId: number) => {
    setImageLoadingStates(prev => ({ ...prev, [providerId]: "loaded" }));
  }, []);

  const handleImageError = useCallback((providerId: number, category: string) => {
    setImageLoadingStates(prev => ({ ...prev, [providerId]: "error" }));
    // Update to emoji fallback
    setProviderImageUrls(prev => ({ ...prev, [providerId]: getOptimizedImageUrl(undefined, category) }));
  }, []);

  // Setup Intersection Observer for lazy loading images
  useEffect(() => {
    if (!imageObserverRef.current) {
      imageObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.getAttribute('data-src');
              if (src && !img.src) {
                img.src = src;
              }
            }
          });
        },
        { rootMargin: '50px' }
      );
    }
    
    return () => {
      if (imageObserverRef.current) {
        imageObserverRef.current.disconnect();
      }
    };
  }, []);

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setLocation(""); // Reset location when changing service
    setFilteredProviders([]); // Clear providers
    setSelectedSlots({}); // Clear selected slots
  };

  const searchProviders = () => {
    if (!selectedService) {
      alert("⚠️ Please select a service first");
      return;
    }

    if (!location.trim()) {
      alert("⚠️ Please select a location");
      return;
    }

    const filtered = allProviders.filter(
      p => p.category === selectedService && 
           p.serviceArea.toLowerCase().includes(location.toLowerCase())
    );
    
    if (filtered.length === 0) {
      alert(`⚠️ No providers found for ${selectedService} in ${location}`);
      return;
    }

    setSelectedSlots({});
    applyFilters(filtered);
  };

  const applyFilters = (providers: Provider[]) => {
    let result = [...providers];
    
    // Apply advanced filters first
    result = result.filter(provider => {
      // Rating filter
      if (provider.rating < minRating) return false;
      
      // Verified filter
      if (verifiedOnly && !provider.verified) return false;
      
      // Price filter - check if at least one time slot is within range
      const hasAffordableSlot = provider.timeSlots.some(slot => slot.price <= maxPrice);
      if (!hasAffordableSlot) return false;
      
      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => 
          Math.min(...a.timeSlots.map(s => s.price)) - 
          Math.min(...b.timeSlots.map(s => s.price))
        );
        break;
      case "price-high":
        result.sort((a, b) => 
          Math.max(...b.timeSlots.map(s => s.price)) - 
          Math.max(...a.timeSlots.map(s => s.price))
        );
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProviders(result);
  };

  useEffect(() => {
    if (filteredProviders.length > 0) {
      applyFilters(filteredProviders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const selectTimeSlot = (providerId: number, slot: TimeSlot) => {
    setSelectedSlots(prev => ({ ...prev, [providerId]: slot }));
  };

  const bookService = (provider: Provider) => {
    const slot = selectedSlots[provider.id];
    if (!slot) {
      alert("⚠️ Please select a time slot before booking!");
      return;
    }

    if (!selectedDate) {
      alert("⚠️ Please select a booking date!");
      return;
    }

    const booking: Booking = {
      id: Date.now(),
      providerId: provider.id,
      providerName: provider.providerName,
      brandName: provider.brandName,
      category: provider.category,
      serviceArea: provider.serviceArea,
      timeSlot: slot.time,
      price: slot.price,
      bookingDate: new Date(selectedDate).toLocaleDateString('en-IN') + ' at ' + slot.time,
      status: "Confirmed",
      image: provider.image
    };

    const updated = [...bookings, booking];
    setBookings(updated);
    localStorage.setItem("qs_bookings", JSON.stringify(updated));
    
    setCurrentBooking(booking);
    setShowModal(true);
  };

  const openReviewsModal = (provider: Provider) => {
    setSelectedProviderForReview(provider);
    
    // Generate sample reviews if not already created
    if (!providerReviews[provider.id]) {
      const sampleReviews: Review[] = [
        {
          id: "1",
          rating: 5,
          comment: "Excellent service! Very professional and on-time.",
          userName: "Rajesh K.",
          date: "2 weeks ago",
          helpfulCount: 24
        },
        {
          id: "2",
          rating: 4,
          comment: "Good service, but took a bit longer than expected.",
          userName: "Priya S.",
          date: "1 month ago",
          helpfulCount: 12
        },
        {
          id: "3",
          rating: 5,
          comment: "Perfect! I will definitely book again.",
          userName: "Amit P.",
          date: "1 month ago",
          helpfulCount: 18
        }
      ];
      setProviderReviews(prev => ({ ...prev, [provider.id]: sampleReviews }));
    }
    
    setShowReviewsModal(true);
  };

  const submitReview = () => {
    if (userRating === 0) {
      alert("Please provide a rating");
      return;
    }
    
    if (!selectedProviderForReview) return;
    
    const newReview: Review = {
      id: Date.now().toString(),
      rating: userRating,
      comment: userComment || "No comment provided",
      userName: "You",
      date: "Just now",
      helpfulCount: 0
    };
    
    const providerId = selectedProviderForReview.id;
    const updated = [...(providerReviews[providerId] || []), newReview];
    setProviderReviews(prev => ({ ...prev, [providerId]: updated }));
    
    // Reset form
    setUserRating(0);
    setUserComment("");
    alert("✅ Review submitted successfully!");
  };

  const openCancelModal = (booking: Booking) => {
    setBookingToCancel(booking);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    if (!bookingToCancel) return;

    // Update booking status
    const updated = bookings.map(b => 
      b.id === bookingToCancel.id 
        ? { ...b, status: "cancelled" as const }
        : b
    );
    setBookings(updated);
    localStorage.setItem("qs_bookings", JSON.stringify(updated));

    alert(`✅ Booking #${bookingToCancel.id} cancelled successfully.\n\nCancel Reason: ${cancelReason || "No reason provided"}\n\nYou'll receive a refund within 3-5 business days.`);
    setShowCancelModal(false);
    setCancelReason("");
    setBookingToCancel(null);
  };

  return (
    <div className="provider-booking-page">
      <div className="pb-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>🔍 Find Service Providers</h1>
        <p>Select a service and find trusted professionals</p>
      </div>

      {!selectedService ? (
        <>
          {/* Services Selection */}
          <div className="services-section">
            <h2>📋 Select a Service</h2>
            <div className="services-grid">
              {uniqueServices.map((service) => {
                const providersCount = SERVICE_PROVIDERS.filter(p => p.category === service).length;
                const serviceImage = serviceImages[service];
                return (
                  <button
                    key={service}
                    onClick={() => handleServiceSelect(service)}
                    className="service-card"
                  >
                    {serviceImage ? (
                      <div className="service-card-image" style={{ backgroundImage: `url(${serviceImage})` }}></div>
                    ) : (
                      <div className="service-card-icon">🔧</div>
                    )}
                    <h3>{service}</h3>
                    <p>{providersCount} providers available</p>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Service Selected - Show Provider Filters */}
          <div className="service-selected-header">
            <button 
              onClick={() => handleServiceSelect("")}
              className="change-service-btn"
            >
              ← Change Service
            </button>
            <h2>📍 {selectedService}</h2>
            <p>Find providers for this service in your area</p>
          </div>

          <div className="pb-filters">
            <div className="filter-row">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="location-input"
              >
                <option value="">Select Location</option>
                {uniqueLocations.map(loc => {
                  // Only show locations that have this service
                  const hasService = SERVICE_PROVIDERS.some(
                    p => p.category === selectedService && p.serviceArea === loc
                  );
                  if (hasService) {
                    return <option key={loc} value={loc}>{loc}</option>;
                  }
                })}
              </select>
              <button onClick={searchProviders} className="search-btn">
                Search Providers
              </button>
              <button 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="advanced-filter-btn"
                title="Advanced Filters"
              >
                ⚙️ {showAdvancedFilters ? "Hide" : "Show"} Filters
              </button>
            </div>

            {showAdvancedFilters && filteredProviders.length > 0 && (
              <div className="advanced-filters">
                <div className="filter-group">
                  <label>Minimum Rating: ⭐ {minRating.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={minRating}
                    onChange={(e) => {
                      setMinRating(parseFloat(e.target.value));
                      applyFilters(filteredProviders);
                    }}
                    className="slider"
                  />
                </div>

                <div className="filter-group">
                  <label>Max Price: ₹{maxPrice}</label>
                  <input
                    type="range"
                    min="0"
                    max="999"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(parseInt(e.target.value));
                      applyFilters(filteredProviders);
                    }}
                    className="slider"
                  />
                </div>

                <div className="filter-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => {
                        setVerifiedOnly(e.target.checked);
                        applyFilters(filteredProviders);
                      }}
                    />
                    <span>✓ Verified Providers Only</span>
                  </label>
                </div>
              </div>
            )}

            {filteredProviders.length > 0 && (
              <div className="filter-row">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                  <option value="default">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            )}
          </div>

          {filteredProviders.length > 0 && (
            <div className="results-info">
              ✅ Found {filteredProviders.length} provider(s) for {selectedService} in {location}
            </div>
          )}

          {filteredProviders.length > 0 && (
            <div className="date-picker-section">
              <label htmlFor="booking-date">📅 Select Booking Date:</label>
              <input
                id="booking-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="date-input"
              />
              {selectedDate && (
                <span className="selected-date-info">
                  Selected: {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
            </div>
          )}

          <div className="providers-grid">
            {filteredProviders.map(provider => {
              const selectedSlot = selectedSlots[provider.id];
              const currentPrice = selectedSlot ? selectedSlot.price : provider.timeSlots[0].price;
              const imageUrl = providerImageUrls[provider.id] || provider.image;
              const isImageEmoji = typeof imageUrl === 'string' && imageUrl.length <= 2;
              const imageLoadState = imageLoadingStates[provider.id] || "loading";

              return (
                <div key={provider.id} className="provider-card">
                  {provider.image && (
                    <div className="provider-image" 
                      style={{ 
                        backgroundImage: isImageEmoji ? 'none' : `url(${imageUrl})`,
                        backgroundColor: isImageEmoji ? '#f0f0f0' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isImageEmoji ? '48px' : 'inherit'
                      }}>
                      {isImageEmoji && <span>{imageUrl || FALLBACK_EMOJI}</span>}
                      {imageLoadState === "loading" && !isImageEmoji && (
                        <div className="image-loading-skeleton"></div>
                      )}
                      {provider.verified && (
                        <div className="verified-badge">✓ Verified</div>
                      )}
                      <img
                        ref={el => {
                          if (el && imageObserverRef.current) {
                            imageObserverRef.current.observe(el);
                          }
                        }}
                        data-src={provider.image}
                        alt={provider.providerName}
                        onLoad={() => handleImageLoad(provider.id)}
                        onError={() => handleImageError(provider.id, provider.category)}
                        style={{ display: 'none' }}
                      />
                    </div>
                  )}
                  <div className="provider-content">
                    <div className="provider-header">
                      <h3>{provider.providerName}</h3>
                      <div className="brand-name">🏢 {provider.brandName}</div>
                      <div className="provider-meta">
                        <span>📍 {provider.serviceArea}</span>
                        <span className="rating">⭐ {provider.rating}</span>
                      </div>
                    </div>

                    <div className="time-slots-section">
                      <h4>⏰ Available Time Slots:</h4>
                      <div className="time-slots">
                        {provider.timeSlots.map((slot, idx) => (
                          <button
                            key={idx}
                            className={`time-slot ${selectedSlot?.time === slot.time ? "selected" : ""}`}
                            onClick={() => selectTimeSlot(provider.id, slot)}
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="price-section">
                      <div className="price-label">Current Price:</div>
                      <div className="price-value">₹{currentPrice}</div>
                      <div className="price-range">Range: {provider.priceRange}</div>
                    </div>

                    <div className="button-group">
                      <button 
                        onClick={() => {
                          setSelectedProviderProfile(provider);
                          setShowProviderProfile(true);
                        }} 
                        className="profile-btn"
                        title="View provider profile"
                      >
                        👤 Profile
                      </button>
                      <button onClick={() => bookService(provider)} className="book-btn">
                        📅 Book
                      </button>
                      <button 
                        onClick={() => openReviewsModal(provider)} 
                        className="reviews-btn"
                        title="View customer reviews"
                      >
                        ⭐
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProviders.length === 0 && location && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h2>No Providers Found</h2>
              <p>No providers available for {selectedService} in {location}.</p>
              <button onClick={() => setLocation("")} className="back-btn">
                Try Another Location
              </button>
            </div>
          )}
        </>
      )}

      {filteredProviders.length === 0 && location && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h2>No Services Available</h2>
          <p>We couldn't find any service providers in {location}.</p>
          <p>Try: Mumbai, Delhi, Bangalore, or Pune</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="bookings-section">
          <h2>📋 My Bookings</h2>
          <div className="bookings-list">
            {bookings.slice().reverse().map(booking => (
              <div key={booking.id} className={`booking-item ${booking.status === 'cancelled' ? 'cancelled' : ''}`}>
                <div className="booking-header">
                  <h3>🎫 {booking.providerName}</h3>
                  <span className={`status-badge status-${booking.status}`}>{booking.status.toUpperCase()}</span>
                </div>
                <div className="booking-details">
                  <p><strong>Brand:</strong> {booking.brandName}</p>
                  <p><strong>Category:</strong> {booking.category}</p>
                  <p><strong>Location:</strong> {booking.serviceArea}</p>
                  <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
                  <p><strong>Price:</strong> ₹{booking.price}</p>
                  <p><strong>Booked On:</strong> {booking.bookingDate}</p>
                </div>
                {booking.status !== 'cancelled' && (
                  <div className="booking-actions">
                    <button 
                      onClick={() => openCancelModal(booking)}
                      className="cancel-btn"
                      title="Cancel this booking"
                    >
                      ❌ Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && currentBooking && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            <div className="modal-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <div className="booking-summary">
              <p><strong>Provider:</strong> {currentBooking.providerName}</p>
              <p><strong>Brand:</strong> {currentBooking.brandName}</p>
              <p><strong>Time Slot:</strong> {currentBooking.timeSlot}</p>
              <p><strong>Price:</strong> ₹{currentBooking.price}</p>
              <p><strong>Booking ID:</strong> #{currentBooking.id}</p>
            </div>
            <button onClick={() => setShowModal(false)} className="close-btn">Close</button>
          </div>
        </div>
      )}

      {showProviderProfile && selectedProviderProfile && (
        <div className="modal-overlay" onClick={() => setShowProviderProfile(false)}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowProviderProfile(false)}>×</button>
            
            {selectedProviderProfile.image && (
              <div className="profile-image" 
                style={{ 
                  backgroundImage: `url(${providerImageUrls[selectedProviderProfile.id] || selectedProviderProfile.image})`,
                  position: 'relative'
                }}>
                <img
                  ref={el => {
                    if (el && imageObserverRef.current) {
                      imageObserverRef.current.observe(el);
                    }
                  }}
                  data-src={selectedProviderProfile.image}
                  alt={selectedProviderProfile.providerName}
                  onLoad={() => handleImageLoad(selectedProviderProfile.id)}
                  onError={() => handleImageError(selectedProviderProfile.id, selectedProviderProfile.category)}
                  style={{ display: 'none' }}
                />
              </div>
            )}
            
            <div className="profile-header">
              <h2>{selectedProviderProfile.providerName}</h2>
              <div className="profile-brand">🏢 {selectedProviderProfile.brandName}</div>
              <div className="profile-rating">⭐ {selectedProviderProfile.rating} Rating</div>
            </div>

            <div className="profile-info">
              <div className="info-item">
                <span className="label">📍 Location:</span>
                <span className="value">{selectedProviderProfile.serviceArea}</span>
              </div>
              <div className="info-item">
                <span className="label">🏷️ Service Category:</span>
                <span className="value">{selectedProviderProfile.category}</span>
              </div>
              <div className="info-item">
                <span className="label">💰 Price Range:</span>
                <span className="value">{selectedProviderProfile.priceRange}</span>
              </div>
              <div className="info-item">
                <span className="label">✅ Verification:</span>
                <span className="value">{selectedProviderProfile.verified ? '✓ Verified Professional' : 'Not Verified'}</span>
              </div>
            </div>

            <div className="experience-section">
              <h3>📌 Experience & Expertise</h3>
              <ul className="expertise-list">
                <li>✓ 8+ years of professional experience</li>
                <li>✓ Completed 1,250+ successful bookings</li>
                <li>✓ Certified and licensed professional</li>
                <li>✓ Equipped with modern tools and equipment</li>
                <li>✓ Emergency service available 24/7</li>
              </ul>
            </div>

            <div className="availability-section">
              <h3>⏰ Available Time Slots</h3>
              <div className="availability-grid">
                {selectedProviderProfile.timeSlots.map((slot, idx) => (
                  <div key={idx} className="slot-item">
                    <div className="slot-label">{slot.label}</div>
                    <div className="slot-time">{slot.time}</div>
                    <div className="slot-price">₹{slot.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => {
              setShowProviderProfile(false);
              bookService(selectedProviderProfile);
            }} className="book-now-btn">
              Book Now
            </button>
          </div>
        </div>
      )}

      {showReviewsModal && selectedProviderForReview && (
        <div className="modal-overlay" onClick={() => setShowReviewsModal(false)}>
          <div className="reviews-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowReviewsModal(false)}>×</button>
            
            <div className="reviews-header">
              <h2>{selectedProviderForReview.providerName}</h2>
              <div className="rating-summary">
                <span className="big-rating">⭐ {selectedProviderForReview.rating}</span>
                <span className="review-count">({(providerReviews[selectedProviderForReview.id]?.length || 0) + 3} reviews)</span>
              </div>
            </div>

            <div className="reviews-list">
              {(providerReviews[selectedProviderForReview.id] || []).map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div>
                      <div className="reviewer-name">{review.userName}</div>
                      <div className="review-rating">{'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                    </div>
                    <div className="review-date">{review.date}</div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <button className="helpful-btn">👍 Helpful ({review.helpfulCount})</button>
                </div>
              ))}
            </div>

            <div className="add-review-section">
              <h3>Share Your Experience</h3>
              <div className="rating-input">
                <label>Your Rating:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`star ${userRating >= star ? "active" : ""}`}
                      onClick={() => setUserRating(star)}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Share your experience (optional)..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="review-textarea"
                rows={3}
              />
              <button onClick={submitReview} className="submit-review-btn">Submit Review</button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && bookingToCancel && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowCancelModal(false)}>×</button>
            <div className="modal-icon">⚠️</div>
            <h2>Cancel Booking?</h2>
            <p>Are you sure you want to cancel booking <strong>#{bookingToCancel.id}</strong>?</p>
            <p>You'll receive a refund within 3-5 business days.</p>
            
            <div className="cancel-form">
              <label htmlFor="cancel-reason">Please tell us why (optional):</label>
              <textarea
                id="cancel-reason"
                placeholder="Your feedback helps us improve..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="cancel-textarea"
                rows={3}
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowCancelModal(false)} className="keep-btn">Keep Booking</button>
              <button onClick={confirmCancelBooking} className="confirm-cancel-btn">Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .provider-booking-page {
          min-height: 100vh;
          background: linear-gradient(135deg, hsl(250 30% 98%) 0%, hsl(240 40% 97%) 100%);
          padding: 2rem;
        }

        .pb-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .services-section {
          max-width: 1400px;
          margin: 2rem auto;
        }

        .services-section h2 {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 2rem;
          color: hsl(var(--foreground));
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .service-card {
          background: white;
          border: 2px solid hsl(var(--border));
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .service-card:hover {
          transform: translateY(-5px);
          border-color: hsl(280 85% 60%);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .service-card-image {
          width: 100%;
          height: 180px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .service-card-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%);
        }

        .service-card-icon {
          font-size: 3rem;
          padding: 2rem;
          width: 100%;
          text-align: center;
        }

        .service-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          padding: 0 1rem;
        }

        .service-card p {
          font-size: 0.9rem;
          color: hsl(var(--muted-foreground));
          text-align: center;
          padding: 0 1rem 1rem;
        }

        .service-selected-header {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .change-service-btn {
          padding: 0.6rem 1.2rem;
          background: hsl(280 85% 98%);
          border: 2px solid hsl(280 85% 60%);
          border-radius: 8px;
          color: hsl(280 85% 60%);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .change-service-btn:hover {
          background: hsl(280 85% 60%);
          color: white;
        }

        .service-selected-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: hsl(var(--foreground));
        }

        .service-selected-header p {
          color: hsl(var(--muted-foreground));
        }

        .back-btn {
          position: absolute;
          top: 2rem;
          left: 2rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 2px solid hsl(280 85% 60%);
          border-radius: 8px;
          color: hsl(280 85% 60%);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: hsl(280 85% 60%);
          color: white;
        }

        .pb-header h1 {
          font-size: 2.5rem;
          color: hsl(var(--foreground));
          margin-bottom: 0.5rem;
        }

        .pb-filters {
          max-width: 1200px;
          margin: 0 auto 2rem;
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .filter-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-row:last-child {
          margin-bottom: 0;
        }
        
        .advanced-filter-btn {
          padding: 0.75rem 1.5rem;
          background: hsl(280 85% 95%);
          border: 2px solid hsl(280 85% 60%);
          color: hsl(280 85% 60%);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .advanced-filter-btn:hover {
          background: hsl(280 85% 60%);
          color: white;
        }
        
        .advanced-filters {
          background: hsl(280 85% 98%);
          padding: 1.5rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .filter-group label {
          font-weight: 600;
          color: hsl(var(--foreground));
          font-size: 0.95rem;
        }
        
        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: hsl(var(--border));
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: hsl(280 85% 60%);
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          background: hsl(280 85% 50%);
        }
        
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: hsl(280 85% 60%);
          cursor: pointer;
          border: none;
          transition: background 0.3s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          background: hsl(280 85% 50%);
        }
        
        .checkbox-group {
          align-items: center;
        }
        
        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
          cursor: pointer;
        }
        
        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: hsl(280 85% 60%);
        }

        .date-picker-section {
          max-width: 1200px;
          margin: 0 auto 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .date-picker-section label {
          font-weight: 600;
          color: hsl(var(--foreground));
          margin: 0;
        }

        .date-input {
          padding: 0.75rem 1rem;
          border: 2px solid hsl(280 85% 60%);
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          background: white;
          color: hsl(var(--foreground));
          transition: all 0.3s ease;
        }

        .date-input:hover {
          border-color: hsl(280 85% 50%);
        }

        .date-input:focus {
          outline: none;
          border-color: hsl(280 85% 40%);
          box-shadow: 0 0 0 3px hsl(280 85% 90%);
        }

        .selected-date-info {
          padding: 0.75rem 1rem;
          background: hsl(280 85% 95%);
          border-radius: 8px;
          color: hsl(280 85% 40%);
          font-weight: 600;
          font-size: 0.95rem;
        }

        .location-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid hsl(var(--border));
          border-radius: 8px;
          font-size: 1rem;
        }

        .location-input:focus {
          outline: none;
          border-color: hsl(280 85% 60%);
        }

        .search-btn {
          padding: 0.75rem 2rem;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px hsl(280 85% 60% / 0.4);
        }

        .filter-select {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid hsl(var(--border));
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
        }

        .results-info {
          max-width: 1200px;
          margin: 0 auto 1.5rem;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
          color: hsl(280 85% 40%);
          font-weight: 600;
        }

        .providers-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .provider-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .provider-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .provider-image {
          width: 100%;
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }

        .provider-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
        }

        .image-loading-skeleton {
          width: 100%;
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .verified-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #10b981;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .provider-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .profile-btn {
          flex: 1;
          padding: 0.75rem;
          background: hsl(280 85% 95%);
          border: 2px solid hsl(280 85% 60%);
          color: hsl(280 85% 60%);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .profile-btn:hover {
          background: hsl(280 85% 60%);
          color: white;
        }

        .profile-modal-content {
          background: white;
          padding: 0;
          border-radius: 15px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .profile-image {
          width: 100%;
          height: 250px;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          overflow: hidden;
        }

        .profile-image::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);
          z-index: 1;
        }

        .profile-header {
          padding: 2rem 2rem 0 2rem;
          text-align: center;
        }

        .profile-header h2 {
          margin: 0 0 0.5rem 0;
        }

        .profile-brand {
          color: hsl(280 85% 60%);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .profile-rating {
          color: hsl(45 100% 45%);
          font-weight: 600;
          font-size: 1.1rem;
        }

        .profile-info {
          padding: 1.5rem 2rem;
          border-bottom: 2px solid hsl(var(--border));
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: hsl(var(--muted));
          border-radius: 8px;
        }

        .info-item .label {
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        .info-item .value {
          color: hsl(280 85% 60%);
          font-weight: 500;
        }

        .experience-section,
        .availability-section {
          padding: 0 2rem;
        }

        .experience-section h3,
        .availability-section h3 {
          margin: 1.5rem 0 1rem 0;
          color: hsl(var(--foreground));
        }

        .expertise-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .expertise-list li {
          padding: 0.5rem 0;
          color: hsl(var(--muted-foreground));
        }

        .availability-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .slot-item {
          padding: 1rem;
          background: hsl(280 85% 98%);
          border-radius: 8px;
          text-align: center;
          border: 2px solid hsl(280 85% 90%);
        }

        .slot-label {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .slot-time {
          font-size: 0.8rem;
          color: hsl(var(--foreground));
          margin-bottom: 0.5rem;
        }

        .slot-price {
          font-size: 1.1rem;
          color: hsl(280 85% 60%);
          font-weight: 700;
        }

        .book-now-btn {
          padding: 1rem 2rem;
          margin: 1.5rem 2rem 2rem 2rem;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .book-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px hsl(280 85% 60% / 0.4);
        }

        .provider-header {
          border-bottom: 2px solid hsl(var(--border));
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .provider-header h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .brand-name {
          color: hsl(280 85% 60%);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .provider-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
          font-size: 0.9rem;
        }

        .category-badge {
          background: var(--gradient-primary);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .rating {
          color: hsl(45 100% 45%);
          font-weight: 600;
        }

        .time-slots-section {
          margin: 1rem 0;
        }

        .time-slots-section h4 {
          font-size: 1rem;
          margin-bottom: 0.75rem;
          color: hsl(var(--muted-foreground));
        }

        .time-slots {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .time-slot {
          padding: 0.5rem 1rem;
          border: 2px solid hsl(var(--border));
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
        }

        .time-slot:hover {
          border-color: hsl(280 85% 60%);
        }

        .time-slot.selected {
          background: var(--gradient-primary);
          color: white;
          border-color: hsl(280 85% 60%);
        }

        .price-section {
          margin: 1rem 0;
          padding: 1rem;
          background: hsl(280 85% 98%);
          border-radius: 8px;
        }

        .price-label {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
        }

        .price-value {
          font-size: 1.8rem;
          color: hsl(280 85% 60%);
          font-weight: 700;
          margin: 0.25rem 0;
        }

        .price-range {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
        }

        .book-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
        }

        .button-group {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .book-btn {
          flex: 2;
        }

        .reviews-btn {
          flex: 1;
          padding: 0.75rem;
          background: hsl(45 100% 55%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reviews-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px hsl(45 100% 55% / 0.4);
        }

        .reviews-modal-content {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          max-width: 700px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .reviews-header {
          border-bottom: 2px solid hsl(var(--border));
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }

        .reviews-header h2 {
          margin: 0 0 0.5rem 0;
        }

        .rating-summary {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .big-rating {
          font-size: 2rem;
          font-weight: 700;
          color: hsl(45 100% 45%);
        }

        .review-count {
          color: hsl(var(--muted-foreground));
          font-size: 0.9rem;
        }

        .reviews-list {
          margin-bottom: 2rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .review-item {
          padding: 1rem;
          background: hsl(var(--muted));
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .reviewer-name {
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        .review-rating {
          color: hsl(45 100% 45%);
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .review-date {
          color: hsl(var(--muted-foreground));
          font-size: 0.85rem;
        }

        .review-comment {
          margin: 0.5rem 0;
          color: hsl(var(--foreground));
          line-height: 1.5;
        }

        .helpful-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          color: hsl(var(--muted-foreground));
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .helpful-btn:hover {
          border-color: hsl(280 85% 60%);
          color: hsl(280 85% 60%);
        }

        .add-review-section {
          border-top: 2px solid hsl(var(--border));
          padding-top: 1.5rem;
        }

        .add-review-section h3 {
          margin: 0 0 1rem 0;
        }

        .rating-input {
          margin-bottom: 1rem;
        }

        .rating-input label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .star-rating {
          display: flex;
          gap: 0.5rem;
        }

        .star {
          font-size: 2rem;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }

        .star.active {
          opacity: 1;
        }

        .star:hover {
          opacity: 0.7;
        }

        .review-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid hsl(var(--border));
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          resize: vertical;
          margin-bottom: 1rem;
        }

        .review-textarea:focus {
          outline: none;
          border-color: hsl(280 85% 60%);
        }

        .submit-review-btn {
          width: 100%;
          padding: 0.75rem;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-review-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px hsl(280 85% 60% / 0.4);
        }

        .booking-item.cancelled {
          opacity: 0.6;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .booking-header h3 {
          margin: 0;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-confirmed {
          background: #10b98130;
          color: #10b981;
        }

        .status-pending {
          background: #f59e0b30;
          color: #f59e0b;
        }

        .status-cancelled {
          background: #ef444430;
          color: #ef4444;
        }

        .booking-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid hsl(var(--border));
        }

        .cancel-btn {
          padding: 0.75rem 1.5rem;
          background: #ef444430;
          border: 2px solid #ef4444;
          color: #ef4444;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-2px);
        }

        .cancel-form {
          margin: 1.5rem 0;
          padding: 1rem;
          background: hsl(var(--muted));
          border-radius: 8px;
        }

        .cancel-form label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .cancel-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid hsl(var(--border));
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          resize: vertical;
        }

        .cancel-textarea:focus {
          outline: none;
          border-color: #ef4444;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .keep-btn {
          flex: 1;
          padding: 0.75rem;
          background: hsl(var(--muted));
          border: 2px solid hsl(var(--border));
          color: hsl(var(--foreground));
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .keep-btn:hover {
          border-color: hsl(280 85% 60%);
          color: hsl(280 85% 60%);
        }

        .confirm-cancel-btn {
          flex: 1;
          padding: 0.75rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .confirm-cancel-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .no-results {
          max-width: 600px;
          margin: 3rem auto;
          text-align: center;
          background: white;
          padding: 3rem 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .bookings-section {
          max-width: 1200px;
          margin: 3rem auto;
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .bookings-section h2 {
          margin-bottom: 1.5rem;
        }

        .bookings-list {
          display: grid;
          gap: 1rem;
        }

        .booking-item {
          background: hsl(280 85% 98%);
          padding: 1.5rem;
          border-radius: 10px;
          border-left: 4px solid hsl(280 85% 60%);
        }

        .booking-item h3 {
          margin-bottom: 1rem;
        }

        .booking-details {
          display: grid;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .status-confirmed {
          color: #11998e;
          font-weight: 600;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          max-width: 500px;
          width: 90%;
          text-align: center;
          position: relative;
        }

        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: hsl(var(--muted-foreground));
        }

        .modal-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .booking-summary {
          text-align: left;
          background: hsl(var(--muted));
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .booking-summary p {
          margin: 0.5rem 0;
        }

        .close-btn {
          padding: 0.75rem 2rem;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .provider-booking-page {
            padding: 1rem;
          }

          .back-btn {
            position: static;
            margin-bottom: 1rem;
          }

          .pb-header h1 {
            font-size: 1.8rem;
          }

          .filter-row {
            flex-direction: column;
          }

          .providers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Dashboard.tsx — QuickServIndia Post-Login Dashboard
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import LocationSelector from "@/components/LocationSelector";

interface Brand {
  name: string;
  rating: string;
  reviews: string;
  location: string;
  price?: string;  // Individual brand pricing
  discount?: string; // Optional discount (e.g., "10%", "₹50")
  image?: string; // Brand/service image URL
  verified?: boolean; // Verified provider badge
  responseTime?: string; // Response time (e.g., "Within 30 mins")
}

interface SubOption {
  icon: string;
  label: string;
  price: string;
  duration: string;
  brands?: Brand[]; // Optional for now, will be required once all services have brands
  subTreatments?: string[]; // Sub-options like "Detox Cleanup", "Casmara Cleanup"
}

interface ServiceCard {
  icon: string;
  name: string;
  count: string;
  color: string;
  image: string;
  subOptions: SubOption[];
}

interface Booking {
  id: string;
  serviceName?: string;
  serviceIcon?: string;
  serviceLabel?: string;
  price: string;
  duration: string;
  location?: string;
  date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  // From Find Providers bookings
  image?: string;
  providerName?: string;
  brandName?: string;
  category?: string;
  serviceArea?: string;
  timeSlot?: string;
  bookingDate?: string;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    icon: "⚡",
    name: "InstaHelp",
    count: "150+ providers",
    color: "#ff6b6b", // Vibrant Coral Red
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80",
    subOptions: [
      { 
        icon: "🔧", 
        label: "Quick Repairs", 
        price: "₹199", 
        duration: "30 min",
        brands: [
          { name: "FixIt Fast", rating: "4.8", reviews: "2.3k", location: "Koramangala", price: "₹219", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", verified: true, responseTime: "Within 20 mins" },
          { name: "Rapid Repair Services", rating: "4.7", reviews: "1.8k", location: "Indiranagar", price: "₹199", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "QuickFix Pro", rating: "4.6", reviews: "1.5k", location: "Whitefield", price: "₹189", discount: "₹10", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop", verified: false, responseTime: "Within 45 mins" },
          { name: "Express Repairs", rating: "4.5", reviews: "1.2k", location: "HSR Layout", price: "₹179", discount: "10%", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Swift Solutions", rating: "4.4", reviews: "980", location: "Marathahalli", price: "₹169", discount: "15%", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" }
        ]
      },
      { 
        icon: "�", 
        label: "Emergency Electrician", 
        price: "₹299", 
        duration: "1 hr",
        brands: [
          { name: "PowerUp Electricals", rating: "4.9", reviews: "3.1k", location: "Jayanagar", price: "₹329", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "Spark Solutions", rating: "4.7", reviews: "2.4k", location: "BTM Layout", price: "₹299", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop", verified: true, responseTime: "Within 45 mins" },
          { name: "Volt Masters", rating: "4.6", reviews: "1.9k", location: "Electronic City", price: "₹279", discount: "₹20", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Current Care", rating: "4.5", reviews: "1.6k", location: "Banashankari", price: "₹269", discount: "10%", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" }
        ]
      },
      { 
        icon: "💧", 
        label: "Urgent Plumbing", 
        price: "₹349", 
        duration: "1 hr",
        brands: [
          { name: "FlowFix Plumbers", rating: "4.8", reviews: "2.7k", location: "Malleshwaram", price: "₹379", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "AquaCare Services", rating: "4.7", reviews: "2.2k", location: "Rajajinagar", price: "₹349", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop", verified: true, responseTime: "Within 45 mins" },
          { name: "PipePro Solutions", rating: "4.6", reviews: "1.8k", location: "Yelahanka", price: "₹329", discount: "₹20", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "DrainMaster", rating: "4.5", reviews: "1.4k", location: "Hebbal", price: "₹319", discount: "10%", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "WaterWorks Express", rating: "4.4", reviews: "1.1k", location: "Sarjapur", price: "₹299", discount: "15%", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
      { 
        icon: "🔑", 
        label: "Locksmith Service", 
        price: "₹249", 
        duration: "30–45 min",
        brands: [
          { name: "KeyMaster Services", rating: "4.9", reviews: "3.5k", location: "MG Road", price: "₹279", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop", verified: true, responseTime: "Within 20 mins" },
          { name: "SecureLock Pro", rating: "4.8", reviews: "2.9k", location: "Brigade Road", price: "₹249", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "LockCraft India", rating: "4.7", reviews: "2.3k", location: "Cunningham Road", price: "₹239", discount: "₹10", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop", verified: false, responseTime: "Within 45 mins" },
          { name: "SafeKey Solutions", rating: "4.6", reviews: "1.7k", location: "Richmond Town", price: "₹229", discount: "8%", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" }
        ]
      },
      { 
        icon: "🚪", 
        label: "Door/Window Fix", 
        price: "₹199", 
        duration: "45 min",
        brands: [
          { name: "DoorDoctor Services", rating: "4.7", reviews: "2.1k", location: "Bellandur", price: "₹219", image: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "WindowWorks Pro", rating: "4.6", reviews: "1.8k", location: "Marathahalli", price: "₹199", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop", verified: true, responseTime: "Within 45 mins" },
          { name: "FrameFix Solutions", rating: "4.5", reviews: "1.5k", location: "Whitefield", price: "₹189", discount: "₹10", image: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Portal Repairs", rating: "4.4", reviews: "1.2k", location: "KR Puram", price: "₹179", discount: "10%", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Entry Experts", rating: "4.3", reviews: "950", location: "Hoodi", price: "₹169", discount: "15%", image: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
      { 
        icon: "🛠️", 
        label: "Handyman Service", 
        price: "₹299", 
        duration: "1–2 hrs",
        brands: [
          { name: "AllFix Handyman", rating: "4.8", reviews: "3.2k", location: "Koramangala", price: "₹329", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "TaskMaster Services", rating: "4.7", reviews: "2.6k", location: "HSR Layout", price: "₹299", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "HomeHelper Pro", rating: "4.6", reviews: "2.1k", location: "BTM Layout", price: "₹279", discount: "₹20", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "FixAll Solutions", rating: "4.5", reviews: "1.7k", location: "JP Nagar", price: "₹269", discount: "10%", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
    ],
  },
  {
    icon: "💅",
    name: "Women's Salon & Spa",
    count: "200+ providers",
    color: "#ec4899", // Hot Pink
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop&q=80",
    subOptions: [
      { 
        icon: "✂️", 
        label: "Haircut & Styling", 
        price: "₹299", 
        duration: "45 min",
        subTreatments: ["Layer Cut", "Bob Cut", "Feather Cut", "U-Cut", "V-Cut", "Blunt Cut", "Curly Styling", "Straight Styling"],
        brands: [
          { 
            name: "Glamour Studio", 
            rating: "4.9", 
            reviews: "4.2k", 
            location: "Indiranagar",
            price: "₹329",
            image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
            verified: true,
            responseTime: "Within 30 mins"
          },
          { 
            name: "Tress & Trends", 
            rating: "4.8", 
            reviews: "3.7k", 
            location: "Koramangala",
            price: "₹299",
            image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
            verified: true,
            responseTime: "Within 1 hour"
          },
          { 
            name: "Style Lounge", 
            rating: "4.7", 
            reviews: "3.1k", 
            location: "Whitefield",
            price: "₹279",
            discount: "₹20",
            image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&h=400&fit=crop",
            responseTime: "Within 2 hours"
          },
          { 
            name: "Chic Cuts Salon", 
            rating: "4.6", 
            reviews: "2.5k", 
            location: "HSR Layout",
            price: "₹289",
            discount: "₹10",
            image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
            verified: true,
            responseTime: "Within 1 hour"
          },
          { 
            name: "Beauty Bliss", 
            rating: "4.5", 
            reviews: "2.1k", 
            location: "Jayanagar",
            price: "₹259",
            discount: "15%",
            image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
            responseTime: "Within 3 hours"
          }
        ]
      },
      { 
        icon: "🎨", 
        label: "Hair Coloring", 
        price: "₹999", 
        duration: "2–3 hrs",
        subTreatments: ["Global Color", "Highlights", "Balayage", "Ombre", "Root Touch-up", "Fashion Colors"],
        brands: [
          { name: "Color Craft Studio", rating: "4.9", reviews: "3.8k", location: "MG Road" },
          { name: "Hue & You Salon", rating: "4.8", reviews: "3.2k", location: "Brigade Road" },
          { name: "Palette Hair Studio", rating: "4.7", reviews: "2.7k", location: "Lavelle Road" },
          { name: "Shade Masters", rating: "4.6", reviews: "2.2k", location: "Richmond Town" }
        ]
      },
      { 
        icon: "🧖", 
        label: "Facial & Cleanup", 
        price: "₹599", 
        duration: "1 hr",
        subTreatments: ["Detox Cleanup", "Casmara Cleanup", "Gold Facial", "Diamond Facial", "Fruit Facial", "Anti-Aging Facial"],
        brands: [
          { name: "Glow Spa & Salon", rating: "4.9", reviews: "4.5k", location: "Koramangala" },
          { name: "Radiance Beauty", rating: "4.8", reviews: "3.9k", location: "Indiranagar" },
          { name: "FreshFace Studio", rating: "4.7", reviews: "3.3k", location: "BTM Layout" },
          { name: "Skin Serenity", rating: "4.6", reviews: "2.8k", location: "JP Nagar" },
          { name: "Pure Glow Spa", rating: "4.5", reviews: "2.3k", location: "Banashankari" }
        ]
      },
      { 
        icon: "💅", 
        label: "Manicure & Pedicure", 
        price: "₹449", 
        duration: "1 hr",
        subTreatments: ["Classic Manicure", "Gel Manicure", "French Manicure", "Spa Pedicure", "Gel Pedicure", "Nail Art"],
        brands: [
          { name: "Nail Art Studio", rating: "4.8", reviews: "3.6k", location: "Whitefield" },
          { name: "Polish Perfect", rating: "4.7", reviews: "3.1k", location: "Electronic City" },
          { name: "Mani-Pedi Lounge", rating: "4.6", reviews: "2.6k", location: "Marathahalli" },
          { name: "Nail Nirvana", rating: "4.5", reviews: "2.1k", location: "Bellandur" }
        ]
      },
      { 
        icon: "🪒", 
        label: "Waxing & Threading", 
        price: "₹199", 
        duration: "30 min",
        brands: [
          { name: "Smooth Skin Studio", rating: "4.8", reviews: "4.1k", location: "HSR Layout" },
          { name: "Silky Touch Salon", rating: "4.7", reviews: "3.5k", location: "Koramangala" },
          { name: "Hair-Free Zone", rating: "4.6", reviews: "2.9k", location: "Jayanagar" },
          { name: "Bare Beauty", rating: "4.5", reviews: "2.4k", location: "BTM Layout" },
          { name: "Flawless Finish", rating: "4.4", reviews: "1.9k", location: "JP Nagar" }
        ]
      },
      { 
        icon: "💆", 
        label: "Spa & Massage", 
        price: "₹1299", 
        duration: "1.5–2 hrs",
        subTreatments: ["Swedish Massage", "Deep Tissue", "Aromatherapy", "Hot Stone", "Thai Massage", "Body Scrub"],
        brands: [
          { name: "Serenity Spa", rating: "4.9", reviews: "5.2k", location: "Indiranagar" },
          { name: "Tranquil Touch", rating: "4.8", reviews: "4.6k", location: "Koramangala" },
          { name: "Bliss Wellness Spa", rating: "4.7", reviews: "3.9k", location: "Whitefield" },
          { name: "Zen Massage Studio", rating: "4.6", reviews: "3.3k", location: "MG Road" }
        ]
      },
    ],
  },
  {
    icon: "💇",
    name: "Men's Salon & Massage",
    count: "180+ providers",
    color: "#3b82f6", // Bright Blue
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop&q=80",
    subOptions: [
      { 
        icon: "✂️", 
        label: "Haircut & Beard Trim", 
        price: "₹199", 
        duration: "30 min",
        subTreatments: ["Regular Cut", "Fade Cut", "Undercut", "Crew Cut", "Buzz Cut", "French Beard", "Full Beard Trim", "Goatee"],
        brands: [
          { name: "Gents Grooming Co.", rating: "4.8", reviews: "3.9k", location: "Koramangala", price: "₹219", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "Sharp Cuts Salon", rating: "4.7", reviews: "3.4k", location: "Indiranagar", price: "₹199", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", verified: true, responseTime: "Within 45 mins" },
          { name: "Barber's Den", rating: "4.6", reviews: "2.8k", location: "HSR Layout", price: "₹189", discount: "₹10", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Style Station Men", rating: "4.5", reviews: "2.3k", location: "Whitefield", price: "₹179", discount: "10%", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Trim & Tidy", rating: "4.4", reviews: "1.9k", location: "BTM Layout", price: "₹169", discount: "15%", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
      { 
        icon: "🪒", 
        label: "Shaving & Grooming", 
        price: "₹149", 
        duration: "20 min",
        brands: [
          { name: "Classic Shave Studio", rating: "4.9", reviews: "4.3k", location: "MG Road", price: "₹169", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop", verified: true, responseTime: "Within 20 mins" },
          { name: "Razor Edge Salon", rating: "4.8", reviews: "3.7k", location: "Brigade Road", price: "₹149", image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "Smooth Shave Co.", rating: "4.7", reviews: "3.1k", location: "Jayanagar", price: "₹139", discount: "₹10", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop", verified: false, responseTime: "Within 45 mins" },
          { name: "Groom Masters", rating: "4.6", reviews: "2.6k", location: "Malleshwaram", price: "₹129", discount: "10%", image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" }
        ]
      },
      { 
        icon: "🎨", 
        label: "Hair Coloring", 
        price: "₹599", 
        duration: "1 hr",
        brands: [
          { name: "Men's Color Studio", rating: "4.7", reviews: "2.9k", location: "Koramangala", price: "₹649", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Dye Hard Salon", rating: "4.6", reviews: "2.4k", location: "Indiranagar", price: "₹599", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Shade Shifters", rating: "4.5", reviews: "2.0k", location: "Whitefield", price: "₹579", discount: "₹20", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" },
          { name: "Color Code Men", rating: "4.4", reviews: "1.6k", location: "Electronic City", price: "₹549", discount: "8%", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" },
          { name: "Tint Masters", rating: "4.3", reviews: "1.3k", location: "Marathahalli", price: "₹529", discount: "12%", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" }
        ]
      },
      { 
        icon: "💆", 
        label: "Head Massage", 
        price: "₹249", 
        duration: "30 min",
        brands: [
          { name: "Relax Head Spa", rating: "4.8", reviews: "3.5k", location: "HSR Layout", price: "₹269", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "Scalp Therapy Studio", rating: "4.7", reviews: "3.0k", location: "BTM Layout", price: "₹249", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop", verified: true, responseTime: "Within 45 mins" },
          { name: "Head Relief Center", rating: "4.6", reviews: "2.5k", location: "JP Nagar", price: "₹239", discount: "₹10", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Cranium Care", rating: "4.5", reviews: "2.1k", location: "Banashankari", price: "₹229", discount: "8%", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" }
        ]
      },
      { 
        icon: "🧔", 
        label: "Facial & Cleanup", 
        price: "₹399", 
        duration: "45 min",
        brands: [
          { name: "Men's Glow Studio", rating: "4.7", reviews: "2.8k", location: "Koramangala", price: "₹429", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 45 mins" },
          { name: "FreshFace Men", rating: "4.6", reviews: "2.3k", location: "Indiranagar", price: "₹399", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Skin Revival Men", rating: "4.5", reviews: "1.9k", location: "Whitefield", price: "₹379", discount: "₹20", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Clear Skin Studio", rating: "4.4", reviews: "1.5k", location: "HSR Layout", price: "₹359", discount: "10%", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" },
          { name: "Gents Facial Bar", rating: "4.3", reviews: "1.2k", location: "BTM Layout", price: "₹339", discount: "15%", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
      { 
        icon: "💪", 
        label: "Body Massage", 
        price: "₹899", 
        duration: "1–1.5 hrs",
        subTreatments: ["Sports Massage", "Deep Tissue", "Swedish Massage", "Reflexology", "Back & Shoulder", "Full Body"],
        brands: [
          { name: "Men's Wellness Spa", rating: "4.9", reviews: "4.7k", location: "Indiranagar", price: "₹949", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Power Massage Studio", rating: "4.8", reviews: "4.1k", location: "Koramangala", price: "₹899", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Muscle Relief Center", rating: "4.7", reviews: "3.5k", location: "MG Road", price: "₹879", discount: "₹20", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" },
          { name: "Body Bliss Men", rating: "4.6", reviews: "2.9k", location: "Whitefield", price: "₹849", discount: "6%", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
    ],
  },
  {
    icon: "🧹",
    name: "Cleaning & Pest Control",
    count: "250+ providers",
    color: "#10b981", // Emerald Green
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&h=400&fit=crop&q=80",
    subOptions: [
      { 
        icon: "🏠", 
        label: "Home Deep Cleaning", 
        price: "₹999", 
        duration: "3–5 hrs",
        subTreatments: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Villa", "Studio Apartment"],
        brands: [
          { name: "SparkleHome Services", rating: "4.9", reviews: "5.1k", location: "Koramangala", price: "₹1099", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "CleanPro India", rating: "4.8", reviews: "4.5k", location: "Indiranagar", price: "₹999", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop", verified: true, responseTime: "Within 3 hours" },
          { name: "FreshSpace Cleaners", rating: "4.7", reviews: "3.9k", location: "Whitefield", price: "₹979", discount: "₹20", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" },
          { name: "PureClean Solutions", rating: "4.6", reviews: "3.3k", location: "HSR Layout", price: "₹949", discount: "5%", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" },
          { name: "ShineRight Services", rating: "4.5", reviews: "2.8k", location: "BTM Layout", price: "₹899", discount: "10%", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", verified: false, responseTime: "Within 5 hours" }
        ]
      },
      { 
        icon: "�️", 
        label: "Sofa Cleaning", 
        price: "₹599", 
        duration: "1–2 hrs",
        brands: [
          { name: "SofaCare Experts", rating: "4.8", reviews: "3.7k", location: "Jayanagar", price: "₹649", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "Upholstery Pro", rating: "4.7", reviews: "3.2k", location: "JP Nagar", price: "₹599", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "FabricFresh Services", rating: "4.6", reviews: "2.7k", location: "Banashankari", price: "₹579", discount: "₹20", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "Couch Cleaners", rating: "4.5", reviews: "2.2k", location: "Malleshwaram", price: "₹549", discount: "8%", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" }
        ]
      },
      { 
        icon: "🪟", 
        label: "Kitchen Cleaning", 
        price: "₹799", 
        duration: "2–3 hrs",
        brands: [
          { name: "Kitchen Sparkle", rating: "4.9", reviews: "4.2k", location: "Koramangala", price: "₹849", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "ChefClean Services", rating: "4.8", reviews: "3.6k", location: "Indiranagar", price: "₹799", image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=600&h=400&fit=crop", verified: true, responseTime: "Within 3 hours" },
          { name: "Grease Busters", rating: "4.7", reviews: "3.1k", location: "Whitefield", price: "₹779", discount: "₹20", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "Kitchen Revival", rating: "4.6", reviews: "2.6k", location: "Electronic City", price: "₹749", discount: "6%", image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" },
          { name: "Culinary Clean", rating: "4.5", reviews: "2.1k", location: "Marathahalli", price: "₹719", discount: "10%", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" }
        ]
      },
      { 
        icon: "🐜", 
        label: "Pest Control", 
        price: "₹699", 
        duration: "1–2 hrs",
        subTreatments: ["General Pest Control", "Termite Treatment", "Bed Bug Treatment", "Rodent Control", "Ant Control", "Lizard Control"],
        brands: [
          { name: "PestAway Solutions", rating: "4.9", reviews: "4.8k", location: "HSR Layout", price: "₹749", image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "BugBusters India", rating: "4.8", reviews: "4.2k", location: "BTM Layout", price: "₹699", image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&h=400&fit=crop", verified: true, responseTime: "Within 3 hours" },
          { name: "SafeHome Pest Control", rating: "4.7", reviews: "3.7k", location: "Koramangala", price: "₹679", discount: "₹20", image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "Terminator Services", rating: "4.6", reviews: "3.1k", location: "JP Nagar", price: "₹649", discount: "7%", image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" }
        ]
      },
      { 
        icon: "🦟", 
        label: "Mosquito Control", 
        price: "₹499", 
        duration: "1 hr",
        brands: [
          { name: "MosquitoShield", rating: "4.8", reviews: "3.9k", location: "Indiranagar", price: "₹549", image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "BuzzOff Services", rating: "4.7", reviews: "3.4k", location: "Whitefield", price: "₹499", image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "AntiMosquito Pro", rating: "4.6", reviews: "2.9k", location: "Bellandur", price: "₹479", discount: "₹20", image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "Bite-Free Solutions", rating: "4.5", reviews: "2.4k", location: "Marathahalli", price: "₹459", discount: "8%", image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "Dengue Defense", rating: "4.4", reviews: "1.9k", location: "Sarjapur", price: "₹439", discount: "12%", image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" }
        ]
      },
      { 
        icon: "🪳", 
        label: "Cockroach Treatment", 
        price: "₹599", 
        duration: "1 hr",
        brands: [
          { name: "RoachKill Experts", rating: "4.9", reviews: "4.5k", location: "Koramangala", price: "₹649", image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "CockroachFree Services", rating: "4.8", reviews: "3.9k", location: "HSR Layout", price: "₹599", image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "Insect Terminators", rating: "4.7", reviews: "3.3k", location: "BTM Layout", price: "₹579", discount: "₹20", image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "PestStop Solutions", rating: "4.6", reviews: "2.8k", location: "JP Nagar", price: "₹549", discount: "8%", image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" }
        ]
      },
    ],
  },
  {
    icon: "⚡",
    name: "Electrician",
    count: "320+ providers",
    color: "#f59e0b", // Amber/Gold
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop&q=80",
    subOptions: [
      { 
        icon: "🔌", 
        label: "Wiring & Rewiring", 
        price: "₹599", 
        duration: "2–4 hrs",
        subTreatments: ["Complete House Wiring", "Partial Rewiring", "New Connection", "MCB Installation", "Circuit Repair", "Safety Check"],
        brands: [
          { name: "WireMaster Electricals", rating: "4.9", reviews: "4.3k", location: "Koramangala", price: "₹649", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "Circuit Solutions", rating: "4.8", reviews: "3.8k", location: "Indiranagar", price: "₹599", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop", verified: true, responseTime: "Within 3 hours" },
          { name: "PowerLine Services", rating: "4.7", reviews: "3.2k", location: "Whitefield", price: "₹579", discount: "₹20", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "ElectroWorks Pro", rating: "4.6", reviews: "2.7k", location: "HSR Layout", price: "₹549", discount: "8%", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" },
          { name: "Voltage Experts", rating: "4.5", reviews: "2.2k", location: "BTM Layout", price: "₹519", discount: "13%", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" }
        ]
      },
      { 
        icon: "🔲", 
        label: "Switchboard Repair", 
        price: "₹199", 
        duration: "30 min",
        brands: [
          { name: "SwitchFix Services", rating: "4.8", reviews: "3.5k", location: "Jayanagar", price: "₹219", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "Board Masters", rating: "4.7", reviews: "3.0k", location: "Malleshwaram", price: "₹199", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop", verified: true, responseTime: "Within 45 mins" },
          { name: "Panel Pro", rating: "4.6", reviews: "2.5k", location: "Rajajinagar", price: "₹189", discount: "₹10", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Switch Solutions", rating: "4.5", reviews: "2.0k", location: "Basavanagudi", price: "₹179", discount: "10%", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" }
        ]
      },
      { 
        icon: "💡", 
        label: "Fan / Light Install", 
        price: "₹249", 
        duration: "30–45 min",
        brands: [
          { name: "LightUp Services", rating: "4.8", reviews: "4.1k", location: "Koramangala", price: "₹269", image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 45 mins" },
          { name: "Fan & Light Pro", rating: "4.7", reviews: "3.6k", location: "Indiranagar", price: "₹249", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Fixture Experts", rating: "4.6", reviews: "3.1k", location: "Whitefield", price: "₹239", discount: "₹10", image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Illuminate Solutions", rating: "4.5", reviews: "2.6k", location: "Electronic City", price: "₹229", discount: "8%", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" },
          { name: "Ceiling Care", rating: "4.4", reviews: "2.1k", location: "Marathahalli", price: "₹219", discount: "12%", image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
      { 
        icon: "🔌", 
        label: "Power Backup Setup", 
        price: "₹899", 
        duration: "2–3 hrs",
        brands: [
          { name: "BackupPower Pro", rating: "4.9", reviews: "3.9k", location: "HSR Layout", price: "₹949", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "UPS Masters", rating: "4.8", reviews: "3.4k", location: "BTM Layout", price: "₹899", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop", verified: true, responseTime: "Within 3 hours" },
          { name: "PowerSafe Solutions", rating: "4.7", reviews: "2.9k", location: "JP Nagar", price: "₹879", discount: "₹20", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "Inverter Experts", rating: "4.6", reviews: "2.4k", location: "Banashankari", price: "₹849", discount: "6%", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" }
        ]
      },
      { 
        icon: "📷", 
        label: "CCTV Installation", 
        price: "₹1499", 
        duration: "3–4 hrs",
        brands: [
          { name: "SecureView Systems", rating: "4.9", reviews: "5.2k", location: "Koramangala", price: "₹1599", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&h=400&fit=crop", verified: true, responseTime: "Within 4 hours" },
          { name: "CameraWatch Pro", rating: "4.8", reviews: "4.6k", location: "Indiranagar", price: "₹1499", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop", verified: true, responseTime: "Within 4 hours" },
          { name: "Surveillance Solutions", rating: "4.7", reviews: "4.0k", location: "Whitefield", price: "₹1479", discount: "₹20", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&h=400&fit=crop", verified: false, responseTime: "Within 5 hours" },
          { name: "EyeSpy Security", rating: "4.6", reviews: "3.5k", location: "MG Road", price: "₹1449", discount: "3%", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop", verified: false, responseTime: "Within 5 hours" },
          { name: "SafeGuard CCTV", rating: "4.5", reviews: "3.0k", location: "Brigade Road", price: "₹1399", discount: "7%", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&h=400&fit=crop", verified: false, responseTime: "Within 6 hours" }
        ]
      },
      { 
        icon: "🔧", 
        label: "Appliance Wiring", 
        price: "₹349", 
        duration: "1 hr",
        brands: [
          { name: "ApplianceWire Pro", rating: "4.8", reviews: "3.7k", location: "Electronic City", price: "₹379", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Device Connect", rating: "4.7", reviews: "3.2k", location: "Marathahalli", price: "₹349", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Gadget Electricals", rating: "4.6", reviews: "2.7k", location: "Bellandur", price: "₹329", discount: "₹20", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" },
          { name: "Wire & Connect", rating: "4.5", reviews: "2.2k", location: "Sarjapur", price: "₹309", discount: "11%", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
    ],
  },
  {
    icon: "🔧",
    name: "Plumber & Carpenter",
    count: "280+ providers",
    color: "#06b6d4", // Cyan
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop&q=80",
    subOptions: [
      { 
        icon: "🚿", 
        label: "Pipe Repair", 
        price: "₹299", 
        duration: "1–2 hrs",
        subTreatments: ["Leaking Pipe", "Burst Pipe", "Blocked Drain", "Pipe Replacement", "Joint Repair", "Underground Pipe"],
        brands: [
          { name: "PipeFix Masters", rating: "4.9", reviews: "4.7k", location: "Koramangala", price: "₹329", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "FlowRepair Services", rating: "4.8", reviews: "4.1k", location: "Indiranagar", price: "₹299", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Leak Stoppers", rating: "4.7", reviews: "3.6k", location: "Whitefield", price: "₹289", discount: "₹10", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" },
          { name: "Pipe Doctors", rating: "4.6", reviews: "3.1k", location: "HSR Layout", price: "₹279", discount: "7%", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" },
          { name: "Drain Solutions", rating: "4.5", reviews: "2.6k", location: "BTM Layout", price: "₹269", discount: "10%", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" }
        ]
      },
      { 
        icon: "💧", 
        label: "Leak Detection", 
        price: "₹199", 
        duration: "30–60 min",
        brands: [
          { name: "LeakFinder Pro", rating: "4.9", reviews: "4.4k", location: "Jayanagar", price: "₹229", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: true, responseTime: "Within 45 mins" },
          { name: "Drip Detectives", rating: "4.8", reviews: "3.9k", location: "Malleshwaram", price: "₹199", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Water Leak Experts", rating: "4.7", reviews: "3.4k", location: "Rajajinagar", price: "₹189", discount: "₹10", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Seepage Solutions", rating: "4.6", reviews: "2.9k", location: "Basavanagudi", price: "₹179", discount: "10%", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
      { 
        icon: "🚰", 
        label: "Tap Installation", 
        price: "₹149", 
        duration: "30 min",
        brands: [
          { name: "TapFit Services", rating: "4.8", reviews: "3.8k", location: "Koramangala", price: "₹169", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: true, responseTime: "Within 30 mins" },
          { name: "Faucet Masters", rating: "4.7", reviews: "3.3k", location: "Indiranagar", price: "₹149", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop", verified: true, responseTime: "Within 45 mins" },
          { name: "Tap & Fixture Pro", rating: "4.6", reviews: "2.8k", location: "Whitefield", price: "₹139", discount: "₹10", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Plumbing Plus", rating: "4.5", reviews: "2.3k", location: "Electronic City", price: "₹129", discount: "13%", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop", verified: false, responseTime: "Within 1 hour" },
          { name: "Quick Tap Install", rating: "4.4", reviews: "1.9k", location: "Marathahalli", price: "₹119", discount: "20%", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
      { 
        icon: "🔨", 
        label: "Furniture Assembly", 
        price: "₹499", 
        duration: "1–2 hrs",
        subTreatments: ["Bed Assembly", "Wardrobe Assembly", "Table Assembly", "Chair Assembly", "Shelf Installation", "Cabinet Assembly"],
        brands: [
          { name: "FurnitureFix Pro", rating: "4.9", reviews: "5.0k", location: "HSR Layout", price: "₹549", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "Assembly Masters", rating: "4.8", reviews: "4.4k", location: "BTM Layout", price: "₹499", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "BuildRight Services", rating: "4.7", reviews: "3.9k", location: "JP Nagar", price: "₹479", discount: "₹20", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "Furniture Builders", rating: "4.6", reviews: "3.4k", location: "Banashankari", price: "₹459", discount: "8%", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" }
        ]
      },
      { 
        icon: "🪑", 
        label: "Furniture Repair", 
        price: "₹399", 
        duration: "1 hr",
        brands: [
          { name: "Wood Revival", rating: "4.8", reviews: "4.2k", location: "Koramangala", price: "₹429", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Furniture Doctors", rating: "4.7", reviews: "3.7k", location: "Indiranagar", price: "₹399", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "RestoreWood Services", rating: "4.6", reviews: "3.2k", location: "Whitefield", price: "₹379", discount: "₹20", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" },
          { name: "Chair & Table Fix", rating: "4.5", reviews: "2.7k", location: "MG Road", price: "₹359", discount: "10%", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" },
          { name: "Carpenter's Touch", rating: "4.4", reviews: "2.2k", location: "Brigade Road", price: "₹339", discount: "15%", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" }
        ]
      },
      { 
        icon: "🚪", 
        label: "Door/Cabinet Work", 
        price: "₹599", 
        duration: "2 hrs",
        brands: [
          { name: "Cabinet Craft", rating: "4.9", reviews: "4.6k", location: "Koramangala", price: "₹649", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "Door & Drawer Pro", rating: "4.8", reviews: "4.0k", location: "Indiranagar", price: "₹599", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "Woodwork Masters", rating: "4.7", reviews: "3.5k", location: "Whitefield", price: "₹579", discount: "₹20", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "Carpentry Solutions", rating: "4.6", reviews: "3.0k", location: "HSR Layout", price: "₹549", discount: "8%", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" }
        ]
      },
    ],
  },
  {
    icon: "💧",
    name: "Native Water Purifier",
    count: "120+ providers",
    color: "#14b8a6", // Teal
    image: "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?w=600&h=400&fit=crop&q=80",
    subOptions: [
      { 
        icon: "💧", 
        label: "RO Installation", 
        price: "₹799", 
        duration: "2–3 hrs",
        brands: [
          { name: "AquaPure Systems", rating: "4.9", reviews: "5.6k", location: "Koramangala", price: "₹899", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 3 hours" },
          { name: "RO Masters India", rating: "4.8", reviews: "5.0k", location: "Indiranagar", price: "₹799", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop", verified: true, responseTime: "Within 4 hours" },
          { name: "PureWater Pro", rating: "4.7", reviews: "4.4k", location: "Whitefield", price: "₹779", discount: "₹20", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" },
          { name: "CleanFlow Services", rating: "4.6", reviews: "3.9k", location: "HSR Layout", price: "₹749", discount: "6%", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop", verified: false, responseTime: "Within 5 hours" }
        ]
      },
      { icon: "�️", label: "RO Repair", price: "₹399", duration: "1–2 hrs" },
      { 
        icon: "🔄", 
        label: "Filter Replacement", 
        price: "₹299", 
        duration: "30 min",
        brands: [
          { name: "FilterFix Pro", rating: "4.8", reviews: "5.8k", location: "Koramangala", price: "₹329", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "Filter Masters", rating: "4.7", reviews: "5.2k", location: "Indiranagar", price: "₹299", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop", verified: true, responseTime: "Within 1 hour" },
          { name: "PureFilter Services", rating: "4.6", reviews: "4.6k", location: "Whitefield", price: "₹279", discount: "₹20", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 2 hours" }
        ]
      },
      { icon: "�", label: "Water Testing", price: "₹199", duration: "30 min" },
      { 
        icon: "🧼", 
        label: "Tank Cleaning", 
        price: "₹499", 
        duration: "1–2 hrs",
        brands: [
          { name: "TankClean Pro", rating: "4.9", reviews: "5.4k", location: "Koramangala", price: "₹549", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "Water Tank Masters", rating: "4.8", reviews: "4.8k", location: "Indiranagar", price: "₹499", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop", verified: true, responseTime: "Within 3 hours" },
          { name: "CleanTank Services", rating: "4.7", reviews: "4.2k", location: "Whitefield", price: "₹479", discount: "₹20", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" }
        ]
      },
      { 
        icon: "⚙️", 
        label: "AMC Service", 
        price: "₹1499", 
        duration: "1 hr",
        brands: [
          { name: "AquaCare AMC", rating: "4.9", reviews: "6.7k", location: "Jayanagar", price: "₹1649", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "RO AMC Pro", rating: "4.8", reviews: "6.1k", location: "Malleshwaram", price: "₹1499", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Annual Care Services", rating: "4.7", reviews: "5.5k", location: "Rajajinagar", price: "₹1449", discount: "₹50", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" }
        ]
      },
    ],
  },
  {
    icon: "🎨",
    name: "Painting & Waterproofing",
    count: "160+ providers",
    color: "#8b5cf6", // Purple
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop&q=80",
    subOptions: [
      { 
        icon: "🖌️", 
        label: "Interior Painting", 
        price: "₹1299", 
        duration: "1–2 days",
        subTreatments: ["1 BHK", "2 BHK", "3 BHK", "Single Room", "Living Room", "Kitchen"],
        brands: [
          { name: "ColorCraft Painters", rating: "4.9", reviews: "5.3k", location: "Koramangala", price: "₹1499", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "PaintPro Services", rating: "4.8", reviews: "4.7k", location: "Indiranagar", price: "₹1399", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "WallArt Painters", rating: "4.7", reviews: "4.1k", location: "Whitefield", price: "₹1299", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 48 hours" },
          { name: "HomePaint Solutions", rating: "4.6", reviews: "3.6k", location: "HSR Layout", price: "₹1199", discount: "₹100", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "Budget Painters", rating: "4.5", reviews: "3.1k", location: "BTM Layout", price: "₹1099", discount: "15%", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 days" }
        ]
      },
      { 
        icon: "🏠", 
        label: "Exterior Painting", 
        price: "₹1599", 
        duration: "2–3 days",
        brands: [
          { name: "OutdoorPaint Pro", rating: "4.9", reviews: "4.9k", location: "Jayanagar", price: "₹1799", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Exterior Masters", rating: "4.8", reviews: "4.3k", location: "Malleshwaram", price: "₹1699", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 48 hours" },
          { name: "FacadePaint Services", rating: "4.7", reviews: "3.8k", location: "Rajajinagar", price: "₹1599", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop", verified: true, responseTime: "Within 48 hours" },
          { name: "WallShield Painters", rating: "4.6", reviews: "3.3k", location: "Basavanagudi", price: "₹1499", discount: "₹100", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 days" }
        ]
      },
      { 
        icon: "🌧️", 
        label: "Waterproofing", 
        price: "₹1199", 
        duration: "1 day",
        subTreatments: ["Terrace Waterproofing", "Bathroom Waterproofing", "Balcony Waterproofing", "Wall Waterproofing", "Basement Waterproofing", "Tank Waterproofing"],
        brands: [
          { name: "WaterShield Pro", rating: "4.9", reviews: "5.5k", location: "Koramangala", price: "₹1399", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "LeakStop Services", rating: "4.8", reviews: "4.9k", location: "Indiranagar", price: "₹1299", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "RainGuard Solutions", rating: "4.7", reviews: "4.3k", location: "Whitefield", price: "₹1199", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 48 hours" },
          { name: "DryWall Experts", rating: "4.6", reviews: "3.8k", location: "Electronic City", price: "₹1099", discount: "₹100", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "Waterproof Masters", rating: "4.5", reviews: "3.3k", location: "Marathahalli", price: "₹999", discount: "15%", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 days" }
        ]
      },
      { 
        icon: "🧱", 
        label: "Wall Texture", 
        price: "₹899", 
        duration: "1 day",
        brands: [
          { name: "TextureCraft Studio", rating: "4.8", reviews: "4.4k", location: "HSR Layout", price: "₹1049", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "WallDesign Pro", rating: "4.7", reviews: "3.9k", location: "BTM Layout", price: "₹949", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 48 hours" },
          { name: "Texture Masters", rating: "4.6", reviews: "3.4k", location: "JP Nagar", price: "₹899", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "ArtWall Services", rating: "4.5", reviews: "2.9k", location: "Jayanagar", price: "₹849", discount: "₹50", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 days" }
        ]
      },
      { 
        icon: "🪜", 
        label: "Ceiling Painting", 
        price: "₹799", 
        duration: "1 day",
        brands: [
          { name: "CeilingPro Painters", rating: "4.8", reviews: "4.2k", location: "Koramangala", price: "₹899", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "TopCoat Services", rating: "4.7", reviews: "3.7k", location: "Indiranagar", price: "₹849", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop", verified: true, responseTime: "Within 48 hours" },
          { name: "Overhead Painters", rating: "4.6", reviews: "3.2k", location: "Whitefield", price: "₹799", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "Ceiling Masters", rating: "4.5", reviews: "2.7k", location: "MG Road", price: "₹749", discount: "₹50", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 days" },
          { name: "Budget Ceiling Paint", rating: "4.4", reviews: "2.3k", location: "Brigade Road", price: "₹699", discount: "12%", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 days" }
        ]
      },
      { 
        icon: "🎨", 
        label: "Decorative Painting", 
        price: "₹1499", 
        duration: "2 days",
        brands: [
          { name: "ArtDecor Painters", rating: "4.9", reviews: "5.7k", location: "Indiranagar", price: "₹1799", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "DecorPaint Studio", rating: "4.8", reviews: "5.1k", location: "Koramangala", price: "₹1649", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", verified: true, responseTime: "Within 48 hours" },
          { name: "Creative Walls", rating: "4.7", reviews: "4.5k", location: "Whitefield", price: "₹1499", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop", verified: true, responseTime: "Within 48 hours" },
          { name: "Artistic Painters", rating: "4.6", reviews: "4.0k", location: "HSR Layout", price: "₹1399", discount: "₹100", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 days" }
        ]
      },
    ],
  },
  {
    icon: "❄️",
    name: "AC & Appliance Repair",
    count: "220+ providers",
    color: "#0ea5e9", // Sky Blue
    image: "https://images.unsplash.com/photo-1635274531661-1c5a7212c7f1?w=600&h=400&fit=crop&q=80",
    subOptions: [
      { 
        icon: "❄️", 
        label: "AC Installation", 
        price: "₹999", 
        duration: "2–3 hrs",
        subTreatments: ["Split AC", "Window AC", "Cassette AC", "Ductable AC", "Uninstallation", "Reinstallation"],
        brands: [
          { name: "CoolAir Experts", rating: "4.9", reviews: "5.4k", location: "Koramangala", price: "₹1099", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop", verified: true, responseTime: "Within 3 hours" },
          { name: "AC Masters India", rating: "4.8", reviews: "4.8k", location: "Indiranagar", price: "₹999", image: "https://images.unsplash.com/photo-1631545806609-c2f4e6a61e8d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 4 hours" },
          { name: "ChillZone Services", rating: "4.7", reviews: "4.2k", location: "Whitefield", price: "₹979", discount: "₹20", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" },
          { name: "FrostFix Pro", rating: "4.6", reviews: "3.7k", location: "HSR Layout", price: "₹949", discount: "5%", image: "https://images.unsplash.com/photo-1631545806609-c2f4e6a61e8d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 5 hours" },
          { name: "AirCool Solutions", rating: "4.5", reviews: "3.2k", location: "BTM Layout", price: "₹899", discount: "10%", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop", verified: false, responseTime: "Within 6 hours" }
        ]
      },
      { 
        icon: "🔧", 
        label: "AC Repair", 
        price: "₹499", 
        duration: "1–2 hrs",
        subTreatments: ["Not Cooling", "Water Leakage", "Noise Issue", "Remote Problem", "PCB Repair", "Compressor Issue"],
        brands: [
          { name: "QuickFix AC", rating: "4.9", reviews: "6.1k", location: "Jayanagar", price: "₹549", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "AC Repair Pro", rating: "4.8", reviews: "5.5k", location: "Malleshwaram", price: "₹499", image: "https://images.unsplash.com/photo-1631545806609-c2f4e6a61e8d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "CoolCare Services", rating: "4.7", reviews: "4.9k", location: "Rajajinagar", price: "₹479", discount: "₹20", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "AC Doctor", rating: "4.6", reviews: "4.3k", location: "Basavanagudi", price: "₹449", discount: "10%", image: "https://images.unsplash.com/photo-1631545806609-c2f4e6a61e8d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" }
        ]
      },
      { 
        icon: "🧊", 
        label: "AC Gas Refill", 
        price: "₹699", 
        duration: "1 hr",
        brands: [
          { name: "GasFill Experts", rating: "4.8", reviews: "4.7k", location: "Koramangala", price: "₹749", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "AC Gas Pro", rating: "4.7", reviews: "4.1k", location: "Indiranagar", price: "₹699", image: "https://images.unsplash.com/photo-1631545806609-c2f4e6a61e8d?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "RefillMaster", rating: "4.6", reviews: "3.6k", location: "Whitefield", price: "₹679", discount: "₹20", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "CoolGas Services", rating: "4.5", reviews: "3.1k", location: "Electronic City", price: "₹649", discount: "7%", image: "https://images.unsplash.com/photo-1631545806609-c2f4e6a61e8d?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "AC Refill Zone", rating: "4.4", reviews: "2.7k", location: "Marathahalli", price: "₹629", discount: "10%", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" }
        ]
      },
      { 
        icon: "📺", 
        label: "TV Repair", 
        price: "₹399", 
        duration: "1 hr",
        brands: [
          { name: "ScreenFix Pro", rating: "4.8", reviews: "5.2k", location: "HSR Layout", price: "₹449", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "TV Repair Masters", rating: "4.7", reviews: "4.6k", location: "BTM Layout", price: "₹399", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "Display Doctors", rating: "4.6", reviews: "4.0k", location: "JP Nagar", price: "₹379", discount: "₹20", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "TV Care Services", rating: "4.5", reviews: "3.5k", location: "Banashankari", price: "₹359", discount: "10%", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" }
        ]
      },
      { 
        icon: "🌀", 
        label: "Washing Machine", 
        price: "₹449", 
        duration: "1–2 hrs",
        brands: [
          { name: "WashFix Experts", rating: "4.9", reviews: "5.8k", location: "Koramangala", price: "₹499", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "Laundry Machine Pro", rating: "4.8", reviews: "5.2k", location: "Indiranagar", price: "₹449", image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=600&h=400&fit=crop", verified: true, responseTime: "Within 3 hours" },
          { name: "Washer Repair Hub", rating: "4.7", reviews: "4.6k", location: "Whitefield", price: "₹429", discount: "₹20", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "SpinCare Services", rating: "4.6", reviews: "4.0k", location: "MG Road", price: "₹409", discount: "9%", image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" },
          { name: "Washing Machine Clinic", rating: "4.5", reviews: "3.5k", location: "Brigade Road", price: "₹389", discount: "13%", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" }
        ]
      },
      { 
        icon: "❄️", 
        label: "Refrigerator Repair", 
        price: "₹599", 
        duration: "1–2 hrs",
        brands: [
          { name: "FridgeFix Pro", rating: "4.9", reviews: "6.3k", location: "Jayanagar", price: "₹649", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=400&fit=crop", verified: true, responseTime: "Within 2 hours" },
          { name: "Refrigerator Masters", rating: "4.8", reviews: "5.7k", location: "Malleshwaram", price: "₹599", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&h=400&fit=crop", verified: true, responseTime: "Within 3 hours" },
          { name: "CoolBox Repair", rating: "4.7", reviews: "5.1k", location: "Rajajinagar", price: "₹579", discount: "₹20", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 hours" },
          { name: "Fridge Care Services", rating: "4.6", reviews: "4.5k", location: "Basavanagudi", price: "₹549", discount: "8%", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&h=400&fit=crop", verified: false, responseTime: "Within 4 hours" }
        ]
      },
    ],
  },
  {
    icon: "🎨",
    name: "Wall Makeover by Revamp",
    count: "95+ providers",
    color: "#f43f5e", // Rose/Pink-Red
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop&q=80",
    subOptions: [
      { 
        icon: "🖼️", 
        label: "Wall Art & Murals", 
        price: "₹2499", 
        duration: "1–2 days",
        brands: [
          { name: "ArtWall Studio", rating: "4.9", reviews: "4.8k", location: "Indiranagar", price: "₹2699", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Mural Masters", rating: "4.8", reviews: "4.2k", location: "Koramangala", price: "₹2499", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Creative Walls", rating: "4.7", reviews: "3.7k", location: "Whitefield", price: "₹2399", discount: "₹100", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "Wall Art Pro", rating: "4.6", reviews: "3.2k", location: "MG Road", price: "₹2299", discount: "8%", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" }
        ]
      },
      { 
        icon: "🏢", 
        label: "3D Wall Panels", 
        price: "₹1999", 
        duration: "1 day",
        brands: [
          { name: "3D Wall Experts", rating: "4.9", reviews: "5.1k", location: "Koramangala", price: "₹2199", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Panel Pro Services", rating: "4.8", reviews: "4.5k", location: "Indiranagar", price: "₹1999", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Dimension Walls", rating: "4.7", reviews: "3.9k", location: "HSR Layout", price: "₹1899", discount: "₹100", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "3D Design Studio", rating: "4.6", reviews: "3.4k", location: "BTM Layout", price: "₹1799", discount: "10%", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "Panel Masters", rating: "4.5", reviews: "2.9k", location: "JP Nagar", price: "₹1699", discount: "15%", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 days" }
        ]
      },
      { 
        icon: "🎨", 
        label: "Wallpaper Installation", 
        price: "₹1299", 
        duration: "1 day",
        brands: [
          { name: "Wallpaper Pro", rating: "4.8", reviews: "5.5k", location: "Jayanagar", price: "₹1399", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Paper & Paste", rating: "4.7", reviews: "4.9k", location: "Malleshwaram", price: "₹1299", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Wall Cover Experts", rating: "4.6", reviews: "4.3k", location: "Rajajinagar", price: "₹1249", discount: "₹50", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "Wallpaper Masters", rating: "4.5", reviews: "3.8k", location: "Basavanagudi", price: "₹1199", discount: "8%", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" }
        ]
      },
      { 
        icon: "✨", 
        label: "Decorative Finishes", 
        price: "₹1799", 
        duration: "1–2 days",
        brands: [
          { name: "Finish Masters", rating: "4.9", reviews: "4.6k", location: "Koramangala", price: "₹1949", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Decorative Pro", rating: "4.8", reviews: "4.0k", location: "Indiranagar", price: "₹1799", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Texture & Finish", rating: "4.7", reviews: "3.5k", location: "Whitefield", price: "₹1749", discount: "₹50", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "Elite Finishes", rating: "4.6", reviews: "3.0k", location: "Electronic City", price: "₹1649", discount: "8%", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "Decor Finish Studio", rating: "4.5", reviews: "2.6k", location: "Marathahalli", price: "₹1549", discount: "14%", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: false, responseTime: "Within 3 days" }
        ]
      },
      { 
        icon: "🪞", 
        label: "Mirror & Glass Work", 
        price: "₹999", 
        duration: "4–6 hrs",
        brands: [
          { name: "Glass Masters", rating: "4.8", reviews: "4.4k", location: "MG Road", price: "₹1099", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: true, responseTime: "Within 6 hours" },
          { name: "Mirror Pro Services", rating: "4.7", reviews: "3.8k", location: "Brigade Road", price: "₹999", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: true, responseTime: "Within 6 hours" },
          { name: "Reflect & Shine", rating: "4.6", reviews: "3.3k", location: "Cunningham Road", price: "₹949", discount: "₹50", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: false, responseTime: "Within 8 hours" },
          { name: "Glass & Mirror Hub", rating: "4.5", reviews: "2.8k", location: "Richmond Town", price: "₹899", discount: "10%", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: false, responseTime: "Within 8 hours" }
        ]
      },
      { 
        icon: "💎", 
        label: "Premium Wall Design", 
        price: "₹3499", 
        duration: "2–3 days",
        brands: [
          { name: "Luxury Wall Studio", rating: "4.9", reviews: "3.9k", location: "Indiranagar", price: "₹3799", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Premium Design Co.", rating: "4.8", reviews: "3.3k", location: "Koramangala", price: "₹3499", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: true, responseTime: "Within 24 hours" },
          { name: "Elite Wall Designs", rating: "4.7", reviews: "2.8k", location: "Whitefield", price: "₹3299", discount: "₹200", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" },
          { name: "Signature Walls", rating: "4.6", reviews: "2.4k", location: "MG Road", price: "₹3199", discount: "9%", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop", verified: false, responseTime: "Within 48 hours" }
        ]
      },
    ],
  },
];

const OFFERS = [
  {
    id: 1,
    title: "First Booking Offer",
    discount: "30% OFF",
    description: "Get 30% off on your first service booking",
    code: "FIRST30",
    color: "hsl(280 85% 60%)",
    icon: "🎉"
  },
  {
    id: 2,
    title: "Weekend Special",
    discount: "20% OFF",
    description: "Book any salon service on weekends",
    code: "WEEKEND20",
    color: "hsl(330 85% 65%)",
    icon: "✨"
  },
  {
    id: 3,
    title: "Cleaning Combo",
    discount: "₹500 OFF",
    description: "Deep cleaning + Pest control combo",
    code: "CLEAN500",
    color: "hsl(160 75% 50%)",
    icon: "🧹"
  },
  {
    id: 4,
    title: "AC Service Deal",
    discount: "15% OFF",
    description: "AC installation & repair services",
    code: "AC15",
    color: "hsl(195 85% 55%)",
    icon: "❄️"
  }
];

const NEW_NOTEWORTHY = [
  {
    id: 1,
    title: "Premium Wall Makeover",
    description: "Transform your walls with 3D panels and artistic murals",
    service: "Wall Makeover by Revamp",
    icon: "🎨",
    badge: "NEW",
    color: "hsl(340 80% 60%)"
  },
  {
    id: 2,
    title: "Native Water Purifier",
    description: "RO installation, repair & AMC services now available",
    service: "Native Water Purifier",
    icon: "💧",
    badge: "TRENDING",
    color: "hsl(190 85% 55%)"
  },
  {
    id: 3,
    title: "InstaHelp Services",
    description: "Quick emergency repairs and handyman services",
    service: "InstaHelp",
    icon: "⚡",
    badge: "POPULAR",
    color: "hsl(15 100% 60%)"
  }
];

const MOST_BOOKED = [
  {
    id: 1,
    icon: "💇",
    name: "Women's Salon & Spa",
    bookings: "2,847",
    rating: "4.9",
    color: "hsl(330 85% 65%)"
  },
  {
    id: 2,
    icon: "🧹",
    name: "Cleaning & Pest Control",
    bookings: "2,341",
    rating: "4.8",
    color: "hsl(160 75% 50%)"
  },
  {
    id: 3,
    icon: "❄️",
    name: "AC & Appliance Repair",
    bookings: "1,923",
    rating: "4.7",
    color: "hsl(195 85% 55%)"
  },
  {
    id: 4,
    icon: "🔧",
    name: "Plumber & Carpenter",
    bookings: "1,756",
    rating: "4.8",
    color: "hsl(200 80% 55%)"
  },
  {
    id: 5,
    icon: "⚡",
    name: "Electrician",
    bookings: "1,542",
    rating: "4.7",
    color: "hsl(45 100% 55%)"
  },
  {
    id: 6,
    icon: "💇",
    name: "Men's Salon & Massage",
    bookings: "1,389",
    rating: "4.6",
    color: "hsl(210 85% 60%)"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [activeService, setActiveService] = useState<ServiceCard | null>(null);
  const [bookedItem, setBookedItem] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [showBookings, setShowBookings] = useState(false);
  const [pageLoadTime] = useState(Date.now());
  
  // Booking form states
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<SubOption | null>(null);
  const [bookingLocation, setBookingLocation] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [availableServices, setAvailableServices] = useState<SubOption[]>([]);
  const [showAvailableServices, setShowAvailableServices] = useState(false);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<typeof OFFERS[0] | null>(null);
  const [couponError, setCouponError] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  // Search bar states
  const [searchInput, setSearchInput] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredServices, setFilteredServices] = useState<ServiceCard[]>([]);

  // Function to get starting price for a service option
  function getStartingPrice(option: SubOption): string {
    if (!option.brands || option.brands.length === 0) {
      return option.price;
    }
    
    const prices = option.brands
      .map(brand => {
        const priceStr = brand.price || option.price;
        return parseInt(priceStr.replace(/[^0-9]/g, ''));
      })
      .filter(price => !isNaN(price));
    
    if (prices.length === 0) {
      return option.price;
    }
    
    const minPrice = Math.min(...prices);
    return `Starting from ₹${minPrice}`;
  }

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) { navigate("/login"); return; }
    setUserName(user.name);
    setUserId(user.id);
    
    // Log DASHBOARD_VIEW activity
    if (user.id) {
      fetch('http://localhost:8080/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { id: user.id },
          activityType: 'DASHBOARD_VIEW',
          activityDescription: `User ${user.name} viewed dashboard`,
          deviceInfo: navigator.userAgent
        })
      }).catch(err => console.error('Failed to log activity:', err));
    }
    
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem("qs_bookings");
    if (savedBookings) {
      setMyBookings(JSON.parse(savedBookings));
    }
    
    // Track time spent on page
    return () => {
      if (user.id) {
        const timeSpent = Math.floor((Date.now() - pageLoadTime) / 1000);
        fetch('http://localhost:8080/api/activities/with-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: { id: user.id },
            activityType: 'DASHBOARD_VIEW',
            activityDescription: `Spent ${timeSpent} seconds on dashboard`,
            timeSpentSeconds: timeSpent,
            deviceInfo: navigator.userAgent
          })
        }).catch(err => console.error('Failed to log time:', err));
      }
    };
  }, [navigate, pageLoadTime]);

  function handleLogout() {
    // Log LOGOUT activity before logging out
    if (userId) {
      fetch('http://localhost:8080/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { id: userId },
          activityType: 'LOGOUT',
          activityDescription: `User ${userName} logged out`,
          deviceInfo: navigator.userAgent
        })
      }).catch(err => console.error('Failed to log logout:', err));
    }
    
    logoutUser();
    navigate("/login");
  }

  function openModal(service: ServiceCard) {
    setBookedItem(null);
    setActiveService(service);
    setShowBookingForm(false);
    setSelectedService(null);
    // Scroll to top when modal opens
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeModal() {
    setActiveService(null);
    setBookedItem(null);
    setShowBookingForm(false);
    setSelectedService(null);
    setBookingLocation("");
    setLocationError("");
    setSearchQuery("");
  }

  function handleBookClick(opt: SubOption) {
    // Navigate to brands page instead of showing booking form
    navigate("/service-brands", {
      state: {
        serviceName: activeService?.name,
        serviceIcon: activeService?.icon,
        serviceColor: activeService?.color,
        option: opt
      }
    });
  }

  // Apply coupon function
  function applyCoupon() {
    setCouponError("");
    
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    // Find matching coupon
    const coupon = OFFERS.find(offer => 
      offer.code.toUpperCase() === couponCode.toUpperCase()
    );

    if (!coupon) {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      setFinalPrice(originalPrice);
      return;
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount.includes('%')) {
      // Percentage discount
      const percentage = parseInt(coupon.discount);
      discountAmount = (originalPrice * percentage) / 100;
    } else {
      // Fixed amount discount
      discountAmount = parseInt(coupon.discount.replace(/[^0-9]/g, ''));
    }

    // Round off the final price to nearest integer
    const newPrice = Math.round(Math.max(0, originalPrice - discountAmount));
    setFinalPrice(newPrice);
    setAppliedCoupon(coupon);
    setCouponError("");
  }

  // Remove coupon
  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setFinalPrice(originalPrice);
    setCouponError("");
  }

  function handleLocationChange(location: { city: string; state: string }) {
    setCurrentLocation(`${location.city}, ${location.state}`);
  }

  // Detect location for booking form
  async function detectBookingLocation() {
    setIsDetectingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          
          if (!response.ok) throw new Error("Failed to fetch location");
          
          const data = await response.json();
          const address = data.address;
          
          const locationStr = `${address.city || address.town || address.village || "Unknown"}, ${address.state || "Unknown"}`;
          setBookingLocation(locationStr);
          setLocationError("");
          
          // Filter and display available services for the detected location
          filterServicesByLocation(locationStr);
        } catch (err) {
          setLocationError("Failed to fetch location details. Please enter manually.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please enter manually.");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable. Please enter manually.");
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;
          default:
            setLocationError("Error detecting location. Please enter manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  // Popular cities for manual selection
  const CITIES = [
    "Mumbai, Maharashtra",
    "Delhi, Delhi",
    "Bangalore, Karnataka",
    "Hyderabad, Telangana",
    "Chennai, Tamil Nadu",
    "Kolkata, West Bengal",
    "Pune, Maharashtra",
    "Ahmedabad, Gujarat",
  ];

  const filteredCities = CITIES.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function selectCity(city: string) {
    setBookingLocation(city);
    setSearchQuery("");
    setShowLocationDropdown(false);
    setLocationError("");
    
    // Filter and display available services for the selected location
    filterServicesByLocation(city);
  }

  // Filter services based on selected location
  function filterServicesByLocation(location: string) {
    const cityName = location.split(",")[0].trim();
    const available: SubOption[] = [];
    
    // Go through all service cards and their sub-options
    SERVICE_CARDS.forEach(serviceCard => {
      serviceCard.subOptions.forEach(subOption => {
        if (subOption.brands && subOption.brands.length > 0) {
          // Check if any brand serves this location
          const brandsInLocation = subOption.brands.filter(brand =>
            brand.location.toLowerCase().includes(cityName.toLowerCase()) ||
            cityName.toLowerCase().includes(brand.location.toLowerCase())
          );
          
          if (brandsInLocation.length > 0) {
            // Add this service with filtered brands
            available.push({
              ...subOption,
              brands: brandsInLocation
            });
          }
        }
      });
    });
    
    setAvailableServices(available);
    setShowAvailableServices(available.length > 0);
  }

  function confirmBooking() {
    if (!bookingLocation.trim()) {
      setLocationError("Please select or enter your location");
      return;
    }
    
    // Create new booking with final price
    const newBooking: Booking = {
      id: Date.now().toString(),
      serviceName: activeService?.name || "",
      serviceIcon: selectedService?.icon || "",
      serviceLabel: selectedService?.label || "",
      price: `₹${finalPrice}`,  // Use final price after discount
      duration: selectedService?.duration || "",
      location: bookingLocation,
      date: new Date().toLocaleDateString("en-IN", { 
        day: "numeric", 
        month: "short", 
        year: "numeric" 
      }),
      status: "pending"
    };
    
    // Save to state and localStorage
    const updatedBookings = [...myBookings, newBooking];
    setMyBookings(updatedBookings);
    localStorage.setItem("qs_bookings", JSON.stringify(updatedBookings));
    
    setBookedItem(selectedService?.label || null);
    setShowBookingForm(false);
    
    // Reset coupon states
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
  }

  function cancelBooking(bookingId: string) {
    const updatedBookings = myBookings.filter(booking => booking.id !== bookingId);
    setMyBookings(updatedBookings);
    localStorage.setItem("qs_bookings", JSON.stringify(updatedBookings));
  }

  // Search functionality
  function handleSearchInput(value: string) {
    setSearchInput(value);
    if (value.trim().length > 0) {
      const filtered = SERVICE_CARDS.filter(service =>
        service.name.toLowerCase().includes(value.toLowerCase()) ||
        service.subOptions.some(sub => 
          sub.label.toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredServices(filtered);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setFilteredServices([]);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (filteredServices.length > 0) {
      openModal(filteredServices[0]);
      setSearchInput("");
      setShowSearchResults(false);
    }
  }

  function selectSearchResult(service: ServiceCard) {
    openModal(service);
    setSearchInput("");
    setShowSearchResults(false);
  }

  return (
    <div className="db-root">
      {/* ── Navbar ── */}
      <header className="db-nav">
        <div className="db-nav-left">
          <div className="db-logo">⚡ QuickServIndia</div>
          <span className="db-greeting">Hi, {userName.split(" ")[0]} 👋</span>
          <button onClick={handleLogout} className="db-logout-btn">Logout</button>
        </div>
        <div className="db-nav-right">
          <LocationSelector onLocationChange={handleLocationChange} />
          <button 
            onClick={() => navigate("/provider-booking")} 
            className="db-provider-btn"
            title="Advanced Provider Booking"
          >
            � Find Providers
          </button>
          <button 
            onClick={() => setShowBookings(!showBookings)} 
            className="db-bookings-btn"
            title="My Bookings"
          >
            📋 My Bookings {myBookings.length > 0 && <span className="booking-badge">{myBookings.length}</span>}
          </button>
        </div>
      </header>

      <main className="db-main animate-fade-in">
        {/* Hero */}
        <section className="db-hero">
          <div className="db-hero-content">
            <h1 className="db-hero-title">What service do you need today?</h1>
            <p className="db-hero-sub">
              {currentLocation 
                ? `Discover and book trusted local professionals in ${currentLocation}.`
                : "Discover and book trusted local professionals near you."}
            </p>
            <form onSubmit={handleSearchSubmit} className="db-search-bar-wrapper">
              <div className="db-search-bar">
                <span className="db-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search for a service or professional…"
                  className="db-search-input"
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => navigate("/service-search")}
                  onClick={() => navigate("/service-search")}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setShowSearchResults(false);
                    }}
                    className="db-search-clear"
                  >
                    ✕
                  </button>
                )}
                <button type="button" onClick={() => navigate("/service-search")} className="db-search-btn">Search</button>
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && filteredServices.length > 0 && (
                <div className="search-results-dropdown">
                  <p className="search-results-label">
                    {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                  </p>
                  {filteredServices.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => selectSearchResult(service)}
                      className="search-result-item"
                      type="button"
                    >
                      <span className="search-result-icon">{service.icon}</span>
                      <div className="search-result-info">
                        <span className="search-result-name">{service.name}</span>
                        <span className="search-result-count">{service.count}</span>
                      </div>
                      <span className="search-result-arrow">→</span>
                    </button>
                  ))}
                </div>
              )}

              {showSearchResults && searchInput && filteredServices.length === 0 && (
                <div className="search-results-dropdown">
                  <div className="search-no-results">
                    <span className="search-no-results-icon">🔍</span>
                    <p className="search-no-results-text">No services found</p>
                    <p className="search-no-results-hint">Try searching for "plumbing", "salon", or "cleaning"</p>
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className="db-hero-decoration"></div>
        </section>

        {/* Statistics Cards */}
        <section className="db-stats">
          <div className="stat-card stat-card-purple animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">213+</div>
              <div className="stat-label">Service Providers</div>
            </div>
          </div>
          <div className="stat-card stat-card-blue animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">1,847</div>
              <div className="stat-label">Bookings Completed</div>
            </div>
          </div>
          <div className="stat-card stat-card-pink animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">4.8/5</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
          <div className="stat-card stat-card-green animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </section>

        {/* Provider Finder Options */}
        <section className="db-section">
          <h2 className="db-section-title">🔍 Find Service Providers</h2>
          <div className="provider-finder-options">
            <div className="finder-card" onClick={() => navigate("/simple-provider-view")}>
              <div className="finder-icon">📋</div>
              <h3>Simple Provider View</h3>
              <p>View providers by location with timings and price range</p>
              <ul className="finder-features">
                <li>✓ Search by city</li>
                <li>✓ View timings</li>
                <li>✓ See price ranges</li>
                <li>✓ Beginner-friendly</li>
              </ul>
              <button className="finder-btn">Open Simple View →</button>
            </div>

            <div className="finder-card" onClick={() => navigate("/provider-booking")}>
              <div className="finder-icon">⚡</div>
              <h3>Advanced Booking System</h3>
              <p>Full-featured booking with time slots and dynamic pricing</p>
              <ul className="finder-features">
                <li>✓ Time slot selection</li>
                <li>✓ Dynamic pricing</li>
                <li>✓ Instant booking</li>
                <li>✓ Booking history</li>
              </ul>
              <button className="finder-btn">Open Advanced View →</button>
            </div>

            <div className="finder-card" onClick={() => navigate("/service-search")}>
              <div className="finder-icon">🔍</div>
              <h3>Service Search</h3>
              <p>Real-time search across 25+ service providers</p>
              <ul className="finder-features">
                <li>✓ Instant search results</li>
                <li>✓ Filter by location</li>
                <li>✓ Compare prices</li>
                <li>✓ View ratings</li>
              </ul>
              <button className="finder-btn">Search Services →</button>
            </div>
          </div>
        </section>

        {/* Service categories */}
        <section className="db-section">
          <h2 className="db-section-title">Popular Services</h2>
          <div className="db-grid">
            {SERVICE_CARDS.map((s, idx) => (
              <button
                key={s.name}
                className="db-card animate-scale-in"
                style={{ 
                  '--card-accent': s.color,
                  animationDelay: `${0.1 * idx}s`
                } as React.CSSProperties}
                onClick={() => openModal(s)}
              >
                <div className="db-card-image" style={{ backgroundImage: `url(${s.image})` }}>
                  <div className="db-card-overlay"></div>
                  <span className="db-card-icon-large">{s.icon}</span>
                </div>
                <div className="db-card-content">
                  <span className="db-card-name">{s.name}</span>
                  <span className="db-card-count">{s.count}</span>
                  <span className="db-card-arrow">View options →</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Offers & Discounts */}
        <section className="db-section">
          <h2 className="db-section-title">🎁 Offers & Discounts</h2>
          <div className="offers-grid">
            {OFFERS.map((offer, idx) => (
              <div
                key={offer.id}
                className="offer-card animate-scale-in"
                style={{ 
                  '--offer-color': offer.color,
                  animationDelay: `${0.1 * idx}s`
                } as React.CSSProperties}
              >
                <div className="offer-icon">{offer.icon}</div>
                <div className="offer-content">
                  <div className="offer-discount">{offer.discount}</div>
                  <h3 className="offer-title">{offer.title}</h3>
                  <p className="offer-description">{offer.description}</p>
                  <div className="offer-code">
                    <span className="offer-code-label">Code:</span>
                    <span className="offer-code-value">{offer.code}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New & Noteworthy */}
        <section className="db-section">
          <h2 className="db-section-title">⭐ New & Noteworthy</h2>
          <div className="noteworthy-grid">
            {NEW_NOTEWORTHY.map((item, idx) => (
              <div
                key={item.id}
                className="noteworthy-card animate-slide-up"
                style={{ 
                  '--noteworthy-color': item.color,
                  animationDelay: `${0.1 * idx}s`
                } as React.CSSProperties}
              >
                <div className="noteworthy-badge">{item.badge}</div>
                <div className="noteworthy-icon">{item.icon}</div>
                <h3 className="noteworthy-title">{item.title}</h3>
                <p className="noteworthy-description">{item.description}</p>
                <div className="noteworthy-service">{item.service}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Most Booked Services */}
        <section className="db-section">
          <h2 className="db-section-title">🔥 Most Booked Services</h2>
          <div className="most-booked-grid">
            {MOST_BOOKED.map((service, idx) => (
              <div
                key={service.id}
                className="most-booked-card animate-scale-in"
                style={{ 
                  '--booked-color': service.color,
                  animationDelay: `${0.1 * idx}s`
                } as React.CSSProperties}
              >
                <div className="most-booked-rank">#{idx + 1}</div>
                <div className="most-booked-icon">{service.icon}</div>
                <div className="most-booked-info">
                  <h3 className="most-booked-name">{service.name}</h3>
                  <div className="most-booked-stats">
                    <span className="most-booked-bookings">📊 {service.bookings} bookings</span>
                    <span className="most-booked-rating">⭐ {service.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info banner */}
        <div className="db-info-banner animate-slide-up">
          🎉 You're logged in! This is a demo dashboard for the QuickServIndia college mini-project.
          Auth data is stored in your browser's <code>localStorage</code>.
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="db-footer">
        <div className="footer-content">
          <div className="footer-section footer-about">
            <h3 className="footer-logo">⚡ QuickServIndia</h3>
            <p className="footer-description">
              Your trusted platform for booking professional home services. 
              We connect you with verified service providers across India.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
              <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Become a Partner</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              <li><a href="#">Home Cleaning</a></li>
              <li><a href="#">Salon & Spa</a></li>
              <li><a href="#">Repairs & Maintenance</a></li>
              <li><a href="#">Painting & Renovation</a></li>
              <li><a href="#">All Services</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Refund Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Contact Info</h4>
            <div className="footer-contact">
              <p className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Mumbai, Maharashtra, India</span>
              </p>
              <p className="contact-item">
                <span className="contact-icon">📧</span>
                <span>support@quickservindia.com</span>
              </p>
              <p className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+91 1800-123-4567</span>
              </p>
              <p className="contact-item">
                <span className="contact-icon">⏰</span>
                <span>24/7 Customer Support</span>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 QuickServIndia. All rights reserved. | Made with ❤️ for connecting homes with professionals
          </p>
        </div>
      </footer>

      {/* ── Sub-options Modal ── */}
      {activeService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-sheet animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="modal-header"
              style={{ background: activeService.color }}
            >
              <div className="modal-header-left">
                <span className="modal-header-icon">{activeService.icon}</span>
                <div>
                  <h2 className="modal-title">{activeService.name}</h2>
                  <p className="modal-subtitle">{activeService.count} available near you</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>
            </div>

            {/* Success booking banner */}
            {bookedItem && !showBookingForm && (
              <div className="modal-booked-banner">
                ✅ <strong>{bookedItem}</strong> booked! A provider will contact you shortly.
              </div>
            )}

            {/* Booking Form */}
            {showBookingForm && selectedService ? (
              <div className="modal-body booking-form-container">
                <button 
                  onClick={() => setShowBookingForm(false)} 
                  className="back-btn"
                >
                  ← Back to services
                </button>

                <div className="booking-form">
                  <h3 className="booking-form-title">Complete Your Booking</h3>
                  
                  {/* Service Details */}
                  <div className="booking-section">
                    <p className="booking-section-label">Service Details</p>
                    <div className="service-summary">
                      <span className="service-summary-icon">{selectedService.icon}</span>
                      <div className="service-summary-info">
                        <p className="service-summary-name">{selectedService.label}</p>
                        <p className="service-summary-meta">
                          ⏱ {selectedService.duration} • {selectedService.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="booking-section">
                    <p className="booking-section-label">Service Location</p>
                    
                    {/* Use Current Location Button */}
                    <button
                      onClick={detectBookingLocation}
                      disabled={isDetectingLocation}
                      className="detect-location-btn"
                      type="button"
                    >
                      {isDetectingLocation ? (
                        <>
                          <span className="location-spinner"></span>
                          Detecting location...
                        </>
                      ) : (
                        <>
                          <span className="location-icon">📍</span>
                          Use Current Location
                        </>
                      )}
                    </button>

                    {/* Manual Location Input with Dropdown */}
                    <div style={{ position: 'relative' }}>
                      <div className="location-input-wrapper">
                        <span className="input-icon">📍</span>
                        <input
                          type="text"
                          placeholder="Enter your city or area..."
                          value={bookingLocation || searchQuery}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (bookingLocation) {
                              setBookingLocation(val);
                            } else {
                              setSearchQuery(val);
                              setShowLocationDropdown(val.length > 0);
                            }
                          }}
                          onFocus={() => {
                            if (!bookingLocation && searchQuery) {
                              setShowLocationDropdown(true);
                            }
                          }}
                          className="location-input"
                        />
                        {bookingLocation && (
                          <button
                            onClick={() => {
                              setBookingLocation("");
                              setSearchQuery("");
                            }}
                            className="clear-location-btn"
                            type="button"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Location Dropdown */}
                      {showLocationDropdown && !bookingLocation && (
                        <div className="location-suggestions">
                          {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <button
                                key={city}
                                onClick={() => selectCity(city)}
                                className="location-suggestion-item"
                                type="button"
                              >
                                📍 {city}
                              </button>
                            ))
                          ) : (
                            <p className="no-suggestions">No cities found</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Location Error */}
                    {locationError && (
                      <div className="location-error-inline">
                        ⚠️ {locationError}
                      </div>
                    )}
                    
                    {/* Available Services in Selected Location */}
                    {showAvailableServices && availableServices.length > 0 && (
                      <div className="available-services-section">
                        <h4 className="available-services-title">
                          ✨ Available Services in {bookingLocation.split(",")[0]}
                        </h4>
                        <p className="available-services-count">
                          Found {availableServices.length} service{availableServices.length > 1 ? 's' : ''} available
                        </p>
                        <div className="available-services-grid">
                          {availableServices.map((service, index) => (
                            <div key={index} className="available-service-card">
                              <div className="available-service-header">
                                <span className="available-service-icon">{service.icon}</span>
                                <div>
                                  <h5 className="available-service-name">{service.label}</h5>
                                  <p className="available-service-meta">
                                    {service.price} • {service.duration}
                                  </p>
                                </div>
                              </div>
                              <p className="available-service-providers">
                                {service.brands?.length || 0} provider{(service.brands?.length || 0) > 1 ? 's' : ''} available
                              </p>
                              {service.brands && service.brands.length > 0 && (
                                <div className="available-service-brands">
                                  {service.brands.slice(0, 3).map((brand, bidx) => (
                                    <div key={bidx} className="mini-brand-card">
                                      <span className="mini-brand-name">{brand.name}</span>
                                      <span className="mini-brand-rating">⭐ {brand.rating}</span>
                                    </div>
                                  ))}
                                  {service.brands.length > 3 && (
                                    <p className="more-brands">+{service.brands.length - 3} more</p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Coupon Section */}
                  <div className="booking-section">
                    <h4 className="booking-section-title">🎟️ Apply Coupon Code</h4>
                    
                    {!appliedCoupon ? (
                      <div className="coupon-input-wrapper">
                        <input
                          type="text"
                          placeholder="Enter coupon code (e.g., FIRST30)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="coupon-input"
                        />
                        <button
                          onClick={applyCoupon}
                          className="apply-coupon-btn"
                          type="button"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="applied-coupon-card">
                        <div className="applied-coupon-info">
                          <span className="applied-coupon-icon">{appliedCoupon.icon}</span>
                          <div>
                            <p className="applied-coupon-title">{appliedCoupon.title}</p>
                            <p className="applied-coupon-discount">{appliedCoupon.discount}</p>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="remove-coupon-btn"
                          type="button"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {couponError && (
                      <div className="coupon-error">
                        ⚠️ {couponError}
                      </div>
                    )}

                    {/* Available Coupons */}
                    {!appliedCoupon && (
                      <div className="available-coupons">
                        <p className="available-coupons-label">Available Coupons:</p>
                        <div className="coupon-chips">
                          {OFFERS.map((offer) => (
                            <button
                              key={offer.code}
                              onClick={() => {
                                setCouponCode(offer.code);
                                setCouponError("");
                              }}
                              className="coupon-chip"
                              type="button"
                            >
                              {offer.icon} {offer.code} - {offer.discount}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="price-summary">
                    <div className="price-row">
                      <span>Service Price:</span>
                      <span>₹{originalPrice}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="price-row discount-row">
                        <span>Discount ({appliedCoupon.code}):</span>
                        <span className="discount-amount">- ₹{originalPrice - finalPrice}</span>
                      </div>
                    )}
                    <div className="price-row total-row">
                      <span>Total Amount:</span>
                      <span className="total-price">₹{finalPrice}</span>
                    </div>
                  </div>

                  {/* Booking Actions */}
                  <div className="booking-actions">
                    <button
                      onClick={confirmBooking}
                      className="confirm-booking-btn"
                      style={{ background: activeService.color }}
                    >
                      Confirm Booking • ₹{finalPrice}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Sub-option list */
              <div className="modal-body">
                <p className="modal-body-label">Select a service type:</p>
                <div className="modal-options-grid">
                  {activeService.subOptions.map((opt) => (
                    <div key={opt.label} className="modal-option-card">
                      <div className="modal-opt-left">
                        <span className="modal-opt-icon">{opt.icon}</span>
                        <div>
                          <p className="modal-opt-label">{opt.label}</p>
                          <p className="modal-opt-meta">⏱ {opt.duration}</p>
                          {opt.brands && opt.brands.length > 0 && (
                            <p className="modal-opt-brands">
                              🏢 {opt.brands.length} providers available
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="modal-opt-right">
                        <span
                          className="modal-opt-price"
                          style={{ color: activeService.color }}
                        >
                          {getStartingPrice(opt)}
                        </span>
                        <button
                          className="modal-book-btn"
                          style={{
                            background: activeService.color,
                          }}
                          onClick={() => handleBookClick(opt)}
                        >
                          View Providers →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── My Bookings Modal ── */}
      {showBookings && (
        <div className="modal-overlay" onClick={() => setShowBookings(false)}>
          <div
            className="modal-sheet bookings-modal animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header" style={{ background: "var(--gradient-primary)" }}>
              <div className="modal-header-left">
                <span className="modal-header-icon">📋</span>
                <div>
                  <h2 className="modal-title">My Bookings</h2>
                  <p className="modal-subtitle">{myBookings.length} booking{myBookings.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowBookings(false)} aria-label="Close">✕</button>
            </div>

            <div className="modal-body">
              {myBookings.length === 0 ? (
                <div className="no-bookings">
                  <span className="no-bookings-icon">📭</span>
                  <p className="no-bookings-text">No bookings yet</p>
                  <p className="no-bookings-hint">Book a service to see it here</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {myBookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-card-container">
                        {booking.image ? (
                          <div className="booking-image" style={{ backgroundImage: `url(${booking.image})` }}></div>
                        ) : (
                          <div className="booking-image-placeholder">
                            {booking.serviceIcon || "🔧"}
                          </div>
                        )}
                        <div className="booking-card-content">
                          <div className="booking-header">
                            <div className="booking-info">
                              <h3 className="booking-service-name">{booking.serviceName || booking.category}</h3>
                              <p className="booking-service-label">{booking.serviceLabel || booking.providerName}</p>
                            </div>
                            <span className={`booking-status booking-status-${booking.status}`}>
                              {booking.status === "pending" && "⏳ Pending"}
                              {booking.status === "confirmed" && "✅ Confirmed"}
                              {booking.status === "completed" && "✓ Completed"}
                              {booking.status === "cancelled" && "✕ Cancelled"}
                            </span>
                          </div>
                          <div className="booking-details">
                            {booking.providerName && (
                              <div className="booking-detail-item">
                                <span className="booking-detail-icon">🏢</span>
                                <span className="booking-detail-text"><strong>Provider:</strong> {booking.providerName}</span>
                              </div>
                            )}
                            {booking.brandName && (
                              <div className="booking-detail-item">
                                <span className="booking-detail-icon">🎫</span>
                                <span className="booking-detail-text"><strong>Brand:</strong> {booking.brandName}</span>
                              </div>
                            )}
                            <div className="booking-detail-item">
                              <span className="booking-detail-icon">📍</span>
                              <span className="booking-detail-text"><strong>Location:</strong> {booking.location || booking.serviceArea}</span>
                            </div>
                            {booking.timeSlot && (
                              <div className="booking-detail-item">
                                <span className="booking-detail-icon">🕐</span>
                                <span className="booking-detail-text"><strong>Time:</strong> {booking.timeSlot}</span>
                              </div>
                            )}
                            <div className="booking-detail-item">
                              <span className="booking-detail-icon">📅</span>
                              <span className="booking-detail-text"><strong>Date:</strong> {booking.date || booking.bookingDate}</span>
                            </div>
                            {booking.duration && (
                              <div className="booking-detail-item">
                                <span className="booking-detail-icon">⏱</span>
                                <span className="booking-detail-text"><strong>Duration:</strong> {booking.duration}</span>
                              </div>
                            )}
                            <div className="booking-detail-item">
                              <span className="booking-detail-icon">💰</span>
                              <span className="booking-detail-text booking-price"><strong>Price:</strong> ₹{booking.price}</span>
                            </div>
                          </div>
                          <div className="booking-actions">
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              className="cancel-booking-btn"
                              title="Cancel Booking"
                            >
                              ✕ Cancel Booking
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }
        
        .db-root {
          min-height: 100vh;
          background: linear-gradient(135deg, hsl(250 30% 98%) 0%, hsl(240 40% 97%) 100%);
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          max-width: 100vw;
          width: 100%;
        }

        /* ── Navbar ── */
        .db-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 2.5rem;
          background: hsl(var(--card));
          border-bottom: 1px solid hsl(var(--border));
          box-shadow: 0 4px 20px hsl(280 85% 60% / 0.08);
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(12px);
          gap: 1rem;
        }
        .db-nav-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-shrink: 0;
        }
        .db-logo {
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: 1.5rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-shrink: 0;
        }
        .db-nav-right { 
          display: flex; 
          align-items: center; 
          gap: 1rem;
          flex-wrap: wrap;
        }
        .db-greeting { 
          font-size: 0.95rem; 
          font-weight: 600; 
          color: hsl(var(--foreground));
          display: flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
        }
        .db-logout-btn {
          padding: 0.6rem 1.4rem;
          border: 2px solid hsl(280 85% 60%);
          border-radius: calc(var(--radius) - 4px);
          background: white;
          color: hsl(280 85% 60%);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }
        .db-logout-btn:hover { 
          background: hsl(280 85% 60%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 25px hsl(280 85% 60% / 0.3);
        }
        .db-logout-btn:active { transform: translateY(0); }

        .db-bookings-btn {
          padding: 0.6rem 1.4rem;
          border: 2px solid hsl(280 85% 60%);
          border-radius: calc(var(--radius) - 4px);
          background: white;
          color: hsl(280 85% 60%);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .db-bookings-btn:hover {
          background: hsl(280 85% 60%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 25px hsl(280 85% 60% / 0.3);
        }

        .db-provider-btn {
          padding: 0.6rem 1.4rem;
          border: 2px solid hsl(210 100% 60%);
          border-radius: calc(var(--radius) - 4px);
          background: white;
          color: hsl(210 100% 60%);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .db-provider-btn:hover {
          background: hsl(210 100% 60%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 25px hsl(210 100% 60% / 0.3);
        }

        .booking-badge {
          background: hsl(0 85% 60%);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 12px;
          min-width: 20px;
          text-align: center;
        }

        /* ── Main ── */
        .db-main {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .db-hero {
          background: var(--gradient-hero);
          border-radius: var(--radius);
          padding: 3rem 2.5rem;
          color: hsl(var(--brand-foreground));
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px hsl(280 85% 60% / 0.25);
        }
        .db-hero-decoration {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: hsl(0 0% 100% / 0.1);
          top: -100px;
          right: -100px;
          animation: float 6s ease-in-out infinite;
        }
        .db-hero-content {
          position: relative;
          z-index: 1;
        }
        .db-hero-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          margin: 0 0 0.75rem;
          line-height: 1.2;
        }
        .db-hero-sub { 
          font-size: 1.1rem; 
          opacity: 0.95; 
          margin: 0 0 2rem;
          font-weight: 400;
        }
        .db-search-bar-wrapper {
          position: relative;
          max-width: 650px;
          width: 100%;
        }
        .db-search-bar {
          display: flex;
          align-items: center;
          background: hsl(var(--card));
          border-radius: calc(var(--radius) - 2px);
          overflow: hidden;
          box-shadow: 0 8px 30px hsl(0 0% 0% / 0.2);
          transition: all 0.3s;
          position: relative;
        }
        .db-search-bar:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px hsl(0 0% 0% / 0.25);
        }
        .db-search-bar:focus-within {
          box-shadow: 0 12px 40px hsl(280 85% 60% / 0.3);
        }
        .db-search-icon { 
          padding: 0 1rem; 
          font-size: 1.2rem;
          color: hsl(var(--muted-foreground));
          flex-shrink: 0;
        }
        .db-search-input {
          flex: 1;
          padding: 1rem 0.5rem;
          border: none;
          outline: none;
          font-size: 1rem;
          background: transparent;
          color: hsl(var(--foreground));
          font-weight: 500;
        }
        .db-search-input::placeholder {
          color: hsl(var(--muted-foreground));
          opacity: 0.7;
        }
        .db-search-clear {
          background: hsl(var(--muted));
          border: none;
          color: hsl(var(--muted-foreground));
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          margin-right: 0.5rem;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .db-search-clear:hover {
          background: hsl(var(--destructive) / 0.2);
          color: hsl(var(--destructive));
          transform: rotate(90deg);
        }
        .db-search-btn {
          padding: 1rem 2rem;
          background: var(--gradient-primary);
          color: hsl(var(--primary-foreground));
          border: none;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .db-search-btn:hover { 
          filter: brightness(1.1);
        }

        /* Search Results Dropdown */
        .search-results-dropdown {
          position: absolute;
          top: calc(100% + 0.75rem);
          left: 0;
          right: 0;
          background: hsl(var(--card));
          border: 2px solid hsl(var(--border));
          border-radius: var(--radius);
          box-shadow: 0 20px 60px hsl(0 0% 0% / 0.2);
          max-height: 400px;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 50;
          animation: slideDown 0.3s ease-out;
          max-width: 100%;
        }
        .search-results-label {
          padding: 0.75rem 1.25rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--muted-foreground));
          margin: 0;
          border-bottom: 1px solid hsl(var(--border));
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          padding: 1rem 1.25rem;
          background: none;
          border: none;
          border-bottom: 1px solid hsl(var(--border));
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        .search-result-item:last-child {
          border-bottom: none;
        }
        .search-result-item:hover {
          background: hsl(var(--primary) / 0.08);
        }
        .search-result-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }
        .search-result-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .search-result-name {
          font-weight: 700;
          font-size: 1rem;
          color: hsl(var(--foreground));
        }
        .search-result-count {
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
        }
        .search-result-arrow {
          font-size: 1.2rem;
          color: hsl(var(--primary));
          opacity: 0;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .search-result-item:hover .search-result-arrow {
          opacity: 1;
          transform: translateX(4px);
        }

        /* No Results */
        .search-no-results {
          padding: 3rem 2rem;
          text-align: center;
        }
        .search-no-results-icon {
          font-size: 3rem;
          opacity: 0.3;
          display: block;
          margin-bottom: 1rem;
        }
        .search-no-results-text {
          font-weight: 700;
          font-size: 1.1rem;
          color: hsl(var(--foreground));
          margin: 0 0 0.5rem;
        }
        .search-no-results-hint {
          font-size: 0.9rem;
          color: hsl(var(--muted-foreground));
          margin: 0;
        }

        /* ── Statistics Cards ── */
        .db-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          width: 100%;
          max-width: 100%;
        }
        .stat-card {
          background: hsl(var(--card));
          border-radius: var(--radius);
          padding: 1.75rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border: 2px solid transparent;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.05;
          transition: opacity 0.3s;
        }
        .stat-card-purple::before { background: var(--gradient-primary); }
        .stat-card-blue::before { background: var(--gradient-secondary); }
        .stat-card-pink::before { background: var(--gradient-warm); }
        .stat-card-green::before { background: var(--gradient-success); }
        
        .stat-card:hover {
          transform: translateY(-5px);
          border-color: currentColor;
        }
        .stat-card:hover::before { opacity: 0.1; }
        
        .stat-card-purple { 
          box-shadow: 0 8px 30px hsl(280 85% 60% / 0.15);
          color: hsl(280 85% 60%);
        }
        .stat-card-purple:hover { box-shadow: 0 12px 40px hsl(280 85% 60% / 0.25); }
        
        .stat-card-blue { 
          box-shadow: 0 8px 30px hsl(210 100% 60% / 0.15);
          color: hsl(210 100% 60%);
        }
        .stat-card-blue:hover { box-shadow: 0 12px 40px hsl(210 100% 60% / 0.25); }
        
        .stat-card-pink { 
          box-shadow: 0 8px 30px hsl(330 85% 65% / 0.15);
          color: hsl(330 85% 65%);
        }
        .stat-card-pink:hover { box-shadow: 0 12px 40px hsl(330 85% 65% / 0.25); }
        
        .stat-card-green { 
          box-shadow: 0 8px 30px hsl(160 75% 50% / 0.15);
          color: hsl(160 75% 50%);
        }
        .stat-card-green:hover { box-shadow: 0 12px 40px hsl(160 75% 50% / 0.25); }
        
        .stat-icon {
          font-size: 3rem;
          line-height: 1;
          position: relative;
          z-index: 1;
        }
        .stat-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }
        .stat-value {
          font-family: 'Poppins', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.25rem;
          color: hsl(var(--foreground));
        }
        .stat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ── Section ── */
        .db-section-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 1.5rem;
          color: hsl(var(--foreground));
        }

        /* ── Provider Finder Options ── */
        .provider-finder-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .finder-card {
          background: white;
          border: 2px solid hsl(var(--border));
          border-radius: var(--radius);
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .finder-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .finder-card:hover::before {
          transform: scaleX(1);
        }

        .finder-card:hover {
          border-color: hsl(280 85% 60%);
          box-shadow: 0 12px 35px hsl(280 85% 60% / 0.2);
          transform: translateY(-5px);
        }

        .finder-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .finder-card h3 {
          font-size: 1.3rem;
          color: hsl(var(--foreground));
          margin-bottom: 0.75rem;
        }

        .finder-card p {
          color: hsl(var(--muted-foreground));
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .finder-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
        }

        .finder-features li {
          padding: 0.5rem 0;
          color: hsl(var(--muted-foreground));
          font-size: 0.95rem;
        }

        .finder-btn {
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

        .finder-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px hsl(280 85% 60% / 0.4);
        }

        /* ── Service Grid ── */
        .db-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
        }
        .db-card {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0;
          background: hsl(var(--card));
          border: 2px solid hsl(var(--border));
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .db-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: var(--card-accent);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 2;
        }
        .db-card:hover::before { opacity: 1; }
        .db-card:hover {
          border-color: var(--card-accent);
          box-shadow: 0 12px 35px color-mix(in srgb, var(--card-accent) 25%, transparent);
          transform: translateY(-5px);
        }
        
        .db-card-image {
          position: relative;
          height: 160px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .db-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--card-accent) 0%, color-mix(in srgb, var(--card-accent) 70%, transparent) 100%);
          opacity: 0.85;
          z-index: 1;
        }
        .db-card-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 70%);
        }
        .db-card-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s;
          z-index: 2;
        }
        .db-card:hover .db-card-image::after {
          transform: translateX(100%);
        }
        
        .db-card-icon-large {
          font-size: 4rem;
          position: relative;
          z-index: 3;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
          transition: transform 0.3s;
        }
        .db-card:hover .db-card-icon-large {
          transform: scale(1.15) rotate(5deg);
        }
        
        .db-card-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
        }
        
        .db-card-name { 
          font-weight: 700; 
          font-size: 1rem; 
          color: hsl(var(--foreground));
        }
        .db-card-count { 
          font-size: 0.8rem; 
          color: hsl(var(--muted-foreground));
        }
        .db-card-arrow {
          font-size: 0.75rem;
          color: var(--card-accent);
          font-weight: 700;
          margin-top: 0.25rem;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .db-card:hover .db-card-arrow { opacity: 1; }

        /* ── Info banner ── */
        .db-info-banner {
          background: linear-gradient(135deg, hsl(280 40% 96%), hsl(250 40% 95%));
          border: 2px solid hsl(280 85% 60% / 0.2);
          border-radius: var(--radius);
          padding: 1.25rem 1.5rem;
          font-size: 0.95rem;
          color: hsl(var(--foreground));
          line-height: 1.7;
        }
        .db-info-banner code {
          background: hsl(var(--muted));
          padding: 0.15em 0.5em;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 600;
          color: hsl(280 85% 60%);
        }

        /* ── Offers & Discounts ── */
        .offers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          width: 100%;
          max-width: 100%;
        }
        .offer-card {
          background: white;
          border: 2px solid hsl(var(--border));
          border-radius: var(--radius);
          padding: 1.5rem;
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .offer-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--offer-color);
        }
        .offer-card:hover {
          border-color: var(--offer-color);
          box-shadow: 0 12px 35px color-mix(in srgb, var(--offer-color) 25%, transparent);
          transform: translateY(-5px);
        }
        .offer-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .offer-card:hover .offer-icon {
          transform: scale(1.1) rotate(5deg);
        }
        .offer-content {
          flex: 1;
        }
        .offer-discount {
          display: inline-block;
          background: var(--offer-color);
          color: white;
          font-weight: 800;
          font-size: 1.1rem;
          padding: 0.4rem 0.9rem;
          border-radius: calc(var(--radius) - 4px);
          margin-bottom: 0.75rem;
        }
        .offer-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin: 0 0 0.5rem 0;
        }
        .offer-description {
          font-size: 0.9rem;
          color: hsl(var(--muted-foreground));
          margin: 0 0 0.75rem 0;
          line-height: 1.5;
        }
        .offer-code {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: hsl(var(--muted));
          border-radius: calc(var(--radius) - 4px);
          border: 1px dashed var(--offer-color);
          width: fit-content;
        }
        .offer-code-label {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          font-weight: 600;
        }
        .offer-code-value {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--offer-color);
          font-family: 'Courier New', monospace;
        }

        /* ── New & Noteworthy ── */
        .noteworthy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          width: 100%;
          max-width: 100%;
        }
        .noteworthy-card {
          background: white;
          border: 2px solid hsl(var(--border));
          border-radius: var(--radius);
          padding: 2rem 1.75rem;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .noteworthy-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--noteworthy-color);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .noteworthy-card:hover {
          border-color: var(--noteworthy-color);
          box-shadow: 0 12px 35px color-mix(in srgb, var(--noteworthy-color) 25%, transparent);
          transform: translateY(-5px);
        }
        .noteworthy-card:hover::after {
          opacity: 0.05;
        }
        .noteworthy-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--noteworthy-color);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.35rem 0.75rem;
          border-radius: 12px;
          letter-spacing: 0.05em;
          z-index: 1;
        }
        .noteworthy-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
          transition: transform 0.3s;
        }
        .noteworthy-card:hover .noteworthy-icon {
          transform: scale(1.15);
        }
        .noteworthy-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin: 0 0 0.75rem 0;
          position: relative;
          z-index: 1;
        }
        .noteworthy-description {
          font-size: 0.95rem;
          color: hsl(var(--muted-foreground));
          margin: 0 0 1rem 0;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }
        .noteworthy-service {
          display: inline-block;
          background: var(--noteworthy-color);
          color: white;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.5rem 1rem;
          border-radius: calc(var(--radius) - 4px);
          position: relative;
          z-index: 1;
        }

        /* ── Most Booked Services ── */
        .most-booked-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
        }
        .most-booked-card {
          background: white;
          border: 2px solid hsl(var(--border));
          border-radius: var(--radius);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .most-booked-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--booked-color);
        }
        .most-booked-card:hover {
          border-color: var(--booked-color);
          box-shadow: 0 12px 35px color-mix(in srgb, var(--booked-color) 25%, transparent);
          transform: translateY(-3px);
        }
        .most-booked-rank {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: var(--booked-color);
          color: white;
          font-size: 0.85rem;
          font-weight: 800;
          padding: 0.35rem 0.65rem;
          border-radius: 8px;
          min-width: 32px;
          text-align: center;
        }
        .most-booked-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .most-booked-card:hover .most-booked-icon {
          transform: scale(1.15);
        }
        .most-booked-info {
          flex: 1;
        }
        .most-booked-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin: 0 0 0.6rem 0;
          padding-right: 2rem;
        }
        .most-booked-stats {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .most-booked-bookings {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          font-weight: 600;
        }
        .most-booked-rating {
          font-size: 0.85rem;
          color: hsl(45 100% 45%);
          font-weight: 700;
        }

        /* ── Footer ── */
        .db-footer {
          background: linear-gradient(135deg, hsl(250 30% 15%), hsl(280 40% 20%));
          color: hsl(0 0% 90%);
          padding: 3rem 2rem 1.5rem;
          margin-top: 4rem;
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          gap: 2.5rem;
          margin-bottom: 2.5rem;
          width: 100%;
        }
        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-logo {
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: 1.5rem;
          background: linear-gradient(135deg, hsl(280 85% 70%), hsl(330 85% 75%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.75rem 0;
        }
        .footer-description {
          font-size: 0.9rem;
          line-height: 1.6;
          color: hsl(0 0% 75%);
          margin: 0 0 1rem 0;
        }
        .footer-social {
          display: flex;
          gap: 0.75rem;
        }
        .social-link {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: hsl(0 0% 100% / 0.1);
          border-radius: 8px;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .social-link:hover {
          background: var(--gradient-primary);
          transform: translateY(-3px);
          box-shadow: 0 6px 20px hsl(280 85% 60% / 0.4);
        }
        .footer-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.5rem 0;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-links a {
          color: hsl(0 0% 75%);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .footer-links a:hover {
          color: hsl(280 85% 70%);
          transform: translateX(5px);
        }
        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: hsl(0 0% 75%);
          margin: 0;
          line-height: 1.5;
        }
        .contact-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 2rem;
          border-top: 1px solid hsl(0 0% 100% / 0.1);
          text-align: center;
        }
        .footer-copyright {
          font-size: 0.85rem;
          color: hsl(0 0% 65%);
          margin: 0;
        }

        /* ─────────────────────────────────────
           MODAL
        ───────────────────────────────────── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: hsl(240 30% 15% / 0.6);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0;
          animation: fadeIn 0.3s ease-out;
          overflow-x: hidden;
          overflow-y: auto;
        }
        @media (min-width: 640px) {
          .modal-overlay { align-items: center; padding: 1.5rem; }
        }

        .modal-sheet {
          background: hsl(var(--card));
          width: 100%;
          max-width: 680px;
          max-width: min(680px, 100vw);
          overflow-x: hidden;
          border-radius: var(--radius) var(--radius) 0 0;
          overflow: hidden;
          box-shadow: 0 -10px 60px hsl(0 0% 0% / 0.3);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 640px) {
          .modal-sheet {
            border-radius: var(--radius);
            max-height: 85vh;
          }
        }

        /* Modal header */
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.75rem 2rem;
          color: #fff;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .modal-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
          opacity: 0.9;
        }
        .modal-header-left { 
          display: flex; 
          align-items: center; 
          gap: 1rem;
          position: relative;
          z-index: 1;
        }
        .modal-header-icon { 
          font-size: 2.5rem;
          filter: drop-shadow(0 2px 8px hsl(0 0% 0% / 0.2));
        }
        .modal-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0;
          color: #fff;
          text-shadow: 0 2px 8px hsl(0 0% 0% / 0.2);
        }
        .modal-subtitle { 
          font-size: 0.85rem; 
          margin: 0.25rem 0 0; 
          opacity: 0.9;
        }
        .modal-close {
          background: hsl(0 0% 100% / 0.25);
          border: none;
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          font-weight: 700;
        }
        .modal-close:hover { 
          background: hsl(0 0% 100% / 0.4);
          transform: rotate(90deg);
        }

        /* Booking success banner */
        .modal-booked-banner {
          background: linear-gradient(135deg, hsl(142 76% 45% / 0.15), hsl(160 75% 50% / 0.15));
          border-bottom: 2px solid hsl(142 76% 45% / 0.3);
          color: hsl(142 76% 35%);
          padding: 0.9rem 2rem;
          font-size: 0.95rem;
          font-weight: 600;
          flex-shrink: 0;
          animation: slideDown 0.4s ease-out;
        }

        /* Modal body */
        .modal-body {
          padding: 1.75rem 2rem 2rem;
          overflow-y: auto;
          flex: 1;
        }
        .modal-body-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0 0 1.25rem;
        }

        /* Options grid */
        .modal-options-grid {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .modal-option-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border: 2px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          background: hsl(var(--background));
          gap: 1rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .modal-option-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: currentColor;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .modal-option-card:hover {
          border-color: currentColor;
          box-shadow: 0 8px 25px color-mix(in srgb, currentColor 20%, transparent);
          transform: translateX(5px);
        }
        .modal-option-card:hover::before {
          opacity: 0.03;
        }

        .modal-opt-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 0;
          position: relative;
          z-index: 1;
        }
        .modal-opt-icon { 
          font-size: 1.75rem; 
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .modal-option-card:hover .modal-opt-icon {
          transform: scale(1.15);
        }
        .modal-opt-label {
          font-weight: 700;
          font-size: 1rem;
          color: hsl(var(--foreground));
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .modal-opt-meta {
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
          margin: 0.15rem 0 0;
          font-weight: 500;
        }

        .modal-opt-right {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .modal-opt-price {
          font-weight: 800;
          font-size: 1.1rem;
          white-space: nowrap;
          font-family: 'Poppins', sans-serif;
        }
        .modal-book-btn {
          padding: 0.55rem 1.2rem;
          color: #fff;
          border: none;
          border-radius: calc(var(--radius) - 4px);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          box-shadow: 0 4px 15px currentColor;
          box-shadow: 0 4px 15px color-mix(in srgb, currentColor 30%, transparent);
        }
        .modal-book-btn:hover { 
          transform: translateY(-2px);
          box-shadow: 0 6px 20px color-mix(in srgb, currentColor 40%, transparent);
        }
        .modal-book-btn:active { transform: translateY(0); }

        /* ─────────────────────────────────────
           BOOKING FORM
        ───────────────────────────────────── */
        .booking-form-container {
          padding: 1.5rem 2rem 2rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: hsl(var(--primary));
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.5rem 0;
          margin-bottom: 1.5rem;
          transition: all 0.2s;
        }
        .back-btn:hover {
          gap: 0.75rem;
          color: hsl(var(--primary-dark));
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .booking-form-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          color: hsl(var(--foreground));
        }

        .booking-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .booking-section-label {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: hsl(var(--muted-foreground));
          margin: 0;
        }

        /* Service Summary */
        .service-summary {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
        }
        .service-summary-icon {
          font-size: 2.5rem;
          line-height: 1;
        }
        .service-summary-info {
          flex: 1;
        }
        .service-summary-name {
          font-weight: 700;
          font-size: 1.05rem;
          color: hsl(var(--foreground));
          margin: 0 0 0.25rem;
        }
        .service-summary-meta {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          margin: 0;
          font-weight: 500;
        }

        /* Location Detection Button */
        .detect-location-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.85rem 1rem;
          background: linear-gradient(135deg, hsl(280 85% 60%), hsl(250 85% 65%));
          color: white;
          border: none;
          border-radius: calc(var(--radius) - 4px);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px hsl(280 85% 60% / 0.25);
        }
        .detect-location-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px hsl(280 85% 60% / 0.35);
        }
        .detect-location-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .location-icon {
          font-size: 1.1rem;
        }
        .location-spinner {
          width: 16px;
          height: 16px;
          border: 2.5px solid hsl(0 0% 100% / 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Location Input */
        .location-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          font-size: 1.1rem;
          pointer-events: none;
        }
        .location-input {
          width: 100%;
          padding: 0.95rem 1rem 0.95rem 3rem;
          border: 2px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 4px);
          font-size: 0.95rem;
          font-weight: 500;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          outline: none;
          transition: all 0.3s;
        }
        .location-input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 4px hsl(var(--primary) / 0.1);
        }
        .location-input::placeholder {
          color: hsl(var(--muted-foreground));
          opacity: 0.6;
        }
        .clear-location-btn {
          position: absolute;
          right: 0.75rem;
          background: hsl(var(--muted));
          border: none;
          color: hsl(var(--muted-foreground));
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          transition: all 0.2s;
        }
        .clear-location-btn:hover {
          background: hsl(var(--destructive) / 0.2);
          color: hsl(var(--destructive));
        }

        /* Location Suggestions Dropdown */
        .location-suggestions {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          right: 0;
          background: hsl(var(--card));
          border: 2px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 4px);
          box-shadow: 0 8px 25px hsl(0 0% 0% / 0.15);
          max-height: 240px;
          overflow-y: auto;
          z-index: 10;
          animation: slideDown 0.3s ease-out;
        }
        .location-suggestion-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.85rem 1rem;
          background: none;
          border: none;
          border-bottom: 1px solid hsl(var(--border));
          text-align: left;
          font-size: 0.9rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          cursor: pointer;
          transition: all 0.2s;
        }
        .location-suggestion-item:last-child {
          border-bottom: none;
        }
        .location-suggestion-item:hover {
          background: hsl(var(--primary) / 0.08);
          color: hsl(var(--primary));
        }
        .no-suggestions {
          padding: 1.5rem;
          text-align: center;
          color: hsl(var(--muted-foreground));
          font-size: 0.9rem;
          margin: 0;
        }

        /* Location Error Inline */
        .location-error-inline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: hsl(var(--destructive) / 0.08);
          border: 1px solid hsl(var(--destructive) / 0.3);
          border-radius: calc(var(--radius) - 4px);
          color: hsl(var(--destructive));
          font-size: 0.85rem;
          font-weight: 600;
          animation: slideDown 0.3s ease-out;
        }

        /* Available Services Section */
        .available-services-section {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
          border-radius: calc(var(--radius));
          animation: slideDown 0.4s ease-out;
        }

        .available-services-title {
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .available-services-count {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
        }

        .available-services-grid {
          display: grid;
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .available-services-grid::-webkit-scrollbar {
          width: 6px;
        }

        .available-services-grid::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .available-services-grid::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }

        .available-service-card {
          background: white;
          padding: 1rem;
          border-radius: calc(var(--radius) - 4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .available-service-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .available-service-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .available-service-icon {
          font-size: 2rem;
          line-height: 1;
        }

        .available-service-name {
          font-size: 1rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin: 0 0 0.25rem 0;
        }

        .available-service-meta {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
          margin: 0;
        }

        .available-service-providers {
          font-size: 0.85rem;
          color: #14b8a6;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
        }

        .available-service-brands {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mini-brand-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: hsl(var(--muted) / 0.3);
          border-radius: calc(var(--radius) - 6px);
          font-size: 0.85rem;
        }

        .mini-brand-name {
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        .mini-brand-rating {
          color: #f59e0b;
          font-weight: 600;
        }

        .more-brands {
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
          font-style: italic;
          margin: 0.25rem 0 0 0;
        }

        /* Booking Actions */
        .booking-actions {
          display: flex;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 2px solid hsl(var(--border));
        }
        .confirm-booking-btn {
          flex: 1;
          padding: 1rem 1.5rem;
          color: white;
          border: none;
          border-radius: calc(var(--radius) - 4px);
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 6px 20px currentColor;
          box-shadow: 0 6px 20px color-mix(in srgb, currentColor 35%, transparent);
          font-family: 'Poppins', sans-serif;
        }
        .confirm-booking-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px color-mix(in srgb, currentColor 45%, transparent);
        }
        .confirm-booking-btn:active {
          transform: translateY(0);
        }

        /* ── My Bookings Modal ── */
        .bookings-modal {
          max-width: 700px;
        }
        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .booking-card {
          background: white;
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .booking-card:hover {
          box-shadow: 0 8px 25px hsl(280 85% 60% / 0.15);
          transform: translateY(-2px);
        }
        .booking-card-container {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem;
        }
        .booking-image {
          width: 150px;
          height: 150px;
          background-size: cover;
          background-position: center;
          border-radius: calc(var(--radius) - 4px);
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .booking-image-placeholder {
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, hsl(280 85% 90%) 0%, hsl(250 85% 85%) 100%);
          border-radius: calc(var(--radius) - 4px);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .booking-card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .booking-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid hsl(var(--border));
        }
        .booking-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }
        .booking-info {
          flex: 1;
        }
        .booking-service-name {
          font-size: 1rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin: 0 0 0.25rem 0;
        }
        .booking-service-label {
          font-size: 0.9rem;
          color: hsl(var(--muted-foreground));
          margin: 0;
        }
        .booking-status {
          padding: 0.4rem 0.9rem;
          border-radius: calc(var(--radius) - 4px);
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .booking-status-pending {
          background: hsl(45 100% 95%);
          color: hsl(45 100% 35%);
        }
        .booking-status-confirmed {
          background: hsl(142 76% 95%);
          color: hsl(142 76% 36%);
        }
        .booking-status-completed {
          background: hsl(210 100% 95%);
          color: hsl(210 100% 40%);
        }
        .booking-status-cancelled {
          background: hsl(0 85% 95%);
          color: hsl(0 85% 45%);
        }
        .booking-details {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 1rem;
          padding: 1rem;
          background: hsl(var(--muted));
          border-radius: 0.75rem;
        }
        .booking-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: hsl(var(--muted-foreground));
        }
        .booking-detail-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 0.2rem;
        }
        .booking-detail-text {
          color: hsl(var(--foreground));
          font-weight: 500;
          word-break: break-word;
        }
        .booking-price {
          color: hsl(280 85% 60%);
          font-weight: 700;
          font-size: 1.05rem;
        }
        .no-bookings {
          text-align: center;
          padding: 3rem 2rem;
        }
        .no-bookings-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        .no-bookings-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin: 0 0 0.5rem 0;
        }
        .no-bookings-hint {
          font-size: 0.95rem;
          color: hsl(var(--muted-foreground));
          margin: 0;
        }
        .booking-actions {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid hsl(var(--border));
          display: flex;
          justify-content: flex-end;
        }
        .cancel-booking-btn {
          padding: 0.6rem 1.2rem;
          border: 2px solid hsl(0 85% 60%);
          border-radius: calc(var(--radius) - 4px);
          background: white;
          color: hsl(0 85% 60%);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .cancel-booking-btn:hover {
          background: hsl(0 85% 60%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px hsl(0 85% 60% / 0.3);
        }
        .cancel-booking-btn:active {
          transform: translateY(0);
        }

        /* Responsive for booking form */
        @media (max-width: 640px) {
          .booking-form-container {
            padding: 1.25rem 1.5rem 1.5rem;
          }
          .booking-form {
            gap: 1.5rem;
          }
          .booking-form-title {
            font-size: 1.25rem;
          }
          .service-summary {
            padding: 1rem;
          }
          .service-summary-icon {
            font-size: 2rem;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .db-nav { 
            padding: 1rem 1.25rem;
            flex-wrap: wrap;
          }
          .db-nav-left {
            width: 100%;
            justify-content: space-between;
          }
          .db-nav-right {
            width: 100%;
            justify-content: space-between;
            margin-top: 0.75rem;
          }
          .db-bookings-btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }
          .booking-details {
            grid-template-columns: 1fr;
          }
          .db-greeting {
            font-size: 0.85rem;
          }
          .db-main { padding: 2rem 1.25rem; gap: 2rem; }
          .db-hero { padding: 2rem 1.5rem; }
          .db-search-bar-wrapper {
            max-width: 100%;
          }
          .db-search-bar {
            flex-wrap: wrap;
          }
          .db-search-input {
            min-width: 0;
            padding: 0.85rem 0.5rem;
          }
          .db-search-btn {
            padding: 0.85rem 1.5rem;
            font-size: 0.9rem;
          }
          .search-results-dropdown {
            max-height: 300px;
          }
          .db-stats { grid-template-columns: 1fr; }
          .stat-card { padding: 1.5rem 1.25rem; }
          .db-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
          .offers-grid { grid-template-columns: 1fr; }
          .noteworthy-grid { grid-template-columns: 1fr; }
          .most-booked-grid { grid-template-columns: 1fr; }
          .footer-content { 
            grid-template-columns: 1fr; 
            gap: 2rem;
          }
          .footer-about {
            text-align: center;
          }
          .footer-social {
            justify-content: center;
          }
          .modal-header { padding: 1.25rem 1.5rem; }
          .modal-body { padding: 1.25rem 1.5rem 1.5rem; }
          .modal-option-card { padding: 1rem 1.25rem; flex-direction: column; align-items: flex-start; }
          .modal-opt-right { width: 100%; justify-content: space-between; }
        }

        @media (max-width: 480px) {
          .db-logo {
            font-size: 1.3rem;
          }
          .db-logout-btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }
          .db-hero-title {
            font-size: 1.5rem;
          }
          .db-search-icon {
            padding: 0 0.75rem;
            font-size: 1rem;
          }
          .search-result-icon {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

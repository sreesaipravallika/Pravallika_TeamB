import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Search, MapPin, Star, ArrowLeft } from "lucide-react";

interface ServiceProvider {
  id: number;
  providerName: string;
  serviceName: string;
  category: string;
  location: string;
  price: string;
  priceUnit: string;
  rating: number;
  reviews: number;
}

const serviceProviders: ServiceProvider[] = [
  // Plumbers
  { id: 1, providerName: "QuickFix Plumbing", serviceName: "Plumber", category: "Home Services", location: "Mumbai, Maharashtra", price: "₹299", priceUnit: "/hr", rating: 4.8, reviews: 234 },
  { id: 2, providerName: "FlowMaster Services", serviceName: "Plumber", category: "Home Services", location: "Delhi, Delhi", price: "₹349", priceUnit: "/hr", rating: 4.9, reviews: 189 },
  { id: 3, providerName: "PipePro Solutions", serviceName: "Plumbing Services", category: "Home Services", location: "Bangalore, Karnataka", price: "₹279", priceUnit: "/hr", rating: 4.7, reviews: 156 },
  
  // Electricians
  { id: 4, providerName: "PowerUp Electricals", serviceName: "Electrician", category: "Home Services", location: "Mumbai, Maharashtra", price: "₹399", priceUnit: "/hr", rating: 4.9, reviews: 312 },
  { id: 5, providerName: "Spark Solutions", serviceName: "Electrician", category: "Home Services", location: "Pune, Maharashtra", price: "₹329", priceUnit: "/hr", rating: 4.8, reviews: 267 },
  { id: 6, providerName: "Volt Masters", serviceName: "Electrical Services", category: "Home Services", location: "Hyderabad, Telangana", price: "₹359", priceUnit: "/hr", rating: 4.7, reviews: 198 },
  
  // Tutors
  { id: 7, providerName: "EduExcel Tutoring", serviceName: "Tutor", category: "Education", location: "Delhi, Delhi", price: "₹499", priceUnit: "/hr", rating: 4.9, reviews: 445 },
  { id: 8, providerName: "BrightMinds Academy", serviceName: "Math Tutor", category: "Education", location: "Mumbai, Maharashtra", price: "₹599", priceUnit: "/hr", rating: 5.0, reviews: 523 },
  { id: 9, providerName: "LearnPro Tutors", serviceName: "Science Tutor", category: "Education", location: "Bangalore, Karnataka", price: "₹549", priceUnit: "/hr", rating: 4.8, reviews: 389 },
  { id: 10, providerName: "SmartStudy Hub", serviceName: "English Tutor", category: "Education", location: "Chennai, Tamil Nadu", price: "₹449", priceUnit: "/hr", rating: 4.7, reviews: 276 },
  
  // AC Repair
  { id: 11, providerName: "CoolAir Services", serviceName: "AC Repair", category: "Home Services", location: "Mumbai, Maharashtra", price: "₹449", priceUnit: "/visit", rating: 4.8, reviews: 567 },
  { id: 12, providerName: "ChillTech AC Solutions", serviceName: "AC Repair & Maintenance", category: "Home Services", location: "Delhi, Delhi", price: "₹499", priceUnit: "/visit", rating: 4.9, reviews: 623 },
  { id: 13, providerName: "FrostFix AC Services", serviceName: "AC Installation & Repair", category: "Home Services", location: "Bangalore, Karnataka", price: "₹399", priceUnit: "/visit", rating: 4.7, reviews: 412 },
  
  // Cleaning Services
  { id: 14, providerName: "SparkleClean Services", serviceName: "Cleaning", category: "Home Services", location: "Mumbai, Maharashtra", price: "₹999", priceUnit: "/session", rating: 4.8, reviews: 789 },
  { id: 15, providerName: "FreshHome Cleaners", serviceName: "Deep Cleaning", category: "Home Services", location: "Pune, Maharashtra", price: "₹1199", priceUnit: "/session", rating: 4.9, reviews: 856 },
  { id: 16, providerName: "PureSpace Cleaning", serviceName: "House Cleaning", category: "Home Services", location: "Hyderabad, Telangana", price: "₹899", priceUnit: "/session", rating: 4.7, reviews: 634 },
  
  // Carpenters
  { id: 17, providerName: "WoodCraft Masters", serviceName: "Carpenter", category: "Home Services", location: "Bangalore, Karnataka", price: "₹349", priceUnit: "/hr", rating: 4.8, reviews: 234 },
  { id: 18, providerName: "TimberPro Services", serviceName: "Carpentry", category: "Home Services", location: "Chennai, Tamil Nadu", price: "₹299", priceUnit: "/hr", rating: 4.7, reviews: 189 },
  
  // Painters
  { id: 19, providerName: "ColorPerfect Painters", serviceName: "Painter", category: "Home Services", location: "Mumbai, Maharashtra", price: "₹399", priceUnit: "/hr", rating: 4.9, reviews: 445 },
  { id: 20, providerName: "BrushMasters Painting", serviceName: "Painting Services", category: "Home Services", location: "Delhi, Delhi", price: "₹429", priceUnit: "/hr", rating: 4.8, reviews: 378 },
  
  // Pest Control
  { id: 21, providerName: "BugBusters India", serviceName: "Pest Control", category: "Home Services", location: "Bangalore, Karnataka", price: "₹699", priceUnit: "/visit", rating: 4.9, reviews: 512 },
  { id: 22, providerName: "SafeHome Pest Solutions", serviceName: "Pest Control Services", category: "Home Services", location: "Mumbai, Maharashtra", price: "₹749", priceUnit: "/visit", rating: 4.8, reviews: 467 },
  
  // Salon Services
  { id: 23, providerName: "Glamour Studio", serviceName: "Salon", category: "Beauty & Wellness", location: "Mumbai, Maharashtra", price: "₹599", priceUnit: "/service", rating: 4.9, reviews: 892 },
  { id: 24, providerName: "Style Lounge", serviceName: "Hair Salon", category: "Beauty & Wellness", location: "Delhi, Delhi", price: "₹549", priceUnit: "/service", rating: 4.8, reviews: 734 },
  
  // Appliance Repair
  { id: 25, providerName: "FixIt Fast", serviceName: "Appliance Repair", category: "Home Services", location: "Pune, Maharashtra", price: "₹299", priceUnit: "/visit", rating: 4.7, reviews: 345 }
];

const ServiceSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<ServiceProvider[]>([]);
  const [showInitial, setShowInitial] = useState(true);

  const popularSearches = ["plumber", "electrician", "tutor", "AC repair", "cleaning"];

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredResults([]);
      setShowInitial(true);
      return;
    }

    setShowInitial(false);
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    
    const results = serviceProviders.filter(service => {
      return (
        service.providerName.toLowerCase().includes(lowerSearchTerm) ||
        service.serviceName.toLowerCase().includes(lowerSearchTerm) ||
        service.category.toLowerCase().includes(lowerSearchTerm) ||
        service.location.toLowerCase().includes(lowerSearchTerm)
      );
    });

    setFilteredResults(results);
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm("");
    setShowInitial(true);
  };

  const handlePopularSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleBookService = (service: ServiceProvider) => {
    navigate("/dashboard", { 
      state: { 
        selectedService: service.serviceName,
        prefilledData: {
          serviceType: service.serviceName,
          location: service.location
        }
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">⚡ QuickServ</h1>
              <p className="text-sm text-muted-foreground">Find trusted local service providers</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="text-center mb-8 space-y-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">Search for Services</h2>
            <p className="text-lg text-muted-foreground">Find plumbers, electricians, tutors, and more...</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search for services (e.g., plumber, electrician, tutor...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 h-12 text-base w-full"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-destructive/10"
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button size="lg" className="h-12 px-8 whitespace-nowrap">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Result Count */}
          {!showInitial && (
            <div className="inline-block px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
              <p className="font-semibold text-primary">
                {filteredResults.length === 0 
                  ? "No services found" 
                  : filteredResults.length === 1 
                  ? "1 service found" 
                  : `${filteredResults.length} services found`}
              </p>
            </div>
          )}
        </section>

        {/* Results Section */}
        <section>
          {showInitial ? (
            /* Initial State */
            <Card className="max-w-2xl mx-auto text-center p-8 shadow-lg">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-2">Start searching for services</h3>
              <p className="text-muted-foreground mb-6">Type in the search box above to find service providers</p>
              
              <div className="space-y-4">
                <p className="text-sm font-semibold text-muted-foreground">Popular searches:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularSearches.map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePopularSearch(term)}
                      className="capitalize hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ) : filteredResults.length === 0 ? (
            /* No Results */
            <Card className="max-w-2xl mx-auto text-center p-8 shadow-lg">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No services found</h3>
              <p className="text-muted-foreground mb-4">
                Try searching for "plumber", "electrician", "tutor", or "AC repair"
              </p>
              <Button variant="outline" onClick={handleClear}>
                Clear Search
              </Button>
            </Card>
          ) : (
            /* Results Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {filteredResults.map((service) => (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold truncate">{service.providerName}</h3>
                        <p className="text-sm text-primary font-semibold">{service.serviceName}</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 shrink-0 text-xs">
                        {service.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 pb-3 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{service.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />
                      <span>{service.rating} ({service.reviews} reviews)</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <span className="text-2xl font-bold text-primary">{service.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">{service.priceUnit}</span>
                    </div>
                    <Button onClick={() => handleBookService(service)} size="sm">
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ServiceSearch;

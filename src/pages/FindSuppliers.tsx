import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, ExternalLink, Search, Filter } from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

interface Supplier {
  id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  website: string;
  description: string;
  is_verified: boolean;
}

interface Category {
  id: string;
  name: string;
}

const FindSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    // For now, show mock data since we don't have suppliers populated yet
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        company_name: 'ABC Manufacturing Ltd.',
        contact_person: 'John Doe',
        phone: '+91 98765 43210',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        website: 'https://abcmanufacturing.com',
        description: 'Leading manufacturer of industrial machinery and equipment.',
        is_verified: true,
      },
      {
        id: '2',
        company_name: 'XYZ Industries',
        contact_person: 'Jane Smith',
        phone: '+91 87654 32109',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        website: 'https://xyzindustries.com',
        description: 'Specialized in precision engineering and manufacturing solutions.',
        is_verified: false,
      }
    ];

    const mockCategories: Category[] = [
      { id: '1', name: 'Industrial Machinery' },
      { id: '2', name: 'Agricultural Equipment' },
      { id: '3', name: 'Construction Machinery' },
      { id: '4', name: 'Manufacturing Tools' },
    ];

    setSuppliers(mockSuppliers);
    setCategories(mockCategories);
    setLoading(false);
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !selectedLocation || 
                           supplier.state.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                           supplier.city.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const uniqueStates = Array.from(new Set(suppliers.map(s => s.state)));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading suppliers...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-4">Find Suppliers</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with verified suppliers across India for all your machinery needs
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-card rounded-lg p-6 mb-8 border border-card-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {uniqueStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{supplier.company_name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {supplier.contact_person}
                    </p>
                  </div>
                  {supplier.is_verified && (
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {supplier.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    {supplier.city}, {supplier.state}
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                    {supplier.phone}
                  </div>
                  
                  {supplier.website && (
                    <div className="flex items-center text-sm">
                      <ExternalLink className="w-4 h-4 mr-2 text-muted-foreground" />
                      <a 
                        href={supplier.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="pt-3 space-y-2">
                  <Button asChild className="w-full" variant="accent">
                    <Link to={`/create-inquiry?supplier=${supplier.id}`}>
                      Send Inquiry
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No suppliers found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedLocation("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default FindSuppliers;

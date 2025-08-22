import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Supplier {
  id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  city: string;
  state: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price_range: string;
  supplier_id: string;
}

const CreateInquiry = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    quantity: "",
    targetPrice: "",
    deliveryTimeline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // For now, we'll show a message that this feature is coming soon
    // TODO: Implement backend APIs for suppliers and products
    toast({
      title: "Coming Soon",
      description: "Inquiry creation will be available once the supplier database is populated.",
      variant: "destructive",
    });
  }, [user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create an inquiry.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!selectedSupplier || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement inquiry creation API call
      toast({
        title: "Feature Coming Soon",
        description: "Inquiry creation will be implemented with the backend API.",
      });
      
      // For now, just redirect back
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-heading font-bold">Create Inquiry</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New Inquiry Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Select Supplier *</Label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coming-soon" disabled>
                        Suppliers will be loaded from backend API
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product">Related Product (Optional)</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coming-soon" disabled>
                        Products will be loaded from backend API
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Enter inquiry subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your requirements in detail..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Required</Label>
                    <Input
                      id="quantity"
                      placeholder="e.g., 10 units"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetPrice">Target Price</Label>
                    <Input
                      id="targetPrice"
                      placeholder="e.g., ₹50,000"
                      value={formData.targetPrice}
                      onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryTimeline">Delivery Timeline</Label>
                  <Input
                    id="deliveryTimeline"
                    placeholder="e.g., 2-3 weeks"
                    value={formData.deliveryTimeline}
                    onChange={(e) => handleInputChange('deliveryTimeline', e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    variant="accent"
                  >
                    {isSubmitting ? (
                      "Creating Inquiry..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Inquiry
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateInquiry;

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductData {
  name: string;
  description: string;
  category: string;
  priceRange: string;
  minOrderQuantity: string;
  specifications: { [key: string]: string };
  tags: string[];
  countryOfOrigin: string;
  certificationStandards: string[];
}

const CreateProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    category: "",
    priceRange: "",
    minOrderQuantity: "",
    specifications: {},
    tags: [],
    countryOfOrigin: "India",
    certificationStandards: [],
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Mock data for now since we don't have backend APIs yet
    const mockProfile = {
      user_type: user.role || 'supplier',
    };
    
    const mockCategories = [
      { id: '1', name: 'Industrial Machinery' },
      { id: '2', name: 'Agricultural Equipment' },
      { id: '3', name: 'Construction Machinery' },
      { id: '4', name: 'Manufacturing Tools' },
    ];

    setProfile(mockProfile);
    setCategories(mockCategories);
    setLoading(false);
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !productData.certificationStandards.includes(newCertification.trim())) {
      setProductData(prev => ({
        ...prev,
        certificationStandards: [...prev.certificationStandards, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (certToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      certificationStandards: prev.certificationStandards.filter(cert => cert !== certToRemove)
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setProductData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpecification = (keyToRemove: string) => {
    setProductData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[keyToRemove];
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || profile?.user_type !== 'supplier') {
      toast({
        title: "Access Denied",
        description: "Only suppliers can create products.",
        variant: "destructive",
      });
      return;
    }

    if (!productData.name || !productData.description || !productData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement product creation API call
      toast({
        title: "Feature Coming Soon",
        description: "Product creation will be implemented with the backend API.",
      });
      
      // For now, just redirect back to dashboard
      navigate('/supplier-dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (profile?.user_type !== 'supplier') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">Only suppliers can create products.</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-heading font-bold">Create New Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={productData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your product in detail..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={productData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                    <Input
                      id="countryOfOrigin"
                      value={productData.countryOfOrigin}
                      onChange={(e) => handleInputChange('countryOfOrigin', e.target.value)}
                      placeholder="Country of origin"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range</Label>
                    <Input
                      id="priceRange"
                      value={productData.priceRange}
                      onChange={(e) => handleInputChange('priceRange', e.target.value)}
                      placeholder="e.g., ₹50,000 - ₹1,00,000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minOrderQuantity">Minimum Order Quantity</Label>
                    <Input
                      id="minOrderQuantity"
                      value={productData.minOrderQuantity}
                      onChange={(e) => handleInputChange('minOrderQuantity', e.target.value)}
                      placeholder="e.g., 1 unit"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {productData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    placeholder="Specification name"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="Value"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
                    />
                    <Button type="button" onClick={addSpecification} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(productData.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 border rounded">
                      <span><strong>{key}:</strong> {value}</span>
                      <X 
                        className="w-4 h-4 cursor-pointer text-destructive" 
                        onClick={() => removeSpecification(key)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add certification"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  />
                  <Button type="button" onClick={addCertification} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {productData.certificationStandards.map((cert) => (
                    <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                      {cert}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeCertification(cert)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="accent">
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;

"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Tag, CheckCircle, Gift } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

const PromoCodeSection = ({ 
  promo, 
  setPromo, 
  appliedPromo, 
  setAppliedPromo, 
  promoError, 
  setPromoError 
}) => {
  const [showAvailablePromos, setShowAvailablePromos] = useState(false);
  const [availablePromos, setAvailablePromos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch active promotions from database
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/promotions/active`
        );
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const formattedPromos = data.map(promo => ({
            code: promo.code,
            desc: promo.title,
            discount: promo.discount
          }));
          setAvailablePromos(formattedPromos);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
        // Set fallback promos if API fails
        setAvailablePromos([
          { code: "EIDSPECIAL20%", desc: "Eid Special 20% Off", discount: 20 },
          { code: "NEWYEAR10%", desc: "New Year 10% Off", discount: 10 },
          { code: "SUMMER05%", desc: "Summer 5% Off", discount: 5 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  // Demo promo codes (fallback)
  // Validate promo code with backend
  const isPromoValid = async (code) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/promotions/validate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        }
      );
      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error('Error validating promo:', error);
      // Fallback to local validation
      return availablePromos.some((p) => p.code === code);
    }
  };

  const handleApplyPromo = async () => {
    if (!promo.trim()) {
      setPromoError("Please enter a promo code");
      toast.warning("Empty Promo Code", {
        description: "Please enter a promo code to apply.",
      });
      return;
    }

    try {
      // First check if this promo exists in available promos
      const promoDetails = availablePromos.find(p => p.code === promo.trim());
      
      if (!promoDetails) {
        setPromoError("Invalid promo code");
        toast.error("Invalid Promo Code", {
          description: "This promo code doesn't exist. Please check and try again.",
        });
        return;
      }

      // Then validate with backend
      if (!await isPromoValid(promo)) {
        setPromoError("Invalid promo code");
        toast.error("Invalid Promo Code", {
          description: "The promo code you entered is not valid. Please check and try again.",
        });
        return;
      }

      setAppliedPromo(promo);
      setPromoError("");
      toast.success("Promo Code Applied!", {
        description: `Promo code ${promoDetails.code} (${promoDetails.discount}% off) has been applied successfully.`,
      });
    } catch (error) {
      console.error("Error applying promo code:", error);
      setPromoError("Error applying promo code");
      toast.error("Failed to apply promo code", {
        description: "Please try again or contact support if the issue persists.",
      });
    }
  };

  const handleClearPromo = () => {
    setPromo("");
    setAppliedPromo("");
    setPromoError("");
    toast.info("Promo Code Removed", {
      description: "The promo code has been removed from your booking.",
    });
  };

  const handleQuickApply = async (promoCode) => {
    try {
      // First validate the promo code
      const isValid = await isPromoValid(promoCode.code);
      
      if (!isValid) {
        setPromoError("Invalid promo code");
        toast.error("Invalid Promo Code", {
          description: "This promo code is not valid. Please try another one.",
        });
        return;
      }

      // If valid, apply the promo code
      setPromo(promoCode.code);
      setAppliedPromo(promoCode.code);
      setPromoError("");
      setShowAvailablePromos(false);
      
      toast.success("Promo Code Applied!", {
        description: `${promoCode.desc} (${promoCode.discount}% off) has been applied successfully.`,
      });
    } catch (error) {
      console.error("Error applying promo code:", error);
      toast.error("Failed to apply promo code", {
        description: "Please try again or contact support if the issue persists.",
      });
    }
  };

  if(promoError){
    toast.error(promoError);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Promo Code</h3>
        {appliedPromo && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Applied
          </div>
        )}
      </div>

      {/* Promo Input Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {/* Promo Input */}
          <div className="relative flex-1">
            <Input
              type="text"
              value={promo}
              onChange={(e) => {
                setPromo(e.target.value);
                setPromoError("");
              }}
              placeholder="Enter promo code"
              className={`h-12 pr-16 bg-background border text-foreground placeholder:text-muted-foreground ${
                promoError 
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
                  : "border-border focus:border-primary focus:ring-primary/20"
              } rounded-lg shadow-sm hover:shadow-md transition-shadow focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}
            />
            

            {/* Apply/X Button */}
            {promo && promo === appliedPromo ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={handleClearPromo}
              >
                <X className="w-3 h-3" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="default"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs "
                onClick={handleApplyPromo}
                disabled={!promo.trim()}
              >
                Apply
              </Button>
            )}
          </div>

          {/* Available Promos Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-center w-12 h-12 bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow hover:border-primary hover:bg-accent"
                title="Available promo codes"
              >
                <Gift className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-background border-border">
              <div className="p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Available Promo Codes</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {availablePromos.map((promoCode, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Tag className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">
                            {promoCode.code}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {promoCode.desc}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleQuickApply(promoCode)}
                        className="h-8 px-3 text-xs "
                      >
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

    </div>
  );
};

export default PromoCodeSection;


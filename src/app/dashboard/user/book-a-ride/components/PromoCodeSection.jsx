"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Tag, CheckCircle } from "lucide-react";
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

  // Demo promo codes
  const availablePromos = [
    { code: "EIDSPECIAL20%", desc: "Eid Special 20% Off", discount: 20 },
    { code: "NEWYEAR10%", desc: "New Year 10% Off", discount: 10 },
    { code: "SUMMER05%", desc: "Summer 5% Off", discount: 5 },
    { code: "FIRSTRIDE15%", desc: "First Ride 15% Off", discount: 15 },
    { code: "WEEKEND25%", desc: "Weekend Special 25% Off", discount: 25 },
  ];

  const isPromoValid = (code) => availablePromos.some((p) => p.code === code);

  const handleApplyPromo = () => {
    if (!promo.trim()) {
      setPromoError("Please enter a promo code");
      toast.warning("Empty Promo Code", {
        description: "Please enter a promo code to apply.",
      });
      return;
    }

    if (!isPromoValid(promo)) {
      setPromoError("Invalid promo code");
      toast.error("Invalid Promo Code", {
        description: "The promo code you entered is not valid. Please check and try again.",
      });
      return;
    }

    setAppliedPromo(promo);
    setPromoError("");
    toast.success("Promo Code Applied!", {
      description: "Your discount has been applied successfully.",
    });
  };

  const handleClearPromo = () => {
    setPromo("");
    setAppliedPromo("");
    setPromoError("");
    toast.info("Promo Code Removed", {
      description: "The promo code has been removed from your booking.",
    });
  };

  const handleQuickApply = (promoCode) => {
    setPromo(promoCode.code);
    setAppliedPromo(promoCode.code);
    setPromoError("");
    setShowAvailablePromos(false);
    toast.success("Promo Code Applied!", {
      description: `${promoCode.desc} has been applied successfully.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
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
        <div className="relative">
          <Input
            type="text"
            value={promo}
            onChange={(e) => {
              setPromo(e.target.value);
              setPromoError("");
            }}
            placeholder="Enter promo code"
            className={`pr-20 bg-accent/10 border ${
              promoError 
                ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                : "border-primary/20 focus:border-primary focus:ring-primary/20"
            } rounded-lg`}
          />
          
          {/* Clear Button */}
          {promo && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-16 top-1/2 -translate-y-1/2 w-6 h-6 p-0 hover:bg-accent"
              onClick={handleClearPromo}
            >
              <X className="w-3 h-3" />
            </Button>
          )}

          {/* Apply Button */}
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs"
            onClick={handleApplyPromo}
            disabled={!promo.trim()}
          >
            {promo && promo === appliedPromo ? "Applied" : "Apply"}
          </Button>
        </div>

        {/* Error Message */}
        {promoError && (
          <div className="text-sm text-red-600 font-medium flex items-center gap-1">
            <X className="w-4 h-4" />
            {promoError}
          </div>
        )}

        {/* Applied Promo Display */}
        {appliedPromo && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">
                  {availablePromos.find(p => p.code === appliedPromo)?.desc}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearPromo}
                className="text-green-600 hover:text-green-800 h-6 px-2"
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Available Promos Toggle */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowAvailablePromos(!showAvailablePromos)}
        className="w-full border-primary/20 text-primary hover:bg-primary/5"
      >
        {showAvailablePromos ? "Hide" : "Show"} Available Promo Codes
      </Button>

      {/* Available Promos List */}
      {showAvailablePromos && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Available Promo Codes:</h4>
          <div className="grid grid-cols-1 gap-2">
            {availablePromos.map((promoCode, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-accent/20 border border-border/20 rounded-lg hover:bg-accent/30 transition-colors"
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
                  className="h-8 px-3 text-xs"
                >
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodeSection;


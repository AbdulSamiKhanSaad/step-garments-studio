import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
}

const QuoteModal = ({ open, onOpenChange, productName }: QuoteModalProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: "",
    productType: productName || "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Quote Request Sent!", description: "We'll get back to you within 24 hours." });
    onOpenChange(false);
    setForm({ name: "", email: "", phone: "", quantity: "", productType: "", message: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Request a Quote</DialogTitle>
          <p className="text-sm text-muted-foreground">Fill in the details and we'll get back to you within 24 hours.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 890" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Order Quantity</Label>
              <Input id="quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 500 pieces" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="productType">Product Type</Label>
            <Input id="productType" value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })} placeholder="e.g. T-Shirts, Hoodies" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Additional Details</Label>
            <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Fabric preferences, customization needs..." rows={3} />
          </div>
          <button type="submit" className="btn-primary w-full">Submit Quote Request</button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;

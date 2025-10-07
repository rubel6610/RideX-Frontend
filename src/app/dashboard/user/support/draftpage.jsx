"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, HelpCircle, Send } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
	{
		q: "How do I book a ride?",
		a: "Go to the Book a Ride page, enter your pickup and drop locations, select your ride type, and confirm your booking.",
	},
	{
		q: "How can I contact my driver?",
		a: "Once your ride is confirmed, you can view driver details and contact them from your dashboard.",
	},
	{
		q: "What if I have an issue with my ride?",
		a: "You can report issues from the Ride History page or contact support directly using the form below.",
	},
	{
		q: "How do I update my profile?",
		a: "Navigate to My Profile in the dashboard and click the Edit button to update your information.",
	},
];

export default function SupportPage() {
	const [form, setForm] = useState({ name: "", email: "", message: "" });
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setSubmitted(true);
		// Here you would send the form data to your backend/support system
	};

	return (
		<div className="min-h-screen bg-accent/10 flex flex-col items-center py-10 px-2">
			<div className="w-full max-w-3xl bg-background rounded-2xl shadow-lg p-8 border border-accent flex flex-col gap-8">
				{/* Header */}
				<div className="flex flex-col items-center gap-2 text-center">
					<HelpCircle className="w-10 h-10 text-primary mb-1" />
					<h1 className="text-3xl font-bold text-primary">
						Support & Help Center
					</h1>
					<p className="text-foreground/60 max-w-xl">
						Need help? Find answers to common questions below or contact our
						support team. We're here to make your RideX experience smooth and
						safe.
					</p>
				</div>
				{/* FAQ Section */}
				<div>
					<h2 className="text-xl font-semibold text-foreground mb-4">
						Frequently Asked Questions
					</h2>
					<Accordion type="single" collapsible className="w-full">
						{faqs.map((faq, idx) => (
							<AccordionItem
								key={idx}
								value={`faq-${idx}`}
								className="border-b border-accent"
							>
								<AccordionTrigger className="font-semibold text-primary flex items-center gap-2">
									<HelpCircle className="w-4 h-4 text-primary" />
									{faq.q}
								</AccordionTrigger>
								<AccordionContent className="text-foreground/80 text-sm bg-accent/10 px-4 py-2 rounded-b">
									{faq.a}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
				{/* Contact Form */}
				<div>
					<h2 className="text-xl font-semibold text-foreground mb-4">
						Contact Support
					</h2>
					{submitted ? (
						<div className="bg-accent/20 border border-accent rounded-lg p-6 text-center text-primary font-semibold flex flex-col items-center gap-2">
							<Send className="w-8 h-8 mb-2 text-primary" />
							Thank you for reaching out! Our support team will get back to you
							soon.
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="flex flex-col md:flex-row gap-4">
								<Input
									name="name"
									value={form.name}
									onChange={handleChange}
									placeholder="Your Name"
									required
									className="bg-accent/10 border border-accent"
								/>
								<Input
									name="email"
									value={form.email}
									onChange={handleChange}
									placeholder="Your Email"
									type="email"
									required
									className="bg-accent/10 border border-accent"
								/>
							</div>
							<Textarea
								name="message"
								value={form.message}
								onChange={handleChange}
								placeholder="How can we help you?"
								rows={4}
								required
								className="bg-accent/10 border border-accent"
							/>
							<Button
								type="submit"
								variant="primary"
								className="w-full mt-2 flex items-center gap-2"
							>
								<Send className="w-4 h-4" /> Send Message
							</Button>
						</form>
					)}
					<div className="flex flex-col md:flex-row gap-4 mt-6 text-sm text-foreground/70 items-center justify-center">
						<div className="flex items-center gap-2">
							<Mail className="w-4 h-4 text-primary" /> support@ridex.com
						</div>
						<div className="flex items-center gap-2">
							<Phone className="w-4 h-4 text-primary" /> +880 1234-567890
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
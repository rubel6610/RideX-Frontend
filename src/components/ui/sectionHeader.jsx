import React from "react";
import { ArrowRight } from "lucide-react";

const SectionHeader = ({ title, subtitle, highlight, description, icon }) => {
    const Icon = icon || ArrowRight;
    return (
        <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-accent text-foreground rounded-full text-sm font-medium border border-primary">
                <Icon className="h-4 w-4 mr-2" />
                {title}
            </div>
            <h2 className="text-3xl md:text-display font-bold">
                {subtitle}
                {highlight && <span className="text-gradient-accent">{highlight}</span>}
            </h2>
            <p className="text-lg text-accent-foreground max-w-2xl mx-auto">
                {description}
            </p>
        </div>
    );
};

export default SectionHeader;
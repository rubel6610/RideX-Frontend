'use client'
import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex justify-center pt-7 pb-10">
            <div className="w-full max-w-[1440px] px-4 md:px-16 py-12">
                <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 bg-[#eafbe5] py-18 mb-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] text-center">Privacy Policy</h1>
                </div>
                <div className="text-muted-foreground text-base my-8">Last updated: {new Date().toLocaleDateString()}</div>
                <section className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">1. Information We Collect</h2>
                    <div className="bg-primary/5 border border-primary/10 text-text rounded-2xl p-6 mb-6">
                        <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Name, email address, and phone number</li>
                            <li>Profile photo and identification documents</li>
                            <li>Payment information and billing details</li>
                            <li>Emergency contact information</li>
                        </ul>
                    </div>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">2. Location Data</h2>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6">
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Collected to enable ride matching and navigation</li>
                            <li>Used to improve service accuracy and safety</li>
                        </ul>
                    </div>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">3. How We Use Your Information</h2>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6">
                        <ul className="list-disc ml-6 space-y-1">
                            <li>To provide and improve our ride services</li>
                            <li>To process payments securely</li>
                            <li>To communicate updates and offers</li>
                            <li>To ensure safety and security</li>
                        </ul>
                    </div>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">4. Your Choices</h2>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6">
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Access or update your information anytime</li>
                            <li>Opt out of marketing communications</li>
                            <li>Request deletion of your account</li>
                        </ul>
                    </div>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">5. Data Sharing</h2>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6">
                        <ul className="list-disc ml-6 space-y-1">
                            <li>We may share your data with drivers, riders, and service partners to facilitate rides.</li>
                            <li>Information may be shared with law enforcement or regulatory authorities as required by law.</li>
                            <li>We do not sell your personal information to third parties.</li>
                        </ul>
                    </div>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">6. Data Security</h2>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6">
                        <ul className="list-disc ml-6 space-y-1">
                            <li>We use industry-standard security measures to protect your data.</li>
                            <li>Access to your information is restricted to authorized personnel only.</li>
                            <li>We regularly review our security practices to ensure your data remains safe.</li>
                        </ul>
                    </div>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">7. Data Retention</h2>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6">
                        <ul className="list-disc ml-6 space-y-1">
                            <li>We retain your data as long as your account is active or as needed to provide services.</li>
                            <li>Data may be retained for legal, regulatory, or safety reasons.</li>
                        </ul>
                    </div>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">8. Children’s Privacy</h2>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6">
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Our services are not intended for children under 18 years of age.</li>
                            <li>We do not knowingly collect personal information from children.</li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">9. Contact Us</h2>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                        <p className="text-text">
                            If you have questions about our privacy practices, please contact us at <a href="mailto:support@ridex.com" className="text-primary underline">support@ridex.com</a>.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
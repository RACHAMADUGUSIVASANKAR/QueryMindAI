import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import AboutSection from '@/components/landing/AboutSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/layout/Footer';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';

export default function Home() {
    return (
        <>
            <Head>
                <title>QueryMindAI</title>
                <meta name="description" content="QueryMindAI transforms natural language into powerful MongoDB queries. No syntax. No complexity. Just answers." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </Head>

            <Navbar />

            <main>
                <HeroSection />
                <FeaturesSection />
                <AboutSection />
                <TestimonialsSection />
                <FAQSection />
                <CTASection />
            </main>

            <Footer />
            <ChatbotWidget />
        </>
    );
}

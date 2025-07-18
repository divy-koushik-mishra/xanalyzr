import React from 'react';
import { AnimatedTestimonials } from '../../components/ui/animated-testimonials';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Xanalyzr turned our messy spreadsheets into beautiful dashboards in minutes. The AI insights are spot on!",
      name: "Jane Doe",
      designation: "Head of Analytics, Acme Corp",
      src: "/deepinder.jpg"
    },
    {
      quote: "The best tool for quick, actionable data analysis. Our team loves the visualizations and ease of use.",
      name: "John Smith",
      designation: "Product Manager, Beta Inc.",
      src: "/ritesh.jpg"
    },
    {
      quote: "I was amazed at how fast we could get insights from our Excel files. Highly recommended!",
      name: "Priya Patel",
      designation: "Data Scientist, Gamma LLC",
      src: "/sam.jpg"
    }
  ];

  return (
    <section className="relative z-10 px-6">
      <AnimatedTestimonials
        testimonials={testimonials}
        autoplay={true}
      />
    </section>
  );
} 
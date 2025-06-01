import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-slate-800 rounded-xl shadow-xl">
      <div className="container mx-auto text-center">
        <Users className="w-16 h-16 text-purple-400 mx-auto mb-6" />
        <h2 className="text-4xl font-bold mb-6 text-white">Join Our Growing Community!</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Whether you're looking to buy your perfect car or sell your current one, Your2ndRide makes it simple, safe, and enjoyable.
        </p>
        <Button size="lg" asChild className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white transform hover:scale-105 transition-transform duration-300">
          <Link to="/register">Get Started Now</Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToActionSection;

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  const contactInfo = [
    { icon: <Mail className="w-8 h-8 text-purple-400" />, title: "Email Us", detail: "support@your2ndride.com", href: "mailto:support@your2ndride.com" },
    { icon: <Phone className="w-8 h-8 text-pink-400" />, title: "Call Us", detail: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: <MapPin className="w-8 h-8 text-orange-400" />, title: "Visit Us", detail: "123 Auto Drive, Car City, CA 90210", href: "#" },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    alert("Message sent! (This is a placeholder)");
    e.target.reset();
  };

  return (
    <div className="py-10">
      <motion.section
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">Get In Touch</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Have questions, feedback, or need support? We're here to help! Reach out to us through any of the channels below.
        </p>
      </motion.section>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.section
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-8"
        >
          {contactInfo.map((item, index) => (
            <div key={index} className="flex items-start space-x-6 p-6 bg-slate-800 rounded-lg shadow-lg">
              <div className="flex-shrink-0 mt-1">{item.icon}</div>
              <div>
                <h2 className="text-2xl font-semibold text-purple-300 mb-1">{item.title}</h2>
                <a href={item.href} className="text-lg text-gray-300 hover:text-orange-400 transition-colors duration-300">{item.detail}</a>
              </div>
            </div>
          ))}
        </motion.section>

        <motion.section
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="bg-slate-800 p-8 rounded-xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input id="name" type="text" required placeholder="Your Name" className="bg-slate-700 border-slate-600 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input id="email" type="email" required placeholder="your.email@example.com" className="bg-slate-700 border-slate-600 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <Label htmlFor="subject" className="text-gray-300">Subject</Label>
              <Input id="subject" type="text" required placeholder="Reason for contacting" className="bg-slate-700 border-slate-600 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <Label htmlFor="message" className="text-gray-300">Message</Label>
              <textarea
                id="message"
                rows="5"
                required
                placeholder="Your message here..."
                className="w-full p-2 rounded-md bg-slate-700 border-slate-600 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500"
              ></textarea>
            </div>
            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Send Message <Send className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactPage;

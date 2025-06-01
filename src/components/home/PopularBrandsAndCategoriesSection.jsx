import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Tag, Car } from 'lucide-react';

const featureCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05, // Faster delay for quicker appearance of many items
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

const popularBrands = ["Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi", "Nissan", "Volkswagen"];
const categories = ["Sedan", "SUV", "Truck", "Hatchback", "Coupe", "Minivan", "Electric", "Convertible"];

const PopularBrandsAndCategoriesSection = () => {
  return (
    <section className="py-16">
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Popular Brands</h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            className="flex flex-wrap justify-center gap-3"
          >
            {popularBrands.map((brand, index) => (
              <motion.custom
                key={brand}
                variants={featureCardVariants}
                custom={index}
                component={Button}
                variant="outline"
                className="neumorphism-button dark:neumorphism-button text-gray-700 dark:text-gray-300 border-slate-300 dark:border-slate-600 hover:bg-orange-400 hover:text-white !shadow-orange-400/30"
              >
                <Tag className="w-4 h-4 mr-2" /> {brand}
              </motion.custom>
            ))}
          </motion.div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">Browse by Category</h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category, index) => (
              <motion.custom
                key={category}
                variants={featureCardVariants}
                custom={index}
                component={Button}
                variant="outline"
                className="neumorphism-button dark:neumorphism-button text-gray-700 dark:text-gray-300 border-slate-300 dark:border-slate-600 hover:bg-sky-400 hover:text-white !shadow-sky-400/30"
              >
                <Car className="w-4 h-4 mr-2" /> {category}
              </motion.custom>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PopularBrandsAndCategoriesSection;
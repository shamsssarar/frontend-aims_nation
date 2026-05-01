"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// --- ANIMATION VARIANTS ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

export default function ContactPage() {
  // --- STATE FOR NODEMAILER INTEGRATION ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 👉 BACKEND PREPARATION: 
    // Once your backend is ready, we will replace this setTimeout with a real fetch() request to your API route that triggers Nodemailer.
    try {
      /* 
      Example future API call:
      await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      */
      
      // Simulating network delay for now
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSubmitting(false);
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 px-6 relative overflow-hidden transition-colors duration-300">
      
      {/* --- INDUSTRIAL BACKGROUND ELEMENTS --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* --- PAGE HEADER --- */}
        <motion.div 
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-center mb-20 space-y-4"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-semibold text-sm mb-4 border border-primary/20">
            We are online
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
            Let's build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#8AB071]">future.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">
            Whether you have questions about admissions, our curriculum, or potential partnerships, our team is ready to connect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
          
          {/* --- LEFT COLUMN: CONTACT INFO --- */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="col-span-1 space-y-6"
          >
            {/* Location Card */}
            <motion.div variants={fadeUp} className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl dark:shadow-none transition-all duration-300">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AiMS Headquarters</h3>
                  <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm space-y-1">
                    <p>Block-E, House-49 (3rd Floor)</p>
                    <p>3B Road 11</p>
                    <p>Dhaka 1212, Bangladesh</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div variants={fadeUp} className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl dark:shadow-none transition-all duration-300">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
                  <a href="mailto:aimsnation.bd@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                    aimsnation.bd@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.div variants={fadeUp} className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl dark:shadow-none transition-all duration-300">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Call Us</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Mon-Fri from 9am to 6pm.
                  </p>
                  <a href="tel:+8801234567890" className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm font-medium block mt-1">
                    +880 1234-567890
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* --- RIGHT COLUMN: THE FORM --- */}
          <motion.div 
            variants={slideInRight}
            initial="hidden"
            animate="show"
            className="col-span-1 lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              
              {/* Form internal subtle background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe" 
                      required 
                      className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com" 
                      required 
                      className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-700 dark:text-slate-300">Subject</Label>
                  <Input 
                    id="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?" 
                    required 
                    className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-700 dark:text-slate-300">Message</Label>
                  <Textarea 
                    id="message" 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..." 
                    required 
                    className="min-h-[150px] resize-y bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary dark:text-white p-4"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-[#587843] text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      Sending... <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                    </>
                  ) : isSuccess ? (
                    <>
                      Message Sent! <CheckCircle2 className="h-5 w-5 ml-2 text-white" />
                    </>
                  ) : (
                    <>
                      Send Message <Send className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                {isSuccess && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-primary font-medium mt-4"
                  >
                    Thank you! We have received your message and will be in touch shortly.
                  </motion.p>
                )}
              </form>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
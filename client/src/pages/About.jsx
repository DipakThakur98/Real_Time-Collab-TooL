import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Globe, Target, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div className="bg-white dark:bg-slate-800  transition-colors duration-300 min-h-screen">
            <Navbar />
            
            <main className="pt-40">
                {/* Hero */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-32">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white  tracking-tight leading-tight mb-8"
                    >
                        We’re on a mission to <br />
                        <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-100  decoration-8 underline-offset-8">connect teams.</span>
                    </motion.h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400  font-medium max-w-3xl mx-auto leading-relaxed">
                        CollabTool was founded on the belief that real-time collaboration should be effortless, secure, and beautiful. We build tools that help teams work together better, no matter where they are.
                    </p>
                </div>

                {/* Culture / Image */}
                <div className="px-6 lg:px-8 mb-32">
                    <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl relative h-[600px]">
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" 
                            alt="Our Team" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>
                        <div className="absolute bottom-20 left-20">
                            <h2 className="text-4xl font-black text-white">Built for the future of work.</h2>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="bg-gray-50 dark:bg-slate-800/50  py-32 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {[
                                { icon: Heart, title: 'User First', desc: 'Every feature we build starts with a real human need.' },
                                { icon: Shield, title: 'Secure by Design', desc: 'Privacy isn’t an option, it’s our fundamental baseline.' },
                                { icon: Globe, title: 'Remote Native', desc: 'We understand remote because we are remote.' },
                                { icon: Target, title: 'Extreme Speed', desc: 'Real-time means real-time. No lag, no friction.' },
                            ].map((value, i) => (
                                <div key={i} className="space-y-6">
                                    <div className="w-14 h-14 bg-white dark:bg-slate-800  rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400  shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 ">
                                        <value.icon size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white ">{value.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400  font-medium leading-relaxed">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Placeholder */}
                <div className="py-32 bg-white dark:bg-slate-800  transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white  mb-20 tracking-tight underline decoration-indigo-600 decoration-8 underline-offset-8">Meet the Team</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                            {[
                                { name: 'Alex Rivera', role: 'CEO & Founder', img: 'https://i.pravatar.cc/300?u=1' },
                                { name: 'Sarah Chen', role: 'CTO', img: 'https://i.pravatar.cc/300?u=2' },
                                { name: 'Marcus J.', role: 'Head of Product', img: 'https://i.pravatar.cc/300?u=3' },
                                { name: 'Jessica Miller', role: 'Lead Design', img: 'https://i.pravatar.cc/300?u=4' },
                            ].map((member, i) => (
                                <div key={i} className="group">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-indigo-600 rounded-full scale-105 opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                                        <img src={member.img} alt={member.name} className="w-40 h-40 rounded-full mx-auto grayscale group-hover:grayscale-0 transition-all duration-500 shadow-xl" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white ">{member.name}</h4>
                                    <p className="text-gray-400 dark:text-gray-500  font-bold uppercase tracking-widest text-xs mt-1">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;

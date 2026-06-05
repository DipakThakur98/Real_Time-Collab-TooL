import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Shield, HelpCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const Pricing = () => {
    const [billingCycle, setBillingCycle] = React.useState('monthly');
    const [loading, setLoading] = React.useState(false);
    const { user } = useAuth();
    const { showToast } = useToast();

    const handlePayment = async (plan) => {
        if (!user) {
            showToast('Please login to subscribe', 'error');
            return;
        }

        if (plan.amount === 0) {
            showToast('You are already on the Free plan');
            return;
        }

        setLoading(true);
        try {
            const amount = billingCycle === 'monthly' ? plan.amount : plan.yearlyAmount;
            const { data } = await api.post('/payments/create-checkout-session', {
                amount,
                planName: plan.name
            });

            if (data.url) {
                window.location.href = data.url;
            } else {
                showToast('Failed to create checkout session', 'error');
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Something went wrong';
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            name: "Free",
            price: "₹0",
            yearlyPrice: "₹0",
            amount: 0,
            desc: "Perfect for students and hobbyists.",
            features: ["Up to 3 documents", "Real-time collaboration", "24h chat history", "Community support"],
            cta: "Get Started",
            highlight: false
        },
        {
            name: "Pro",
            price: "₹999",
            yearlyPrice: "₹799",
            amount: 999,
            yearlyAmount: 799,
            desc: "For professionals and growing teams.",
            features: ["Unlimited documents", "Advanced security", "Unlimited chat history", "Priority email support", "Custom templates"],
            cta: "Go Pro",
            highlight: true
        },
        {
            name: "Team",
            price: "₹2499",
            yearlyPrice: "₹1999",
            amount: 2499,
            yearlyAmount: 1999,
            desc: "Full power for large organizations.",
            features: ["Everything in Pro", "Single Sign-On (SSO)", "Admin controls", "Dedicated account manager", "99.9% Uptime SLA"],
            cta: "Contact Sales",
            highlight: false
        }
    ];

    return (
        <div className="bg-[#f8fafc] dark:bg-slate-900  min-h-screen transition-colors duration-300">
            <Navbar />
            
            <main className="pt-40 pb-32 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white  tracking-tight">Simple Pricing</h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400  font-medium">
                            Choose the plan that's right for you. All plans include real-time collaboration.
                        </p>
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white ' : 'text-gray-400 dark:text-gray-500'}`}>Monthly</span>
                            <button 
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                className="w-14 h-8 bg-indigo-600 rounded-full p-1 relative flex items-center transition-all"
                            >
                                <div className={`w-6 h-6 bg-white dark:bg-slate-800 rounded-full shadow-sm transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                            <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white ' : 'text-gray-400 dark:text-gray-500'}`}>Yearly <span className="text-green-500 text-xs">(Save 20%)</span></span>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <motion.div 
                                key={plan.name}
                                whileHover={{ y: -10 }}
                                className={`relative p-12 rounded-[3rem] border transition-all duration-300 ${plan.highlight ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-500/20 ' : 'bg-white dark:bg-slate-800  border-gray-100 dark:border-slate-700  text-gray-900 dark:text-white  shadow-xl shadow-gray-100/50 '}`}
                            >
                                {plan.highlight && (
                                    <div className="absolute top-0 right-12 -translate-y-1/2 px-6 py-2 bg-amber-400 text-indigo-900 text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className="space-y-4 mb-10">
                                    <h3 className="text-2xl font-black">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-black">
                                            {billingCycle === 'monthly' ? plan.price : plan.yearlyPrice}
                                        </span>
                                        <span className={`text-sm font-bold ${plan.highlight ? 'text-indigo-200' : 'text-gray-400 dark:text-gray-500 '}`}>/month</span>
                                    </div>
                                    <p className={`font-medium ${plan.highlight ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400 '}`}>{plan.desc}</p>
                                </div>

                                <div className="space-y-5 mb-12">
                                    {plan.features.map(feat => (
                                        <div key={feat} className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-indigo-400' : 'bg-green-50 '}`}>
                                                <Check size={12} className={plan.highlight ? 'text-white' : 'text-green-600 '} />
                                            </div>
                                            <span className="text-sm font-bold">{feat}</span>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => handlePayment(plan)}
                                    disabled={loading}
                                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${plan.highlight ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:bg-indigo-900/30 shadow-xl' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 '}`}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : plan.cta}
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* FAQ Mini */}
                    <div className="mt-40 grid lg:grid-cols-2 gap-20">
                        <div className="space-y-6">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white  tracking-tight">Frequently Asked <br />Questions</h3>
                            <p className="text-lg text-gray-500 dark:text-gray-400  font-medium leading-relaxed">
                                Everything you need to know about our pricing and collaboration limits.
                            </p>
                        </div>
                        <div className="space-y-10">
                            {[
                                { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel, upgrade or downgrade your plan at any time from your dashboard." },
                                { q: "Do you offer discounts for students?", a: "Absolutely! Contact our support with your student ID for a 50% discount." },
                                { q: "Is my data secure?", a: "We use bank-level encryption and private servers to ensure your data is always safe." },
                            ].map((faq, i) => (
                                <div key={i} className="space-y-2">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white ">{faq.q}</h4>
                                    <p className="text-gray-500 dark:text-gray-400  font-medium">{faq.a}</p>
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

export default Pricing;

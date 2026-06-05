import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Zap, Users, MessageSquare, ShieldCheck, 
    RefreshCcw, Share2, Play, ChevronRight,
    CheckCircle2, Star, Github as GithubIcon, ArrowRight,
    Flame, TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    const [email, setEmail] = useState('');
    const [notifications, setNotifications] = useState([]);
    const addNotification = (msg) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, msg }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
    };
    const handleSubscribe = () => {
        if (email.trim()) {
            addNotification(`Subscribed with ${email}`);
            setEmail('');
        } else {
            addNotification('Please enter a valid email address');
        }
    };
    const fadeAll = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };
    const fadeIn = fadeAll; // keep existing variable name

    return (
        <div className="bg-white dark:bg-slate-800  transition-colors duration-300 overflow-x-hidden">
            <Navbar />

            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-8 text-center space-y-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-widest shadow-sm"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white/30"></span>
                </span>
                v2.0 is now live
            </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl md:text-8xl font-black text-white  tracking-tight leading-[0.9]"
                        >
                            Collaborate in <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-indigo-200">Real-Time.</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-indigo-100 font-medium leading-relaxed max-w-2xl mx-auto"
                        >
                            The ultimate workspace for teams to edit documents, chat instantly, and ship projects together seamlessly.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-lg shadow-2xl hover:bg-indigo-50 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                                Get Started Free <ArrowRight size={20} />
                            </Link>
                            <Link to="#demo" className="w-full sm:w-auto px-10 py-5 bg-transparent text-white border border-white/30 rounded-2xl font-black text-lg shadow-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
                                <Play size={20} className="text-white group-hover:scale-125 transition-transform" /> 
                                Live Demo
                            </Link>
                        </motion.div>
                    </div>
 
                    {/* --- Mockup / Demo Section --- */}
                    <motion.div 
                        id="demo"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-24 relative"
                    >
                        <div className="absolute inset-0 bg-indigo-600 blur-[120px] opacity-10 rounded-full scale-90"></div>
                        <div className="relative bg-white dark:bg-slate-800  rounded-[2rem] md:rounded-[3rem] p-4 shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20  border border-gray-100 dark:border-slate-700  overflow-hidden group">
                            <div className="bg-gray-50 dark:bg-slate-800/50  rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 dark:border-slate-700  p-2 relative overflow-hidden h-[400px] md:h-[600px]">
                                {/* Interactive Typing Demo Simulation */}
                                <div className="absolute top-4 left-6 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                </div>
                                
                                <div className="pt-16 px-8 md:px-16 text-left space-y-6">
                                    <motion.h2 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, delay: 1 }}
                                        className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white  border-r-4 border-indigo-600 overflow-hidden whitespace-nowrap pr-2"
                                    >
                                        Collaborative Research Paper
                                    </motion.h2>
                                    <motion.p 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 3 }}
                                        className="text-lg md:text-xl text-gray-400 dark:text-gray-500  font-medium leading-relaxed max-w-3xl"
                                    >
                                        The study of real-time synchronization in distributed systems shows that low-latency communication is essential for effective collaboration...
                                    </motion.p>
                                    
                                    <div className="flex flex-wrap gap-4 mt-12">
                                        {[
                                            { name: 'Sarah', color: 'bg-indigo-600' },
                                            { name: 'Marcus', color: 'bg-rose-500' },
                                            { name: 'Jessica', color: 'bg-amber-500' }
                                        ].map((user, i) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 3.5 + (i * 0.2) }}
                                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800  rounded-full shadow-lg border border-gray-50 dark:border-slate-700/50 "
                                            >
                                                <div className={`w-3 h-3 rounded-full ${user.color}`}></div>
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 ">{user.name} is typing</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-50  to-transparent"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Brand Scroller Section --- */}
            <section className="py-20 bg-white dark:bg-slate-800  border-b border-gray-50 dark:border-slate-700/50  overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <p className="text-center text-xs font-black text-gray-400 dark:text-gray-500  uppercase tracking-[0.4em] mb-12">Trusted by teams at</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Google', 'Netflix', 'Discord', 'Stripe', 'Airbnb', 'Notion'].map((brand) => (
                            <span key={brand} className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white  tracking-tighter hover:text-indigo-600 dark:text-indigo-400 transition-colors cursor-default">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Stats Section --- */}
            <section className="py-20 border-y border-gray-50 dark:border-slate-700/50  bg-gray-50 dark:bg-slate-800/50/30  transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: 'Active Users', value: '10k+' },
                            { label: 'Docs Created', value: '500k+' },
                            { label: 'Uptime', value: '99.9%' },
                            { label: 'Team Size', value: '50+' },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white ">{stat.value}</h3>
                                <p className="text-sm font-bold text-gray-400 dark:text-gray-500  uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Features Section --- */}
            <section id="features" className="py-32 bg-white dark:bg-slate-800  transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
                        <h2 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">Features</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white  tracking-tight">Everything you need to collaborate.</h3>
                        <p className="text-lg text-gray-500 dark:text-gray-400  font-medium">A unified workspace designed for modern engineering and creative teams.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: Zap, 
                                title: 'Real-Time Editing', 
                                desc: 'Experience zero-latency document synchronization powered by WebSockets.',
                                color: 'bg-amber-50 text-amber-600  '
                            },
                            { 
                                icon: MessageSquare, 
                                title: 'Instant Chat', 
                                desc: 'Communicate with your team directly inside the editor without switching tabs.',
                                color: 'bg-blue-50 text-blue-600  '
                            },
                            { 
                                icon: ShieldCheck, 
                                title: 'Secure Auth', 
                                desc: 'Advanced JWT-based authentication ensures your private documents stay private.',
                                color: 'bg-green-50 text-green-600  '
                            },
                            { 
                                icon: Users, 
                                title: 'Team Support', 
                                desc: 'Invite unlimited collaborators and see exactly where they are with cursor tracking.',
                                color: 'bg-purple-50 text-purple-600  '
                            },
                            { 
                                icon: RefreshCcw, 
                                title: 'Auto Save', 
                                desc: 'Your work is saved every 2 seconds. Never worry about losing progress again.',
                                color: 'bg-rose-50 text-rose-600  '
                            },
                            { 
                                icon: Share2, 
                                title: 'One-Click Share', 
                                desc: 'Share your work instantly via public or private links with custom permissions.',
                                color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400  '
                            },
                        ].map((feat, i) => (
                            <motion.div 
                                key={i}
                                {...fadeIn}
                                className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-800  border border-gray-100 dark:border-slate-700  hover:border-indigo-100 dark:border-indigo-900/30  transition-all duration-500"
                            >
                                <div className={`w-14 h-14 ${feat.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <feat.icon size={32} />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 dark:text-white  mb-4">{feat.title}</h4>
                                <p className="text-gray-500 dark:text-gray-400  font-medium leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Collaboration Highlights --- */}
<section id="collaboration" className="py-32 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-12">Collaboration in Action</h2>
    <div className="grid md:grid-cols-2 gap-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative rounded-[2rem] bg-white dark:bg-slate-800 p-8 shadow-2xl border border-gray-100 dark:border-slate-700"
      >
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Live Editing</h3>
        <p className="text-gray-600 dark:text-gray-300">See changes appear instantly as teammates type.</p>
        <Flame size={96} className="text-pink-600 dark:text-pink-400 mt-6" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative rounded-[2rem] bg-white dark:bg-slate-800 p-8 shadow-2xl border border-gray-100 dark:border-slate-700"
      >
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Integrated Chat</h3>
        <p className="text-gray-600 dark:text-gray-300">Chat without leaving the editor.</p>
        <TrendingUp size={96} className="text-green-600 dark:text-green-400 mt-6" />
      </motion.div>
    </div>
  </div>
</section>
{/* --- How It Works --- */}
            <section className="py-32 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 blur-[150px] rounded-full -mr-[400px] -mt-[400px]"></div>
                
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Workflow</h2>
                                <h3 className="text-5xl font-black tracking-tight leading-tight">Start collaborating <br />in seconds.</h3>
                            </div>

                            <div className="space-y-10">
                                {[
                                    { step: '01', title: 'Create Workspace', desc: 'Sign up and create your first shared document in one click.' },
                                    { step: '02', title: 'Invite the Team', desc: 'Send a link to your colleagues and see them join instantly.' },
                                    { step: '03', title: 'Ship Faster', desc: 'Edit together, chat in real-time, and get your project done.' },
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="text-4xl font-black text-gray-800 dark:text-gray-200 group-hover:text-indigo-400 transition-colors">{step.step}</div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-bold">{step.title}</h4>
                                            <p className="text-gray-400 dark:text-gray-500 font-medium">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-indigo-600/20 rounded-[3rem] border border-white/10 flex items-center justify-center p-12">
                                <div className="space-y-8 w-full">
                                    <div className="h-4 bg-white dark:bg-slate-800/20 rounded-full w-2/3 animate-pulse"></div>
                                    <div className="h-4 bg-white dark:bg-slate-800/10 rounded-full w-full"></div>
                                    <div className="h-4 bg-white dark:bg-slate-800/10 rounded-full w-5/6"></div>
                                    <div className="h-32 bg-indigo-50 dark:bg-indigo-900/300/20 rounded-3xl border border-white/5 flex items-center justify-center">
                                        <Users className="text-indigo-400 animate-bounce" size={48} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

           {/* Inserted sections */}

{/* --- Blog Section --- */}
<section id="blog" className="py-32 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-12 text-center">Our Blog</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {[
        {title: 'Real-time Collaboration at Scale', excerpt: 'Explore how our new architecture enables seamless teamwork.', img: 'https://picsum.photos/seed/blog1/400/300'},
        {title: 'Secure Authentication Practices', excerpt: 'Best practices for JWT and session isolation.', img: 'https://picsum.photos/seed/blog2/400/300'},
        {title: 'Designing Premium UI Experiences', excerpt: 'Tips for creating stunning landing pages.', img: 'https://picsum.photos/seed/blog3/400/300'},
      ].map((post, i) => (
        <motion.div key={i} {...fadeIn} className="bg-white dark:bg-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <img src={post.img} alt={post.title} className="w-full h-48 object-cover"/>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{post.title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{post.excerpt}</p>
            <Link to="/blog" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Read more →</Link>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* --- Popular Posts Section --- */}
<section id="popular" className="py-32 bg-white dark:bg-slate-800 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-12 text-center">Popular Content</h2>
    <div className="grid md:grid-cols-2 gap-8">
      {[
        {title: 'Live Demo', icon: Flame, color: 'bg-red-50 text-red-600'},
        {title: 'Trending Guides', icon: TrendingUp, color: 'bg-green-50 text-green-600'},
      ].map((item, i) => (
        <motion.div key={i} {...fadeIn} className={`flex items-center p-8 rounded-2xl ${item.color} shadow-md hover:scale-105 transition-transform duration-300`}>
          <item.icon size={48} className="mr-6"/>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* --- Testimonials --- */}
            <section className="py-32 bg-white dark:bg-slate-800  transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white  tracking-tight underline decoration-indigo-600 decoration-8 underline-offset-8">Loved by Teams</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sarah Chen', role: 'Senior Architect', text: 'The real-time sync is better than Google Docs. The minimal UI keeps my team focused.' },
                            { name: 'Marcus Rodriguez', role: 'Product Manager', text: 'Finally, a collaboration tool that feels like it was built for modern developers.' },
                            { name: 'Jessica Miller', role: 'UX Designer', text: 'The integrated chat makes a huge difference. No more jumping between Slack and the editor.' },
                        ].map((t, i) => (
                            <div key={i} className="p-12 rounded-[2.5rem] bg-gray-50 dark:bg-slate-800/50  border border-gray-100 dark:border-slate-700  flex flex-col justify-between hover:scale-105 transition-transform duration-300">
                                <div className="space-y-6">
                                    <div className="flex gap-1 text-amber-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                                    </div>
                                    <p className="text-xl font-medium text-gray-700 dark:text-gray-300  italic">"{t.text}"</p>
                                </div>
                                <div className="mt-10 pt-8 border-t border-gray-200 ">
                                    <h5 className="font-bold text-gray-900 dark:text-white ">{t.name}</h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400  font-medium">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Newsletter Section --- */}
            <section className="py-32 bg-indigo-50 dark:bg-indigo-900/30 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white">Newsletter</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Get the latest updates on collaboration features and team productivity.</p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">me mera gmail hai thakurdipak me pudates ane chayiye</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            onClick={handleSubscribe}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
            {/* Notification container */}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                {notifications.map((n) => (
                    <div key={n.id} className="bg-indigo-600 text-white px-4 py-2 rounded shadow-md">
                        {n.msg}
                    </div>
                ))}
            </div>
            {/* --- CTA --- */}
          <section className="py-32">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl" style={{background: 'linear-gradient(135deg, #7F00FF, #E100FF)'}}>
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-[3rem]"></div>
            <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Ready to collaborate?</h2>
                <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto">
                    Join over 10,000+ users building amazing things together. Start for free today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link to="/register" className="px-12 py-6 bg-white text-indigo-600 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                        Get Started Free
                    </Link>
                    <a href="https://github.com" className="flex items-center gap-2 text-white font-bold hover:text-indigo-200">
                        <GithubIcon size={24} /> View on GitHub
                    </a>              
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Home;

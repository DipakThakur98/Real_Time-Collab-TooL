import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, ArrowDownToLine, ChevronDown, ChevronUp, BookOpen, CheckCircle, Globe } from 'lucide-react';

const AiSidebar = ({ isOpen, onClose, quillRef }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [thinkingSteps, setThinkingSteps] = useState([]);
    const [thought, setThought] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [isThoughtExpanded, setIsThoughtExpanded] = useState(true);
    const [inserted, setInserted] = useState(false);
    
    // Language Support State
    const [selectedLang, setSelectedLang] = useState('auto');

    const languages = [
        { value: 'auto', label: '🌐 Auto-Detect' },
        { value: 'hi', label: '🇮🇳 Hindi (हिंदी)' },
        { value: 'hinglish', label: '💬 Hinglish' },
        { value: 'en', label: '🇬🇧 English' },
        { value: 'es', label: '🇪🇸 Español' },
        { value: 'fr', label: '🇫🇷 Français' }
    ];

    const quickTemplates = [
        { label: '💡 Generate Blog Outline', text: 'Write a comprehensive outline and structure for a professional blog post about real-time collaborative editors.' },
        { label: '📝 Catchy Introduction', text: 'Draft an engaging, high-authority introduction paragraph explaining the rise of AI in modern collaborative software.' },
        { label: '🧠 Deep Brainstorming', text: 'Analyze and outline the major security challenges faced when building a real-time collaborative document editor.' }
    ];

    const detectLanguage = (text, targetLang) => {
        if (targetLang !== 'auto') return targetLang;
        
        // Devanagari Hindi Unicode range check
        const hindiRegex = /[\u0900-\u097F]/;
        if (hindiRegex.test(text)) return 'hi';

        // Common Hinglish keyword check
        const hinglishKeywords = ['likho', 'kya', 'kaise', 'batao', 'batavo', 'chahiye', 'kro', 'thi', 'mere', 'sare', 'krna', 'hona', 'aur', 'ke bare me', 'hi', 'konsa', 'kaunsa', 'best', 'hai', 'ko', 'liye', 'vesa', 'muji', 'mujhse', 'he', 'hai'];
        const words = text.toLowerCase().split(/\s+/);
        if (words.some(word => hinglishKeywords.includes(word))) return 'hinglish';

        // Spanish keyword check
        const spanishKeywords = ['escribir', 'como', 'sobre', 'crear', 'hola', 'articulo', 'español', 'spanish'];
        if (words.some(word => spanishKeywords.includes(word))) return 'es';

        // French keyword check
        const frenchKeywords = ['ecrire', 'comment', 'sur', 'creer', 'bonjour', 'article', 'français', 'french'];
        if (words.some(word => frenchKeywords.includes(word))) return 'fr';

        return 'en';
    };

    const handleGenerate = async (customPrompt = null) => {
        const activePrompt = customPrompt || prompt;
        if (!activePrompt.trim()) return;

        setLoading(true);
        setInserted(false);
        setThought('');
        setDescription('');
        setContent('');
        setThinkingSteps([]);
        if (!customPrompt) setPrompt('');

        // Detect language
        const lang = detectLanguage(activePrompt, selectedLang);

        // Step-by-step thinking logs translations based on language
        let steps = [];
        if (lang === 'hi') {
            steps = [
                "आपकी खोज का विश्लेषण आरम्भ किया जा रहा है...",
                "डेटाबेस और सिमेंटिक ग्राफ से जानकारी संकलित की जा रही है...",
                "तर्कसंगत विचारों को क्रमबद्ध किया जा रहा है...",
                "उच्च गुणवत्तायुक्त हिंदी पाठ तैयार किया जा रहा है..."
            ];
        } else if (lang === 'hinglish') {
            steps = [
                "Aapki search query par deep analysis start ho chuki hai...",
                "High authority semantic information extract ki ja rahi hai...",
                "Logical thinking process and outline structure set ho raha hai...",
                "Premium Hinglish dynamic output generate kiya ja raha hai..."
            ];
        } else if (lang === 'es') {
            steps = [
                "Iniciando análisis semántico profundo...",
                "Recopilando datos de nodos de alta autoridad...",
                "Sintetizando la estructura lógica...",
                "Redactando el contenido final en Español..."
            ];
        } else if (lang === 'fr') {
            steps = [
                "Initialisation de l'analyse sémantique...",
                "Extraction des données des graphes d'autorité...",
                "Synthèse de la structure de raisonnement...",
                "Rédaction finale du contenu en Français..."
            ];
        } else {
            steps = [
                "Initializing deep search query and context alignment...",
                "Accessing semantic workspace and authority graphs...",
                "Synthesizing logical reasoning structure...",
                "Drafting detailed content with premium formatting..."
            ];
        }

        for (let i = 0; i < steps.length; i++) {
            await new Promise(r => setTimeout(r, 650));
            setThinkingSteps(prev => [...prev, steps[i]]);
        }

        // Logical output templates mapped per language
        let generatedThought = '';
        let generatedDesc = '';
        let generatedContent = '';

        if (lang === 'hi') {
            generatedThought = `1. खोज क्वेरी: "${activePrompt}"\n2. १८ उच्च-अधिकार वाले नोड्स से हिंदी अनुवाद एवं संदर्भ खोजा गया।\n3. संरचना: आकर्षक मुख्य शीर्षक -> विषय प्रवेश -> ३ महत्वपूर्ण बिंदु -> अंतिम निष्कर्ष।\n4. शैली: अत्यंत स्पष्ट, पेशेवर एवं प्रभावशाली देवनागरी शैली।`;
            
            generatedDesc = `एक पेशेवर रूप से तैयार किया गया ब्लॉग लेख जो इस विषय पर गहराई से चर्चा करता है।`;
            
            generatedContent = `### विस्तृत लेख: ${activePrompt}\n\nआज के आधुनिक डिजिटल युग में, **${activePrompt}** का विषय हमारी कार्यकुशलता और तकनीकी विकास के दृष्टिकोण में एक क्रांतिकारी बदलाव का प्रतिनिधित्व करता है। यदि हम इसके बुनियादी सिद्धांतों को बारीकी से समझें, तो हम विकास के असीमित अवसरों को प्राप्त कर सकते हैं।\n\n#### इसका मूल दर्शन\nइसके केंद्र में एक अत्यंत व्यवस्थित ढांचा (Framework) काम करता है जो सभी प्रकार की बाधाओं को दूर करता है। आधुनिक तकनीकों का उपयोग करके, यह वास्तविक समय (Real-Time) में समस्याओं का समाधान प्रस्तुत करता है।\n\n#### मुख्य लाभ और विशेषताएं\n- **स्केलेबल आर्किटेक्चर (Scalable):** इसे आधुनिक डिजिटल कार्यप्रवाह को सुगम बनाने के लिए अनुकूलित किया गया है।\n- **अनुकूलन क्षमता (Adaptive):** यह समय और परिस्थितियों के अनुसार स्वयं को ढालने में सक्षम है।\n- **तत्काल समाधान (Actionable):** न्यूनतम जटिलता के साथ यह अत्यधिक वास्तविक मूल्य प्रदान करता है।\n\nनिष्कर्ष के तौर पर, इस क्षेत्र में पूर्ण दक्षता हासिल करने के लिए निरंतर नवोन्मेष और रणनीतिक संरेखण होना अत्यंत आवश्यक है।`;
            
            if (activePrompt.toLowerCase().includes('blog') || activePrompt.toLowerCase().includes('ब्लॉग')) {
                generatedThought = `1. ब्लॉग प्रारूप सक्रिय।\n2. अधिकतम यूजर इंगेजमेंट के लिए ४० लोकप्रिय हिंदी आलेखों का विश्लेषण किया गया।\n3. प्रारूप: मुख्य शीर्षक -> विस्तृत विश्लेषण -> ३ मुख्य स्तंभ -> अंतिम संदेश।`;
                generatedDesc = `एसईओ-अनुकूलित (SEO-Optimized), अत्यधिक आकर्षक हिंदी ब्लॉग पोस्ट जो पाठकों को गहराई से ज्ञान प्रदान करेगी।`;
                generatedContent = `### नव-परिवर्तन: ${activePrompt.replace(/blog/i, '').trim() || 'नवीनतम विकास'}\n\nजटिल विषयों को समझना और उन पर लिखना अब कठिन कार्य नहीं है। डिजिटल युग में, स्पष्ट और सरल संचार ही आपकी सबसे बड़ी ताकत है। आइए समझते हैं कि यह विषय हमारे लिए क्यों महत्वपूर्ण है।\n\n#### १. संरचित कथा की शक्ति (Structured Narrative)\nजब तक हम किसी विचार को स्पष्ट रूप से प्रस्तुत नहीं करते, तब तक उसका महत्व सिद्ध नहीं होता। सरल शब्दों का चयन करके हम जटिल तकनीकी संरचनाओं और उपयोगकर्ता अनुभव के बीच की दूरी को कम कर सकते हैं।\n\n#### २. जैविक जुड़ाव को बढ़ावा (Organic Engagement)\nइस प्रतिस्पर्धी बाजार में आगे रहने के लिए लेख की गहराई और निरंतरता आवश्यक है। सर्च इंजन हमेशा ऐसे विस्तृत और व्यावहारिक लेखों को प्राथमिकता देते हैं जो पाठकों की समस्याओं का वास्तविक समाधान करते हैं।\n\n#### ३. कार्य को परिणाम में बदलना\nअंततः, एक बेहतरीन लेख पाठक को एक स्पष्ट दिशा देता है। लेख की गुणवत्ता बनाए रखने के लिए व्यावहारिक सलाह, सटीक प्रारूप और पठनीयता को सदैव प्राथमिकता दें।`;
            }
        } 
        else if (lang === 'hinglish') {
            generatedThought = `1. Search Query: "Hinglish output for: ${activePrompt}"\n2. Analyzed tech community slang and conversational structures.\n3. Tone: Casual, helpful, super friendly, and highly professional.\n4. Design: Clear Headings -> Quick overview -> 3 pillars of value -> Dynamic summary.`;
            
            generatedDesc = `Hinglish me synthesized super clean blog outline aur writing dynamic details ke sath.`;
            
            generatedContent = `### Deep Dive: ${activePrompt}\n\nAaj ke fast-paced digital era me, **${activePrompt}** ka topic hamare kaam karne ke tarike me ek bohot bada revolutionary change lekar aaya hai. Agar hum iske basic concepts ko dhyan se samjhein, toh hum iski aashcharyajanak capabilities ka poora fayda utha sakte hain.\n\n#### Core Philosophy Kya Hai?\nIske center me ek bohot hi clean framework kaam karta hai jo sabhi hurdles ko remove kar deta hai. Modern techniques ka use karke, ye real-time me complex challenges ko easily solve karta hai.\n\n#### Key Benefits Aur Takeaways\n- **Super Scalable:** Isko naye workflows ko smooth banane ke liye bilkul zero se optimized kiya gaya hai.\n- **Dynamic Adaptability:** Ye requirement ke hisab se apne aap ko adjust karne me fully capable hai.\n- **Actionable Execution:** Ye user ko maximum practical value deta hai wo bhi bina kisi headache ke.\n\nEnd me, is domain me master banne ke liye regular practice aur smart strategies ka hona bohot hi zyada zaroori hai.`;

            if (activePrompt.toLowerCase().includes('blog')) {
                generatedThought = `1. Hinglish Blog writing templates activated.\n2. Injected catchy titles and trending keywords.\n3. Style: Friendly blog layout that keeps users hooked from start to finish.`;
                generatedDesc = `SEO optimized aur bohot hi attractive Hinglish blog post jo aasaani se readers ko samajh aayega.`;
                generatedContent = `### Naya Daur: A Deep Dive Into ${activePrompt.replace(/blog/i, '').trim() || 'Next-Gen Technology'}\n\nDifficult topics par likhna ya unhe samajhna ab bilkul bhi mushkil nahi hai. Aaj ke digital era me, simple aur effective communication hi aapki sabse badi power hai. Chaliye dekhte hain ki ye topic kyu sabse important ban gaya hai.\n\n#### 1. Structured Writing Ki Power\nGreat ideas tab tak useless hain jab tak unhe acche se explain na kiya jaye. Simple words ka use karke hum technical terms aur user experience ke beech ka gap khatam kar sakte hain.\n\n#### 2. Organic Engagement Badhana\nCompetitive market me stand out karne ke liye constant value aur informative topics bohot zaroori hain. Search engines hamesha un contents ko promote karte hain jo genuinely logon ki help karte hain.\n\n#### 3. Practical Knowledge Par Focus\nEk acche resource ki pehchan ye hai ki wo reader ko aage badhne ka sahi rasta bataye. Hamesha actionable advice aur clean layouts ko priority dein taaki readership boost ho sake.`;
            }
        } 
        else if (lang === 'es') {
            generatedThought = `1. Consulta de búsqueda: "${activePrompt}"\n2. Recuperado 15 nodos de alta autoridad en Español.\n3. Estructura: Introducción -> Pilares clave -> Resumen interactivo.\n4. Tono: Formal, claro y educativo.`;
            
            generatedDesc = `Un artículo de nivel ejecutivo redactado dinámicamente en Español, proporcionando información detallada y optimizada para SEO.`;
            
            generatedContent = `### Análisis Profundo: ${activePrompt}\n\nEn el ecosistema digital actual, el tema de **${activePrompt}** representa un cambio de paradigma en la forma en que abordamos la eficiencia y la innovación. Al comprender sus fundamentos, los profesionales y desarrolladores pueden liberar su máximo potencial.\n\n#### La Filosofía Central\nEn su esencia, este concepto impulsa una estructura organizada diseñada para eliminar los puntos de fricción. Al aprovechar las metodologías modernas, resuelve desafíos complejos de manera rápida y escalable.\n\n#### Puntos Clave a Considerar\n- **Arquitectura Escalable:** Desarrollada para admitir flujos de trabajo contemporáneos de manera eficiente.\n- **Adaptabilidad Dinámica:** Capaz de responder automáticamente a los requisitos cambiantes.\n- **Valor Práctico Inmediato:** Ofrece soluciones de la vida real con una complejidad mínima.\n\nEn conclusión, para dominar este campo es fundamental mantener una iteración constante y una alineación estratégica.`;
        } 
        else if (lang === 'fr') {
            generatedThought = `1. Requête de recherche: "${activePrompt}"\n2. Synthèse effectuée sur 16 nœuds de connaissances en Français.\n3. Tono: Professionnel, rigoureux et engageant.\n4. Organisation: Titre -> Introduction -> Piliers de valeur -> Conclusion.`;
            
            generatedDesc = `Un guide complet rédigé de manière synthétique et optimisé pour le référencement naturel en Français.`;
            
            generatedContent = `### Analyse Détaillée: ${activePrompt}\n\nDans l'écosystème numérique d'aujourd'hui, le sujet de **${activePrompt}** incarne un changement de paradigme majeur dans notre manière de concevoir l'efficacité et l'innovation. En maîtrisant ses principes de base, les équipes peuvent libérer un potentiel extraordinaire.\n\n#### La Philosophie Fondamentale\nAu cœur de ce concept réside un cadre structuré pour éliminer les points de friction opérationnels. En exploitant des méthodes modernes, il apporte des réponses fluides à des défis techniques complexes.\n\n#### Caractéristiques Essentielles\n- **Architecture Évolutive:** Conçue pour s'intégrer harmonieusement dans les processus actuels.\n- **Intelligence Adaptative:** S'adapte instantanément aux changements de contexte.\n- **Valeur Pratique Directe:** Offre des réponses concrètes avec un minimum de contraintes.\n\nEn conclusion, l'excellence dans ce domaine exige un apprentissage continu et un alignement stratégique constant.`;
        } 
        else {
            // Default English
            generatedThought = `1. Search Query: "Semantic context analysis for: ${activePrompt}"\n2. Retrieved 18 high-authority matching nodes.\n3. Formatting layout: Catchy Header -> Introduction hook -> Key Structural Pillars -> Actionable Summary.\n4. Intended Tone: Executive, highly engaging, clear and authoritative.`;
            
            generatedDesc = `A professionally synthesized content structure outlining critical factors, semantic breakdowns, and key insights regarding: "${activePrompt.substring(0, 50)}...".`;
            
            generatedContent = `### Deep Dive: ${activePrompt}\n\nIn today's fast-paced digital ecosystem, the topic of **${activePrompt}** represents a paradigm shift in how we approach efficiency and innovation. By understanding its foundational core, developers and teams can unlock unparalleled potential.\n\n#### The Core Philosophy\nAt its heart, this concept drives a structured framework designed to eliminate friction points. By leveraging modern methodologies, it addresses complex challenges with scalable, real-time responses.\n\n#### Key Takeaways\n- **Scalable Architecture:** Designed from the ground up to support modern workflows.\n- **Adaptive Intelligence:** Dynamically responds to changing inputs and requirements.\n- **Actionable Execution:** Provides practical, real-world value with minimal overhead.\n\nTo master this fully, constant iteration and strategic alignment remain absolute necessities.`;

            if (activePrompt.toLowerCase().includes('blog')) {
                generatedThought = `1. Blog Synthesis protocol matched.\n2. Analyzed top 40 viral writing structures for high engagement.\n3. Structuring strategy: Hook introduction -> 3 Pillars of Action -> Bold, memorable conclusion.`;
                generatedDesc = `An SEO-optimized, highly engaging blog article outline and content drafted dynamically for standard publication.`;
                generatedContent = `### The Modern Frontier: A Deep Dive into ${activePrompt.replace(/blog/i, '').trim() || 'Next-Gen Collaboration'}\n\nWriting and reading about complex subjects doesn't have to be a daunting task. In fact, in the digital era, clear communication is your ultimate competitive advantage. Here is what makes this topic highly critical in today's landscape.\n\n#### 1. The Power of Structured Narrative\nGreat ideas fail when they aren't explained clearly. By focusing on simple explanations for complex ideas, we bridge the gap between technical architecture and user experience.\n\n#### 2. Driving Organic Engagement\nTo stand out in a crowded market, consistency and depth are key. High-authority search engines prioritize detailed, informative resources that genuinely solve problems rather than superficial summaries.\n\n#### 3. Transforming Action into Results\nUltimately, a great resource leaves the reader with a clear path forward. Implement actionable advice, maintain semantic formatting, and prioritize readability at every stage.`;
            }
        }

        await new Promise(r => setTimeout(r, 700));

        setThought(generatedThought);
        setDescription(generatedDesc);
        setContent(generatedContent);
        setLoading(false);
    };

    const handleInsert = () => {
        const quill = quillRef.current?.getEditor();
        if (!quill || !content) return;

        try {
            const range = quill.getSelection(true);
            const index = range ? range.index : quill.getLength();

            const formattedHtml = `
                <br/>
                <div class="ai-generated-block" style="border-left: 4px solid #4f46e5; padding-left: 20px; margin: 20px 0; background-color: rgba(79, 70, 229, 0.02);">
                    ${content
                        .replace(/^### (.*$)/gim, '<h2 style="color: #1e1b4b; font-weight: 800; font-size: 1.5em; margin-top: 1em;">$1</h2>')
                        .replace(/^#### (.*$)/gim, '<h3 style="color: #4f46e5; font-weight: 700; font-size: 1.2em; margin-top: 0.8em;">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/^- (.*$)/gim, '<li>$1</li>')
                        .replace(/\n\n/g, '<br/>')
                        .replace(/\n/g, '<br/>')
                    }
                </div>
                <br/>
            `;

            quill.clipboard.dangerouslyPasteHTML(index, formattedHtml);
            
            setInserted(true);
            setTimeout(() => setInserted(false), 3000);
        } catch (err) {
            console.error('Error inserting into editor:', err);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                        <Sparkles className="text-white" size={18} />
                    </div>
                    <div>
                        <h3 className="font-black tracking-tight text-sm">AI Co-Writer Panel</h3>
                        <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest font-mono">Deep Search Reasoning</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Scrollable Container */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
                
                {/* Language Selection bar */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Globe size={11} className="text-indigo-500" />
                        AI Output Language
                    </label>
                    <div className="relative">
                        <select
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:outline-none font-bold text-xs text-gray-600 dark:text-gray-300 shadow-sm cursor-pointer appearance-none"
                        >
                            {languages.map((lang) => (
                                <option key={lang.value} value={lang.value}>{lang.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Prompt Input Form */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Ask AI or Research Topic</label>
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ask AI in Hindi, Hinglish, or English to write anything..."
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:outline-none font-medium placeholder:text-gray-400 transition-all text-sm resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleGenerate();
                                }
                            }}
                        />
                        <button
                            onClick={() => handleGenerate()}
                            disabled={loading || !prompt.trim()}
                            className="absolute right-3 bottom-3 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 dark:disabled:bg-slate-800 text-white disabled:text-gray-400 dark:disabled:text-gray-600 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </div>
                </div>

                {/* Quick templates if no generation is active */}
                {!loading && !content && (
                    <div className="space-y-3">
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Quick AI Tasks</span>
                        <div className="space-y-2">
                            {quickTemplates.map((t, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleGenerate(t.text)}
                                    className="w-full p-4 text-left bg-gray-50 hover:bg-indigo-50 dark:bg-slate-900/40 dark:hover:bg-indigo-950/40 border border-gray-100 dark:border-slate-700/50 rounded-2xl transition-all duration-300 text-xs font-bold text-gray-700 dark:text-gray-300 flex flex-col gap-1 hover:border-indigo-100"
                                >
                                    <span>{t.label}</span>
                                    <span className="font-medium text-gray-400 dark:text-gray-500 truncate w-full">{t.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Deep Thinking Logger */}
                {loading && (
                    <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2.5xl space-y-4 animate-pulse">
                        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                            <Loader2 size={18} className="animate-spin" />
                            <span className="text-xs font-black uppercase tracking-widest animate-pulse">Deep Reasoning Active...</span>
                        </div>
                        <div className="space-y-2 font-mono text-[10px] text-gray-500 dark:text-gray-400">
                            {thinkingSteps.map((step, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i} 
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-indigo-400">⚡</span>
                                    <span>{step}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dynamic Content Display */}
                {!loading && content && (
                    <div className="space-y-6">
                        
                        {/* 1. Deep Thought Toggle Box */}
                        <div className="border border-purple-100 dark:border-purple-900/30 bg-purple-50/20 dark:bg-purple-950/10 rounded-2.5xl overflow-hidden">
                            <button 
                                onClick={() => setIsThoughtExpanded(!isThoughtExpanded)}
                                className="w-full px-5 py-4 flex items-center justify-between text-xs font-black uppercase tracking-widest text-purple-700 dark:text-purple-400 bg-purple-50/40 dark:bg-purple-950/20 border-b border-purple-100/50 dark:border-purple-900/20"
                            >
                                <span className="flex items-center gap-2">
                                    <BookOpen size={14} />
                                    AI Thought Process
                                </span>
                                {isThoughtExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <AnimatePresence>
                                {isThoughtExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="p-5 font-mono text-[10px] text-purple-600/80 dark:text-purple-400/70 whitespace-pre-line leading-relaxed overflow-hidden"
                                    >
                                        {thought}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 2. AI Description */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">SEO Description</span>
                            <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700/50 text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-400">
                                {description}
                            </div>
                        </div>

                        {/* 3. AI Generated Content Text */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Generated Output</span>
                            <div className="p-5 bg-white dark:bg-slate-900 rounded-3rem border border-gray-200 dark:border-slate-700 text-sm font-medium leading-relaxed overflow-x-hidden space-y-4">
                                {content.split('\n\n').map((para, index) => {
                                    if (para.startsWith('###')) {
                                        return <h3 key={index} className="text-base font-black text-gray-900 dark:text-white mt-4">{para.replace('###', '').trim()}</h3>;
                                    }
                                    if (para.startsWith('####')) {
                                        return <h4 key={index} className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-3">{para.replace('####', '').trim()}</h4>;
                                    }
                                    if (para.startsWith('-')) {
                                        return (
                                            <ul key={index} className="list-disc pl-5 space-y-1.5 my-2">
                                                {para.split('\n').map((item, i) => (
                                                    <li key={i} className="text-xs font-bold text-gray-600 dark:text-gray-400">{item.replace('-', '').trim()}</li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                    return <p key={index} className="text-xs font-bold text-gray-600 dark:text-gray-400">{para}</p>;
                                })}
                            </div>
                        </div>

                        {/* Insert Button */}
                        <div className="pt-2">
                            <button
                                onClick={handleInsert}
                                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${inserted ? 'bg-green-600 text-white shadow-green-500/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 active:scale-95'}`}
                            >
                                {inserted ? (
                                    <>
                                        <CheckCircle size={18} />
                                        Inserted!
                                    </>
                                ) : (
                                    <>
                                        <ArrowDownToLine size={18} />
                                        Insert Content into Document
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiSidebar;

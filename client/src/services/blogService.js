// Simulated AI Blog Service
// In a real production app, this would fetch from a backend API powered by GPT-4/LLMs

const initialPosts = [
    {
        id: '1',
        title: "The Impact of LLMs on Collaborative Coding",
        subtitle: "How AI is changing the way developers work together in real-time.",
        excerpt: "Deep dive into WebSockets and Operational Transformation that powers modern editors like Google Docs.",
        category: "Technical",
        author: "Alex Rivera",
        date: "Oct 12, 2023",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
        content: `
            <p>Large Language Models (LLMs) are no longer just fancy autocomplete tools. They are becoming integral members of development teams. In this deep dive, we explore how real-time collaborative environments are being transformed by AI-assisted pair programming.</p>
            <h3>The Evolution of Collaboration</h3>
            <p>Traditional collaboration meant sharing a screen or using basic multi-cursor editors. With the integration of LLMs, the "collaborator" can now be an intelligent agent that suggests architectural patterns, refactors code on the fly, and even writes unit tests while you focus on business logic.</p>
        `
    },
    {
        id: '2',
        title: "Building AI-Assisted Real-Time Editors",
        subtitle: "A step-by-step tutorial on integrating OpenAI API with Socket.IO.",
        excerpt: "Learn how to use React, Socket.IO, and Quill to build a high-performance real-time text editor.",
        category: "Tutorial",
        author: "Sarah Chen",
        date: "Oct 15, 2023",
        readTime: "12 min read",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
        content: `
            <p>In this tutorial, we will build a simplified version of CollabTool's AI features. We'll use React for the frontend, Node.js for the backend, and the OpenAI GPT-4 API for our intelligence layer.</p>
            <h3>Step 1: Setting up the Socket</h3>
            <p>First, we need a stable bidirectional connection. Socket.IO allows us to stream AI tokens directly to the client as they are generated.</p>
        `
    }
];

export const getBlogPosts = () => {
    return initialPosts;
};

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle2 className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />
    };

    const colors = {
        success: 'border-green-100 bg-green-50  ',
        error: 'border-red-100 bg-red-50  ',
        info: 'border-blue-100 bg-blue-50  '
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${colors[type]} min-w-[300px]`}
        >
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-bold text-gray-800  flex-grow">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-black/5  rounded-lg transition-colors">
                <X size={16} className="text-gray-400" />
            </button>
        </motion.div>
    );
};

export default Toast;

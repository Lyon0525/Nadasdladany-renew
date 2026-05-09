import { motion } from 'framer-motion';

export const DynamicBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-secondary/30">
            {/* Arany selymes folt */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]"
            />
            {/* Mélyzöld elegáns folt */}
            <motion.div
                animate={{
                    x: [0, -80, 0],
                    y: [0, 120, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[40%] -right-[5%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]"
            />
        </div>
    );
};
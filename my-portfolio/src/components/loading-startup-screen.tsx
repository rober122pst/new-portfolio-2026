import loadingBar from '@assets/loading.webp';
import logo from '@assets/logos/horizontal_96x.webp';
import { motion } from 'motion/react';

export default function LoadingStartupScreen() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="flex h-full w-full flex-col items-center justify-center gap-16 bg-black"
        >
            <img src={logo} />
            <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0, delay: 2 }}
                className="w-36"
                src={loadingBar}
            />
        </motion.div>
    );
}

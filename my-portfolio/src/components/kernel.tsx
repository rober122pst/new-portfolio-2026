import BootScreen from './bootScreen';
import Desktop from './desktop';
import LookScreen from './lookScreen';
import Taskbar from './taskbar';
import { motion } from 'motion/react';
import { useKernelStore } from '../store/kernel';

export default function OSKernel() {
    const currentState = useKernelStore((s) => s.currentState);

    const renderScreen = () => {
        switch (currentState) {
            case 'BOOT':
                return <BootScreen />;
            case 'LOOK':
                return <LookScreen />;
            case 'DESKTOP':
                return (
                    <>
                        <Desktop />
                        <Taskbar />
                    </>
                );
            default:
                return <BootScreen />;
        }
    };

    return (
        <motion.div
            key={currentState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-rows-[1fr_auto] h-full"
        >
            {renderScreen()}
        </motion.div>
    );
}

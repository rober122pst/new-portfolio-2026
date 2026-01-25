import { motion } from 'motion/react';
import { useKernelStore } from '../store/kernel';
import BootScreen from './boot-screen';
import Desktop from './desktop';
import LookScreen from './look-screen';
import Taskbar from './taskbar';

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
            className="grid h-full grid-rows-[1fr_auto]"
        >
            {renderScreen()}
        </motion.div>
    );
}

import { useCallback, version } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { motion } from 'motion/react';
import rbr from '../assets/logos/rbr_logo.webp';

interface NavigatorWithDeviceMemory extends Navigator {
    deviceMemory?: number;
}

export default function BiosStartupScreen() {
    const { t } = useTranslation();
    const getMemory = useCallback(() => {
        if (navigator as NavigatorWithDeviceMemory) {
            return (navigator as NavigatorWithDeviceMemory).deviceMemory || 0;
        }
        return 0;
    }, []);

    const memory = getMemory();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex h-full w-full p-8"
        >
            <div className="font-terminal flex flex-1 flex-col space-y-6 text-lg leading-tight text-neutral-400 select-none">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
                    <p>{t('boot.bios.hero.title')}</p>
                    <p>{t('boot.bios.hero.subtitle', { year: new Date().getFullYear() })}</p>
                    <p>{t('boot.bios.hero.allRights')}</p>
                    <p>{t('boot.bios.hero.reactEngine', { version: version })}</p>
                    <p>{t('boot.bios.hero.vite')}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0, delay: 2.5 }}>
                    <p>{t('boot.bios.version')}</p>
                </motion.div>

                {/* Hardware Section */}
                <motion.table
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0, delay: 3.5 }}
                >
                    <tbody>
                        <tr>
                            <td className="w-32">{t('boot.bios.hardware.kernel.label')}</td>
                            <td>:</td>
                            <td>{t('boot.bios.hardware.kernel.value')}</td>
                        </tr>
                        <tr>
                            <td>{t('boot.bios.hardware.processor.label')}</td>
                            <td>:</td>
                            <td>
                                {t('boot.bios.hardware.processor.value', {
                                    cores: navigator.hardwareConcurrency,
                                })}
                            </td>
                        </tr>
                        <tr>
                            <td>{t('boot.bios.hardware.memory.label')}</td>
                            <td>:</td>
                            <td>
                                {memory
                                    ? t('boot.bios.hardware.memory.value', {
                                          deviceMemory: memory * 1024,
                                      })
                                    : t('unknown')}
                            </td>
                        </tr>
                    </tbody>
                </motion.table>

                {/* Peripherals Section */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0, delay: 4.5 }}>
                    <div className="flex w-64 items-baseline">
                        <span className="flex-none">{t('boot.bios.peripherals.keyboard.label')}</span>
                        <span className="mx-2 grow overflow-hidden whitespace-nowrap">
                            ......................................................................
                        </span>
                        <span className="flex-none">{t('boot.bios.peripherals.keyboard.status')}</span>
                    </div>
                    <div className="flex w-64 items-baseline">
                        <span className="flex-none">{t('boot.bios.peripherals.mouse.label')}</span>
                        <span className="mx-2 grow overflow-hidden whitespace-nowrap">
                            ......................................................................
                        </span>
                        <span className="flex-none">{t('boot.bios.peripherals.mouse.status')}</span>
                    </div>
                </motion.div>

                {/* Hardware Section */}
                <motion.table
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0, delay: 5.5 }}
                >
                    <tbody>
                        <tr>
                            <td className="w-52">{t('boot.bios.infos.disk.label')}</td>
                            <td>:</td>
                            <td>{t('boot.bios.infos.disk.value')}</td>
                        </tr>
                        <tr>
                            <td>{t('boot.bios.infos.network.label')}</td>
                            <td>:</td>
                            <td>
                                {navigator.onLine
                                    ? t('boot.bios.infos.network.connected')
                                    : t('boot.bios.infos.netword.offline')}
                            </td>
                        </tr>
                    </tbody>
                </motion.table>
                <footer className="mt-auto">
                    <div>
                        <Trans i18nKey="boot.bios.footer.devTools">
                            Pressione <strong className="font-bold text-white uppercase">F12</strong> para o MODO
                            INSPEÇÃO
                        </Trans>
                    </div>
                    <div>{t('boot.bios.footer.start')}</div>
                </footer>
            </div>
            <div className="pointer-events-none flex items-start select-none">
                <img src={rbr} />
            </div>
        </motion.div>
    );
}

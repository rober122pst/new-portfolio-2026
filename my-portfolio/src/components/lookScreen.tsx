import { Button } from './ui/buttons';
import avatar from '../assets/profile.webp';
import { useKernelStore } from '../store/kernel';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/user';
import wallpaper from '../assets/red_gotham.png';

export default function LookScreen() {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const register = useUserStore((s) => s.register);

    const setScreen = useKernelStore((s) => s.setScreen);

    const registryUser = async () => {
        try {
            if (!username || !password) {
                alert('Precisa do nome');
                return;
            }
            register(username);
            setUsername('');
            setPassword('');
            setScreen('DESKTOP');
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };

    return (
        <div
            className="relative flex items-center justify-center text-white bg-cover bg-center after:absolute after:inset-0 after:bg-black/50 after:pointer-events-none"
            style={{ backgroundImage: `url(${wallpaper})` }}
        >
            <div className="space-y-5 z-10 bg-zinc-600 border border-elevated p-8">
                <div className="flex justify-center w-full">
                    <img className="rounded-full" src={avatar} alt="Foto de perfil" />
                </div>
                <table className="border-separate border-spacing-x-12 border-spacing-y-3">
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="username">{t('lookScreen.username')}:</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="border-2 border-sunk h-6 px-1 bg-white text-black outline-0"
                                    id="username"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="password">{t('lookScreen.password')}:</label>
                            </td>
                            <td>
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-2 border-sunk h-6 px-1 bg-white text-black outline-0"
                                    id="password"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="flex justify-center">
                    <Button onClick={registryUser}>{t('lookScreen.signIn')}</Button>
                </div>
            </div>
        </div>
    );
}

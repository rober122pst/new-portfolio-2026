import avatar from '@assets/profile.webp';
import wallpaper from '@assets/red_gotham.png';
import { useKernelStore } from '@store/kernel';
import { useUserStore } from '@store/user';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/buttons';

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
            className="relative flex items-center justify-center bg-cover bg-center text-white after:pointer-events-none after:absolute after:inset-0 after:bg-black/50"
            style={{ backgroundImage: `url(${wallpaper})` }}
        >
            <div className="border-elevated z-10 space-y-5 border bg-zinc-600 p-8">
                <div className="flex w-full justify-center">
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
                                    className="border-sunk h-6 border-2 bg-white px-1 text-black outline-0"
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
                                    className="border-sunk h-6 border-2 bg-white px-1 text-black outline-0"
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

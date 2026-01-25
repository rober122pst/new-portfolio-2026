import errorAudio from '../assets/audios/error.mp3';
import { appRegistry, type AppId } from '../core/app-registry';
import { useFileSystemActions, useFileSystemStore } from '../store/filesystem';
import { useProcessActions, useProcessStore } from '../store/processes';
import { useWindowActions } from '../store/windows';
import { playAudio } from '../utils/playAudio';

export function useOpenFile() {
    const { openProcess } = useProcessActions();
    const { openWindow } = useWindowActions();
    const { resolvePath } = useFileSystemActions();

    const launchErrorDialog = (name: string, message: string) => {
        try {
            // Verifica se já não abrimos essa janela para evitar spam
            const currentProcesses = useProcessStore.getState().processes;
            const isAlreadyOpen = Object.values(currentProcesses).some(
                (p) =>
                    (p.data as { isError: boolean }).isError === true &&
                    (p.data as { message: string })?.message === message
            );

            if (!isAlreadyOpen) {
                const pid = openProcess('dialogBox', {
                    isError: true,
                    name: name,
                    message: message,
                });
                playAudio(errorAudio, 0.2);
                openWindow(pid, { width: 400, height: 180 }, 'unresizable');
            }

            return;
        } catch (e) {
            console.error('Falha ao tentar abrir janela de erro:', e);
        }
    };

    const openFile = (fileId: string) => {
        const file = useFileSystemStore.getState().items[fileId];
        if (!file) return;

        if (file.type === 'shortcut' && file.metadata) {
            if (file.metadata.appId) {
                // Criar processo
                const pid = openProcess(file.metadata.appId);
                // Criar janela
                openWindow(pid);
                return;
            }

            if (file.metadata.targetId) {
                openFile(file.metadata.targetId);
                return;
            }
        }

        if (file.type === 'folder') {
            console.log('Abrir pasta:', resolvePath(file.id));
            const pid = openProcess('fileExplorer', {
                currentFolderId: file.id,
            });

            openWindow(pid);
            return;
        }

        const extension = file.extension?.toLowerCase();

        if (!extension) {
            launchErrorDialog('Error Starting Program', 'Arquivo sem extensão. Não sei como abrir.');
            return;
        }

        if (extension === 'exe') {
            const appId = file.metadata?.appId;
            if (!appId) {
                launchErrorDialog('Error Starting Program', 'Aplicativo não encontrado');
                return;
            }
            const pid = openProcess(appId as AppId, {
                fileId: file.id,
            });
            openWindow(pid);
            return;
        }

        const appEntry = Object.entries(appRegistry).find(([_, config]) =>
            config.supportedExtensions?.includes(extension)
        );

        if (appEntry) {
            const [appId, _] = appEntry;

            const pid = openProcess(appId as AppId, {
                fileId: file.id,
            });

            openWindow(pid);
        } else {
            launchErrorDialog(
                'Error Starting Program',
                `Nenhum aplicativo instalado para abrir arquivos .${extension}`
            );
        }
    };

    return openFile;
}

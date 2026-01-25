import { useProcess, useProcessActions } from '@store/processes';

import { Button } from '@components/ui/buttons';
import { ErrorIcon } from '@components/ui/icons';
import { useWindowActions } from '@store/windows';

export default function DialogBox({ pid }: { pid: string }) {
    const { closeProcess } = useProcessActions();
    const { closeWindow } = useWindowActions();
    const process = useProcess(pid);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-800">
            <div className="flex items-center justify-center gap-5">
                <ErrorIcon size={48} />
                <span className="w-2/3 text-sm text-white">{(process?.data as { message: string }).message}</span>
            </div>
            <Button
                onClick={() => {
                    closeProcess(pid);
                    closeWindow(pid);
                }}
                className="h-6 w-16 text-white"
            >
                Ok
            </Button>
        </div>
    );
}

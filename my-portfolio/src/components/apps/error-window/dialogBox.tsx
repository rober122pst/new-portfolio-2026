import { useProcess, useProcessActions } from '../../../store/processes';

import { useWindowActions } from '../../../store/windows';
import { Button } from '../../ui/buttons';
import { ErrorIcon } from '../../ui/icons';

export default function DialogBox({ pid }: { pid: string }) {
    const { closeProcess } = useProcessActions();
    const { closeWindow } = useWindowActions();
    const process = useProcess(pid);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-5">
                <ErrorIcon size={48} />
                <span className="text-white">{(process?.data as { message: string }).message}</span>
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

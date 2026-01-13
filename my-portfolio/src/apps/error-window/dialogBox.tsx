import { Button } from '../../components/ui/buttons';
import { ErrorIcon } from '../../components/ui/icons';
import { useProcessActions } from '../../store/processes';
import { useWindowActions } from '../../store/windows';

export default function DialogBox({ pid }: { pid: string }) {
    const { getProcess, closeProcess } = useProcessActions();
    const { closeWindow } = useWindowActions();
    const process = getProcess(pid);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full gap-3">
            <div className="flex items-center gap-5">
                <ErrorIcon size={48} />
                <span className="text-white">{(process?.data as { message: string }).message}</span>
            </div>
            <Button
                onClick={() => {
                    closeProcess(pid);
                    closeWindow(pid);
                }}
                className="w-16 h-6 text-white"
            >
                Ok
            </Button>
        </div>
    );
}

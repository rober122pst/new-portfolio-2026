import folderIcon from '../../assets/icons/folder_icon.ico';
import myComputerIcon from '../../assets/icons/my_computer.gif';
import notepadIcon from '../../assets/icons/notepad_icon.ico';
import txtIcon from '../../assets/icons/txt_icon.ico';

export interface IconsProps {
    className?: string;
    size?: number;
}

/**
 * @param size Tamanho em pixels
 */
export function FolderIcon({ className, size = 40 }: IconsProps) {
    return <img className={className} src={folderIcon} style={{ width: size, height: size }} />;
}

/**
 * @param size Tamanho em pixels
 */
export function TXTIcon({ className, size = 40 }: IconsProps) {
    return <img className={className} src={txtIcon} style={{ width: size, height: size }} />;
}

/**
 * @param size Tamanho em pixels
 */
export function NotepadIcon({ className, size = 40 }: IconsProps) {
    return <img className={className} src={notepadIcon} style={{ width: size, height: size }} />;
}

/**
 * @param size Tamanho em pixels
 */
export function MyComputerIcon({ className, size = 40 }: IconsProps) {
    return <img className={className} src={myComputerIcon} style={{ width: size, height: size }} />;
}

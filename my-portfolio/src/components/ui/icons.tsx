import folderIcon from '../../assets/icons/folder_icon.ico';
import myComputerIcon from '../../assets/icons/my_computer.gif';

interface IconsProps {
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
export function MyComputerIcon({ className, size = 40 }: IconsProps) {
    return <img className={className} src={myComputerIcon} style={{ width: size, height: size }} />;
}

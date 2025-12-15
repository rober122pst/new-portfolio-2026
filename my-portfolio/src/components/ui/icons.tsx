import folderIcon from '../../assets/icons/folder_icon.ico';
import myComputerIcon from '../../assets/icons/my_computer.gif';

interface IconsProps {
    size?: number;
}

/**
 * @param size Tamanho em pixels
 */
export function FolderIcon({ size = 40 }: IconsProps) {
    return <img src={folderIcon} style={{ width: size, height: size }} />;
}

/**
 * @param size Tamanho em pixels
 */
export function MyComputerIcon({ size = 40 }: IconsProps) {
    return <img src={myComputerIcon} style={{ width: size, height: size }} />;
}

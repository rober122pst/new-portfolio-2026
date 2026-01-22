import type { ImgHTMLAttributes } from 'react';
import desktopIcon from '../../assets/icons/desktop.webp';
import diskCIcon from '../../assets/icons/disk-so.webp';
import diskIcon from '../../assets/icons/disk.webp';
import documentsIcon from '../../assets/icons/documents.webp';
import errorIcon from '../../assets/icons/error.webp';
import explorerIcon from '../../assets/icons/explorer.webp';
import fileIcon from '../../assets/icons/file.webp';
import folderIcon from '../../assets/icons/folder.webp';
import myComputerIcon from '../../assets/icons/my-computer.webp';
import notepadIcon from '../../assets/icons/notepad_icon.ico';
import recycleBinIcon from '../../assets/icons/recycle-bin.webp';
import txtIcon from '../../assets/icons/txt_icon.ico';
import shortcutIcon from '../../assets/shortcut.webp';

interface BaseIconProps extends ImgHTMLAttributes<HTMLImageElement> {
    size?: number;
    isShortcut?: boolean;
    src: string;
}

function BaseIcon({ src, className, size = 48, style, alt = '', isShortcut = false, ...props }: BaseIconProps) {
    return (
        <div className="relative">
            <img
                src={src}
                className={className}
                alt={alt}
                style={{
                    width: size,
                    height: size,
                    minWidth: size,
                    minHeight: size,
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                    ...style,
                }}
                {...props}
            />
            {isShortcut && <img className="absolute bottom-0 left-0 size-3" src={shortcutIcon} />}
        </div>
    );
}

export type IconProps = Omit<BaseIconProps, 'src'>;

export function FolderIcon(props: IconProps) {
    return <BaseIcon src={folderIcon} alt="Pasta" {...props} />;
}

export function TXTIcon(props: IconProps) {
    return <BaseIcon src={txtIcon} alt="Arquivo de Texto" {...props} />;
}

export function NotepadIcon(props: IconProps) {
    return <BaseIcon src={notepadIcon} alt="Bloco de Notas" {...props} />;
}

export function MyComputerIcon(props: IconProps) {
    return <BaseIcon src={myComputerIcon} alt="Meu Computador" {...props} />;
}

export function ExplorerIcon(props: IconProps) {
    return <BaseIcon src={explorerIcon} alt="Explorador de Arquivos" {...props} />;
}

export function ErrorIcon(props: IconProps) {
    return <BaseIcon src={errorIcon} alt="Erro" {...props} />;
}

export function FileIcon(props: IconProps) {
    return <BaseIcon src={fileIcon} alt="Arquivo" {...props} />;
}

export function DocumentsIcon(props: IconProps) {
    return <BaseIcon src={documentsIcon} alt="Documentos" {...props} />;
}

export function DesktopIcon(props: IconProps) {
    return <BaseIcon src={desktopIcon} alt="Área de Trabalho" {...props} />;
}

export function DiskIcon(props: IconProps) {
    return <BaseIcon src={diskIcon} alt="Disco" {...props} />;
}

export function DiskCIcon(props: IconProps) {
    return <BaseIcon src={diskCIcon} alt="Disco C:" {...props} />;
}

export function RecycleBinCIcon(props: IconProps) {
    return <BaseIcon src={recycleBinIcon} alt="Disco C:" {...props} />;
}

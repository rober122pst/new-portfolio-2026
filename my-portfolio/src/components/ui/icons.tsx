import type { ImgHTMLAttributes } from 'react';
import errorIcon from '../../assets/icons/error.webp';
import explorerIcon from '../../assets/icons/explorer.ico';
import folderIcon from '../../assets/icons/folder_icon.ico';
import myComputerIcon from '../../assets/icons/my_computer.gif';
import notepadIcon from '../../assets/icons/notepad_icon.ico';
import txtIcon from '../../assets/icons/txt_icon.ico';
import shortcutIcon from '../../assets/shortcut.webp';

interface BaseIconProps extends ImgHTMLAttributes<HTMLImageElement> {
    size?: number;
    isShortcut?: boolean;
    src: string;
}

function BaseIcon({ src, className, size = 40, style, alt = '', isShortcut = false, ...props }: BaseIconProps) {
    return (
        <div className="relative">
            <img
                src={src}
                className={className}
                alt={alt}
                style={{
                    width: size,
                    height: size,
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                    ...style,
                }}
                {...props}
            />
            {isShortcut && <img className="absolute left-0 bottom-0 size-3" src={shortcutIcon} />}
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

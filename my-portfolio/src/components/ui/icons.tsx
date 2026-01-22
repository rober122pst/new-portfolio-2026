import { type ImgHTMLAttributes } from 'react';
import errorIcon from '../../assets/icons/error.webp';
import shortcutIcon from '../../assets/shortcut.webp';

interface BaseIconProps extends ImgHTMLAttributes<HTMLImageElement> {
    size?: number;
    isShortcut?: boolean;
    src: string;
}

export function BaseIcon({ src, className, size = 48, style, alt = '', isShortcut = false, ...props }: BaseIconProps) {
    return (
        <div style={{ width: size, height: size, flexShrink: 0, ...style }}>
            <img
                src={src}
                className={className}
                alt={alt}
                style={{
                    width: '100%',
                    height: '100%',
                    flexShrink: 0,
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                }}
                {...props}
            />
            {isShortcut && <img className="absolute bottom-0 left-0 size-3" src={shortcutIcon} />}
        </div>
    );
}

export type IconProps = Omit<BaseIconProps, 'src'>;

export function ErrorIcon(props: IconProps) {
    return <BaseIcon src={errorIcon} alt="Erro" {...props} />;
}

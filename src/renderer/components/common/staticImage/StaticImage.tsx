import { IS_DIST_MODE, IS_E2E, IS_PACKAGED, STATIC_PATH } from "@common/config";
import path from "path";
import type { ImgHTMLAttributes } from "react";
import React from "react";

export const getStatic = (relativePath: string): string =>
    IS_PACKAGED()
        ? path.resolve(STATIC_PATH, relativePath)
        : IS_E2E || IS_DIST_MODE
        ? `file://${path.resolve(STATIC_PATH, relativePath)}`
        : new URL(relativePath, window.location.origin).toString();

interface StaticImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    alt: string;
    src: string;
}

/**
 * Image wrapper to get stuff from `__static` folder.
 */
export const StaticImage: React.FC<StaticImageProps> = ({
    src,
    alt,
    ...rest
}) => <img {...rest} src={getStatic(src)} alt={alt} />;

import { View, Image, type ImageSourcePropType } from 'react-native';
import { cn } from '@/lib/cn';
import { dicebearUriToRasterImageUri } from '@/lib/third-party/dicebear';
import { useThemeColors } from '@/context/ThemeContext';
import { AppText } from './AppText';

/** Default avatar image used when no source is provided. */
export const DEFAULT_AVATAR_SOURCE = require('@assets/avatar.png');

/** Preset background colors for avatars. Use by index for stable variety (e.g. AVATAR_BACKGROUNDS[i]). */
export const AVATAR_BACKGROUNDS = [
  '#E8F4FD',
  '#FEF3C7',
  '#D1FAE5',
  '#FCE7F3',
  '#EDE9FE',
  '#FFE4E6',
  '#F3E8FF',
  '#CCFBF1',
] as const;

/**
 * Non-empty remote avatar URL → `{ uri }` suitable for {@link Avatar}.
 * Returns `undefined` when missing/blank. Trims whitespace. DiceBear URLs are
 * rasterized inside Avatar (see `normalizeImageSource` in this file).
 */
export function avatarRemoteSource(
  url: string | null | undefined
): { uri: string } | undefined {
  const t = typeof url === 'string' ? url.trim() : '';
  return t.length > 0 ? { uri: t } : undefined;
}

export type AvatarSize = number;

export type AvatarProps = {
  /** Diameter in pixels (e.g. 40, 52, 96). */
  size?: AvatarSize;
  /** Image source: `{ uri }` or `require(...)`. When missing, uses default avatar.png. */
  source?: ImageSourcePropType | null;
  /** Background color behind the image (e.g. from AVATAR_BACKGROUNDS). */
  backgroundColor?: string;
  /** Name or label for accessibility and for initials when no image (e.g. "John Doe" → "JD"). */
  altText?: string;
  /** Extra Tailwind classes (e.g. border). */
  className?: string;
};

function getInitials(altText: string): string {
  const parts = altText.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) {
    const s = parts[0];
    return s.length >= 2 ? s.slice(0, 2).toUpperCase() : s.toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_BORDER_WIDTH = 4;

function normalizeImageSource(source: ImageSourcePropType): ImageSourcePropType {
  if (typeof source === 'object' && source !== null && 'uri' in source) {
    const uri = source.uri;
    if (typeof uri === 'string' && uri.length > 0) {
      return { uri: dicebearUriToRasterImageUri(uri) };
    }
  }
  return source;
}

export function Avatar({
  size = 40,
  source,
  backgroundColor,
  altText,
  className,
}: AvatarProps) {
  const colors = useThemeColors();
  const rawSource =
    source != null && (typeof source !== 'object' || !('uri' in source) || !!source.uri)
      ? source
      : DEFAULT_AVATAR_SOURCE;
  const effectiveSource =
    typeof rawSource === 'object' &&
    rawSource !== null &&
    'uri' in rawSource &&
    typeof rawSource.uri === 'string'
      ? normalizeImageSource(rawSource)
      : rawSource;
  const initials = altText ? getInitials(altText) : '';

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: AVATAR_BORDER_WIDTH,
          borderColor: colors.avatarBorder,
        },
        backgroundColor ? { backgroundColor } : undefined,
      ]}
      className={cn(
        'overflow-hidden items-center justify-center',
        !backgroundColor && 'bg-surface-light dark:bg-surface-dark',
        className
      )}
      accessibilityRole="image"
      accessibilityLabel={altText ?? 'Avatar'}
    >
      {effectiveSource ? (
        <Image
          source={effectiveSource}
          resizeMode="cover"
          style={{
            width: size - 2 * AVATAR_BORDER_WIDTH,
            height: size - 2 * AVATAR_BORDER_WIDTH,
          }}
        />
      ) : (
        <AppText
          className="font-metropolis-semibold text-primaryDark dark:text-primaryDark-dark"
          style={{ fontSize: Math.max(10, size * 0.35) }}
        >
          {initials || '?'}
        </AppText>
      )}
    </View>
  );
}

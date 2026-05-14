import { View, Image, type ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/cn';
import { dicebearUriToRasterImageUri } from '@/lib/third-party/dicebear';
import { useThemeColors } from '@/context/ThemeContext';

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
  /** Image source: `{ uri }` or `require(...)`. When missing, shows a user icon. */
  source?: ImageSourcePropType | null;
  /** Background color behind the image (e.g. from AVATAR_BACKGROUNDS). */
  backgroundColor?: string;
  /** Name or label for accessibility (e.g. profile name). */
  altText?: string;
  /** Extra Tailwind classes (e.g. border). */
  className?: string;
};

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

function resolveAvatarImageSource(
  source: ImageSourcePropType | null | undefined
): ImageSourcePropType | null {
  if (source == null) return null;
  if (typeof source === 'number') {
    return source;
  }
  if (typeof source === 'object' && source !== null && 'uri' in source) {
    const uri = source.uri;
    if (typeof uri === 'string' && uri.trim().length > 0) {
      return normalizeImageSource(source);
    }
  }
  return null;
}

export function Avatar({
  size = 40,
  source,
  backgroundColor,
  altText,
  className,
}: AvatarProps) {
  const colors = useThemeColors();
  const imageSource = resolveAvatarImageSource(source);
  const inner = size - 2 * AVATAR_BORDER_WIDTH;
  const iconSize = Math.max(14, Math.round(inner * 0.52));

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
      {imageSource != null ? (
        <Image
          source={imageSource}
          resizeMode="cover"
          style={{
            width: inner,
            height: inner,
          }}
        />
      ) : (
        <Ionicons name="person" size={iconSize} color={colors.textMuted} />
      )}
    </View>
  );
}

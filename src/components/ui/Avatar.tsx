import { View, Image, type ImageSourcePropType } from 'react-native';
import { cn } from '@/lib/cn';
import { AppText } from './AppText';

export type AvatarSize = number;

export type AvatarProps = {
  /** Diameter in pixels (e.g. 40, 52, 96). */
  size?: AvatarSize;
  /** Image source: `{ uri }` or `require(...)`. When missing, shows initials or placeholder. */
  source?: ImageSourcePropType;
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

export function Avatar({
  size = 40,
  source,
  altText,
  className,
}: AvatarProps) {
  const showImage = source != null && (typeof source !== 'object' || !('uri' in source) || !!source.uri);
  const initials = altText ? getInitials(altText) : '';

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className={cn('overflow-hidden items-center justify-center bg-surface-light dark:bg-surface-dark', className)}
      accessibilityRole="image"
      accessibilityLabel={altText ?? 'Avatar'}
    >
      {showImage && source ? (
        <Image
          source={source}
          resizeMode="cover"
          style={{ width: size, height: size }}
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

interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <h2 className="text-2xl font-semibold text-ink-900 sm:text-3xl">{title}</h2>
      <div className={`rule-gold mt-3 ${align === 'center' ? 'mx-auto' : ''}`} />
      {description && <p className="mt-4 text-ink-600">{description}</p>}
    </div>
  );
}

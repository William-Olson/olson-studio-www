interface MutedSectionProps {
  overrideClasses?: string;
  overrideColorClass?: string;
  addClasses?: string;
}

export const mutedColorCss = 'rgb(68 64 60 / 1)';
export const mutedColorClass = 'text-stone-700';

/*
  Allows wrapping components or elements to apply muted color for text.
*/
export function MutedSection(
  props: React.PropsWithChildren<MutedSectionProps>
): React.ReactElement {
  let styles =
    (props.overrideColorClass ? props.overrideColorClass : mutedColorClass) +
    ' ' +
    (props.overrideClasses
      ? props.overrideClasses
      : 'm-5 pl-8 pr-8 pb-9 space-y-6');
  if (!props.overrideClasses && props.addClasses) {
    styles += ' ' + props.addClasses;
  }
  return <div className={styles}>{props.children}</div>;
}

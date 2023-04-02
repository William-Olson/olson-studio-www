interface MutedSectionProps {
  overrideClasses?: string;
  overrideColorClass?: string;
  addClasses?: string;
}

export function MutedSection(
  props: React.PropsWithChildren<MutedSectionProps>
): React.ReactElement {
  const colorClass = 'text-stone-700';
  let styles =
    (props.overrideColorClass ? props.overrideColorClass : colorClass) +
    ' ' +
    (props.overrideClasses
      ? props.overrideClasses
      : 'm-5 pl-8 pr-8 pb-9 space-y-6');
  if (!props.overrideClasses && props.addClasses) {
    styles += ' ' + props.addClasses;
  }
  return <div className={styles}>{props.children}</div>;
}

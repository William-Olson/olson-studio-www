export interface EmptyResultsProps {
  entityName: string;
}

export const EmptyResults: React.FC<EmptyResultsProps> = (
  props: EmptyResultsProps
) => {
  return <small className="text-[grey]">No {props.entityName} Found!</small>;
};

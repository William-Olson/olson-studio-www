interface MyProps {
  isAdmin: boolean;
}

export function AdminGuard(
  props: React.PropsWithChildren<MyProps>
): React.ReactElement {
  if (!props.isAdmin) {
    return (
      <>
        <div className="pb-20 w-full">
          <div className="m-5 pl-8 pr-8 pb-9 space-y-6 text-center">
            Blocked Content! Requires Permissions to Accesss!
          </div>
        </div>
      </>
    );
  }

  return props.children ? <>{props.children}</> : <></>;
}

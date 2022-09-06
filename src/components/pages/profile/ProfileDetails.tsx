import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { UserState } from '../../../stores/UserStore';
import { DarkModeState } from '../../../stores/DarkModeStore';
import moment from 'moment';

interface LabelProps {
  label: string;
  value: string;
}

function SimpleLabel(props: LabelProps): ReactElement {
  return (
    <div className="flex-container">
      <div className="flex flex-row">
        <div className="flex-col w-44">{props.label}</div>
        <div className="flex-col flex-grow">{props.value}</div>
      </div>
    </div>
  );
}

export const ProfileDetails = observer(
  class extends React.Component {
    private userStore: typeof UserState = UserState;
    private darkMode: typeof DarkModeState = DarkModeState;

    render() {
      let memberSince = 'N/A';
      let lastLogin = 'N/A';
      if (this.userStore.user?.created_at) {
        memberSince = moment(this.userStore.user?.created_at).format(
          'MM/DD/YYYY hh:mm A'
        );
      }
      if (this.userStore.user?.updated_at) {
        lastLogin = moment(this.userStore.user?.updated_at).format(
          'MM/DD/YYYY hh:mm A'
        );
      }

      return (
        <>
          {!!this.userStore?.user && (
            <div className="pb-20 w-90">
              <div className="m-5 rounded border-2 border-inherit pl-8 pr-8 pb-9">
                <h3 className="text-3xl font-mono pb-6 mt-6">User Details</h3>
                <p></p>
                <SimpleLabel
                  label="First Name"
                  value={this.userStore.user.firstName}
                />
                <SimpleLabel
                  label="Last Name"
                  value={this.userStore.user.lastName}
                />
                <SimpleLabel label="Email" value={this.userStore.user.email} />
                <SimpleLabel
                  label="Provider"
                  value={this.userStore.user.provider?.toUpperCase() || ''}
                />
                <SimpleLabel label="Member Since" value={memberSince} />
                <SimpleLabel label="Last Login" value={lastLogin} />
              </div>
            </div>
          )}
        </>
      );
    }
  }
);

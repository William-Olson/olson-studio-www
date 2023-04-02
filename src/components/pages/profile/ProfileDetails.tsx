import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { UserState } from '../../../stores/UserStore';
// import { DarkModeState } from '../../../stores/DarkModeStore';
import moment from 'moment';
import { SimpleLabel } from '../../layout/subcomponents/SimpleLabel';
import { MutedSection } from '../../helpers/MutedSection';

export const ProfileDetails = observer(
  class extends React.Component {
    private userStore: typeof UserState = UserState;
    // private darkMode: typeof DarkModeState = DarkModeState;

    render(): ReactElement {
      // const border = 'rounded border-2 border-inherit';
      let memberSince = 'N/A';
      let lastLogin = 'N/A';
      if (this.userStore.user?.created_at) {
        memberSince = moment(this.userStore.user?.created_at).format(
          'M / D - YYYY'
        );
      }
      if (this.userStore.user?.updated_at) {
        const last = moment(this.userStore.user?.updated_at).toDate();
        const since = moment
          .duration(-1 * (Date.now() - last.getTime()))
          .humanize(true);
        lastLogin = since.toString();
      }

      return (
        <>
          {!!this.userStore?.user && (
            <div className="pb-20 md:ml-auto md:mr-auto md:w-1/2">
              <MutedSection addClasses="m-5 pl-8 pr-8 pb-9">
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
                <SimpleLabel label="Last Login" value={lastLogin} />
                <SimpleLabel label="Member Since" value={memberSince} />
              </MutedSection>
            </div>
          )}
        </>
      );
    }
  }
);

import React from 'react';
import { observer } from 'mobx-react';
import { UserState } from '../../../stores/UserStore';
import { BadgeComponent } from './Badge';
import { Tooltip } from '../../helpers/Tooltip';

export const ProfileBadges = observer(
  class extends React.Component {
    private userStore: typeof UserState = UserState;
    render() {
      return (
        <div className="pb-20 md:ml-auto md:mr-auto md:w-1/2">
          {!!this.userStore?.user?.badges &&
            this.userStore?.user?.badges.length > 0 && (
              <React.Fragment>
                <div className="text-3xl m-6">Badges</div>
                <div className="">
                  {this.userStore?.user?.badges.map((badge) => {
                    return (
                      <div
                        key={badge.name + '-profile-badge'}
                        className="h-28 w-28"
                      >
                        <Tooltip text={badge.friendlyName}>
                          <BadgeComponent badge={badge} />
                        </Tooltip>
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            )}
        </div>
      );
    }
  }
);

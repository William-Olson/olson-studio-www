import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { UserState } from '../../../stores/UserStore';
import { SessionsState } from '../../../stores/SessionsStore';
import moment from 'moment';
import { SimpleLabel } from '../../layout/subcomponents/SimpleLabel';
import { StudioApiSession } from '../../../types/StudioApiTypes';
import { Token } from '../../../util/Auth';
import _ from 'lodash';

const isCurrentSession = (session: StudioApiSession): boolean => {
  const current = Token.fromCache();
  if (!current.isValid()) {
    return false;
  }
  const currentSession = current.decode()?.sub || '---';

  return currentSession === session.id;
};

const maxLength = 53;
const truncateAgent = (session: StudioApiSession): string => {
  if (!session) {
    return '';
  }

  if (isCurrentSession(session)) {
    return '[ Current Session ]';
  }

  const trimmed: string =
    (session.userAgent || session.id || '').slice(0, maxLength) || '';
  if (trimmed.length) {
    return `${trimmed}...`;
  }
  return trimmed;
};

export const ProfileSessions = observer(
  class extends React.Component {
    private userStore: typeof UserState = UserState;
    private userSessions: typeof SessionsState = SessionsState;

    public async componentDidMount() {
      if (!this.userSessions.activeSessions) {
        await this.userSessions.fetchSessions();
      }
    }

    render(): ReactElement {
      return (
        <>
          {!!this.userStore?.user && (
            <div className="pb-20 w-full">
              <div className="m-5 pl-8 pr-8 pb-9 space-y-6">
                <h3 className="text-3xl font-mono pb-6 mt-6">
                  Active Sessions
                </h3>
                {this.userSessions.activeSessions?.results?.length &&
                  _.sortBy(this.userSessions.activeSessions.results, [
                    'lastActivity'
                  ])
                    .reverse()
                    .map((session) => (
                      <SimpleLabel
                        label={moment(session.lastActivity).format(
                          'M / D - hh:mm:ss a'
                        )}
                        value={truncateAgent(session)}
                        key={session.id}
                        action={
                          <button
                            disabled={isCurrentSession(session)}
                            className={
                              isCurrentSession(session)
                                ? 'text-[grey]'
                                : 'text-[red]'
                            }
                            onClick={async () => {
                              await this.userSessions.revoke(session);
                            }}
                          >
                            Revoke
                          </button>
                        }
                      />
                    ))}
              </div>
            </div>
          )}
        </>
      );
    }
  }
);

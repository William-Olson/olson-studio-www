import React from 'react';

import adminBadge from '../../../images/admin-badge.png';
import { StudioApiBadge } from '../../../types/StudioApiTypes';

export interface BadgeComponentProps {
  badge: StudioApiBadge;
}

export class BadgeComponent extends React.Component<BadgeComponentProps> {
  render() {
    switch (this.props.badge.name) {
      case 'admin':
        return (
          <img
            id="user-avatar"
            className={'inline object-cover w-28 h-28'}
            src={adminBadge}
            style={{
              userSelect: 'none',
              msUserSelect: 'none',
              MozUserSelect: 'none',
              msTouchSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            alt="user avatar"
            referrerPolicy="no-referrer"
          />
        );
      default:
        return <></>;
    }
  }
}

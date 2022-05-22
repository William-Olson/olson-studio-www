import React, { ReactElement } from 'react'
import { Link } from 'react-router'

interface AppLinkProps {
  to: string
}

/**
 * Link that also works for external URL's
 */
export default class AppLink extends React.Component<AppLinkProps> {
  public render() {
    const url = this.props.to
    const getLink: (url: string) => ReactElement = (url: string) => {
      if (/^https?:\/\//.test(url)) {
        return <a href={url} />
      }
      return <Link to={url} />
    }
    return <React.Fragment>{getLink(url)}</React.Fragment>
  }
}

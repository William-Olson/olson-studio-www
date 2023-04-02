import React, { ReactElement } from 'react';
import { StudioApiService } from '../../../services/StudioApiService';
import { StudioApiUser } from '../../../types/StudioApiTypes';
import { Token } from '../../../util/Auth';
import { Autocomplete } from './Autocomplete';

export interface UserAutocompleteProps {
  onSelect: (selection: StudioApiUser) => void;
}

export interface UserAutocompleteState {
  responseData: Array<StudioApiUser>;
}

export class UserAutocomplete extends React.Component<
  UserAutocompleteProps,
  UserAutocompleteState
> {
  private api = new StudioApiService();

  constructor(props: UserAutocompleteProps) {
    super(props);

    this.searchUsers = this.searchUsers.bind(this);
    this.state = {
      responseData: []
    };
  }

  async componentDidMount() {
    const users = await this.api.getUsers(Token.fromCache(), '');
    this.setState({ responseData: users });
  }

  // Render after selected. How should it display in the input box after chosen?
  toInputDisplayValue = (suggestion: StudioApiUser) =>
    `${suggestion.firstName} ${suggestion.lastName} (${suggestion.email})`;

  // How to render each suggestion item in pop up list.
  toSuggestion = (suggestion: StudioApiUser): ReactElement => (
    <div className="flex p-2 bg-neutral-700 cursor-pointer hover:bg-neutral-400">
      <img
        width={'40px'}
        height={'40px'}
        className="flex-none"
        src={suggestion.avatar}
        alt="user-image"
      />
      <span className="flex-initial p-2">
        {suggestion.firstName} {suggestion.lastName}
      </span>
      <span className="flex-auto p-2">({suggestion.email})</span>
    </div>
  );

  // how to match a search input against a suggestion's fields
  match(record: StudioApiUser, normalizedInput: string): boolean {
    const terms = normalizedInput.split(' ').filter((x) => x);
    const searchSpace =
      `${record.firstName.toLowerCase()} ` +
      `${record.lastName.toLowerCase()} ` +
      `${record.email.toLowerCase()} `;

    return terms.some((t) => searchSpace.includes(t));
  }

  // search studio api for users that match the input
  async searchUsers(value: string) {
    const normalizedInputValue = value.trim().toLowerCase();
    const inputLength = normalizedInputValue.length;
    let data = this.state.responseData || [];

    // fetch users from API if they aren't present already
    if (!this.state.responseData || !this.state.responseData.length) {
      const userResp = await this.api.getUsers(
        Token.fromCache(),
        normalizedInputValue
      );
      data = userResp.results;
      console.log(data);
      this.setState({ responseData: data });
    }

    if (!inputLength) {
      // return all data on empty input
      return data;
    }

    // use frontend filtering until we have backend support for searching
    return inputLength === 0
      ? []
      : data.filter((recordData) =>
          this.match(recordData, normalizedInputValue)
        );
  }

  render() {
    return (
      <Autocomplete<StudioApiUser>
        required
        onSearch={this.searchUsers}
        onSelect={this.props.onSelect}
        renderSuggestion={this.toSuggestion}
        getSuggestionValue={this.toInputDisplayValue}
      />
    );
  }
}

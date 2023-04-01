import React, { FormEvent, ReactElement } from 'react';
import Autosuggest, { ChangeEvent } from 'react-autosuggest';

export interface AutocompleteProps<T> {
  // the handler for reacting to a selection
  onSelect: (selection: T) => void;

  // the call to get suggestions
  onSearch: (value: string) => Promise<Array<T>>;

  // the value that should be rendered inside the input after selection
  getSuggestionValue: (value: T) => string;

  // how to render each item the suggestion list
  renderSuggestion: (suggestion: T) => string | React.Component | ReactElement;

  // is this a required form field?
  required?: boolean;
}

// internal state to this component
export interface AutocompleteState<T> {
  value: string;
  suggestions: Array<T>;
}

/*
  Autocomplete component renders a dropdown box with selections provided from an external
  prop function `onSearch` based on an input given by the end user.
*/
export class Autocomplete<T> extends React.Component<
  AutocompleteProps<T>,
  AutocompleteState<T>
> {
  constructor(props: AutocompleteProps<T>) {
    super(props);
    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event: FormEvent<HTMLElement>, changed: ChangeEvent): void => {
    this.setState({
      value: changed.newValue || ''
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search...',
      value,
      required: this.props.required,
      onChange: this.onChange,
      className:
        'shadow appearance-none border rounded w-full py-2 px-3 bg-inherit leading-tight focus:outline-none focus:shadow-outline'
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        // Autosuggest will call this function every time you need to update suggestions.
        onSuggestionsFetchRequested={(input: { value?: string }) => {
          this.props.onSearch(input.value || '').then((results) => {
            this.setState({
              suggestions: results
            });
          });
        }}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.props.getSuggestionValue}
        onSuggestionSelected={(
          _ev: FormEvent<HTMLElement>,
          val: { suggestion: T }
        ) => this.props.onSelect(val?.suggestion)}
        renderSuggestion={this.props.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

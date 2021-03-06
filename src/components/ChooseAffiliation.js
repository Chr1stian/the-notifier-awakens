import React, { Component } from 'react';
import { defaultAffiliationSettings } from '../defaults/affiliations';
import './ChooseAffiliation.css';
import { Link } from 'react-router-dom';
import { Icon } from './';

export default class ChooseAffiliation extends Component {
  constructor(props) {
    super(props);
    this.updateSettings = this.updateSettings.bind(this);
    this.affiliations = defaultAffiliationSettings;
    this.state = {
      searchFilter: '',
      isCreateAffiliationOpen: false,
      addAffiliationName: '',
      addAffiliationId: '',
      addAffiliationIdDirty: false,
      formIsValid: false,
      formIsEmpty: true,
    };
    this.searchField = null;
  }

  updateSettings(key, value) {
    const settings = { ...this.props.settings, [key]: value };
    this.props.updateSettings(settings);
  }

  chooseAffiliation(affiliation) {
    if (affiliation in this.affiliations) {
      this.props.changeAffiliation(affiliation);
    }
  }

  filterSearch(searchFilter) {
    this.setState({ ...this.state, searchFilter });
  }

  toggleCreateAffiliation() {
    if (this.state.isCreateAffiliationOpen) {
      this.setState(state => ({
        ...state,
        searchFilter: this.searchField.value,
        isCreateAffiliationOpen: false,
      }));
    } else {
      const addAffiliationName =
        this.state.addAffiliationName || this.state.searchFilter;
      const addAffiliationId =
        this.state.addAffiliationId || this.transformToSlug(addAffiliationName);
      this.setState(state => ({
        ...state,
        formIsEmpty: this.checkIfFormIsEmpty(
          addAffiliationName,
          addAffiliationId,
        ),
        formIsValid: this.checkIfFormIsValid(
          addAffiliationName,
          addAffiliationId,
        ),
        searchFilter: state.addAffiliationName,
        addAffiliationName,
        addAffiliationId,
        isCreateAffiliationOpen: true,
      }));
    }
  }

  changeAddAffiliationName(value) {
    const addAffiliationName = value;
    if (!this.state.addAffiliationIdDirty) {
      const addAffiliationId = this.transformToSlug(value);
      this.setState({
        ...this.state,
        formIsEmpty: this.checkIfFormIsEmpty(
          addAffiliationName,
          addAffiliationId,
        ),
        formIsValid: this.checkIfFormIsValid(
          addAffiliationName,
          addAffiliationId,
        ),
        addAffiliationName,
        searchFilter: addAffiliationName,
        addAffiliationId,
      });
    } else {
      this.setState({
        ...this.state,
        formIsEmpty: this.checkIfFormIsEmpty(
          addAffiliationName,
          this.state.addAffiliationId,
        ),
        formIsValid: this.checkIfFormIsValid(
          addAffiliationName,
          this.state.addAffiliationId,
        ),
        addAffiliationName,
        searchFilter: addAffiliationName,
      });
    }
  }

  changeAddAffiliationId(value) {
    const addAffiliationId = this.transformToSlug(value);
    this.setState({
      ...this.state,
      formIsEmpty: this.checkIfFormIsEmpty(
        this.state.addAffiliationName,
        addAffiliationId,
      ),
      formIsValid: this.checkIfFormIsValid(
        this.state.addAffiliationName,
        addAffiliationId,
      ),
      addAffiliationId,
      addAffiliationIdDirty: !!value,
    });
  }

  transformToSlug(value) {
    return value
      .toLowerCase()
      .replace(/[^0-9a-zæøå]+/g, '-')
      .replace(/å/g, 'a')
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'o')
      .replace(/^-|-$/g, '');
  }

  setCreateAffiliationForm(addAffiliationName, addAffiliationId) {
    document.documentElement.scrollTop = 0;

    this.setState({
      ...this.state,
      formIsEmpty: this.checkIfFormIsEmpty(
        addAffiliationName,
        addAffiliationId,
      ),
      formIsValid: this.checkIfFormIsValid(
        addAffiliationName,
        addAffiliationId,
      ),
      addAffiliationName,
      searchFilter: addAffiliationName,
      addAffiliationId,
      addAffiliationIdDirty: true,
      isCreateAffiliationOpen: true,
    });
  }

  emptyForm() {
    this.setState({
      ...this.state,
      formIsEmpty: true,
      formIsValid: false,
      addAffiliationName: '',
      addAffiliationId: '',
      searchFilter: '',
      addAffiliationIdDirty: false,
    });
  }

  checkIfNameIsTaken(name) {
    if (name) {
      const lowerName = name.toLowerCase();
      return Object.values(this.affiliations).some(
        ({ name = '' }) => name.toLowerCase() === lowerName,
      );
    }
    return false;
  }

  checkIfIdIsTaken(id) {
    return id && id in this.affiliations;
  }

  checkIfFormIsValid(name, id) {
    // return !this.checkIfNameIsTaken(name) && !this.checkIfIdIsTaken(id);
    return !this.checkIfIdIsTaken(id);
  }

  checkIfFormIsEmpty(name, id) {
    return !name && !id;
  }

  render() {
    const affiliations = Object.entries(this.affiliations)
      .filter(
        ([key, { name }]) =>
          key &&
          key !== 'debug' &&
          new RegExp(`(^| )${this.state.searchFilter.toLowerCase()}`).test(
            name.toLowerCase(),
          ),
      )
      .sort(([, a], [, b]) => a.name.localeCompare(b.name));

    const chooseTranslation = this.props.translate('choose');
    const affiliationsAvailable = affiliations
      .filter(([, { components = [] }]) => components.length)
      .map(([key, { name = '' }], i) => (
        <Link
          to={'/' + key}
          key={i}
          className="item"
          title={`${chooseTranslation} ${name || key}`}
        >
          {name || key}
        </Link>
      ));

    const changeTranslation = this.props.translate('change');
    const affiliationsUnavailable = affiliations
      .filter(([, { components = [] }]) => !components.length)
      .map(([key, { name = '' }], i) => (
        <Link
          to={'/' + key}
          key={i}
          className="item no-components"
          title={`${changeTranslation} ${name || key}`}
        >
          + {name || key}
        </Link>
      ));

    return (
      <>
        <h1>{this.props.translate('chooseAffiliation')}</h1>
        <div className="form-group">
          <input
            placeholder={this.props.translate('searchAffiliationPlaceholder')}
            type="text"
            ref={element => (this.searchField = element)}
            onChange={e => this.filterSearch(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div
            className="toggle-create-affiliation"
            onClick={() => this.toggleCreateAffiliation()}
          >
            {this.state.isCreateAffiliationOpen ? '-' : '+'}{' '}
            {this.props.translate('addAffiliation')}
          </div>
          {this.state.isCreateAffiliationOpen ? (
            <div className="create-affiliation">
              <p
                className="small darken"
                dangerouslySetInnerHTML={{
                  __html: this.props.translate('addAffiliationInfo'),
                }}
              />
              <div className="form-group">
                <label htmlFor="affiliation-name">
                  {this.props.translate('name')}
                </label>
                <input
                  id="affiliation-name"
                  value={this.state.addAffiliationName}
                  onChange={e => this.changeAddAffiliationName(e.target.value)}
                  type="text"
                  placeholder={this.props.translate('affiliationNameExample')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="affiliation-name">
                  {this.props.translate('urlPath')}
                </label>
                <input
                  id="affiliation-id"
                  value={this.state.addAffiliationId}
                  onChange={e => this.changeAddAffiliationId(e.target.value)}
                  type="text"
                  placeholder={
                    this.transformToSlug(this.state.addAffiliationName) ||
                    this.props.translate('affiliationIdExample')
                  }
                />
                <div className="small center grow">
                  <span className="darken">{window.location.origin}/</span>
                  <span className="glow">
                    {this.state.addAffiliationId ||
                      this.transformToSlug(this.state.addAffiliationName) ||
                      '{URL}'}
                  </span>
                </div>
              </div>
              <div className="form-group">
                {!this.state.formIsEmpty ? (
                  <button onClick={() => this.emptyForm()} tabIndex={-1}>
                    {this.props.translate('resetForm')} <Icon name="Trash" />
                  </button>
                ) : null}
                <div className="space" />
                {!this.state.formIsEmpty && this.state.formIsValid ? (
                  <button
                    disabled={this.state.formIsEmpty || !this.state.formIsValid}
                  >
                    {this.props.translate('create')} "
                    {this.state.addAffiliationName}"{' '}
                    <Icon name="IosArrowForward" />
                  </button>
                ) : null}

                {!this.state.formIsEmpty && !this.state.formIsValid ? (
                  <button
                    disabled={this.state.formIsEmpty || this.state.formIsValid}
                  >
                    {this.props.translate('change')} "
                    {this.state.addAffiliationName}"{' '}
                    <Icon name="IosArrowForward" />
                  </button>
                ) : null}
              </div>
              <p
                warning={
                  this.checkIfIdIsTaken(this.state.addAffiliationId)
                    ? this.props.translate('idTakenError')
                    : ''
                }
              >
                <Icon name="MdInfoOutline" />
              </p>
            </div>
          ) : null}
        </div>
        <div className="affiliation-list">{affiliationsAvailable}</div>
        <h2>{this.props.translate('unavailableComponents')}</h2>
        <p className="small darken">
          ({this.props.translate('unavailableComponentsSubComment')}.)
        </p>
        <div className="affiliation-list">{affiliationsUnavailable}</div>
      </>
    );
  }
}

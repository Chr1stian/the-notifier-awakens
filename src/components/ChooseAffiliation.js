import React, { Component } from 'react';
import { defaultAffiliationSettings } from '../defaults/affiliations';
import './ChooseAffiliation.css';

export default class ChooseAffiliation extends Component {
  constructor(props) {
    super(props);
    this.updateSettings = this.updateSettings.bind(this);
    this.affiliations = defaultAffiliationSettings;
  }

  updateSettings(key, value) {
    const settings = { ...this.props.settings, [key]: value };
    this.props.updateSettings(settings);
  }

  chooseAffiliation(affiliation) {
    if (affiliation in this.affiliations) {
      this.updateSettings('affiliation', affiliation);
    }
  }

  render() {
    const affiliations = Object.entries(this.affiliations)
      .filter(([key]) => key !== 'debug' && key !== 'choose')
      .map(([key, { name = '' }], i) => (
        <div
          key={i}
          className="item"
          onClick={() => this.chooseAffiliation(key)}
        >
          {name || key}
        </div>
      ));

    return (
      <>
        <h1>Velg linjeforening</h1>
        <div className="affiliation-list">{affiliations}</div>
      </>
    );
  }
}

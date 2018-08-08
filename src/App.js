import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {debounce} from 'throttle-debounce';

const appId = '1d96f326376f8503f41b36e079a90220';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const iconUrl = 'http://openweathermap.org/img/w/';
const iconFormat = 'png';
const units = 'metric';
const lang = 'fr';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            city: '',
            countryCode: '',
            lastUpdated: '',
            data: undefined
        };
    }
    putParis = () => {
        this.setState({
            city: 'Paris',
            countryCode: 'fr'
        });
        this.onSubmit();
    }
    handleChange = (event) => {
        switch(event.target.name) {
            case 'countryCode': {
                this.setState({
                    countryCode: event.target.value
                });
            }
            break;
            case 'city':
                this.setState({
                    city: event.target.value
                });
            break;
            default:
        }
        this.onSubmit();
    }
    onSubmit = debounce(1000, () => {
        fetch(apiUrl + '?q=' + this.state.city + ',' + this.state.countryCode
            + '&units=' + units
            + '&lang=' + lang
            + '&APPID=' + appId
        )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    data: data
                });
            });
    });
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Weather-man6 React Vers.</h1>
                </header>
                <div className="form">
                    <div className="form-error">
                        { this.state.error }
                    </div>
                    <div className="form-input">
                        Ville : <input type="text" name='city' value={this.state.city} onChange={this.handleChange}/><br/>
                    </div>
                    <div className="form-input">
                        Pays : <input type="text" name='countryCode' value={this.state.countryCode} onChange={this.handleChange}/><br/>
                    </div>
                    <div className="form-input">
                        <input id="test" type="button" value="Mettre Paris" onClick={this.putParis}/>
                    </div>
                    <div className="lastUpdated">
                    </div>
                </div>
            </div>
        );
    }
}

export default App;

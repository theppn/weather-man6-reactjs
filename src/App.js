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

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            city: '',
            countryCode: 'fr',
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
            case 'countryCode':
                this.setState({
                    countryCode: event.target.value
                });
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
    parseData(data) {
        if (data.hasOwnProperty('list')) {
            let list = data['list'];
            // making sure we have 5d/3h data
            if (list.length === 40) {
                const tabs = [];
                const step = 24 * 3600 * 1000;
                let elements = [];

                // sorting by date just in case
                list = list.sort((a, b) => {
                    return a['dt'] - b['dt'];
                });

                let currentDay = new Date(list[0]['dt'] * 1000).setHours(0, 0, 0, 0);
                let currentTab = { 
                    date: currentDay,
                    data: []
                };
                list.map((item, index) => {
                    // on next day, push elements to tab, push current tab to tabs and create new tab
                    // careful, dt is in s, ms is required
                    if (item['dt'] * 1000 > (currentDay + step)) {
                        currentTab.data = elements;
                        tabs.push(currentTab);
                        elements = [];
                        currentDay = currentDay + step;
                        currentTab = {
                            date: currentDay,
                            data: []
                        };
                    }
                    elements.push({
                        date: item.dt * 1000,
                        icon: item['weather'][0]['icon'],
                        description: item['weather'][0]['description'],
                        temp: item['main']['temp'],
                        pressure: item['main']['pressure'],
                        humidity: item['main']['humidity'],
                        windSpeed: item['wind']['speed']
                    });
                    // on last element, push everything remaining
                    if (index === (list.length - 1)) {
                        currentTab.data = elements;
                        tabs.push(currentTab);
                    }
                    return list;
                });
                this.setState({
                    error: '',
                    data: tabs,
                    lastUpdated: new Date()
                });
            } else {
                this.error = 'Données invalides';
                console.log('getForecast error: 40 entries expected for 5d/3h data');
            }
        } else {
            this.error = 'Données invalides';
            console.log('getForecast error: 5d/3h data in unexpected format');
        }
    }
    onSubmit = debounce(1000, () => {
        fetch(apiUrl + '?q=' + this.state.city + ',' + this.state.countryCode
            + '&units=' + units
            + '&lang=' + lang
            + '&APPID=' + appId
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                this.parseData(data);
            })
            .catch(() => {
                this.setState({
                    error: 'Erreur de requête'
                });
            });
    });
    render() {
        const data = this.state.data;
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
                    {this.state.lastUpdated ? (
                        <div className="lastUpdated">
                            Dernière requête faite le : {this.state.lastUpdated.toLocaleString('fr-FR')}
                        </div>
                    ):('')}
                </div>
                {data ? (
                    <div className="result">
                        <Tab data={this.state.data} />
                    </div>
                ):('')}
            </div>
        );
    }
}

class Tab extends React.Component {
    onClick = (event) => {
        const target = event.target.closest('.tab-container').getElementsByClassName('tab-info-container')[0];
        if (target.style.display !== 'flex') {
            target.style.display = 'flex';
        } else {
            target.style.display = 'none';
        }
    }
    render() {
        return this.props.data.map((item, index) => {
            const d = new Date(item.date);
            const day = ((d.getDate() + '').length > 1 ? '' : '0') + d.getDate();
            const month = (((d.getMonth() + 1) + '').length > 1 ? '' : '0') + (d.getMonth()+1);
            const year = d.getFullYear() + '';
            return (
                <div key={'tab'+index} className="tab-container">
                    <button className="tab-title-container" onClick={this.onClick}>
                        {day + '/' + month + '/' + year}
                    </button>
                    <div className="tab-info-container" style={{display:'none'}}>
                        <Element data={item.data} />
                    </div>
                </div>
            );
        });
    }
}

class Element extends React.Component {
    render() {
        return this.props.data.map((item) => {
            const d = new Date(item.date);
            const h = ((d.getHours() + '').length > 1 ? '' : '0') + d.getHours();
            const m = ((d.getMinutes() + '').length > 1 ? '' : '0') + d.getMinutes();
            return (
                <div key={item.date} className="element-container">
                    <div className="element-time-container">
                        <h2>{h + ':' + m}</h2>
                    </div>
                    <div className="element-icon-container">
                        <img alt={item.description} src={iconUrl + '/' + item.icon + '.' + iconFormat}/>
                        <h3>{item.temp}°C</h3>
                    </div>
                    <div className="element-detail-container">
                        <h3>Détails :</h3>
                        <ul>
                            <li>Description : {item.description}</li>
                            <li>Pression : {item.pressure}hPa</li>
                            <li>Humidité : {item.humidity}%</li>
                            <li>Vent : {item.windSpeed}m/s</li>
                        </ul>
                    </div>
                </div>
            );
        });
    }
}

export default App;

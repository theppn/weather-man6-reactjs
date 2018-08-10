import React, {Component} from 'react';
import {Environment} from "./Environment";
import logo from './logo.svg';
import './App.css';
import {debounce} from 'throttle-debounce';
import Tab from './Tab';

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
        fetch(Environment.apiUrl + '?q=' + this.state.city + ',' + this.state.countryCode
            + '&units=' + Environment.units
            + '&lang=' + Environment.lang
            + '&APPID=' + Environment.appId
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

export default App;

import React from 'react';
import {Environment} from "./Environment";
import './Element.css';

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
                        <img alt={item.description} src={Environment.iconUrl + '/' + item.icon + '.' + Environment.iconFormat}/>
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

export default Element;

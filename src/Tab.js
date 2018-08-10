import React from 'react';
import './Tab.css';
import Element from './Element';

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

export default Tab;

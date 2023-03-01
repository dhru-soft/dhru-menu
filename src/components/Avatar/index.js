import * as React from 'react';
import {shortName} from "../../lib/functions";


const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

const Index = (props) => {

    let {label, value, size, fontsize, lineheight, more,src,backgroundColor} = props;

    const initials = shortName(label),
        charIndex = initials && initials.charCodeAt(0) - 65,
        colorIndex = Boolean(charIndex>0) ? charIndex % 19 : 1;

    if (!Boolean(size)) {
        size = 35
    }



    if(Boolean(src)){
        return <img src={`https://${src}`} className={'w-100'} style={{borderRadius:50}} />
    }

        return (
            <>
                <div style={{
                    borderRadius: 100,
                    width: 50,
                    height:50,
                    display:'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: backgroundColor || colors[colorIndex], ...more
                }}>
                    <div style={{
                        color:'white',
                        fontSize: fontsize || 25
                    }}>{initials}</div>
                </div>
            </>
        );

}

export default Index

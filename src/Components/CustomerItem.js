import React from 'react';

export default function CustomerItem(props) {
    const {id, name, lat, long, distance} = props.props;
    return (
        <tr key={`Customer-${id}-${name}`}>                  
            <td>{id}</td>
            <td>{name}</td>
            <td>{lat}</td>
            <td>{long}</td>
            <td>{distance}</td>
            {/* <td>          
                <ul className="lineScores">
                {
                    rounds?.map((e, i) => {
                        return<li key={`roundscore--${i}`}>Round {i+1}: {e}</li>
                    })
                }
                </ul>
            </td> */}
        </tr>
    )
}

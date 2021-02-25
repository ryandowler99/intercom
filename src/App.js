import React, {useState, useEffect} from 'react';
import { getDistance } from 'geolib';
import './App.css';
import CustomerItem from './Components/CustomerItem';
const axios = require('axios');
const uri = 'challenge.json';


export default function Home() {
    //State and values
    const [customerData, setCustomerData] = useState([])//Data from json file (customers)
    const [customerDataComplete, setCustomerDataComplete] = useState([])//Customer objs polulatd with their calculated distance
    const [customerDataCompleteSortedByDist, setCustomerDataCompleteSortedByDist] = useState([])//Customers stored in the sorted order
    const [sortByDistance, setSortByDistance] = useState(false); //customer will be sorted by id by default
    const officeLatAndLong =  { latitude: 53.339428, longitude: -6.257664 };
    {
    //Helper Functions
    
    //GET data
    const fetchData = (url) => {
        axios.get(url, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }
        
            }).then(function (response) {
            let data = response.data;
            let lines = data.split(/\n/);
            let wrapped = "[" + lines.join(",") + "]";
            let cleanArrayOfObjs = JSON.parse(wrapped);
            
            setCustomerData(cleanArrayOfObjs)
            return cleanArrayOfObjs;
            });
        //   .then((response) => response.json())
        //   .then((messages) => {console.log("messages");});
    }
 
    //Update Customers with calculted distance
    const updateCustomers = (cust) => {
        console.log("In updatecust i gt:", cust);
        let complete = cust.map((v,i) => {
            let theDist = getDistance(officeLatAndLong, { latitude: v.latitude, longitude: v.longitude})
            let newCustomerObj ={
                id: v.user_id,
                name: v.name,
                lat: v.latitude,
                long: v.longitude,
                distance: theDist
            }
            return newCustomerObj;
        })
        let onlyLocals = complete.filter((v) => v.distance <= 100000);
        let onlyLocalsSorted = onlyLocals.sort((a, b) => a.id - b.id)
        setCustomerDataComplete(onlyLocalsSorted)
        return complete;
    }
    //Effects
    useEffect(() => {
        fetchData(uri)
    },[]);
    //Update customers when data is initiall set (arg1) and when filter is interacted with (arg2)
    useEffect(() => {
        updateCustomers(customerData);
    }, [customerData, sortByDistance])
    //Set a customer seperate state where its sorted by dist - prevents resetting one state over and over between the two sorts 
    useEffect(() => {
        let onlyLocalsSortedByDistance = customerDataComplete.sort((a, b) => a.distance - b.distance)
        //Dont set state if its unnessesary
        customerDataCompleteSortedByDist.length ? 
            console.log("YOUR ALL GOOD TO GO")
        :
            setCustomerDataCompleteSortedByDist(onlyLocalsSortedByDistance)
    }, [sortByDistance])
    //Removes the need for conditional rendering
    let customersToDisplay = sortByDistance ? customerDataCompleteSortedByDist : customerDataComplete;
    return (
        <>
            <div>
                <h1>Intercom Customer Data (Locals only)</h1>
                <button onClick={()=>setSortByDistance(prev=>!prev)}>
                    Sort this data by: {sortByDistance ? 'ID' : 'Distance'}
                </button>
            </div>
            <div className="customersContainer">
                <table>
                    <thead>
                    <tr>
                        <th onClick={()=>setSortByDistance(prev=>!prev)}>ID</th>
                        <th>Name</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th onClick={()=>setSortByDistance(prev=>!prev)}>Distance</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            customersToDisplay.map(customer => (
                                <CustomerItem props={{
                                    id: customer.id,
                                    name: customer.name,
                                    lat: customer.lat,
                                    long: customer.long,
                                    distance: customer.distance
                                }} />
                            ))  
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}}

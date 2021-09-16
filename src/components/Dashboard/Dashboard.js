import React, {Component} from "react";
import axios from "axios";
import './Dashboard.css';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiDetails: [],
            search: null,
            selectedCategory: null,
            category: ['ALL', 'Info', 'Launch Pads', 'Rockets'],
            selectedAPI: [],
        }
    }

    componentDidMount() {
        this.getAllDetails();
    }

    getAllDetails = () => {
        axios.get('http://localhost:4000/').then(response => {
            return response.data;
        }).then((response) => {
            if (response.status) {
                const data = response.data;
                console.log(data);
                this.setState({apiDetails: data, selectedAPI: []})
            }
        }).catch(err => console.log(err));
    }

    getAPIDetailsBySearch = (category) => {
        if (category === 'ALL') {
            this.getAllDetails();
        } else {
            const {search} = this.state;
            console.log(search);
            axios.get('http://localhost:4000/search', {
                params: {
                    category: category,
                    name: search
                }
            }).then((response) => {
                if (response.status) {
                    const responseData = response.data;
                    console.log(responseData.data);
                    this.setState(
                        {
                            apiDetails: responseData.data,
                            selectedCategory: category,
                            selectedAPI: []
                        },
                    )
                }
            }).catch(err => console.log(err));
        }
    }


    render() {
        return (
            <div style={{margin: '30px'}}>
                <h3>Categories</h3>
                {
                    this.state.category.map((category, index) => {
                        return <button key={index}
                                       onClick={() => this.getAPIDetailsBySearch(category)}>{category}</button>
                    })
                }
                <br/>
                <br/>
                <input type="search" onChange={(e) => this.setState({search: e.target.value})}/>
                <button onClick={() => this.getAPIDetailsBySearch(null)}>search</button>
                <div className="api-details">
                    {
                        this.state.apiDetails.map((apiDetail) => {
                            return (
                                <div key={apiDetail._id} className="api-detail">
                                    <h3>{apiDetail.name}</h3>
                                    <h4>API Call</h4>
                                    <a href="#">{apiDetail.api_call}</a>
                                    <h4>Description</h4>
                                    <p>{apiDetail.description}</p>
                                    <h4>Pricing Details</h4>
                                    <ul>
                                        <li>Monthly ${apiDetail.subscriptions.monthly}</li>
                                        <li>Yearly ${apiDetail.subscriptions.yearly}</li>
                                    </ul>
                                    <button onClick={() => this.setState({
                                        selectedAPI: apiDetail,
                                    })}>Deatils
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="selected-api">
                    {this.state.selectedAPI.length !== 0 ?
                        <div>
                            <h3>{this.state.selectedAPI.name}</h3>
                            <p>API Call: {this.state.selectedAPI.api_call}</p>
                            <p>API Type: {this.state.selectedAPI.type}</p>
                            <div className="response">
                                <h3>Sample Response</h3>
                                <pre>
                                    {JSON.stringify(this.state.selectedAPI.response, null, 2)}
                                </pre>
                                <h3>Parameters</h3>
                                <pre>
                                    {JSON.stringify(this.state.selectedAPI.parameters, null, 2)}
                                </pre>
                            </div>
                        </div>
                        : null}
                </div>
            </div>
        )
    }
}

export default Dashboard;
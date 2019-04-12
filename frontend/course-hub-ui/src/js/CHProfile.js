import React, { Component } from 'react';
import '../App.css';
import '../css/common-components.css';
import '../css/profile.css';
import CHNavigator from './CHNavigator';
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import { searchUser } from '../elasticSearch';
import ProfileContent from "./CHProfileContent";

const fetch = require('node-fetch');

class CHProfile extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            choice: '',
            firstName: '',
            email: '',
        };
        this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
    }

    componentWillMount() {
        const self = this;
        firebaseInitialization.auth().onAuthStateChanged(user => self.handleAuthStateChange(user));
    }

    handleClick = (choice, firstName, email) => {
        console.log('In handle click');
        this.setState({ choice: choice, firstName: firstName, email: email});
    };

    handleAuthStateChange = user => {
        if (user) {
            var email = user.email;
            var payloadSearch = {
                query: {
                    term: { Email: email }
                }
            };
            searchUser(payloadSearch).then(first => {
                this.setState({
                    choice: "homeSignedIn",
                    firstName: first,
                    email: email
                });
            });
        } else {
            this.setState({
                choice: "home"
            });
        }
    };

    render() {
        const choice = this.state.choice;
        const firstName = this.state.firstName;
        const email = this.state.email;

        return(
            <div className="profile">
                {choice === "deals" &&
                    this.props.history.push('/deals')
                }
                {(choice === "profile" || choice === "homeSignedIn" ) &&
                    [
                        <CHNavigator updateContent={this.handleClick} signedIn={true} caller={"app"} firstName={firstName} email={email} key="keyNavigatorLandingContent" />,
                        <div className="profile-content" key="keyLandingContent">
                            <ProfileContent updateContent={this.handleClick} email={email} />
                        </div>,
                        <CHFooter key="keyFooterLandingContent" />,
                    ]
                }

            </div>
        );
    }
}

export default CHProfile;
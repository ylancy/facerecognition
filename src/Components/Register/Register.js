import React from 'react';
import { createAuthUserWithEmailAndPassword, createUserDocFromAuth } from '../../utili/firebase';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registerName: '',
            registerEmail: '',
            registerPassword: ''
        }
    }
    onNameChange = (event) => {
        this.setState({ registerName: event.target.value })
    }

    onEmailChange = (event) => {
        this.setState({ registerEmail: event.target.value })
    }

    onPasswordChange = (event) => {
        this.setState({ registerPassword: event.target.value })
    }

    onRegisterSubmit = async (event) => {
        event.preventDefault();

        try {
            const { user } = await createAuthUserWithEmailAndPassword(this.state.registerEmail, this.state.registerPassword);
            await createUserDocFromAuth(user, { name: this.state.registerName, entries: 0 });
            this.props.onRouteChange('signin');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('email already registered')
            } else {
                console.log('error user creation', error)
            }
        }
    }

    render() {
        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f2 fw6 ph0 mh0">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="name"
                                    name="name"
                                    id="name"
                                    onChange={this.onNameChange} />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    onChange={this.onEmailChange} />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={this.onPasswordChange} />
                            </div>
                        </fieldset>
                        <div className="">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register" onClick={this.onRegisterSubmit} />
                        </div>
                    </div>
                </main>
            </article>
        )
    }

}

export default Register;
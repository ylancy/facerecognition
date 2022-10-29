import React from 'react';
import { signInAuthUserWithEmailAndPassword } from '../../utili/firebase';

class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: '',
            errorMessage: '',
            submitting: false
        }
    }
    onEmailChange = (event) => {
        this.setState({ signInEmail: event.target.value, errorMessage: '' })
    }

    onPasswordChange = (event) => {
        this.setState({ signInPassword: event.target.value, errorMessage: '' })
    }

    onSubmitSignIn = async (event) => {
        this.setState({ submitting: true });
        event.preventDefault();
        try {
            await signInAuthUserWithEmailAndPassword(this.state.signInEmail, this.state.signInPassword);
            this.props.onRouteChange('home');
        } catch (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    this.setState({ errorMessage: 'incorrect password' });
                    break
                case 'auth/user-not-found':
                    this.setState({ errorMessage: 'no user with this email' });
                    break
                case 'auth/invalid-email':
                    this.setState({ errorMessage: 'invalid email' });
                    break
                default:
                    this.setState({ errorMessage: error.code })
            }
        } finally {
            this.setState({ submitting: false });
        }
    }

    render() {
        const { onRouteChange } = this.props;
        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f2 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    onChange={this.onEmailChange}
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={this.onPasswordChange} />
                            </div>
                            {this.state.errorMessage &&
                                <div className="mv3 bg-orange pa1 white">
                                    <p>{this.state.errorMessage}</p>
                                </div>
                            }
                        </fieldset>
                        <div className="">
                            <input
                                disabled={this.state.submitting || !this.state.signInEmail || !this.state.signInPassword}
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                type="submit"
                                value={this.state.submitting ? "loading" : "Sign in"}
                                onClick={this.onSubmitSignIn}
                            />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                        </div>
                    </div>
                </main>
            </article>
        )
    }

}

export default Signin;
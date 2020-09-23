import React, { useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

const Login = () => {
    const [user, setUser] = useState({
        isSigned: false,
        name: '',
        email: '',
        photo: '',
        password: '',
        success: false,
        error: ''
    })

    const [newUser, setNewUser] = useState(false)

    // Sign In With Google

    var provider = new firebase.auth.GoogleAuthProvider();
    const handleGoogleSignIn = () => {
        firebase.auth().signInWithPopup(provider)
            .then(res => {
                const { email, displayName, photoURL } = res.user
                const UserInfo = {
                    isSigned: true,
                    name: displayName,
                    email: email,
                    photo: photoURL,
                }
                setUser(UserInfo)
            })
            .catch(error => {
                const errorMessage = error.message;
                setUser((prevData) => {
                    return {
                        ...prevData,
                        error: errorMessage
                    }
                })
            });
    }

    //GoogleSignOut

    const handleGoogleSignOut = () => {
        firebase.auth().signOut()
            .then(res => {
                const UserInfo = {
                    isSigned: false,
                    name: '',
                    email: '',
                    photo: ''
                }
                setUser(UserInfo)
            })
            .catch(err => {

            })
    }

    //field Validation for email and password

    const handleBlur = (e) => {
        const { name, value } = e.target;

        let isFieldValid = true;
        if (name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(value);
            if(isFieldValid){
                console.log("email Valid")
            }
        }

        if (name === 'password') {
            const isLengthField = value.length > 6
            const isNumberContain = /[0-9]/.test(value)
            isFieldValid = isLengthField && isNumberContain;
            if(isFieldValid){
                console.log("Password Valid")
            }
        }

        if (isFieldValid) {
            console.log("isValid", isFieldValid)
            setUser((prevData) => {
                return {
                    ...prevData,
                    [name] : value
                }
            })
        }
       
    }

  

    //Email & Password

    const handleSubmit = (e) => {

        if (!newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    firebase.auth().currentUser.updateProfile({
                        displayName: user.name
                    }).then(() => {
                        const UserInfo = { ...user }
                        UserInfo.success = true
                        UserInfo.error = ''
                        setUser(UserInfo);
                        console.log(user)
                        console.log(res);
                    });
                })
                .catch(error => {
                    var errorMessage = error.message;
                    const UserInfo = { ...user }
                    UserInfo.success = false
                    UserInfo.error = errorMessage
                    setUser(UserInfo)
                });
                console.log(user)
        }

        if (newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const UserInfo = { ...user }
                    UserInfo.success = true
                    UserInfo.error = ''
                    setUser(UserInfo)
                    console.log(user)
                })
                .catch(function (error) {
                    var errorMessage = error.message;
                    const UserInfo = { ...user }
                    UserInfo.success = false
                    UserInfo.error = errorMessage
                    setUser(UserInfo)
                });

                console.log("I from false", user)

        }
        console.log(user)
        e.preventDefault();
    }




    return (
        <div>
            {
                user.isSigned ? <button onClick={handleGoogleSignOut}>Sign Out</button> :
                    <button onClick={handleGoogleSignIn}>Sign In</button>
            }
            <br />
            {
                user.isSigned && <div>
                    <h3>name:{user.name}</h3>
                    <p>email:{user.email}</p>
                    <img style={{ width: '50%' }} src={user.photo} alt="" />
                </div>
            }

            <input onChange={() => setNewUser(!newUser)} type="checkbox" name="NewUser" id="" />
            <label htmlFor="NewUser">New User</label>

            <form onSubmit={handleSubmit}>
                {
                    newUser && <label>
                        Name:
                         <input onBlur={handleBlur} type="text" name="name" />
                    </label>
                }
                <br />
                <label>
                    Email:
                    <input onBlur={handleBlur} type="email" name="email" />
                </label>
                <br />
                <label>
                    Password:
                    <input onBlur={handleBlur} type="password" name="password" />
                </label>
                <br />
                <input type="submit" value="Submit" />
            </form>
            {
                user.error && <h1 style={{ color: 'red' }}>{user.error}</h1>
            }
            {
                user.success && <h1 style={{ color: 'green' }}>User {newUser ? 'created' : `${user.name} Sign in`} WithEmailAndPassword Successfully</h1>
            }
        </div>
    );
};

export default Login;

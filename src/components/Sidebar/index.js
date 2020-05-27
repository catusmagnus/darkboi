// Packages:
import React, { useState, useEffect } from 'react';
import { useInput } from '../../hooks/input-hook';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import * as EmailValidator from 'email-validator';


// Imports:
import {
    DEFAULT_STORAGE_LIMIT
} from '../../constants';

import {
    ACCOUNT_ICON,
    CLOSE_ICON
} from '../../constants/icons';


// Styles:
const LaunchSidebarButton = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 2em;
    margin: 1.5em;
    padding: 0.3em;
    border-radius: 50%;
    cursor: pointer;
    -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;
    transition: all 0.125s ease;

    &:hover {
        width: 2.1em;
        background-color: #55efc4;
    }
`;

const Wrapper = styled.div`
    position: absolute;
    left: ${ props => props.sidebarVisibility === true ? '0vw' : '-20vw' };
    z-index: 1;
    width: 20vw;
    height: 100vh;
    background: #131617;
    color: #55efc4;
    -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;
    transition: all 0.25s ease;

    @media only screen and (max-width: 768px) {
        left: ${ props => props.sidebarVisibility === true ? '0vw' : '-50vw' };
        width: 50vw;
    }
`;

const CloseSidebarButton = styled.img`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 0.9em;
    margin: 1.5em;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
        width: 1em;
        // transform: rotate(90deg);
    }
`;

const ProfileSectionWrapper = styled.div`
    position: absolute;
    bottom: 82vh;
    width: 100%;
    height: 18vh;
`;

const ProfilePicture = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 2em;
    margin: 1.5em;
    padding: 0.3em;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.125s ease;

    &:hover {
        background-color: #74B9FF;
}
`;

const Username = styled.div`
    position: absolute;
    top: 0;
    left: 7em;
    display: inline-block;
    margin-top: 2.8em;
    font-size: 0.7em;
    font-weight: 600;
`;

const Verified = styled.span`
    margin-left: 0.4em;
    font-size: 0.9em;
`;

const NumberOfBooks = styled.div`
    position: absolute;
    top: 0em;
    left: 8.3em;
    display: inline-block;
    margin-top: 4.9em;
    font-size: 0.6em;
`;

const SavedBooksWrapper = styled.div`
    position: absolute;
    bottom: 10vh;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 72vh;
    border-top: 1px solid #55efc4;
    border-bottom: 1px solid #55efc4;
`;

const SavedBooksEnterWrapper = styled(SavedBooksWrapper)`
    display: unset;
    justify-content: unset;
    align-items: unset;
    text-align: left;
`;

const TitleSection = styled.div`
    display: inline-block;
    margin: 1em;
`;

const SavedBooksTitle = styled.div`
    display: inline-block;
    font-size: 1.3em;
    font-weight: 600;
    cursor: pointer;
`;

const LoginTitle = styled(SavedBooksTitle)`
    color: ${ props => props.active === true ? 'inherit' : '#447575' };
    transition: all 0.25s ease;

    &:hover {
        color: #55efc4;
    }
`;

const Divider = styled(SavedBooksTitle)`
    margin: 0em 0.2em;
    cursor: unset;
`;

const RegisterTitle = styled(SavedBooksTitle)`
    color: ${ props => props.active === true ? 'inherit' : '#447575' };
    transition: all 0.25s ease;

    &:hover {
        color: #55efc4;
}
`;

const FormSection = styled.div`
    display: inline-block;
    margin-left: 1em    ;
`;

const InputField = styled.input`
    margin-top: 0.7em;
    padding: 0.65em 2em;
    padding-left: 1em;
    background: #000000;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    color: #55efc4;
    text-align: left;
    outline: none;
    border: none;
    border-radius: 0.3em;
    // border-bottom: 1px solid ${ props => props.errorsInPage[props.inputIdenity] !== null ? '#ff7675' : '#447575' };
    box-shadow: 0 4px 8px -1px rgba(0, 0, 0, 0.5), 0 -4px 6px -3px rgba(0, 0, 0, 0.4), 0 0px 2px -8px rgba(0, 0, 0, 0.3);
    transition: all 0.25s ease;

    &:focus {
        // border-bottom: 1px solid ${ props => props.errorsInPage[props.inputIdenity] !== null ? '#ff7675' : '#55efc4' };
    }

    &::placeholder {
        color: ${ props => props.errorsInPage[props.inputIdenity] !== null ? '#ff7675' : '#00b894' };
        opacity: 1;
    }
`;

const ErrorText = styled.div`
    margin-top: 0.5em;
    margin-left: 0.1em;
    color: #d63031;
    font-size: 0.7em;
    font-weight: 600;
    text-align: left;
`;

const FormButton = styled.div`
    display: inline-block;
    width: 18em;
    width: -webkit-fill-available;
    margin-top: 1.5em;
    padding: 0.75em 1em;
    background-color: ${ props => props.clickable === true ? '#0984E3' : '#74B9FF' };
    border-radius: 0.4em;
    font-weight: 600;
    font-size: 0.7em;
    color: #FFF;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
        background-color: #74B9FF;
    }
`;

const SpaceUsedWrapper = styled.div`
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 10vh;
`;


// Functions:
const ProfileSection = (props) => {
    return (
        <ProfileSectionWrapper>
            <ProfilePicture
                src={ props.profilePicture }
            />
            <Username>
                @{ props.username }
                <Verified
                    role="img"
                    aria-label="verified"
                >
                    { props.verified === true ? '✅' : '❎' }
                </Verified>
            </Username>
            <NumberOfBooks>{ props.booksArray.length } books stored.</NumberOfBooks>
        </ProfileSectionWrapper>
    );
};

const SavedBooks = (props) => {
    // Constants:
    const firebase = require('firebase');
    const db = firebase.firestore();
    const auth = firebase.auth();
    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm;
    const LOGIN = 'LOGIN';
    const REGISTER = 'REGISTER';
    const defaultErrorsInPage = {
        emailAddress: null,
        username: null,
        password: null
    };


    // State:
    const [ formState, setFormState ] = useState(LOGIN);
    const [ errorsInPage, setErrorsInPage ] = useState(defaultErrorsInPage);
    const [ errorsPresentInPage, setErrorsPresentInPage ] = useState(false);
    const [ buttonClickable, setButtonClickable ] = useState(true);
    const { value: emailAddress, bind: bindEmailAddress, reset: resetEmailAddress } = useInput('');
    const { value: username, bind: bindUsername, reset: resetUsername } = useInput('');
    const { value: password, bind: bindPassword, reset: resetPassword } = useInput('');


    // Functions:
    const titleClickHandler = (NEW_FORM_STATE) => {
        if (formState !== NEW_FORM_STATE) {
            setFormState(NEW_FORM_STATE);
        }
    };

    const validateFields = () => {
        let errorMessages = {
            emailAddress: null,
            username: null,
            password: null
        };
        let errorPresent = false;

        // Validate email address.
        if (EmailValidator.validate(emailAddress) !== true || emailAddress.length === 0 || emailAddress.length >= 30) {
            // Invalid email address.
            errorMessages.emailAddress = "Email may not be correct.. 🩹";
            errorPresent = true;
        }

        // Validate password length.
        if (password.length >= 30) {
            // Password length must be at least 6 characters.
            errorMessages.password = "Password too strong! 😅";
            errorPresent = true;
        }

        // Validate password strength.
        if (password.length < 6) {
            // Password length must be at least 6 characters.
            errorMessages.password = "At least 6 characters! 🐛";
            errorPresent = true;
        }

        if (formState === REGISTER) {
            // Validate username.
            if (usernameRegex.test(username) !== true || typeof username !== 'string' || username.length === 0 || username.length > 30) {
                // Username is invalid.
                errorMessages.username = "Username is invalid.. 👀";
                errorPresent = true;
            }
        }

        return {
            errorMessages,
            errorPresent
        };
    };

    const handleFormButtonClick = () => {
        let validationResults = validateFields();
        let errorMessages = validationResults.errorMessages;
        let errorPresent = validationResults.errorPresent;

        if (errorPresent === false) {
            setButtonClickable(false);
            if (formState === LOGIN) {
                auth.signInWithEmailAndPassword(emailAddress, password)
                    .then(() => {
                        // Check if the sign in was successful.
                        let user = auth.currentUser;
                        if (user === null) {
                            // Sign in failed.
                            errorMessages.password = "Something went wrong.. 🤕";
                            errorPresent = true;

                            setErrorsPresentInPage(true);
                            setErrorsInPage({
                                ...errorsInPage,
                                ...errorMessages
                            });

                            setButtonClickable(true);
                        }
                    })
                    .catch((error) => {
                        // Handle Errors here.
                        let errorCode = error.code;
                        let errorMessage = error.message;
                        if (errorCode === 'auth/invalid-email') {
                            errorMessages.email = "Your email is invalid.. 🙄";
                            errorPresent = true;
                        } else if (errorCode === 'auth/user-disabled') {
                            errorMessages.email = "Your account is disabled.. 💀";
                            errorPresent = true;
                        } else if (errorCode === 'auth/user-not-found') {
                            errorMessages.email = "Didn't find your account.. 🤔";
                            errorPresent = true;
                        } else if (errorCode === 'auth/wrong-password') {
                            errorMessages.password = "Wrong password.. 🌚";
                            errorPresent = true;
                        } else {
                            console.error("Hey there, please report this error..", errorMessage);
                            errorMessages.password = "Something went wrong.. 🤕";
                            errorPresent = true;
                        }

                        setErrorsPresentInPage(true);
                        setErrorsInPage({
                            ...errorsInPage,
                            ...errorMessages
                        });

                        setButtonClickable(true);
                    });
            } else if (formState === REGISTER) {
                auth.fetchSignInMethodsForEmail(emailAddress)
                    .then(signInMethods => {
                        // Verify if the email address has been used before.
                        if (signInMethods.indexOf(firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) !== -1) {
                            // Email address has been used before.
                            errorMessages.email = "Email has already been used.. 👾";
                            return true;
                        } else {
                            // Email address hasn't been used before.
                            return false;
                        }
                    })
                    .then((emailUsedBefore) => {
                        if (emailUsedBefore === true) {
                            // Flag an error.
                            errorMessages.password = "Email has already been used.. 👾";
                            errorPresent = true;

                            setErrorsPresentInPage(true);
                            setErrorsInPage({
                                ...errorsInPage,
                                ...errorMessages
                            });

                            setButtonClickable(true);
                        } else {
                            // Register user.
                            let firestoreUserObj = {
                                usedSpace: 0,
                                totalSpace: DEFAULT_STORAGE_LIMIT,
                                booksArray: []
                            };
                            
                            db.collection('users').doc(emailAddress).set(firestoreUserObj)
                                .then(() => {
                                    // Register user.
                                    auth.createUserWithEmailAndPassword(emailAddress, password)
                                        .then(() => {
                                            // Update user's profile.
                                            let user = auth.currentUser;
                                            user.updateProfile({
                                                displayName: username
                                            })
                                            .catch((error) => {
                                                // An error happened.
                                                console.error(error);
                                            });;
                                        })
                                        .catch((error) => {
                                            // Handle error.
                                            let errorCode = error.code;
                                            let errorMessage = error.message;
                                            console.error(errorCode, errorMessage);
                                        });
                                })
                                .catch((error) => {
                                    // An error occured.
                                    let errorCode = error.code;
                                    let errorMessage = error.message;
                                    console.error("Hey there, please report this error..", errorCode, errorMessage);

                                    errorMessages.password = "Something went wrong.. 🤕";
                                    errorPresent = true;

                                    setErrorsPresentInPage(true);
                                    setErrorsInPage({
                                        ...errorsInPage,
                                        ...errorMessages
                                    });

                                    setButtonClickable(true);
                                });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        setErrorsInPage({
                            ...errorsInPage,
                            ...errorMessages,
                            email: 'Failed to validate email due to slow internet speed.. 😓'
                        });

                        setButtonClickable(true);
                    });
            }
        } else {
            setErrorsPresentInPage(true);
            setErrorsInPage({
                ...errorsInPage,
                ...errorMessages
            });

            setButtonClickable(true);
        }
    };


    // Return:
    if (props.signedIn === true) {
        return (
            <SavedBooksWrapper>
                { props.booksArray }
            </SavedBooksWrapper>
        );
    } else {
        return (
            <SavedBooksEnterWrapper>
                <TitleSection>
                    <LoginTitle
                        onClick={ () => titleClickHandler(LOGIN) }
                        active={ formState === LOGIN ? true : false }
                    >
                        Login
                    </LoginTitle>
                    <Divider>/</Divider>
                    <RegisterTitle
                        onClick={ () => titleClickHandler(REGISTER) }
                        active={ formState === REGISTER ? true : false }
                    >
                        Register
                    </RegisterTitle>
                </TitleSection>
                <FormSection>
                    {
                        formState === LOGIN
                        ?
                        (
                            <>
                                <InputField
                                    id="emailAddress"
                                    type="text"
                                    placeholder="Email address"
                                    inputIdenity="emailAddress"
                                    errorsInPage={ errorsInPage }
                                    errorsPresentInPage={ errorsPresentInPage }
                                    { ...bindEmailAddress }
                                />
                                {
                                    errorsInPage.emailAddress !== null
                                    ?
                                    (
                                        <ErrorText>{ errorsInPage.emailAddress }</ErrorText>
                                    )
                                    :
                                    (
                                        <br />
                                    )
                                }
                                <InputField
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    inputIdenity="password"
                                    errorsInPage={ errorsInPage }
                                    errorsPresentInPage={ errorsPresentInPage }
                                    { ...bindPassword }
                                />
                                {
                                    errorsInPage.password !== null
                                    ?
                                    (
                                        <ErrorText>{ errorsInPage.password }</ErrorText>
                                    )
                                    :
                                    (
                                        <br />
                                    )
                                }
                                <FormButton
                                    clickable={ buttonClickable }
                                    onClick={ () => handleFormButtonClick() }
                                >{ LOGIN }</FormButton>
                            </>
                        )
                        :
                        (
                            <>
                                <InputField
                                    id="emailAddress"
                                    type="text"
                                    placeholder="Email address"
                                    inputIdenity="emailAddress"
                                    errorsInPage={ errorsInPage }
                                    errorsPresentInPage={ errorsPresentInPage }
                                    { ...bindEmailAddress }
                                />
                                {
                                    errorsInPage.emailAddress !== null
                                    ?
                                    (
                                        <ErrorText>{ errorsInPage.emailAddress }</ErrorText>
                                    )
                                    :
                                    (
                                        <br />
                                    )
                                }
                                <InputField
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    inputIdenity="username"
                                    errorsInPage={ errorsInPage }
                                    errorsPresentInPage={ errorsPresentInPage }
                                    { ...bindUsername }
                                />
                                {
                                    errorsInPage.username !== null
                                    ?
                                    (
                                        <ErrorText>{ errorsInPage.username }</ErrorText>
                                    )
                                    :
                                    (
                                        <br />
                                    )
                                }
                                <InputField
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    inputIdenity="password"
                                    errorsInPage={ errorsInPage }
                                    errorsPresentInPage={ errorsPresentInPage }
                                    { ...bindPassword }
                                />
                                {
                                    errorsInPage.password !== null
                                    ?
                                    (
                                        <ErrorText>{ errorsInPage.password }</ErrorText>
                                    )
                                    :
                                    (
                                        <br />
                                    )
                                }
                                <FormButton
                                    clickable={ buttonClickable }
                                    onClick={ () => handleFormButtonClick() }
                                >{ REGISTER }</FormButton>
                            </>
                        )
                    }
                </FormSection>
            </SavedBooksEnterWrapper>
        );
    }
};

const SpaceUsed = (props) => {
    return (
        <SpaceUsedWrapper>
            { props.usedSpace } out of { props.totalSpace }
        </SpaceUsedWrapper>
    );
};

const Sidebar = () => {
    // Constants:
    const firebase = require('firebase');
    const db = firebase.firestore();
    const auth = firebase.auth();
    const defaultUserObj = {
        signedIn: false,
        username: 'anon',
        profilePicture: ACCOUNT_ICON,
        verified: false,
        usedSpace: 0,
        totalSpace: DEFAULT_STORAGE_LIMIT,
        booksArray: []
    };


    // State:
    const [ sidebarVisibility, setSidebarVisibility ] = useState(true);
    const [ userObj, setUserObj ] = useState(defaultUserObj);
    const [ firestoreUserObjListener, setFirestoreUserObjListener ] = useState(null);


    // Effects:
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is/has signed in.

                // Attach Firestore userObj listener.
                setFirestoreUserObjListener(db.collection('users').doc(user.displayName)
                    .onSnapshot((doc) => {
                        let source = doc.metadata.hasPendingWrites ? 'LOCAL' : 'SERVER';
                        let user = doc.data();
                        console.log(source, " data: ", user);

                        // Save userObj from db.
                        setUserObj({
                            ...userObj,
                            usedSpace: user.usedSpace === undefined ? userObj.usedSpace : user.usedSpace,
                            totalSpace: user.totalSpace === undefined ? userObj.totalSpace : user.totalSpace,
                            booksArray: user.booksArray === undefined ? userObj.booksArray : user.booksArray
                        });
                    })
                );
                
                // Detach Firestore userObj listener.
                firestoreUserObjListener();
                
                // Save userObj from auth.
                setUserObj({
                    ...userObj,
                    signedIn: true,
                    username: user.displayName === undefined ? userObj.username : user.displayName,
                    profilePicture: user.photoURL === undefined ? userObj.profilePicture : user.photoURL,
                    verified: user.emailVerified === undefined ? userObj.verified : user.emailVerified
                });
            } else {
                // User is signed out.
                if (userObj.signedIn === true) {
                    setUserObj(defaultUserObj);
                    if (firestoreUserObjListener !== null) {
                        // Detach Firestore userObj listener.
                        firestoreUserObjListener();
                        setFirestoreUserObjListener(null);
                    }
                }
            }
        });
    }, []);

    useEffect(() => {
        return () => {
            if (firestoreUserObjListener !== null) {
                // Detach Firestore userObj listener.
                firestoreUserObjListener();
                setFirestoreUserObjListener(null);
            }
        };
    }, []);


    // Return:
    return (
        <>
            <LaunchSidebarButton 
                src={ userObj.profilePicture }
                onClick={ () => setSidebarVisibility(true) }
            />
            <Wrapper
                sidebarVisibility={ sidebarVisibility }
            >
                <CloseSidebarButton 
                    src={ CLOSE_ICON }
                    onClick={ () => setSidebarVisibility(false) }
                />
                <ProfileSection
                    signedIn={ userObj.signedIn }
                    username={ userObj.username }
                    profilePicture={ userObj.profilePicture }
                    verified={ userObj.verified }
                    booksArray={ userObj.booksArray }
                />
                <SavedBooks
                    signedIn={ userObj.signedIn }
                    booksArray={ userObj.booksArray }
                />
                <SpaceUsed
                    usedSpace={ userObj.usedSpace }
                    totalSpace={ userObj.totalSpace }
                />
            </Wrapper>
        </>
    );
};


// Export:
export default Sidebar;
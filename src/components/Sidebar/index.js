// Packages:
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";


// Imports:
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
    transition: all 0.125s ease;

    &:hover {
        width: 2.1em;
        background-color: #81ecec;
    }
`;

const Wrapper = styled.div`
    position: absolute;
    left: ${ props => props.sidebarVisibility === true ? '0vw' : '-20vw' };
    z-index: 1;
    width: 20vw;
    height: 100vh;
    background: #131617;
    transition: all 0.25s ease;

    @media only screen and (max-width: 768px) {
        left: ${ props => props.sidebarVisibility === true ? '0vw' : '-50vw' };
        width: 50vw;
    }
`;

const CloseSidebarButton = styled.img`
    float: right;
    width: 1.3em;
    margin: 1.5em;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
        width: 1.4em;
        transform: rotate(90deg);
    }
`;


// Functions:
const Sidebar = () => {
    // State:
    const [ sidebarVisibility, setSidebarVisibility ] = useState(true);
    // Return:
    return (
        <>
            <LaunchSidebarButton 
                src={ ACCOUNT_ICON }
                onClick={ () => setSidebarVisibility(true) }
            />
            <Wrapper
                sidebarVisibility={ sidebarVisibility }
            >
                <CloseSidebarButton 
                    src={ CLOSE_ICON }
                    onClick={ () => setSidebarVisibility(false) }
                />
            </Wrapper>
        </>
    );
};


// Export:
export default Sidebar;
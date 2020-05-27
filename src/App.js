// Packages:
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import { Scrollbars } from 'react-custom-scrollbars';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";


// Components:
import Sidebar from './components/Sidebar';


// Constants:
import {
	DEFAULT_UPLOAD_LIMIT
} from './constants';

import {
	INVALID_FILE_TYPE,
	BIG_FILE
} from './constants/errors';


// Components:


// Package Fixes:
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${ pdfjs.version }/pdf.worker.js`;


// Styles:
const Wrapper = styled.div`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 100vw;
	min-height: 100vh;
	background-color: ${ props => props.errorPresent === true ? '#D63031' : '#000000' };
	text-align: center;
	transition: all 0.5s ease;
`;

const AntiFlexBox = styled.div``;

const UploadFile = styled.input`
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;

    & + label {
		${ props => props.buttonClickable !== true ? 'position: absolute; z-index: -1;' : '' };
        display: flex;
		justify-content: center;
		align-items: center;
		width: 14em;
		height: 2em;
		padding: 0.5em 1em;
		background-color: ${ props=> props.errorPresent === true ? '#FF7675' : '#55EFC4'};
		opacity: ${ props => props.file !== null ? '0' : '1' };
		box-shadow: 0 30px 80px -20px rgba(0, 0, 10, 0.3), 0 30px 70px -30px rgba(0, 0, 0, 0.3);
		color: #2d3436;
		font-size: 0.9em;
		font-weight: 600;
		border-radius: 0.3em;
		cursor: ${ props => props.file !== null ? 'unset' : 'pointer' };
		${ props => props.file !== null ? '-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;' : '' }
		transition: all 0.3s ease;
    }

    &:focus + label,
    & + label:hover {
        background-color: ${ props=> props.errorPresent === true ? '#FFFFFF' : '#6EFDD5'};
    }

    & + label {
		cursor: ${ props => props.file !== null ? 'unset' : 'pointer' };
		${ props => props.file !== null ? '-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;' : '' }
    }

    &:focus + label {
        outline: 1px dotted #000;
        outline: -webkit-focus-ring-color auto 5px;
    }
`;

const ErrorMessageWrapper = styled.div`
	display: inline-block;
	padding-top: 0.7em;
	color: #DFE6E9;
	font-size: 0.8em;
	font-weight: 500;
`;

const PDFAreaWrapper = styled.div`
	filter: invert(1);
`;

const CustomPage = styled(Page)`
	margin: 0.75em 0em;
`;

const ShowMore = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 14em;
	height: 2em;
	margin: auto;
    margin-top: 2em;
    margin-bottom: 2em;
	padding: 0.5em 1em;
	background-color: #55EFC4;
	box-shadow: 0 30px 80px -20px rgba(0, 0, 10, 0.3), 0 30px 70px -30px rgba(0, 0, 0, 0.3);
	color: #2d3436;
	font-size: 0.9em;
	font-weight: 600;
	border-radius: 0.3em;
	cursor: pointer;
	transition: all 0.3s ease;
`;

const CounterWrapper = styled.div`
	position: absolute;
	bottom: 0;
	display: inline-block;
	padding-bottom: 2.3em;
	color: #dfe6e9;
	font-size: 0.7em;
	font-weight: 500;
`;

const UploadCountLoader = styled.div`
	width: 16em;
	height: 0.7em;
	padding-bottom: 0.4em;
`;

const Logo = styled.img`
	position: absolute;
	bottom: 0;
	display: inline-block;
	width: 7em;
`;


// Functions:
const uploadFile = (event) => {
	// Verify if any file was selected.
	if (event.target.files[0] !== undefined) {
		// Image variables:
		const fileBlob = event.target.files[0];
		const fileURL = URL.createObjectURL(fileBlob);
		const fileExtension = fileBlob.name.split('.').pop();
		const fileSize = fileBlob.size;

		// Validate file extension.
		if (!['pdf'].includes(fileExtension)) {
			// File extension is unacceptable.
			return {
				error: true,
				errorMessage: INVALID_FILE_TYPE,
				file: {
					fileBlob,
					fileURL,
					fileExtension,
					fileSize
				}
			};
		}

		// Validate file size.
		if (fileSize > DEFAULT_UPLOAD_LIMIT) {
			// File size is greater than 50 MB.
			return {
				error: true,
				errorMessage: BIG_FILE,
				file: {
					fileBlob,
					fileURL,
					fileExtension,
					fileSize
				}
			};
		}

		// No errors present.
		return {
			error: false,
			errorMessage: null,
			file: {
				fileBlob,
				fileURL,
				fileExtension,
				fileSize
			}
		};
	}
};

const ErrorMessage = (props) => {
	if (props.errorPresent === true) {
		return (
			<>
				<ErrorMessageWrapper>
					{ props.errorMessage }
				</ErrorMessageWrapper>
			</>
			
		);
	} else {
		return <></>;
	}
};

const PDFArea = (props) => {
	// State:
	const [ numberOfPages, setNumberOfPages ] = useState(0);
	const [ maxPage, setMaxPage ] = useState(10);

	// Return:
	if (props.file === null) {
		return <></>;
	} else {
		return (
			<>
				<PDFAreaWrapper>
					<Document
						file={ props.file.fileBlob }
						onLoadSuccess={ (pdf) => setNumberOfPages(pdf.numPages) }
						renderMode="svg"
					>
						{[...Array(numberOfPages)].map((value, index) => {
							if (index > 0 && index < maxPage) {
								return (
									<CustomPage
										key={ index }
										pageNumber={ index }
									/>
								);
							} else {
								return (
									<span
										key={ index }
									>
									</span>
								);
							}
						})}
					</Document>
				</PDFAreaWrapper>
				{
					(maxPage === numberOfPages || numberOfPages < maxPage)
					?
					(
						<></>
					)
					:
					(
						<ShowMore
							onClick={ () => setMaxPage(maxPage + 10) }
						>
							show more 10 pages
						</ShowMore>
					)
				}
			</>
		);
	}
};

const Counter = (props) => {
	if (props.uploadCount === null) {
		return (
			<CounterWrapper>
				<SkeletonTheme color="#636e72" highlightColor="#b2bec3">
					<UploadCountLoader>
						<Skeleton />
					</UploadCountLoader>
				</SkeletonTheme>
			</CounterWrapper>
		);
	} else {
		return (
			<CounterWrapper>
				<span role="img" aria-label="celebration">🎉</span> { props.uploadCount } people have used darkboi! <span role="img" aria-label="celebration">🎉</span>
			</CounterWrapper>
		);
	}
	
};

const App = () => {
	// Constants:
	const firebase = require('firebase');
    const rdb = firebase.database();


	// State:
	const [ errorPresent, setErrorPresent ] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState(null);
	const [ file, setFile ] = useState(null);
	const [ buttonClickable, setButtonClickable ] = useState(true);
	const [ uploadCount, setUploadCount ] = useState(null);
	const [ countListener, setCountListener ] = useState(null);


	// Effects:
	useEffect(() => {
		// Attach listener.
		setCountListener(rdb.ref('/uploadCount/').on('value', (snapshot) => {
			if (snapshot !== null && buttonClickable === true) {
				setUploadCount(snapshot.val());
			}
		}));
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (file !== null && errorPresent === false) {
			
		}
	}, [file, errorPresent]);

	useEffect(() => {
		return () => {
			// Detach listener.
			rdb.ref('/uploadCount/').off('value', countListener);
		}
		// eslint-disable-next-line
	}, []);


	// Functions:
	const handleFileUpload = (uploadStatus) => {
		if (uploadStatus.error === true) {
			setErrorPresent(true);
			if (uploadStatus.errorMessage === INVALID_FILE_TYPE) {
				setErrorMessage('invalid file type :/');
			} else if (uploadStatus.errorMessage === BIG_FILE) {
				setErrorMessage('file too heavy, might crash ur device');
			}
		} else {
			setErrorPresent(false);
			setErrorMessage(null);
			setFile(uploadStatus.file);
			setTimeout(() => setButtonClickable(false), 300);
		}
	};

	const updateUploadCount = () => {
		// Update the upload count via a transaction operation.
		rdb.ref('/uploadCount/').transaction((currentUploadCount) => {
			if (currentUploadCount !== null) {
				currentUploadCount++;
			}
			return currentUploadCount;
		});
	};


	// Return:
	return (
		<Scrollbars
			style={{ height: '100vh' }}
		>
			<Wrapper
				errorPresent={ errorPresent }
			>
				<Sidebar />
				<AntiFlexBox>
					<UploadFile
						type="file"
						name="uploadFile"
						id="uploadFile"
						accept=".pdf"
						onChange={ (event) => {
							if (file === null) {
								handleFileUpload(uploadFile(event));
							}
						}}
						errorPresent={ errorPresent }
						file={ file }
						buttonClickable={ buttonClickable }
					/>
					<label
						htmlFor="uploadFile"
						onClick={ () => updateUploadCount() }
					>
						upload dat pdf
					</label>
					<ErrorMessage
						errorPresent={ errorPresent }
						errorMessage={ errorMessage }
					/>
					<PDFArea
						file={ file }
					/>
				</AntiFlexBox>
				{
					file === null
					?
					(
						<>
							<Counter
								uploadCount={ uploadCount }
							/>
							<Logo
								src="logo.png"
							/>
						</>
					)
					:
					(
						<></>
					)
				}
			</Wrapper>
		</Scrollbars>
	);
};


// Export:
export default App;
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Import the SweetAlert library
import axios from 'axios'; // Import Axios or another HTTP client
import '../Assets/Stylesheets/SpeechNote.scss'
import Timeline from './Timeline';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import '../Assets/Stylesheets/AddMinutes.scss'

function SpeechNote() {


    // ###UseStates: -----------
    // useStates: 
    const [noteContent, setNoteContent] = useState('');
    const [instructions, setInstructions] = useState('Press the Start Recognition button and allow access.');
    const [notes, setNotes] = useState([]);
    const [recognition, setRecognition] = useState(null);
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [chatGPTResponse, setChatGPTResponse] = useState('');
    const apiKey = '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'; // Replace with your actual OpenAI API key
    // const apiKey = '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'; // chatgpt version 3 API key
    let noteCounter = 1;
    const [activeTab, setActiveTab] = useState('records');

    const onTabChange = (tab) => {
        setActiveTab(tab);
    }
    const { transcript, listening, startListening, stopListening } = useSpeechRecognition();


    // ###UseEffect: ----------- 

    //1. Exception 
    useEffect(() => {
        const initRecognition = () => {
            try {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                setRecognition(recognition);
            } catch (e) {
                console.error(e);
                setInstructions('Sorry, Your Browser Doesn\'t Support the Web Speech API. Try Opening This Demo In Google Chrome.');
            }
        };
        initRecognition();
        setNotes(getAllNotes());
    }, []);


    //2. VoiceRecog
    useEffect(() => {
        if (recognition) {
            recognition.onstart = () => {
                setInstructions('Voice recognition activated. Try speaking into the microphone.');
                setIsRecognizing(true);
            };

            recognition.onspeechend = () => {
                setInstructions('You were quiet for a while so voice recognition turned itself off.');
                setIsRecognizing(false);
            };

            recognition.onresult = (event) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript;
                setNoteContent((prevContent) => prevContent + transcript);
            };

            recognition.onerror = (event) => {
                if (event.error === 'no-speech') {
                    setInstructions('No speech was detected. Try again.');
                    setIsRecognizing(false); // Set recognition state to false
                }
            };
        }
    }, [recognition]);

    // Toggle between Start and Pause/Resume
    const toggleRecording = () => {
        if (isRecognizing) {
            pauseRecording();
        } else {
            startRecording();
        }
    };
///////////////////////////// ///////////// //////////////  //////////////// ///
    // ###Functions: -----------

    // Start Recording:
    const startRecording = () => {
        if (noteContent.length) {
            setNoteContent(noteContent + ' ');
        }
        recognition.start();
        setIsRecognizing(true);
        setInstructions('Voice recognition activated. Try speaking into the microphone.');
    };

    // Pause Recording
    const pauseRecording = () => {
        // alert('work')
        recognition.stop();
        setIsRecognizing(false);
        setInstructions('Voice recognition paused.');
    };


    const saveNote = (dateTime, content, title) => {
        // const title = `Speech Note ${noteCounter}`; // Generates the title dynamically
        localStorage.setItem('note-' + dateTime, content);
        // setNotes(getAllNotes());
        setNotes([...notes, { date: dateTime, content, title }]);
        Swal.fire({
            icon: 'success',
            title: 'Note Saved!',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            toast: true,
            // position: 'top-end',
            width: '15rem',
            customClass: {
                popup: 'colored-toast',
            }
        });
    };

    // Save note
    const onSaveNote = () => {
        recognition.stop();
        if (!noteContent.length) {
            setInstructions('Could not save an empty note. Please add a message to your note.');
        } else {
            const dateTime = new Date().toLocaleString();
            // saveNote(new Date().toLocaleString(), noteContent);
            const title = `Note ${noteCounter}`; // Generate a default name
            saveNote(dateTime, noteContent, title);
            setNoteContent('');
            // renderNotes(getAllNotes());
            noteCounter++;
            setNotes(getAllNotes());
            setInstructions('Note saved successfully.');
        }
    };



    // Edit Note:
    // Editing Notes:
    const editNote = (dateTime, newContent) => {
        localStorage.setItem('note-' + dateTime, newContent);
        setNotes(getAllNotes());
        Swal.fire({
            icon: 'success',
            title: 'Note Edited!',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            toast: true,
            width: '15rem',
            customClass: {
                popup: 'colored-toast',
            }
        });
    };

    // Update saved note content
    const updateNoteContent = (dateTime, content) => {
        const newContent = prompt('Edit your note:', content); // Prompt for the new content
        if (newContent !== null) {
            editNote(dateTime, newContent);
        }
    };


    // Update note
    const updateNote = (dateTime, content, name) => {
        localStorage.setItem('note-' + dateTime, content);
        setNotes(getAllNotes());
        Swal.fire({
            // ... your existing Swal configurations
        });
    };




    // Copy Clipboard
    // const copyToClipboard = () => {
    //     const textarea = document.getElementById('note-textarea');
    //     if (textarea) {
    //         textarea.select();
    //         document.execCommand('copy');
    //     }
    // }

    const copyToClipboard = () => {
        if (noteContent.trim().length > 0) {
            navigator.clipboard.writeText(noteContent)
                .then(() => {
                    // Text successfully copied to clipboard
                    console.log('Text copied to clipboard:', noteContent);
                    // Swal.fire({
                    //     icon: 'success',
                    //     title: 'Copied!',
                    //     text: 'Text has been copied to the clipboard',
                    //     showConfirmButton: false,
                    //     timer: 1500 // Close the message after 1.5 seconds
                    // });
                    const copyIcon = document.getElementById('copyIcon');
                    copyIcon.title = 'Copied';
                    copyIcon.style.color = 'pink'; // Set the color to green
                    copyIcon.style.fill = 'green';
                    copyIcon.dataset.bsOriginalTitle = 'Copied!';
                    copyIcon.style.background = 'black';
                    copyIcon.style.setProperty('--bs-tooltip-background-color', 'black');
                    // You can also set a message or state to indicate the text was copied
                })
                .catch((error) => {
                    // Unable to copy text to clipboard
                    console.error('Error copying text to clipboard:', error);
                    // Notify the user about the error
                });
        } else {
            // Notify the user that there's no text to copy
            console.log('There is no text to copy.');
            Swal.fire({
                icon: 'warning',
                title: 'Empty Text',
                text: 'There is no text to copy.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };


    // 01. method: (Some API issue occuring  [Error processing text]):
    const callGPT3API = async (text) => {
        try {
            const desireText = "Convert as minutes of meeting: \n";
            const DesireOutputText = desireText + text;

            const chatGPTResponse = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: DesireOutputText }],
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );
            // Handle the response as needed
            console.log("chat res", chatGPTResponse.data.choices[0].message.content);
            setChatGPTResponse(chatGPTResponse.data.choices[0].message.content);
            // setResponse(chatGPTResponse.data.choices[0].message.content);
        } catch (error) {
            console.error('Error calling GPT-3:', error);
        }
    };


    // const handleSubmit = (e) => {
    //     e.preventDefault(); // Prevent the form from submitting and reloading the page
    //     callGPT3API(noteContent);
    // };

    // Call handleCopyAndSendToChatGPT
    const handleCopyAndSendToChatGPT = (e) => {
        e.preventDefault(); // Prevent the form from submitting and reloading the page
        callGPT3API(noteContent);
    };


    //Delete Notes:
    // const deleteNote = (index) => {
    //     const newNotes = [...notes];
    //     newNotes.splice(index, 1);
    //     setNotes(newNotes);
    // };
    const deleteNote = (dateTime) => {
        localStorage.removeItem('note-' + dateTime);
        // renderNotes(getAllNotes());
        setNotes(getAllNotes());
    };

    //Readout Notes:
    const readOutLoud = (message) => {
        // alert("MeSage")
        const speech = new SpeechSynthesisUtterance();
        speech.text = message;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    };

    // get all the notes
    const getAllNotes = () => {
        const notes = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.substring(0, 5) === 'note-') {
                notes.push({
                    date: key.replace('note-', ''),
                    content: localStorage.getItem(localStorage.key(i))
                });
            }
        }
        return notes;
    };


    // OnTextArea Change:
    const onNoteTextareaChange = (event) => {
        setNoteContent(event.target.value);
    };


    // Function to update the name of the note
    const updateNoteName = (dateTime) => {
        const note = notes.find((n) => n.date === dateTime);
        const newNoteName = prompt('Edit your note name:', note.name);
        if (newNoteName !== null) {
            note.name = newNoteName;
            updateNote(dateTime, note.content, newNoteName);
        }
    };


    //Render Notes:
    const renderNotes = () => {
        return notes.map((note, index) => (
            <li key={index} className="note">{console.log("sdf note name", note, index)}
                
                <div className="d-flex bd-highlight">
                    <span className="p-2 flex-grow-1 bd-highlight name fw-bold" onClick={() => updateNoteName(note.date)}>
                        {note.title} Speech Note
                    </span>
                    <div className='p-2 bd-highlight'>
                        <button className="btn sound" title="Listen to Note" onClick={() => readOutLoud(note.content)}>
                            {/* Listen to Note */}
                            <svg xmlns="http://www.w3.org/2000/svg" height='1rem' viewBox="0 0 640 512">
                                {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                                <path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z" /></svg>
                        </button>
                        <button
                            className="btn text-primary edit_Icon"
                            title="Edit Note"
                            // onClick={() => updateNoteContent(note.date, note.content)}
                            onClick={() => updateNoteContent(note.date, note.content)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width={20} viewBox="0 0 512 512">
                                {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg>

                        </button>
                        <button className="btn text-danger" title="Delete Note" onClick={() => deleteNote(note.date)}>

                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width={20} viewBox="0 0 448 512">
                                {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
                        </button>
                        <span className="date text-muted">{note.date}</span>
                    </div>
                </div>
                <p className="content">{note.content}</p>
            </li>

        ));
    };







    return (
        <div className='Final-container d-flex justify-content-center align-items-center min vh-10 main_content_actionpoint'>
            <div className='col-lg-12'>
                {/* <ul className='nav nav-pills nav-justified'>
                    <li className='nav-item'>
                        <a className='nav-link active' aria-current="page" href='#'>Record</a>
                    </li>
                    <li className='nav-item'>
                        <a className="nav-link active" tabindex="-1" aria-disabled="true" href="#">Notes</a>
                    </li>
                </ul> */}



                <ul className="nav nav-pills">
                    <li className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}>
                        <a className="nav-link " onClick={() => onTabChange('records')}>Record Speech </a>
                    </li>
                    <li className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`}>
                        <a className="nav-link " onClick={() => onTabChange('notes')}>All Notes</a>
                    </li>
                </ul>


                <div className='tab-content'>
                    {/* {activeTab === 'notes' && <Timeline />} */}

                    {activeTab === 'notes' && (

                        <div className='card'>
                            {/* <h3 className='text-center my-notes-title'>My Notes</h3> */}
                            <div className=' right-fix mt-2'>
                                <ol id="notes">{renderNotes(notes)}</ol>
                            </div>
                        </div>
                    )}

                    {activeTab === 'records' && (

                        <div className='card'>
                            {/* <p className='card-header text-center fw-bold'> Speech Recognition Notes </p> */}
                            <div className='card-body'>
                            {/* <p>{isRecognizing ? "Microphone is on" : 'Microphone is off'}</p> */}
                                <code className='fw-bold'>Speech To Text: {isRecognizing ? "(Microphone is [on])" : '(Microphone is [off])'}</code>
                                <textarea placeholder='Speech to text here (or) Type a text' rows={13} className='form-control mb-2 mt-1' value={noteContent}
                                    // onChange={(e) => setNoteContent(e.target.value)}
                                    onChange={onNoteTextareaChange}
                                ></textarea>

                                {/* <div class="copy-text">
                                    <input type="text" class="text" value={noteContent} />
                                    <button><i class="fa fa-clone"></i></button>
                                </div> */}

                                <div id='copyIcon' className='copyIcon' onClick={() => copyToClipboard()} title='copy'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z" />
                                    </svg>
                                </div>

                                <div className='d-flex'>

                                </div>

                                <div className='d-flex justify-content-evenly mt-2 allbuttons'>

                                    <button className='btn Icon_play mx-2 ' title='Start/Pause Recording' onClick={toggleRecording}
                                    // disabled={isRecognizing}
                                    >
                                        {/* <button id="start-record-btn" className='btn btn-success' title="Start Recording" onClick={startRecording}
                                            disabled={isRecognizing}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                                            </svg>
                                            Start
                                        </button> */}
                                        {isRecognizing ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="28" width={28} viewBox="0 0 512 512">
                                                {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM224 192V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32zm128 0V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32z"/></svg>
                                            
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="28" width={28} viewBox="0 0 512 512">
                                            {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                                        <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>
                                        )}
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                                        </svg> */}
                                    </button>
                                    {/* <div className='Icon_pause align-items-center mx-2' title='Pause' onClick={() => pauseRecording}>
                                        <button id="pause-record-btn" title="Pause Recording" className='btn btn-secondary' onClick={() => pauseRecording}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pause-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z" />
                                            </svg>
                                            Pause
                                        </button>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
                                        </svg>

                                    </div> */}
                                    {/*  */}
                                    <button className='btn Icon_save align-items-center' data-mdb-ripple-color="dark" title='Save Note' onClick={onSaveNote}>
                                        {/* <button className='btn btn-primary' onClick={onSaveNote}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
                                                <path d="M11 2H9v3h2V2Z" />
                                                <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0ZM1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5Zm3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4v4.5ZM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V15Z" />
                                            </svg>
                                            Save Note
                                        </button> */}
                                        <svg xmlns="http://www.w3.org/2000/svg" height="28" width={28} viewBox="0 0 448 512">
                                            {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                                        <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-floppy-fill" viewBox="0 0 16 16">
                                            <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5v-13Z" />
                                            <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V16Zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V0ZM9 1h2v4H9V1Z" />
                                        </svg> */}
                                    </button>
                                    {/* <div>
                                        <button onClick={() => copyToClipboard()} className='btn btn-secondary'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z" />
                                            </svg>
                                            Copy To Clipboard</button>
                                    </div> */}
                                    <div>
                                        {/* <button className='btn btn-primary' onClick={handleCopyAndSendToChatGPT}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                                            </svg>
                                            ChatGPT</button> */}
                                        <button className='btn icon_ChatSend' title='ChatGPT-Request' onClick={handleCopyAndSendToChatGPT}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="28" width={28} viewBox="0 0 512 512">
                                            {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                                        <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg>
                                        </button>
                                        {/* <p id="recording-instructions" style={{ color: 'orange' }}>{instructions}</p> */}
                                    </div>
                                </div>
                                <code className='fw-bold'>Chat-GPT Response:</code>
                                <textarea id='chatGPT-response' value={chatGPTResponse} rows={12} readOnly placeholder='ChatGPT Response' className='form-control w-100 mt-2'>
                                </textarea>

                                {/* <div className=''>
                            <h3 className='text-center my-notes-title'>My Notes</h3>
                            <div className='right-fix '>
                                <ol id="notes">{renderNotes(notes)}</ol>
                            </div>
                        </div> */}
                            </div>
                            <div className={`card-footer ${setInstructions === 'Note saved successfully.' ? 'text-success' : 'text-danger'} text-danger text-center`}>
                                {instructions}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SpeechNote
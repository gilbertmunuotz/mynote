import NewNote from './AddNote';
import EditNote from './EditNote';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Spinner from "../components/Spinner";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Note } from "../Interfaces/Interfaces";
import { logoutSuccess } from '../assets/authSlice';
import React, { useState, useEffect } from "react";
import { formatDate } from "../utilities/Datefunc";
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../api/userAPISlice';
import PushPinIcon from '@mui/icons-material/PushPin';
import { Fab, IconButton, Tooltip } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useGetNotesQuery, useDeleteNoteMutation, usePinNoteMutation, useUnPinNoteMutation } from '../api/notesAPISlice';

function Home() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false); // Manage Add Modal
    const [editModalOpen, setEditModalOpen] = useState(false); // Manages the open/close state of the edit modal.
    const [selectedNoteId, setSelectedNoteId] = useState<string>(''); // Stores the ID of the note being edited
    const [notes, setNotes] = useState<Note[]>([]);
    const { data, isLoading, isError } = useGetNotesQuery();
    const [deleteNote] = useDeleteNoteMutation();
    const [logout] = useLogoutMutation();
    const [pin] = usePinNoteMutation();
    const [unPin] = useUnPinNoteMutation();

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => { setModalOpen(false); setEditModalOpen(false); };// Closes both the add and edit modals and resets the selectedNoteId.
    const handleEditOpen = (noteId: string) => { setSelectedNoteId(noteId); setEditModalOpen(true); };//  Sets the selectedNoteId and opens the edit modal.
    const handleEditClose = () => setEditModalOpen(false);

    // Populate form state with the fetched Note data on initial render
    useEffect(() => {
        if (data) {
            setNotes(data.Notes);
        }
    }, [data]);


    //Delete Note Logic
    async function handleDelete(_id: string) {
        if (window.confirm("This Action is Irreversible!")) {
            try {
                await deleteNote(_id).unwrap();
                // Update the notes state after deletion
                setNotes(notes.filter(note => note._id !== _id));
                toast.success("Note deleted successfully");
            } catch (error) {
                console.error('Failed to delete Note: ', error);
                toast.error("Error Deleting Note");
            }
        }
    }


    // User Logout Logic
    async function handleLogout(event: React.FormEvent) {
        event.preventDefault();

        try {
            const user = await logout().unwrap();
            dispatch(logoutSuccess(user));
            toast.success("Logged Out Succesfully!");
            navigate("/");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error Logging Out', error);
            if (error?.data?.message) {
                toast.error(error.data.message);
            }
        }
    }

    // Handle Any Errors if any
    if (isError) {
        console.error("Error Occurred");
        toast.error("Sorry, an error occurred.");
    }

    //Handle pin Note
    async function handlePinNote(noteId: string) {
        try {
            await pin(noteId).unwrap();
        } catch (error) {
            console.error('Failed to pin the note:', error);
            toast.error("Failed to Pin Note")
        }
    }

    //Handle Un Pin Note
    async function handleUnpinNote(noteId: string) {
        try {
            await unPin(noteId).unwrap();
        } catch (error) {
            console.error('Failed to Unpin the note:', error);
            toast.error("Failed to Pin Note")
        }
    }

    // Sort notes so that pinned notes come first
    const sortedNotes = notes.slice().sort((a, b) => b.pinned - a.pinned);

    return (
        <div className="p-4 relative min-h-screen">
            {isLoading ? (
                <Spinner loading={false} />
            ) : (
                <>
                    <div className="flex justify-between my-2 mx-6">
                        <div className="logout">
                            <Tooltip title="Log Out">
                                <button onClick={handleLogout} className='text-base text-white px-5 py-1 rounded-3xl' style={{ background: '#1976D2' }}><LogoutIcon /></button>
                            </Tooltip>
                        </div>

                        <div className="profile">
                            <Tooltip title="Account">
                                <Link to={"/me/profile"}>
                                    <AccountCircleIcon sx={{ fontSize: 40 }} />
                                </Link>
                            </Tooltip>
                        </div>
                    </div>

                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-4 mb-4">
                            {sortedNotes.map((note: Note) => (
                                <div key={note._id} className="p-4 rounded-md" style={{ background: '#EDEAE0' }}>
                                    <div className="flex justify-between">
                                        <h1 className="text-xl font-bold mb-2">{note.title}</h1>
                                        {note.pinned ? (
                                            <Tooltip title="UnPin">
                                                <button type="button" onClick={() => handleUnpinNote(note._id as string)}>{/* Asserted the note._id Type */}
                                                    <PushPinIcon />
                                                </button>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Pin">
                                                <button type="button" onClick={() => handlePinNote(note._id as string)}>{/* Asserted the note._id Type */}
                                                    <PushPinIcon sx={{ opacity: 0.2 }} />
                                                </button>
                                            </Tooltip>
                                        )}
                                    </div>
                                    <p className="text-gray-700">{note.text}</p>
                                    <section className="text-left text-sm flex justify-between sm:text-right sm:text-base border-t-2 border-y-white space-y-2">
                                        <div className="icon mt-2 ">
                                            <IconButton onClick={() => note._id && handleEditOpen(note._id)}>
                                                <Tooltip title="Edit">
                                                    <EditIcon />
                                                </Tooltip>
                                            </IconButton>
                                            <IconButton onClick={() => note._id && handleDelete(note._id)} style={{ color: '#FF0000' }}>
                                                <Tooltip title="Delete">
                                                    <DeleteIcon />
                                                </Tooltip>
                                            </IconButton>
                                        </div>
                                        <div className="timeStamp">
                                            {note.updatedAt && note.createdAt ? (
                                                note.updatedAt > note.createdAt ? (
                                                    `Updated: ${formatDate(note.updatedAt)}`
                                                ) : (
                                                    `${formatDate(note.createdAt)}`
                                                )
                                            ) : (
                                                `Created: ${formatDate(note.createdAt ?? '')}`
                                            )}
                                        </div>
                                    </section>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center text-2xl font-bold">
                                No Notes available
                            </div>
                        </div>
                    )}
                </>
            )}
            {!isLoading && (
                <Tooltip title="New" style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
                    <Fab color="primary" aria-label="add" onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            )}
            <NewNote open={modalOpen} onClose={handleClose} />
            <EditNote open={editModalOpen} onClose={handleEditClose} noteId={selectedNoteId} />
        </div>
    );
}

export default Home;
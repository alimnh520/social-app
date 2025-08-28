'use client'
import { io } from "socket.io-client";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";
import { IoMdLogOut } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { format } from "timeago.js";
import { FaComment, FaHeart, FaShare } from "react-icons/fa";
import { UserContext } from "../Provider";

let socket;

const page = () => {
    const context = useContext(UserContext);
    const user = context?.data;

    // const fontImage = newImage && URL.createObjectURL(newImage);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [editImage, setEditImage] = useState(false);
    const [editName, setEditName] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newName, setNewName] = useState('');
    const [post, setPost] = useState('');

    const [postImage, setPostImage] = useState('');
    const [postText, setPostText] = useState('');
    const [postBox, setPostBox] = useState(false);

    const [postMenu, setPostMenu] = useState(false);
    const [deletePost, setDeletePost] = useState(false);
    const [editPost, setEditPost] = useState(false);

    const fontImage = editImage && newImage ? URL.createObjectURL(newImage) : null;

    if (message) {
        setTimeout(() => {
            setMessage('');
        }, 1500);
    }

    // user post fetch

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await fetch('/api/posts/my-post', {
                    method: 'GET'
                });
                const data = await res.json();
                if (data.success) setPost(data.message);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();

        fetch("/api/socket");

        socket = io({ path: "/api/socket_io" });

        socket.on("newPost", (post) => {
            setPost((prev) => [...prev, post]);
        });

        return () => socket.disconnect();

    }, []);

    if (user) {
        document.title = `My Album । ${user.username}`
    }


    // set new name

    const handleNewName = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/edit-name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newName })
            });
            const data = await res.json();
            if (data.success) window.location.reload();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    // set new Image 

    const handleNewImage = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", newImage);
            formData.append("upload_preset", "my_album_preset");
            formData.append("folder", "love");
            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const uploadResult = await response.json();

            const res = await fetch('/api/user/edit-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ img_url: uploadResult.secure_url, img_id: uploadResult.public_id })
            });

            const data = await res.json();
            if (data.success) window.location.reload();

        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    // upload a post 

    const handleUploadPost = async () => {
        setLoading(true);
        try {
            if (postImage) {
                if ((postImage.size / 1048576) > 30) {
                    setLoading(false);
                    setMessage('File size is too large');
                    return
                }
                const formData = new FormData();
                formData.append("file", postImage);
                formData.append("upload_preset", "my_album_preset");
                formData.append("folder", "love");

                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/${postImage?.type === 'video/mp4' ? 'video' : 'image'}/upload`, {
                    method: 'POST',
                    body: formData
                });
                const uploadResult = await response.json();

                const res = await fetch('/api/posts/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postText, imageType: postImage?.type, post_url: uploadResult.secure_url, post_id: uploadResult.public_id })
                });
                setLoading(false);
                const data = await res.json();
                setMessage(data.message);
                if (data.success) {
                    setPostBox(false);
                    setPostImage('');
                    setPostText('')
                }

            } else {
                const res = await fetch('/api/posts/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postText })
                });
                const data = await res.json();
                setMessage(data.message);
                if (data.success) {
                    setPostBox(false);
                    setPostImage('');
                    setPostText('')
                }
            }

        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }


    // user logout

    const handleLogOut = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/logout', { method: 'GET' });
            const data = await response.json();
            setLoading(false);
            setMessage(data.message);
            if (data.success) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`w-full h-[calc(100vh-69px)] flex items-start gap-x-2 justify-between ${loading ? 'pointer-events-none' : 'pointer-events-auto'} text-white`}>

            {message && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50">
                    {message}
                </div>
            )}

            {loading && (
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 inset-0 flex items-center justify-center bg-opacity-40 z-50 rounded-2xl">
                    <img
                        src="/197-1970959_whf-logo-spinner-to-indicate-loading-transparent-loading-heart-gif.png"
                        alt="Loading"
                        className="w-16 h-16 object-contain"
                    />
                </div>
            )}

            <div className="w-1/4 bg-[#555555a9] h-full flex flex-col items-center pt-10 px-12 relative">


                <div className="w-full z-10 max-w-md p-6 bg-white text-black rounded-lg shadow-lg border border-gray-200 space-y-4 flex flex-col items-center">

                    {/* Profile Image Section */}
                    <div className="relative size-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                        {/* Placeholder for profile image */}
                        <img
                            src={fontImage ? fontImage : user.image || user.image ? user.image : '/no-image-icon-4.png'}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />

                        {/* Edit Image Button */}
                        <button
                            onClick={() => setEditImage(!editImage)}
                            className="absolute bottom-2 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-blue-700 transition"
                        >
                            {editImage ? "Cancel" : "Edit Image"}
                        </button>
                    </div>

                    {/* Image Upload Input */}
                    <div className={`w-full ${editImage ? 'h-14' : 'h-0'} overflow-hidden transition-all duration-300`}>
                        <div className="flex">
                            <input
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                className="w-36 px-3 py-2 border border-blue-500 rounded-l-md text-sm focus:outline-none"
                                onChange={(e) => setNewImage(e.target.files[0])}
                            />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 text-sm" onClick={handleNewImage}>
                                Set
                            </button>
                        </div>
                    </div>

                    {/* Username display with edit button */}
                    <div className="w-full flex items-center justify-between border-t border-t-gray-400 pt-4">
                        <p className="font-semibold text-gray-800 truncate">{user?.username || "Loading..."}</p>
                        <button
                            onClick={() => setEditName(!editName)}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition"
                        >
                            {editName ? "Cancel" : "Edit Name"}
                        </button>
                    </div>

                    {/* Username input */}
                    <div className={`w-full ${editName ? 'h-14' : 'h-0'} overflow-hidden transition-all duration-300`}>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Enter new name"
                                className="w-36 px-3 py-2 border border-blue-500 rounded-l-md text-sm focus:outline-none"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 text-sm" onClick={handleNewName}>
                                Set
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setPostBox(true);
                            setPostImage('');
                        }}
                        className="w-full bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow hover:bg-green-700 transition"
                    >
                        Upload a post 💌
                    </button>

                    <button
                        onClick={handleLogOut}
                        className="w-full bg-red-600 text-white text-sm px-4 py-2 rounded-full shadow hover:bg-red-700 transition"
                    >
                        Logout
                    </button>


                </div>

            </div>

            <div className="w-3/4 h-full relative bg-white overflow-y-auto flex flex-col gap-y-4">

                {
                    postBox && (
                        <div className="w-full max-w-xl bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-xl border border-blue-300 p-6 flex flex-col gap-5 z-20 absolute top-24 left-20">

                            <button className="absolute top-0 right-0 rounded-tr-xl hover:text-white border text-blue-300 border-blue-300 text-2xl shadow hover:bg-blue-300 transition" onClick={() => setPostBox(false)}><RxCross2 /></button>

                            {/* Header */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={user?.image || "/no-image-icon-4.png"}
                                    alt="User"
                                    className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover"
                                />
                                <h2 className="text-base font-medium text-gray-700">What's on your heart, {user?.username || "loading..."}? 💙</h2>
                            </div>

                            {/* Text Area */}
                            <textarea
                                placeholder="Write something magical... ✨"
                                className="w-full h-28 resize-none rounded-xl p-3 text-sm text-gray-700 border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-400 shadow-inner"
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                            ></textarea>

                            {/* Image Upload Button */}
                            <div className="flex items-center justify-between gap-x-2 w-full">
                                <label className="w-full cursor-pointer border border-blue-400 hover:border-blue-600 text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 bg-white transition shadow-sm hover:shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h10a4 4 0 004-4M7 10l5 5 5-5" />
                                    </svg>
                                    Upload Image
                                    <input type="file" className="hidden" onChange={(e) => setPostImage(e.target.files[0])} />
                                </label>
                                {postImage && <button className="cursor-pointer border border-blue-400 hover:border-blue-600 text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg text-sm" onClick={() => setPostImage('')}>cancel</button>}
                            </div>

                            {/* Image Preview */}
                            {postImage && (
                                <div className="w-full rounded-lg overflow-hidden border border-blue-300 shadow">
                                    {
                                        postImage?.type === 'video/mp4' ? (
                                            <video controls className="w-full max-h-96 object-contain">
                                                <source src={URL.createObjectURL(postImage)} type='video/mp4' />
                                            </video>
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(postImage)}
                                                alt="Preview"
                                                className="w-full max-h-96 object-contain"
                                            />
                                        )
                                    }
                                </div>
                            )}

                            {/* Post Button */}
                            <button
                                onClick={handleUploadPost}
                                className="self-end bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-lg text-sm font-semibold"
                            >
                                Post 💌
                            </button>
                        </div>
                    )
                }

                <div className="grid grid-cols-3 gap-3">

                    {
                        post && post.slice().reverse().map((elem) => {
                            return (
                                <div className="w-full h-auto max-w-xl bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-4" key={elem._id}>
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={elem.userAvatar || "/no-image-icon-4.png"}
                                                alt="User"
                                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{elem.username || "Unknown User"}</p>
                                                <p className="text-xs text-gray-500">{format(elem.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <button className="text-gray-500 cursor-pointer hover:text-blue-600" onClick={() => setPostMenu(!postMenu)}>
                                                <BsThreeDotsVertical />
                                            </button>
                                            {
                                                postMenu && (
                                                    <div className="absolute right-0 mt-2 w-40 flex flex-col items-start bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                                        <button className="w-full flex items-center gap-x-1.5 text-black px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors" onClick={() => {
                                                            setPostMenu(false);
                                                            setEditPost(true);
                                                        }}>
                                                            <span><FaRegEdit /></span> Edit Post
                                                        </button>
                                                        <button className="w-full flex items-center gap-x-1.5 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={() => {
                                                            setPostMenu(false);
                                                            setDeletePost(true);
                                                        }}>
                                                            <span><MdDelete /></span> Delete Post
                                                        </button>
                                                    </div>
                                                )
                                            }

                                        </div>
                                    </div>

                                    {/* elem Text */}
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{elem.content}</p>

                                    {/* elem Image */}
                                    {elem.imageUrl && (elem.imageType === "video/mp4" ? (
                                        <div className="w-full rounded-md overflow-hidden border border-blue-200">
                                            <video controls className="w-full object-contain max-h-[400px] bg-gray-50">
                                                <source src={elem.imageUrl} type='video/mp4' />
                                            </video>
                                        </div>
                                    ) : (
                                        <div className="w-full rounded-md overflow-hidden border border-blue-200">
                                            <img
                                                src={elem.imageUrl}
                                                alt="Post content"
                                                className="w-full object-contain max-h-[400px] bg-gray-50"
                                            />
                                        </div>))
                                    }

                                    {/* Actions */}

                                    <div className="grid grid-cols-3 items-center justify-center text-sm text-gray-500 pt-2 border-t border-gray-200">
                                        <button className="hover:text-blue-600 cursor-pointer text-xl gap-x-1 flex items-center justify-center"><span className="mt-1 text-xs">{elem?.likes?.length} </span> <BiSolidLike /> </button>

                                        <button className="hover:text-blue-600 cursor-pointer text-xl gap-x-1 flex items-center justify-center"><span className="-bg-conic-0mt-1 text-xs">{elem?.comments?.length} </span> <FaComment /> </button>

                                        <button className="hover:text-blue-600 cursor-pointer text-xl gap-x-1 flex items-center justify-center"><span className="mt-1 text-xs">0 </span> <FaShare /> </button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>

        </div >
    )
}

export default page
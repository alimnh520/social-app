'use client'
import { IoMdLogOut } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { format } from "timeago.js";
import { FaComment, FaHeart } from "react-icons/fa";
import { UserContext } from "../Provider";

const page = () => {
    const user = useContext(UserContext);
    const [upload, setUpload] = useState(false);
    const [userMenu, setUserMenu] = useState(true);
    const [editName, setEditName] = useState(false);
    const [newName, setNewName] = useState('');
    const [editImage, setEditImage] = useState(false);
    const [newImage, setNewImage] = useState('');
    const imageUrl = newImage && URL.createObjectURL(newImage);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageId, setImageId] = useState('');
    const [sourceType, setSourceType] = useState('');
    const [post, setPost] = useState('');

    if (message) {
        setTimeout(() => {
            setMessage('')
        }, 1500);
    }

    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [imgDel, setImgDel] = useState(false);
    const [menuBar, setMenuBar] = useState(false);
    const [postId, setPostId] = useState('');
    const [indexNum, setIndexNum] = useState('');
    const [edit, setEdit] = useState(false);
    const [comment, setComment] = useState(false);

    const handleUpload = async () => {
        if (image) {
            if ((image.size / 1048576) > 20) {
                setMessage('File size is too large');
                return
            }
        }
        setLoading(true);
        if (upload) {
            if (!image || !text) {
                setMessage('share text and photo');
                setLoading(false);
                return
            }
            try {
                const formData = new FormData();
                formData.append("file", image);
                formData.append("upload_preset", "my_album_preset");
                formData.append("folder", "love");
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/dfc60thdd/${image.type === "video/mp4" ? 'video' : 'image'}/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );
                const uploadResult = await response.json();
                const res = await fetch('/api/user/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ secure_url: uploadResult.secure_url, public_id: uploadResult.public_id, text, format: image.type.split('/')[1] }),
                });
                const data = await res.json();
                setLoading(false);
                setMessage(data.message);
                if (data.success) {
                    setEditImage(false);
                    window.location.reload();
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (edit) {
            if (!image && !text) {
                setMessage('edit something');
                setLoading(false);
                return
            }
            try {
                if (image) {
                    const formData = new FormData();
                    formData.append("file", image);
                    formData.append("upload_preset", "my_album_preset");
                    formData.append("folder", "love");
                    const res = await fetch(
                        `https://api.cloudinary.com/v1_1/dfc60thdd/${image.type === "video/mp4" ? 'video' : 'image'}/upload`,
                        {
                            method: "POST",
                            body: formData,
                        }
                    );
                    const uploadResult = await res.json();
                    const response = await fetch('/api/user/edit-post', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ secure_url: uploadResult.secure_url, public_id: uploadResult.public_id, format: image.type.split('/')[1], post_id: postId, delete_id: indexNum }),
                    });
                    const data = await response.json();
                    setLoading(false);
                    setMessage(data.message);
                    if (data.success) {
                        setEditImage(false);
                        window.location.reload();
                    }
                }
                const response = await fetch('/api/user/edit-post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, post_id: postId }),
                });
                const data = await response.json();
                setLoading(false);
                setMessage(data.message);
                if (data.success) {
                    setEditImage(false);
                    window.location.reload();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const uploadUrl = image && URL.createObjectURL(image);

    const handleEditName = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/edit-name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });
            const data = await res.json();
            setLoading(false);
            setMessage(data.message);
            if (data.success) {
                setEditImage(false);
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleEditImage = async () => {
        if (newImage) {
            if ((newImage.size / 1048576) > 6) {
                setMessage('File size is too large');
                return
            }
        }
        if (newImage) {
            if (newImage.type === "video/mp4") {
                setMessage('use only photo');
                return
            }
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", newImage);
            formData.append("upload_preset", "my_album_preset");
            formData.append("folder", "love");
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dfc60thdd/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const uploadResult = await response.json();

            const res = await fetch('/api/user/edit-photo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secure_url: uploadResult.secure_url, public_id: uploadResult.public_id }),
            });

            const data = await res.json();
            setLoading(false);
            setMessage(data.message);
            if (data.success) {
                setEditImage(false);
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleDelete = async () => {
        setImgDel(false);
        setLoading(true);
        try {
            const response = await fetch('/api/user/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageId, type: sourceType, postId })
            });
            setLoading(false);
            const data = await response.json();
            setMessage(data.message);
            if (data.success) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/user/my-post', {
                    method: 'GET'
                });
                const data = await res.json();
                if (data.success) {
                    setPost(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    if (user) {
        document.title = user.username
    }

    const handleLogOut = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/logout', { method: 'GET' });
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
        <div className={`w-full h-screen flex items-start justify-center gap-x-4 relative ${loading ? 'pointer-events-none' : 'pointer-events-auto'} text-white`}>


            {message && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50">
                    {message}
                </div>
            )}

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-40 z-50 rounded-2xl">
                    <img
                        src="/197-1970959_whf-logo-spinner-to-indicate-loading-transparent-loading-heart-gif.png"
                        alt="Loading"
                        className="w-16 h-16 object-contain"
                    />
                </div>
            )}

            {(upload || edit) &&
                <div className="absolute w-6/12 max-sm:w-[320px] h-auto bg-gray-800 top-1/2 -translate-y-1/2 p-7 flex flex-col gap-y-4 items-center border border-gray-200 z-30">
                    <div className="absolute top-2 right-2 text-2xl cursor-pointer" onClick={() => {
                        setUpload(false);
                        setEdit(false);
                    }}><RxCross2 /></div>

                    <div className="w-full h-auto flex max-sm:flex-col gap-3">
                        <textarea name="" value={text} className="h-48 flex-1 max-sm:flex-none max-sm:w-full outline-none border-none " placeholder="write here...." onChange={(e) => setText(e.target.value)}></textarea>

                        <div className="w-52 h-60 bg-white max-sm:w-full flex flex-col items-center justify-end relative">
                            <div className="absolute top-2 right-2 z-20 text-2xl cursor-pointer" onClick={() => setImage('')}><RxCross2 /></div>

                            {
                                image ? (
                                    image.type !== 'video/mp4' ? (
                                        <img src={uploadUrl} className="absolute h-full" />
                                    ) : (
                                        <video controls className='h-full absolute'>
                                            <source src={uploadUrl} type='video/mp4' />
                                        </video>
                                    )
                                ) : (
                                    <img src='/no-image-icon-4.png' className="absolute h-full" />
                                )
                            }

                            <div className="w-24 h-8 mb-2 flex items-center justify-center relative">
                                {
                                    !image && (
                                        <button className="w-full h-full flex items-center justify-center bg-green-600 rounded-md">select file
                                        </button>
                                    )
                                }
                                <input type="file" className='opacity-0 absolute' onChange={(e) => setImage(e.target.files[0])} />
                            </div>
                        </div>

                    </div>

                    <button className='py-1.5 bg-red-600 rounded-md  text-lg w-40' onClick={handleUpload}>Share</button>
                </div>
            }

            <div className={`w-3/12 h-full bg-gray-800 flex flex-col items-center pt-10 gap-y-3 max-sm:absolute max-sm:w-full transition-all duration-500 ${userMenu ? '-left-full' : 'left-0'} z-20`}>

                <div className="absolute top-2 right-2 text-2xl cursor-pointer hidden max-sm:block z-30" onClick={() => setUserMenu(true)}><RxCross2 /></div>

                <div className="size-40 rounded-full drop-shadow-[0_0_10px_#d31158] relative flex items-center justify-center z-10">
                    <img src={imageUrl ? imageUrl : user.image || user.image ? user.image : '/no-image-icon-4.png'} className="w-full h-full object-cover object-center rounded-full" />

                    <button className="bg-red-500 rounded-full text-xl cursor-pointer p-1.5 absolute right-0 bottom-0" onClick={() => setEditImage(!editImage)}><MdModeEditOutline /></button>
                </div>

                {
                    editImage && (
                        <div className="flex items-center gap-x-2 w-60 z-10">
                            <input type="file" className='py-2 rounded-md w-full border px-3' onChange={(e) => setNewImage(e.target.files[0])} />
                            <button className='py-1.5 bg-red-600 rounded-md  text-lg px-5 cursor-pointer' onClick={handleEditImage}>Set</button>
                        </div>
                    )
                }

                <div className='text-3xl font-semibold flex items-center justify-center gap-x-3 z-10'>
                    <h1>{user.username}</h1>
                    <button className="bg-red-500 rounded-full text-xl cursor-pointer p-1.5 mb-1.5" onClick={() => setEditName(!editName)}><MdModeEditOutline /></button>
                </div>

                {
                    editName && (
                        <div className="flex items-center gap-x-2 z-10">
                            <input type="text" className="py-1.5 px-3 text-lg font-semibold outline-none border border-gray-400 rounded-md bg-white text-black" value={newName} onChange={(e) => setNewName(e.target.value)} />
                            <button className='py-1.5 bg-red-600 rounded-md  text-lg px-5 cursor-pointer' onClick={handleEditName}>Set</button>
                        </div>
                    )
                }

                <button className='py-1.5 mt-12 z-10 bg-green-600 rounded-md  text-lg w-40 ' onClick={() => setUpload(true)}>Upload</button>

                <button className='py-1.5 mt-12 z-10 bg-red-600 rounded-md flex items-center justify-center gap-x-2 text-lg w-40 ' onClick={handleLogOut}>Logout <IoMdLogOut /></button>

            </div>
            <div className="w-9/12 h-full overflow-y-scroll dashboard grid grid-cols-3 gap-4 max-sm:gap-0 max-sm:grid-cols-1 max-sm:w-full">

                <div className="h-12 w-full hidden max-sm:flex items-center justify-between px-4 border-b border-b-[#d31158] mb-3" onClick={() => setUserMenu(false)}>
                    <div className="h-full flex items-center justify-center gap-x-3">
                        <img src={user.image ? user.image : '/no-image-icon-4.png'} className='size-10 rounded-full object-cover object-center' />
                        <div className="h-9 w-0.5 bg-[#d31158]"></div>
                        <p className="text-base">Whats's on your mind? </p>
                    </div>
                    <img src="/landscape-photo-3d-icon-illustration-png.webp" alt="" className="h-full" />
                </div>

                {
                    imgDel && (
                        <div className="w-64 h-28 bg-white rounded-md absolute border flex flex-col items-center justify-center gap-y-4 text-red-600 z-20 border-red-600 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
                            <p>Are you sure to delete this photo</p>
                            <div className="flex items-center justify-center gap-x-5">
                                <button className='px-6 py-1.5 bg-green-600 rounded-md text-white ' onClick={() => setImgDel(false)}>No</button>
                                <button className='px-6 py-1.5 bg-red-600 rounded-md text-white ' onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    )
                }

                {
                    post && post.slice().reverse().map((elem, index) => {
                        return (
                            <div className="flex flex-col p-4 gap-y-5 z-10 relative" key={index}>

                                {
                                    (postId === elem.post_id && comment) && (
                                        <div className="absolute w-80 h-[420px] mt-5 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center px-2 py-5 bg-white text-[#d31142] z-20">

                                            <div className="w-full h-full flex flex-col mt-2 overflow-y-scroll gap-y-3">
                                                {
                                                    elem.comment?.slice().reverse().map((comment, index) => {
                                                        return (
                                                            <div className="w-full h-auto flex items-start justify-start gap-x-3" key={index}>
                                                                <img src={comment.user_image ? comment.user_image : '/no-image-icon-4.png'} className='size-10 rounded-full object-cover object-center' />
                                                                <div className='flex flex-1 flex-col gap-y-2 -mt-0.5'>
                                                                    <div className='w-full flex flex-col border-b border-b-[#d31142] pb-1'>
                                                                        <Link href={`/components/user/${comment.username}`}><p>{comment.username}</p></Link>
                                                                        <p className='text-xs -mt-0.5'>{format(comment.createdAt)}</p>
                                                                    </div>
                                                                    <p className='whitespace-pre-wrap leading-relaxed'>{comment.comment}</p>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                            <button className="absolute top-2 right-2 text-xl cursor-pointer" onClick={() => {
                                                setPostId('');
                                                setComment(false);
                                            }}><RxCross2 /></button>
                                        </div>
                                    )
                                }

                                <div className={`absolute flex flex-col gap-y-3 right-6 ${elem.format === 'mp4' ? 'bottom-32 z-10' : 'bottom-10'}`}>
                                    <div className={`text-[#d31142] text-4xl relative flex items-center justify-center flex-col gap-y-1`}>
                                        <FaHeart />
                                        <p className="text-white text-lg">{elem.liked?.length}</p>
                                    </div>
                                    <div className="text-4xl text-[#d31142] cursor-pointer relative flex items-center justify-center flex-col gap-y-1 " onClick={() => {
                                        setPostId(elem.post_id);
                                        setComment(true);
                                    }}>
                                        <FaComment />
                                        <p className="text-white text-lg">{elem.comment?.length}</p>
                                    </div>
                                </div>

                                <div className="absolute top-5 right-2 flex items-center justify-center" onClick={() => {
                                    setMenuBar(!menuBar);
                                    setIndexNum(elem.public_id);
                                    setPostId(elem.post_id);
                                }}>
                                    <div className="text-3xl">
                                        <BsThreeDotsVertical />
                                    </div>
                                    <div className={`w-24 ${menuBar && elem.post_id === postId ? 'h-24' : 'h-0'} bg-white text-[#d31142] absolute right-3.5 transition-all duration-300 top-full flex flex-col justify-center overflow-hidden cursor-pointer`}>
                                        <button className="cursor-pointer hover:bg-red-600 hover:text-white text-start px-3 py-1" onClick={() => setEdit(true)}>Edit</button>
                                        <button className='cursor-pointer hover:bg-red-600 hover:text-white text-start px-3 py-1' onClick={() => {
                                            setImgDel(true);
                                            setPostId(elem.post_id);
                                            setImageId(elem.public_id);
                                            setSourceType(elem.format);
                                        }}>Delete</button>
                                        <Link href={`/components/dashboard/${elem.public_id?.split('/')[1]}`} className='cursor-pointer hover:bg-red-600 hover:text-white text-start px-3 py-1' >See</Link>
                                    </div>
                                </div>

                                <div className='flex items-center gap-x-3 border-b border-b-[#d31142] pb-2'>
                                    <img src={user.image ? user.image : '/no-image-icon-4.png'} className='size-10 rounded-full object-cover object-center' />
                                    <div className='flex flex-col items-start justify-center'>
                                        <p>{user.username}</p>
                                        <p className='text-xs -mt-px ml-1.5'>{format(elem.createdAt)}</p>
                                    </div>
                                </div>
                                <p className='whitespace-pre-wrap leading-relaxed'>{elem.text}</p>
                                {
                                    elem.format === 'mp4' ? (
                                        <video controls className='w-full h-[500px]'>
                                            <source src={elem.img_url} type='video/mp4' />
                                        </video>
                                    ) : (
                                        <div className='w-full h-[500px]'>
                                            <img src={elem.img_url} alt="" className='h-full w-full object-cover object-center' />
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div >
    )
}

export default page
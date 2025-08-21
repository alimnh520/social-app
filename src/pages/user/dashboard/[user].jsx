'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaComment, FaHeart } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { format } from 'timeago.js';

const page = () => {
    const params = useParams();
    const [comment, setComment] = useState(false);
    const [user, setUser] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/user/my-post', {
                    method: 'GET'
                });
                const data = await res.json();
                if (data.success) {
                    setUser(data.message);
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

    return (
        <div className='w-full flex flex-col items-center text-white justify-center px-10 max-sm:p-0 relative z-10'>
            {
                user ? (
                    user.filter((currElm) => {
                        return currElm.public_id.split('/')[1] === params.id;
                    }).map((elem, index) => {
                        return (
                            <div className="w-1/2 h-auto flex flex-col p-4 gap-y-5 max-sm:w-full relative" key={index}>
                                <p className='text-start'>{elem.text ? elem.text : 'Nothing caption...'}</p>

                                {
                                    comment && (
                                        <div className="absolute w-80 h-[420px] mt-5 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center z-10 px-2 py-5 bg-white text-[#d31142]">

                                            <div className="w-full h-auto flex flex-col mt-2 overflow-y-scroll gap-y-3">
                                                {
                                                    elem.comment?.slice().reverse().map((comment, index) => {
                                                        return (
                                                            <div className="w-full h-auto flex items-start justify-start gap-x-3" key={index}>
                                                                <img src={comment.user_image ? comment.user_image : '/no-image-icon-4.png'} className='size-10 rounded-full object-cover object-center' />
                                                                <div className='flex flex-1 flex-col gap-y-2 -mt-0.5'>
                                                                    <div className='w-full flex flex-col border-b border-b-[#d3115873] pb-1'>
                                                                        <p>{comment.username}</p>
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
                                                setComment(false);
                                            }}><RxCross2 /></button>
                                        </div>
                                    )
                                }


                                <div className="w-full flex items-center justify-center">
                                    <div className={`absolute flex flex-col gap-y-3 right-8 ${elem.format === 'mp4' ? 'bottom-32 z-10' : 'bottom-10'}`}>
                                        <div className={`text-[#d31142] text-4xl relative flex items-center justify-center flex-col gap-y-1`}>
                                            <FaHeart />
                                            <p className="text-white text-lg">{elem.liked?.length}</p>
                                        </div>
                                        <div className="text-4xl text-[#d31142] cursor-pointer relative flex items-center justify-center flex-col gap-y-1 " onClick={() => {
                                            setComment(true);
                                        }}>
                                            <FaComment />
                                            <p className="text-white text-lg">{elem.comment?.length}</p>
                                        </div>
                                    </div>
                                    {
                                        elem.format === 'mp4' ? (
                                            <video controls>
                                                <source src={elem.img_url} type='video/mp4' />
                                            </video>
                                        ) : <img src={elem.img_url} alt="" />
                                    }
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className='w-full h-screen flex items-center justify-center z-20'>
                        <img src="/197-1970959_whf-logo-spinner-to-indicate-loading-transparent-loading-heart-gif.png" alt="" className='size-36 object-center object-cover' />
                    </div>
                )
            }
        </div>
    )
}

export default page
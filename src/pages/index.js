'use client'
import { IoSendSharp } from "react-icons/io5";
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
import { UserContext } from "./Provider";

let socket;

export default function LiveChat() {

  const [post, setPost] = useState('');
  const [postComment, setPostComment] = useState(false);

  useEffect(() => {
    async function userPost() {
      try {
        const response = await fetch('/api/posts/user-post', { method: "GET" });
        const data = await response.json();
        setPost(data.message);
      } catch (error) {
        console.log(error);
      }
    }
    userPost();

    fetch("/api/socket");

    socket = io({ path: "/api/socket_io" });

    socket.on("newPost", (post) => {
      setPost((prev) => [...prev, post]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 px-20">
      {
        post && post.slice().reverse().map((elem) => {
          return (
            <div className="w-full relative h-auto max-w-xl bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-4" key={elem._id}>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={elem.userAvatar || "/no-image-icon-4.png"}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover object-center  object-cover border-2 border-blue-400"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{elem.username || "Unknown User"}</p>
                    <p className="text-xs text-gray-500">{format(elem.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* elem Text */}
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{elem.content}</p>

              {/* elem Image */}
              {elem.imageUrl && (elem.imageType === "video/mp4" ? (
                <div className="w-full rounded-md overflow-hidden border border-blue-200">
                  <video controls className="w-full object-contain max-h-[300px] bg-gray-50">
                    <source src={elem.imageUrl} type='video/mp4' />
                  </video>
                </div>
              ) : (
                <div className="w-full rounded-md overflow-hidden border border-blue-200">
                  <img
                    src={elem.imageUrl}
                    alt="Post content"
                    className="w-full object-contain max-h-[300px] bg-gray-50"
                  />
                </div>))
              }

              {/* Actions */}

              <div className={`w-72 ${postComment ? 'h-[410px]' : 'h-0'} overflow-hidden transition-all duration-200 absolute bottom-7 left-1/2 -translate-x-1/2 max-w-xl bg-white rounded-2xl shadow-md border border-gray-200 p-0 flex flex-col space-y-2`}>
                {/* 🔹 Comments List */}
                <div className="flex-1 max-h-80 overflow-y-auto space-y-4 p-3">
                  {/* Single Comment */}
                  <div className="flex items-start space-x-3">
                    <img
                      src="https://i.pravatar.cc/40?img=1"
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover object-center "
                    />
                    <div className="flex flex-col">
                      <div className="bg-gray-100 rounded-2xl px-3 py-2">
                        <p className="text-sm font-semibold text-black">John Doe</p>
                        <p className="text-sm text-gray-700">This is a great post! 👏</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">2m</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <img
                      src="https://i.pravatar.cc/40?img=2"
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover object-center "
                    />
                    <div className="flex flex-col">
                      <div className="bg-gray-100 rounded-2xl px-3 py-2">
                        <p className="text-sm font-semibold text-black">Jane Smith</p>
                        <p className="text-sm text-gray-700">Wow, thanks for sharing 🙌</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">5m</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <img
                      src="https://i.pravatar.cc/40?img=2"
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover object-center "
                    />
                    <div className="flex flex-col">
                      <div className="bg-gray-100 rounded-2xl px-3 py-2">
                        <p className="text-sm font-semibold text-black">Jane Smith</p>
                        <p className="text-sm text-gray-700">Wow, thanks for sharing 🙌</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">5m</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <img
                      src="https://i.pravatar.cc/40?img=2"
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover object-center "
                    />
                    <div className="flex flex-col">
                      <div className="bg-gray-100 rounded-2xl px-3 py-2">
                        <p className="text-sm font-semibold text-black">Jane Smith</p>
                        <p className="text-sm text-gray-700">Wow, thanks for sharing 🙌</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">5m</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <img
                      src="https://i.pravatar.cc/40?img=2"
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover object-center "
                    />
                    <div className="flex flex-col">
                      <div className="bg-gray-100 rounded-2xl px-3 py-2">
                        <p className="text-sm font-semibold text-black">Jane Smith</p>
                        <p className="text-sm text-gray-700">Wow, thanks for sharing 🙌</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">5m</span>
                    </div>
                  </div>

                </div>

                {/* 🔹 Add Comment Box */}
                <div className="w-full flex items-center justify-between space-x-1 border-t pl-3 pr-1 border-t-gray-200 text-black pt-3">
                  <img
                    src="https://i.pravatar.cc/40?img=5"
                    alt="avatar"
                    className="w-10 h-10 object-cover object-center rounded-full"
                  />
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 mt-0.5 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  <button className="text-xl cursor-pointer w-9 h-9 rounded-full flex items-center justify-center px-2 mt-0.5 bg-gray-200"><IoSendSharp /></button>
                </div>
              </div>


              <div className="grid grid-cols-3 items-center justify-center text-sm text-gray-500 pt-2 border-t border-gray-200">
                <button className="hover:text-blue-600 cursor-pointer text-xl gap-x-1 flex items-center justify-center"><span className="mt-1 text-xs">{elem?.likes?.length} </span> <BiSolidLike /> </button>

                <button className="hover:text-blue-600 cursor-pointer text-xl gap-x-1 flex items-center justify-center" onClick={() => setPostComment(!postComment)}><span className="-bg-conic-0mt-1 text-xs">{elem?.comments?.length} </span> <FaComment /> </button>

                <button className="hover:text-blue-600 cursor-pointer text-xl gap-x-1 flex items-center justify-center"><span className="mt-1 text-xs">0 </span> <FaShare /> </button>
              </div>
            </div>
          )
        })
      }


    </div>
  );
}

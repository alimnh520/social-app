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
import { UserContext } from "./Provider";

let socket;

export default function LiveChat() {

  const [post, setPost] = useState('');

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
  );
}

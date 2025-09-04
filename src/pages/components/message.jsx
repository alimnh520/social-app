import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import moment from "moment";
import { ImCross } from "react-icons/im";
import { UserContext } from "../Provider";
import { IoIosArrowBack } from "react-icons/io";
/** Messenger-like desktop layout (Tailwind only) */
export default function MessengerDesktop() {

    const context = useContext(UserContext);
    const user = context?.data;
    const [history, setHistory] = useState([]);
    const [chatUser, setChatUser] = useState("");
    const [input, setInput] = useState("");

    const [searchUser, setSearchUser] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const [userMessage, setUserMessage] = useState("");
    const [mobileView, setMobileView] = useState(false);

    useEffect(() => {

        const userData = async () => {
            try {
                const res = await fetch('/api/message/all-user', {
                    method: 'GET'
                });
                const data = await res.json();
                if (data.success) setSearchUser(data.message);
            } catch (error) {
                console.log(error);
            }
        }
        userData();

        const messageHistory = async () => {
            try {
                const res = await fetch('/api/message/userMessage', {
                    method: 'GET'
                });
                const data = await res.json();
                if (data.success) {
                    setHistory(data.message);

                }
            } catch (error) {
                console.log(error);
            }
        }
        messageHistory();

    }, []);


    const result = searchUser && searchUser?.filter(find =>
        history?.map(user => user.members[1] === find._id)
    );


    const resultMessage = searchUser && searchUser?.filter(find =>
        history?.map(user => user.members[1] === find._id)
    );

    useEffect(() => {
        const userMessage = async () => {
            try {
                const res = await fetch('/api/message/userMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: chatUser?._id })
                });
                const data = await res.json();
                if (data.success) setUserMessage(data.message);

            } catch (error) {
                console.log(error);
            }
        }
        userMessage();

    }, [chatUser]);

    useEffect(() => {
        const userMessage = async () => {
            try {
                const res = await fetch('/api/message/userMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: history[history?.length - 1]?.members[1] })
                });
                const data = await res.json();
                if (data.success) setUserMessage(data.message);

            } catch (error) {
                console.log(error);
            }
        }
        userMessage();

    }, [history]);

    const handleSendMessage = async () => {
        try {
            await fetch('/api/message/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: chatUser._id, text: input })
            });
            setInput("");
        } catch (error) {
            console.log(error);
        }
    }

    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [userMessage]);


    return (
        <div className="h-screen w-full bg-gradient-to-br text-black
         from-[#1f1c2c] to-[#928DAB] p-4">
            <div className="mx-auto h-full max-w-5xl rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 overflow-hidden flex" >
                {/* Left: conversation list */}
                <aside className="w-80 border-r border-gray-200 bg-white/70 backdrop-blur">
                    <div className="p-4 pb-2">
                        <h2 className="text-xl font-semibold">Chats</h2>
                        <div className="mt-3 flex relative">
                            <input
                                type="text"
                                placeholder="Search Messenger"
                                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                value={searchInput}
                                onFocus={() => setIsSearch(true)}
                                onChange={(e) => { setSearchInput(e.target.value) }}
                            />

                            {isSearch && (<div className="w-72 max-h-80 bg-white absolute z-10 top-10 left-0 rounded-2xl shadow-lg border border-gray-200 p-4 flex flex-col space-y-2 overflow-y-auto pb-9">

                                <button className=" absolute -bottom-1 cursor-pointer left-1/2 -translate-x-1/2 text-sm size-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-700" onClick={() => setIsSearch(false)}><ImCross /></button>

                                {searchUser && searchUser.filter((key) => key.username.toLowerCase().includes(searchInput.toLowerCase()) && key._id !== user._id).slice().reverse().map((elem) => {

                                    return (
                                        <div key={elem._id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer" onClick={() => {
                                            !history?.some(u => u.members[1] === elem._id) && setHistory((prev) => [...prev, { members: ['', elem._id] }]);
                                            setChatUser(elem);
                                            setMobileView(true);
                                            setIsSearch(false);
                                        }}>
                                            <img
                                                src={elem.image}
                                                alt={elem.username}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <div className="leading-tight flex flex-col">
                                                <p className="font-semibold text-sm">{elem._id === user._id ? 'You' : elem.username}</p>
                                                <p className="text-xs text-gray-500">
                                                    {elem.online ? (
                                                        <span className="inline-flex items-center gap-1">
                                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                            Active now
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1">
                                                            <span className="h-2 w-2 rounded-full bg-gray-400" />
                                                            Offline
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            )}

                        </div>
                    </div>
                    <div className="h-[calc(100%-92px)] overflow-y-auto">
                        {history && history?.slice().reverse().map((user) => (
                            searchUser && searchUser?.filter((find) => find._id === user.members[1]).map((elem) => {
                                return (
                                    <button
                                        key={elem._id}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition text-left ${elem._id === chatUser?._id && 'bg-indigo-50'
                                            } ${elem._id === history[history?.length - 1]?.members[1] && 'bg-indigo-50'
                                            }`}
                                        onClick={() => {
                                            setChatUser(elem);
                                            setMobileView(true);
                                        }}
                                    >
                                        <div className="relative">
                                            <img
                                                src={elem.image}
                                                alt={elem.username}
                                                className="h-11 w-11 rounded-full object-cover"
                                            />
                                            <span className="absolute -bottom-0 -right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate font-medium">{elem.username}</p>
                                                <span className="text-xs text-gray-500">{moment(user.updatedAt).format("h:mm A")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="truncate text-sm text-gray-600">{user.lastMessage}</p>
                                                <span className="ml-auto inline-flex items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                                                    5
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })
                        ))}
                    </div>
                </aside>

                {/* Center: chat thread */}
                <main className="flex-1 flex flex-col">
                    {/* Chat header */}
                    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-white/80 px-5 py-3 backdrop-blur">

                        <button className={`text-2xl transition-all duration-300`} onClick={() => setMobileView(false)}>
                            <IoIosArrowBack />
                        </button>

                        <img
                            src={chatUser ? chatUser?.image : result[0]?.image}
                            className="h-10 w-10 rounded-full object-cover"
                            alt={chatUser ? chatUser?.username : result[0]?.username}
                        />
                        <div className="leading-tight">
                            <p className="font-semibold">{chatUser ? chatUser?.username : result[0]?.username}</p>
                            <p className="text-xs text-gray-500">
                                {chatUser?.online ? (
                                    <span className="inline-flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active now
                                    </span>
                                ) : (
                                    "Offline"
                                )}
                            </p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <IconBtn title="Search" icon="🔎" />
                            <IconBtn title="Call" icon="📞" />
                            <IconBtn title="More" icon="⋯" />
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto home bg-[url('https://i.ibb.co/88b1pVb/messenger-bg.png')] bg-[length:400px]" ref={scrollRef}>
                        <div className="mx-auto max-w-3xl px-4">
                            {/* Date separator */}
                            <DateDivider label="Today" />
                            {userMessage && userMessage.map((message) => {
                                return (
                                    <div key={message._id} className={`mb-2 flex ${message.senderId === user._id ? "justify-end" : "justify-start"}`}>
                                        <div className={`flex max-w-[70%] items-end gap-2 ${user?.senderId ? "flex-row-reverse" : ""}`}>
                                            {
                                                message.senderId !== user._id && (
                                                    <img
                                                        src={chatUser?.image}
                                                        className="h-8 w-8 rounded-full object-cover"
                                                        alt=""
                                                    />
                                                )
                                            }
                                            <div
                                                className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${message.senderId === user._id
                                                    ? "bg-indigo-600 text-white rounded-br-md"
                                                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap break-words">{message.text}</p>
                                                <div
                                                    className={`mt-1 select-none text-[10px] ${message.senderId === user._id ? "text-indigo-200" : "text-gray-500"
                                                        }`}
                                                >
                                                    {moment(message.createdAt).format("h:mm A")}
                                                </div>
                                            </div>
                                            {/* {showSeen && (
                                                <img
                                                    src={chatUser?.image}
                                                    title="Seen"
                                                    className="h-4 w-4 rounded-full ring-2 ring-white"
                                                    alt="seen"
                                                />
                                            )} */}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div >

                    {/* Composer */}
                    < div className="border-t border-gray-200 bg-white/80 p-3" >
                        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl bg-gray-50 p-2 ring-1 ring-gray-200 focus-within:ring-indigo-400">
                            <IconBtn icon="➕" title="Add" />
                            <textarea
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Aa"
                                className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
                            />
                            <IconBtn icon="😊" title="Emoji" />
                            <button
                                onClick={handleSendMessage}
                                className={`inline-flex h-9 ${input ? 'pointer-events-auto bg-indigo-700' : 'pointer-events-none bg-indigo-500'} items-center justify-center rounded-xl px-4 text-sm font-semibold text-white active:scale-[.98]`}
                            >
                                Send
                            </button>
                        </div>
                    </div >
                </main >
            </div >
        </div >
    );
}

/* --- tiny UI helpers --- */
function IconBtn({ icon, title }) {
    return (
        <button
            type="button"
            title={title}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-lg hover:bg-gray-100"
        >
            <span className="leading-none">{icon}</span>
        </button>
    );
}

function DateDivider({ label }) {
    return (
        <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">{label}</span>
            <div className="h-px flex-1 bg-gray-200" />
        </div>
    );
}

function Section({ title, value }) {
    return (
        <div className="rounded-xl border border-gray-200 p-3">
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-sm font-medium">{value}</p>
        </div>
    );
}

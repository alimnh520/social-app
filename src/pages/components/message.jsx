import { useEffect, useMemo, useRef, useState } from "react";

/** Messenger-like desktop layout (Tailwind only) */
export default function MessengerDesktop() {
    // Demo data (replace with your real data)
    const me = useMemo(
        () => ({
            id: "me",
            name: "You",
            avatar: "https://i.pravatar.cc/120?img=15",
        }),
        []
    );

    const friend = useMemo(
        () => ({
            id: "u1",
            name: "Nahid Hasan",
            avatar: "https://i.pravatar.cc/120?img=32",
            online: true,
        }),
        []
    );

    const [threads] = useState([
        {
            id: "t1",
            user: friend,
            last: "কাল দেখা হবে তো? 🙂",
            unread: 2,
            time: "9:41 PM",
        },
        {
            id: "t2",
            user: {
                id: "u2",
                name: "Sumi Akter",
                avatar: "https://i.pravatar.cc/120?img=48",
                online: false,
            },
            last: "Okay, got it!",
            unread: 0,
            time: "7:12 PM",
        },
    ]);

    const [activeId, setActiveId] = useState("t1");

    const [messages, setMessages] = useState([
        {
            id: "m1",
            from: friend.id,
            text: "হেই! কেমন আছো? 💙",
            time: "9:38 PM",
            date: "Today",
        },
        {
            id: "m2",
            from: me.id,
            text: "ভাল! আগামীকাল কবে ফ্রি?",
            time: "9:39 PM",
            date: "Today",
        },
        {
            id: "m3",
            from: friend.id,
            text: "দুপুর ৩টার পর 😄",
            time: "9:40 PM",
            date: "Today",
        },
        {
            id: "m4",
            from: me.id,
            text: "পারফেক্ট. কাল দেখা হবে তো? 🙂",
            time: "9:41 PM",
            date: "Today",
            seen: true,
        },
    ]);

    const [input, setInput] = useState("");
    const endRef = useRef(null);
    const taRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeId]);

    // autosize textarea (simple)
    useEffect(() => {
        const el = taRef.current;
        if (!el) return;
        el.style.height = "0px";
        el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }, [input]);

    const send = () => {
        const value = input.trim();
        if (!value) return;
        setMessages((m) => [
            ...m,
            {
                id: crypto.randomUUID(),
                from: me.id,
                text: value,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                date: "Today",
            },
        ]);
        setInput("");
    };

    return (
        <div className="h-screen w-full bg-gradient-to-br from-[#1f1c2c] to-[#928DAB] p-4">
            <div className="mx-auto h-full max-w-6xl rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 overflow-hidden flex">
                {/* Left: conversation list */}
                <aside className="w-80 border-r border-gray-200 bg-white/70 backdrop-blur">
                    <div className="p-4 pb-2">
                        <h2 className="text-xl font-semibold">Chats</h2>
                        <div className="mt-3">
                            <input
                                type="text"
                                placeholder="Search Messenger"
                                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="h-[calc(100%-92px)] overflow-y-auto">
                        {threads.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveId(t.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition text-left ${activeId === t.id ? "bg-indigo-50" : ""
                                    }`}
                            >
                                <div className="relative">
                                    <img
                                        src={t.user.avatar}
                                        alt={t.user.name}
                                        className="h-11 w-11 rounded-full object-cover"
                                    />
                                    {t.user.online && (
                                        <span className="absolute -bottom-0 -right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate font-medium">{t.user.name}</p>
                                        <span className="text-xs text-gray-500">{t.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm text-gray-600">{t.last}</p>
                                        {t.unread > 0 && (
                                            <span className="ml-auto inline-flex items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                                                {t.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Center: chat thread */}
                <main className="flex-1 flex flex-col">
                    {/* Chat header */}
                    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-white/80 px-5 py-3 backdrop-blur">
                        <img
                            src={friend.avatar}
                            className="h-10 w-10 rounded-full object-cover"
                            alt={friend.name}
                        />
                        <div className="leading-tight">
                            <p className="font-semibold">{friend.name}</p>
                            <p className="text-xs text-gray-500">
                                {friend.online ? (
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
                    <div className="flex-1 overflow-y-auto bg-[url('https://i.ibb.co/88b1pVb/messenger-bg.png')] bg-[length:400px]">
                        <div className="mx-auto max-w-3xl px-4 py-6">
                            {/* Date separator */}
                            <DateDivider label="Today" />
                            {messages.map((m, i) => {
                                const isMe = m.from === me.id;
                                const showSeen = isMe && m.seen && i === messages.length - 1;
                                return (
                                    <div key={m.id} className={`mb-2 flex ${isMe ? "justify-end" : "justify-start"}`}>
                                        <div className={`flex max-w-[70%] items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                                            {!isMe && (
                                                <img
                                                    src={friend.avatar}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    alt=""
                                                />
                                            )}
                                            <div
                                                className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${isMe
                                                    ? "bg-indigo-600 text-white rounded-br-md"
                                                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                                                <div
                                                    className={`mt-1 select-none text-[10px] ${isMe ? "text-indigo-200" : "text-gray-500"
                                                        }`}
                                                >
                                                    {m.time}
                                                </div>
                                            </div>
                                            {showSeen && (
                                                <img
                                                    src={friend.avatar}
                                                    title="Seen"
                                                    className="h-4 w-4 rounded-full ring-2 ring-white"
                                                    alt="seen"
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={endRef} />
                        </div>
                    </div>

                    {/* Composer */}
                    <div className="border-t border-gray-200 bg-white/80 p-3">
                        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl bg-gray-50 p-2 ring-1 ring-gray-200 focus-within:ring-indigo-400">
                            <IconBtn icon="➕" title="Add" />
                            <textarea
                                ref={taRef}
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        send();
                                    }
                                }}
                                placeholder="Aa"
                                className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
                            />
                            <IconBtn icon="😊" title="Emoji" />
                            <button
                                onClick={send}
                                className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-[.98]"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right: details panel (optional) */}
                <aside className="hidden w-80 shrink-0 border-l border-gray-200 bg-white/70 p-4 lg:block">
                    <div className="flex flex-col items-center">
                        <img src={friend.avatar} className="h-20 w-20 rounded-full object-cover" alt="" />
                        <h3 className="mt-3 text-lg font-semibold">{friend.name}</h3>
                        <p className="text-xs text-gray-500">{friend.online ? "Active now" : "Offline"}</p>
                    </div>
                    <div className="mt-6 space-y-3">
                        <Section title="Nickname" value="Edit…" />
                        <Section title="Color" value="Indigo" />
                        <Section title="Notifications" value="Default" />
                    </div>
                </aside>
            </div>
        </div>
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

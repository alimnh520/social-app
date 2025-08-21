'use client'
import { FaFacebookMessenger } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { IoMdPhotos } from "react-icons/io";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import { LuUserRound } from "react-icons/lu";
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { Bungee_Tint } from "next/font/google";
import { usePathname } from "next/navigation";
import { UserContext } from "../Provider";


const bungeeTint = Bungee_Tint({
    subsets: ['latin'],
    weight: ['400']
});


const Header = () => {
    const [showMenu, setShowMenu] = useState(false);
    const user = useContext(UserContext);
    const pathName = usePathname();

    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [scrollY, setScrollY] = useState('');
    const [scrollUp, setScrollUp] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setScrollUp(scrollTop)

            setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
            setScrollY(scrollTop < lastScrollTop);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);

    return (
        <div className={`w-full z-40 h-auto bg-[#13050a] flex items-center justify-between px-20 text-[#d31158] max-sm:w-full max-sm:flex-col max-sm:items-start max-sm:px-5 border-b border-b-[#d31158] pb-2 transition-all duration-300 ${scrollY && 'top-0 sticky'} ${scrollUp > 150 ? 'sticky -top-12' : '-top-24'}`}>

            <div className={`flex h-[60px] gap-x-8 items-center justify-center relative max-sm:w-full max-sm:justify-between ${bungeeTint.className}`}>
                <p className="text-3xl font-extrabold drop-shadow-[0_0_7px_#d31158]">ALBUM</p>
                <div className="flex items-center justify-center gap-x-3">
                    <Link href='/components/search' className={`text-3xl ${pathName === '/components/search' && 'text-white'}`} onClick={() => setShowMenu(false)}><GoSearch /></Link>
                    <div className="h-6 w-0.5 bg-[#d31158]"></div>
                    <Link href='/components/search' className={`text-[26px] ${pathName === '/components/search' && 'text-white'}`} onClick={() => setShowMenu(false)}><FaFacebookMessenger /></Link>
                </div>
            </div>

            <div className={`flex items-center justify-center gap-x-14 max-sm:items-start max-sm:gap-x-0 max-sm:gap-y-3 overflow-hidden transition-all duration-300 z-10 max-sm:w-full`}>
                <ul className='flex items-center justify-center gap-x-9 font-semibold max-sm:w-full max-sm:justify-between'>
                    <li>
                        <Link href='/' className={`flex items-center justify-center text-3xl p-1.5 ${pathName === '/' && 'text-white bg-[#d3115862] rounded-full'}`} onClick={() => setShowMenu(false)}><GoHomeFill /></Link>
                    </li>

                    <li>
                        <Link href='/components/videos' className={`flex items-center justify-center text-3xl p-1.5 ${pathName === '/components/videos' && 'text-white bg-[#d3115862] rounded-full'}`} onClick={() => setShowMenu(false)}><MdOutlineOndemandVideo /></Link>
                    </li>

                    <li>
                        <Link href='/components/photos' className={`flex items-center justify-center text-3xl p-1.5 ${pathName === '/components/photos' && 'text-white bg-[#d3115862] rounded-full'}`} onClick={() => setShowMenu(false)}><IoMdPhotos /></Link>
                    </li>

                    <li>
                        {
                            user ? (
                                <Link href="/user/dashboard" className={`flex items-center text-3xl ${pathName === '/components/dashboard' && 'text-white'}`} onClick={() => setShowMenu(false)}>
                                    <div className="relative">
                                        <img src={user.image ? user.image : '/no-image-icon-4.png'} className='size-9 rounded-full object-cover object-center' />
                                        <div className="absolute text-white bottom-0 right-0 text-sm">
                                            <IoMenu />
                                        </div>
                                    </div>

                                </Link>
                            ) : (
                                <Link href='/user/signin' className={`flex items-center justify-center text-3xl p-1.5 ${pathName === '/user/signin' || '/user/signup' && 'text-white bg-[#d3115862] rounded-full'}`} onClick={() => setShowMenu(false)}><LuUserRound /></Link>
                            )
                        }
                    </li>
                </ul>


            </div>
        </div>
    )
}

export default Header
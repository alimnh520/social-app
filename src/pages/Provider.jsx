'use client'
import React, { createContext, useEffect, useRef, useState } from 'react'
import Header from './layout/Header'
import { usePathname } from 'next/navigation';

export const UserContext = createContext();

const Provider = ({ children }) => {
    const [data, setData] = useState('');
    const path = usePathname();
    const hideHeader = ['/user/signin', '/user/signup'];
    const mainDiv = useRef();

    useEffect(() => {
        if (mainDiv.current) {
            for (let i = 0; i < 15; i++) {
                const newDiv = document.createElement('span');
                newDiv.classList.add('love');
                mainDiv.current.appendChild(newDiv);

                const randomSize = Math.random() * 20 + 10;

                newDiv.style.height = randomSize + 'px';
                newDiv.style.width = randomSize + 'px';

                newDiv.style.setProperty('--before-top', randomSize / 2 + 'px');
                newDiv.style.setProperty('--after-left', randomSize / 2 + 'px');

                const delayTime = Math.random() * 6 + 5;
                const durationTime = Math.random() * 6 + 4;
                newDiv.style.animationDelay = delayTime + 's';
                newDiv.style.animationDuration = durationTime + 's';

                const move = Math.random() * window.innerWidth + 0;
                newDiv.style.left = move + 'px';
            }
        }

        async function userData() {
            try {
                const res = await fetch('/api/user/data', { method: 'GET' });
                const data = await res.json();
                if (data.success) setData(data.message);
            } catch (error) {
                console.log(error);
            }
        }
        userData();

    }, []);

    return (
        <div className='w-full h-auto overflow-x-hidden relative scroll-smooth' ref={mainDiv}>
            <UserContext.Provider value={data}>
                {!hideHeader.includes(path) && <Header />}
                {children}
            </UserContext.Provider>
        </div>
    )
}

export default Provider
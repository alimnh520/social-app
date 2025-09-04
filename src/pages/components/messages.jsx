'use client'
import React, { useEffect, useState } from 'react'

const messages = () => {
    const [searchUser, setSearchUser] = useState("");
    const [history, setHistory] = useState([]);
    console.log(history?.map);


    useEffect(() => {

        const userData = async () => {
            try {
                const res = await fetch('/api/message/all-user', {
                    method: 'GET'
                });
                const data = await res.json();
                if (data.success) {
                    setSearchUser(data.message);
                }
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


    return (
        <div>messages</div>
    )
}

export default messages
import { useState, useEffect } from 'react';
import { resetPassword, account } from '../../lib/Appwrite';

const setNewPassword = () => {
    const [userId, setUserId] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdParam = urlParams.get('userId');
        const secretParam = urlParams.get('secret');
        if (userIdParam) {
            setUserId(userIdParam);
        }
        if (secretParam) {
            setSecret(secretParam);
        }
    }, []);

    const handleReset = async (e: any) => {
        e.preventDefault();
        if (password === passwordConfirm) {
            if (password.length >= 8) {
                await resetPassword(userId, secret, password, passwordConfirm)
                    .then((res) => {
                        if (res === true) {
                            account.deleteSessions();
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 1500);
                        } else {
                            alert('Something went wrong');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                alert('Password must be at least 8 characters long');
            }
        } else {
            alert('Passwords do not match');
        }
    }

    return (
        <div className='w-full h-fullpage bg-[--background] flex items-center justify-center flex-col'>
            <div className='flex flex-col items-center justify-center w-1/3 gap-2 h-2/3'>
                <h1 className="text-xl text-[--primaryText]">Reset Password</h1>
                <form className='w-full h-fit text-[--primaryText] flex flex-col items-center gap-2 py-4' onSubmit={handleReset}>
                    <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full h-10 p-2 text-[--primaryText] bg-[--secondary] focus-visible:outline-none mb-4" />
                    <input type="password" value={passwordConfirm} placeholder="Confirm Password" onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full h-10 p-2 text-[--primaryText] bg-[--secondary] focus-visible:outline-none mb-4"  />
                    <button className="w-2/3 h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly]" type="submit">Reset</button>
                </form>
            </div>
        </div>
    );
};

export default setNewPassword;
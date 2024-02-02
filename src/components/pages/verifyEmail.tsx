import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { verifyEmail } from '../../lib/Appwrite';

const VerifyEmailPage = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdParam = urlParams.get('userId');
        const secretParam = urlParams.get('secret');
        if (userIdParam && secretParam) {
            verifyEmail(userIdParam, secretParam)
                .then((res) => {
                    if (res === true) {
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
            alert('Something went wrong');
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full h-dvh">
            <Loader2 className="w-12 h-12 text-[--primary] animate-spin" />
        </div>
    );
}

export default VerifyEmailPage;
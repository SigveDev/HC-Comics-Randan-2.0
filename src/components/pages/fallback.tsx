import { useState, useEffect } from "react";
import { Loader2 } from 'lucide-react';
import { loginHCUser, createHCUser } from "../../lib/Appwrite";
import axios from "axios";
import Cookies from "js-cookie";

type AccountResponse = {
    data: AccountResponseData,
}

type AccountResponseData = {
    account: Account,
    config: Config,
    jwt: string
}

type Account = {
    $createdAt: Date,
    $id: string,
    $updatedAt: Date,
    accessedAt: Date,
    email: string,
    emailVerification: boolean,
    labels: string[],
    name: string,
    passwordUpdate: Date,
    phone: string,
    phoneVerification: boolean,
    prefs: [],
    registration: Date,
    status: boolean,
};

type Config = {
    pfp: string
}

const Fallback = () => {
    const [runOnce, setRunOnce] = useState<boolean>(false);

    useEffect(() => {
        if (!runOnce) {
            setRunOnce(true);
            const { pathname } = window.location;
            const jwt = pathname.split('/').pop();
            
            const res = axios.get('https://auth-api.hcklikk.com/account', {
                headers: {
                    jwt_token: jwt
                }
            }) as Promise<AccountResponse>;
            res.then((res: AccountResponse) => {
                localStorage.setItem('autoLogin', String(true));
                // Set the cookie to expire in 2 days
                Cookies.set('token', res.data.jwt, { expires: 7 });
            
                const login = loginHCUser(res.data.account.email, res.data.account.$id) as Promise<any>;
                login.then(() => {
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }).catch((err: any) => {
                    console.log(err);
                    const create = createHCUser(res.data.account.$id, res.data.account.email, res.data.account.name) as Promise<any>;
                        create.then((res: any) => {
                            const login = loginHCUser(res.data.account.email, res.data.account.$id) as Promise<any>;
                            login.then(() => {
                                setTimeout(() => {
                                    window.location.href = '/';
                                }, 1000);
                            }).catch((err: any) => {
                                console.log(err);
                                window.location.href = '/login';
                            });
                        }).catch((err: any) => {
                            console.log(err);
                            window.location.href = '/login';
                        });
                });
            
            }).catch((err: any) => {
                console.log(err);
                window.location.href = '/login';
            });
        }
    }, [])

    return (
        <div className="flex flex-col items-center justify-center w-full h-dvh">
            <Loader2 className="w-12 h-12 text-[--primary] animate-spin" />
        </div>
    )
}

export default Fallback;
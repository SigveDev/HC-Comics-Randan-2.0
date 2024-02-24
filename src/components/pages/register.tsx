import { useState } from "react";
import { account, createUser } from "../../lib/Appwrite";

const Register = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (password === password2) {
            if (password.length < 8) {
                alert("Password must be at least 8 characters long!");
                return;
            }
            const res: any = createUser(email, password, name);
            res.then(() => {
                const login = account.createEmailSession(email, password);
                login.then(() => {
                    window.location.href = "/profile";
                }).catch((err2: any) => {
                    console.log(err2);
                });
            }).catch((err: any) => {
                console.log(err);
                setError("User with email already exists!");
            });
        } else {
            alert("Passwords do not match!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full grow">
            <div className="flex flex-col items-center justify-center w-2/3 xl:w-1/3 lg:w-1/3 h-1/2">
                <form className="flex flex-col items-center justify-center w-full h-full gap-4" onSubmit={handleSubmit}>
                    <h1 className="text-xl text-[--primaryText]">Register</h1>
                    <input className="w-full h-10 p-2 text-[--primaryText] bg-[--secondary] focus-visible:outline-none rounded-none" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input className="w-full h-10 p-2 text-[--primaryText] bg-[--secondary] focus-visible:outline-none rounded-none" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="w-full h-10 p-2 text-[--primaryText] bg-[--secondary] focus-visible:outline-none rounded-none" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input className="w-full h-10 p-2 text-[--primaryText] bg-[--secondary] focus-visible:outline-none rounded-none" type="password" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                    {error && <p className="text-red-600">{error}</p>}
                    <a href="/login" className="text-[--primary]">Have a user?</a>
                    <button className="w-2/3 h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly]" type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
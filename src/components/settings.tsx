import { useState, useEffect } from 'react';
import { getUserPFP, updatePFP, updateName, sendPasswordResetLoggedIn, getPublicUser, togglePublicUser } from '../lib/Appwrite';
import { User } from '../assets/types';
import { Pencil } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const Settings = (user: User) => {
    const [pfp, setPFP] = useState<string>();
    const [menu, setMenu] = useState<boolean>(false);
    const [publicUser, setPublicUser] = useState<boolean>();

    const [tempPfp, setTempPfp] = useState<string>();
    const [tempFile, setTempFile] = useState<File>();
    const [tempName, setTempName] = useState<string>();

    const {getRootProps, getInputProps} = useDropzone(
        {
            accept: {
                'image/png': [],
                'image/jpeg': [],
                'image/jpg': [],
                'image/JPG': [],
            },
            maxFiles: 1,
            onDrop: (acceptedFiles) => {
                const file = acceptedFiles[0];
                setTempPfp(URL.createObjectURL(file));
                setTempFile(file);
            }
        }
    );

    useEffect(() => {
        if (pfp === undefined) {
            getUserPFP()
            .then((res: any) => {
                setPFP(res);
            })
            .catch((err: any) => {
                console.log(err);
            });
        }
    }, [pfp]);

    useEffect(() => {
        if (publicUser === undefined) {
            getPublicUser()
            .then((res: any) => {
                setPublicUser(res.public);
            })
            .catch((err: any) => {
                console.log(err);
            });
        }
    }, [publicUser]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (tempName) {
            await updateName(tempName);
        }
        if (tempFile) {
            await updatePFP(tempFile);
        }
        setMenu(false);
        setTempName(undefined);
        setTempPfp(undefined);
        setTempFile(undefined);

        window.location.reload();
    }

    const handlePublicUser = async () => {
        await togglePublicUser();
        setPublicUser(!publicUser);
    }

    return (
        <div className='flex flex-col w-full col-span-2 gap-2 h-fit'>
            <p className='flex items-center justify-start h-7 pl-2 font-semibold text-lg text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent'>Settings</p>
            <div className='w-full h-fit flex flex-col pl-2 pr-2 pt-4 pb-4 gap-2 bg-[--secondary] relative'>
                <div className='flex flex-row items-center justify-start w-full h-16'>
                    {pfp && <img className='w-16 h-16 rounded-full' src={pfp} alt='Profile Picture' />}
                </div>
                <p className='w-full h-fit font-semibold text-base text-[--primaryText]'>Name: {user.name}</p>
                <p className='w-full h-fit font-semibold text-base text-[--primaryText]'>Email: {user.email}</p>
                <p className='w-full h-fit font-semibold text-base text-[--primaryText]'>Phone: {user.phone}</p>
                <p className='W-full h-fit font-semibold text-base text-[--primaryText]'>Password: ********</p>

                <p className='text-[--primaryText] font-semibold mt-2'>Public profile:</p>
                <label className="relative inline-flex items-center ml-2 cursor-pointer w-fit">
                  <input type="checkbox" value="" className="sr-only peer" onClick={handlePublicUser} defaultChecked={publicUser} />
                  <div className="w-11 h-6 peer-focus:outline-none rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[--primary]"></div>
                </label>

                <button className='w-full h-8 bg-[--primary] text-[--primaryText] mt-4' onClick={() => sendPasswordResetLoggedIn()}>
                    Change Password
                </button>

                <button className='absolute w-6 h-6 top-4 right-2' onClick={() => setMenu(true)}>
                    <Pencil className='text-[--accentText]' />
                </button>
            </div>

            {menu && <div className='fixed inset-0 z-50 w-full h-full bg-black/50' onClick={() => setMenu(false)}></div>}
            {menu && <div className='fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full gap-2 pointer-events-none'>
                <p className='flex items-center justify-start w-1/3 h-7 pl-2 font-semibold text-2xl text-[--primaryText] bg-gradient-to-r from-[--primary] via-[--thirdly] via-55% to-transparent'>Edit User</p>
                <div className='flex flex-col w-1/3 h-fit bg-[--secondary] pointer-events-auto pl-2 pr-2 pt-4 pb-4'>
                    <div className='flex w-full h-32'>
                        {!tempPfp ? <div {...getRootProps()} className='flex flex-col items-center justify-center w-32 h-32 border-dashed border-2 border-[--primary] rounded-full cursor-pointer'>
                            <input {...getInputProps()} />
                            <p className='font-semibold text-lg text-[--primaryText]'>Image</p>
                        </div>
                        :
                        <div className='flex items-center justify-center w-32 h-32' onClick={() => setTempPfp(undefined)}>
                            <img className='w-32 h-32 rounded-full' src={tempPfp} alt='Profile Picture' />
                        </div>}
                    </div>
                    <form className='flex flex-col w-full gap-4 mt-4 h-fit' onSubmit={handleSubmit}>
                        {user.prefs.HC === "false" && <div className='flex flex-col w-full h-fit'>
                            <label className='flex items-center justify-start w-full h-7 font-semibold text-base text-[--primaryText]'>Name</label>
                            <input className="w-full h-10 p-2 text-[--primaryText] bg-[--secondary] focus-visible:outline-none border-2 border-dashed border-[--primary]" type="text" placeholder="Name" value={tempName} onChange={(e) => setTempName(e.target.value)} />
                        </div>}
                        <div className='flex items-center w-full gap-2 h-fit'>
                            <button type='button' className='flex items-center justify-center w-full h-7 font-semibold text-base text-[--primaryText] bg-red-600 rounded-md' onClick={() => {setMenu(false); setTempName(undefined); setTempPfp(undefined); setTempFile(undefined)}}>Cancel</button>
                            <button type='submit' className='flex items-center justify-center w-full h-7 font-semibold text-base text-[--primaryText] bg-[--primary] rounded-md'>Save</button>
                        </div>
                    </form>
                </div>
            </div>}
        </div>
    );
}

export default Settings;
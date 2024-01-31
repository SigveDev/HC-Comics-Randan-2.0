import { useState, useEffect } from 'react';
import { checkUserData } from '../../lib/Appwrite';
import { User } from '../../assets/types';

import Settings from '../settings';
import Current from '../current';
import LikedView from '../likedView';
import ProfileCommentsView from '../profileCommentsView';

const Profile = () => {
    const [user, setUser] = useState<User>();
    
    useEffect(() => {
        checkUserData()
        .then((res: any) => {
            setUser(res);
        })
        .catch((err: any) => {
            console.log(err);
        });
    }, []);
    
    return (
        <div className="grid w-full h-full grid-cols-11 gap-4 pt-8 pb-8 pl-12 pr-12">
            {user && <Settings {...user} />}
            {user && <Current {...user} />}
            {user && <LikedView {...user} />}
            {user && <ProfileCommentsView />}
        </div>
    );
}

export default Profile;
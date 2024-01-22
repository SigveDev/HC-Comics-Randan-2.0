import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { checkUserData, updateEmail, updateName, updatePhone, getLatestChapter } from './lib/Appwrite';
import { ChapterRequest } from './assets/types';

import DefaultLayout from './layouts/default';

import Fallback from './components/pages/fallback';
import Home from './components/pages/home';
import Titles from './components/pages/titles';
import TitleView from './components/pages/titleView';
import Login from './components/pages/login';
import Register from './components/pages/register';
import ChapterView from './components/pages/chapterView';
import PageView from './components/pages/pageView';

function App() {
  const [runOnce, setRunOnce] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!runOnce) {
      setRunOnce(true);
      const localUser = checkUserData();
      localUser.then((res) => {
        setUser(res);
        return;
      }).catch(() => {
        const token = Cookies.get('token');
        if (token) {
          const getUser = () => {
            const res = axios.get('https://auth-api.hcklikk.com/auth', {
              headers: {
                jwt_token: token
              }
            })
            res.then((res) => {
              if (res.data.jwt) {
                Cookies.set('token', res.data.jwt, { expires: 7 });
              }
              if (res.data.config.pfp !== null) {
                localStorage.setItem('pfp', res.data.config.pfp);
              }
            
              checkUserData()
                .then((res2) => {
                  if(res2.email !== res.data.account.email) {
                    updateEmail(res.data.account.email, res.data.account.$id);
                  }
                  if(res2.name !== res.data.account.name) {
                    updateName(res.data.account.name);
                  }
                  if(res2.phone !== res.data.account.phone) {
                    updatePhone(res.data.account.phone, res.data.account.$id);
                  }
                  
                  setUser(res.data);
                })
                .catch((err) => {
                  console.log(err);
                  setUser("error");
                });
            }).catch((err) => {
              console.log(err);
              setUser("error");
            });
          }
          getUser();
        } else {
          const url = window.location.pathname.split('/');
          const site = url[1];
          if (site === "fallback") {
            return;
          } else if (localStorage.getItem('autoLogin') && site !== "fallback") {
            window.location.href = (import.meta as any).env.VITE_HC_AUTH_ENDPOINT;
          } else {
            setUser("error");
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const setColors = async () => {
      const chapter: ChapterRequest = await getLatestChapter() as ChapterRequest;
      const colorPalette = chapter.documents[0].ColorPalette;
      document.documentElement.style.setProperty('--primary', colorPalette?.primary || '#18ADF5');
      document.documentElement.style.setProperty('--secondary', colorPalette?.secondary || '#0B0A34');
      document.documentElement.style.setProperty('--thirdly', colorPalette?.thirdly || '#00468C');
      document.documentElement.style.setProperty('--fourthly', colorPalette?.fourthly || '#041031');
      document.documentElement.style.setProperty('--primaryText', colorPalette?.primaryText || '#FFFFFF');
      document.documentElement.style.setProperty('--secondaryText', colorPalette?.secondaryText || '#969696');
      document.documentElement.style.setProperty('--accentText', colorPalette?.accentText || '#18ADF5');
      document.documentElement.style.setProperty('--background', colorPalette?.background || '#000000');
    }
    setColors();
  }, []);

  return (
    <BrowserRouter>
      <div className='w-full bg-[--background] min-h-dvh'>
        {user && <DefaultLayout user={user}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/titles" element={<Titles />} />
            <Route path="/login" element={user !== "error" ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user !== "error" ? <Navigate to="/" /> : <Register />} />

            <Route path="/c/:chapterID" element={<ChapterView />} />
            <Route path="/t/:titleID" element={<TitleView />} />
            <Route path="/p/:chapterID/:pageID" element={<PageView />} />
          </Routes>
        </DefaultLayout>}
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/fallback/:jwt" element={<Fallback />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
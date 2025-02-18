import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  checkUserData,
  updateEmail,
  updateName,
  updatePhone,
  getLatestChapter,
  postChapterRetention,
} from "./lib/Appwrite";
import { Chapter } from "./assets/types";

import DefaultLayout from "./layouts/default";

import Fallback from "./components/pages/fallback";
import Home from "./components/pages/home";
import Titles from "./components/pages/titles";
import TitleView from "./components/pages/titleView";
import Login from "./components/pages/login";
import Register from "./components/pages/register";
import ChapterView from "./components/pages/chapterView";
import PageView from "./components/pages/pageView";
import ArtPage from "./components/pages/art";
import ArtView from "./components/pages/artView";
import SearchPage from "./components/pages/search";
import Profile from "./components/pages/profile";
import SetNewPassword from "./components/pages/setNewPassword";
import VerifyEmailPage from "./components/pages/verifyEmail";
import AuthorPage from "./components/pages/authorPage";

import AdminHome from "./components/pages/admin/adminHome";
import EditChapterForm from "./components/admin/edit/editChapterForm";
import EditArtForm from "./components/admin/edit/editArtForm";
import EditTitleForm from "./components/admin/edit/editTitleForm";

function App() {
  const [runOnce, setRunOnce] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!runOnce) {
      setRunOnce(true);
      const localUser = checkUserData();
      localUser
        .then((res) => {
          setUser(res);
          return;
        })
        .catch(() => {
          const token = Cookies.get("token");
          if (token) {
            const getUser = () => {
              const res = axios.get("https://auth-api.hcklikk.com/auth", {
                headers: {
                  jwt_token: token,
                },
              });
              res
                .then((res) => {
                  if (res.data.jwt) {
                    Cookies.set("token", res.data.jwt, { expires: 7 });
                  }
                  if (res.data.config.pfp !== null) {
                    localStorage.setItem("pfp", res.data.config.pfp);
                  }

                  checkUserData()
                    .then((res2) => {
                      if (res2.email !== res.data.account.email) {
                        updateEmail(
                          res.data.account.email,
                          res.data.account.$id
                        );
                      }
                      if (res2.name !== res.data.account.name) {
                        updateName(res.data.account.name);
                      }
                      if (res2.phone !== res.data.account.phone) {
                        updatePhone(
                          res.data.account.phone,
                          res.data.account.$id
                        );
                      }

                      setUser(res.data);
                    })
                    .catch((err) => {
                      console.log(err);
                      setUser("error");
                    });
                })
                .catch((err) => {
                  console.log(err);
                  setUser("error");
                });
            };
            getUser();
          } else {
            const url = window.location.pathname.split("/");
            const site = url[1];
            if (site === "fallback") {
              return;
            } else if (
              localStorage.getItem("autoLogin") &&
              site !== "fallback"
            ) {
              window.location.href = (
                import.meta as any
              ).env.VITE_HC_AUTH_ENDPOINT;
            } else {
              setUser("error");
            }
          }
        });
    }
  }, []);

  useEffect(() => {
    const postRetention = async () => {
      if (!window.location.pathname.includes("/p/")) {
        const retention = localStorage.getItem("retention");
        const chapterID = retention?.split("-")[0];
        const page = retention?.split("-")[1];
        if (chapterID && page) {
          await postChapterRetention(chapterID, Number(page));
          localStorage.removeItem("retention");
        }
      }
    };
    postRetention();
  }, [window.location.pathname]);

  useEffect(() => {
    const setColors = async () => {
      let colorPalette;
      try {
        const chapter: Chapter = (await getLatestChapter()) as Chapter;
        colorPalette = chapter?.ColorPalette;
      } catch (error) {
        console.log("No latest chapters found, using default colors.");
      }
      document.documentElement.style.setProperty(
        "--primary",
        colorPalette?.primary || "#18ADF5"
      );
      document.documentElement.style.setProperty(
        "--secondary",
        colorPalette?.secondary || "#0B0A34"
      );
      document.documentElement.style.setProperty(
        "--thirdly",
        colorPalette?.thirdly || "#00468C"
      );
      document.documentElement.style.setProperty(
        "--fourthly",
        colorPalette?.fourthly || "#041031"
      );
      document.documentElement.style.setProperty(
        "--primaryText",
        colorPalette?.primaryText || "#FFFFFF"
      );
      document.documentElement.style.setProperty(
        "--secondaryText",
        colorPalette?.secondaryText || "#969696"
      );
      document.documentElement.style.setProperty(
        "--accentText",
        colorPalette?.accentText || "#18ADF5"
      );
      document.documentElement.style.setProperty(
        "--background",
        colorPalette?.background || "#000000"
      );
    };
    setColors();
  }, []);

  console.log("welcome!");

  return (
    <BrowserRouter>
      <div className="w-full bg-[--background] min-h-dvh">
        <Routes>
          <Route path="/" element={<DefaultLayout user={user} />}>
            <Route index element={<Home />} />
            <Route path="titles" element={<Titles />} />
            <Route path="art" element={<ArtPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route
              path="login"
              element={
                user !== "error" && user !== null ? (
                  <Navigate to="/" />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="register"
              element={
                user !== "error" && user !== null ? (
                  <Navigate to="/" />
                ) : (
                  <Register />
                )
              }
            />
            <Route path="c/:chapterID" element={<ChapterView />} />
            <Route path="t/:titleID" element={<TitleView />} />
            <Route path="p/:chapterID/:pageID" element={<PageView />} />
            <Route path="a/:artID" element={<ArtView />} />
            <Route path="u/:authorID" element={<AuthorPage />} />
            <Route
              path="profile"
              element={user !== "error" ? <Profile /> : <Navigate to="/" />}
            />
            <Route path="password/reset" element={<SetNewPassword />} />
            <Route path="email/verify" element={<VerifyEmailPage />} />
            <Route path="fallback/:jwt" element={<Fallback />} />
            <Route path="admin" element={<AdminHome />} />
            <Route
              path="admin/edit/c/:chapterID"
              element={<EditChapterForm />}
            />
            <Route path="admin/edit/a/:artID" element={<EditArtForm />} />
            <Route path="admin/edit/t/:titleID" element={<EditTitleForm />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

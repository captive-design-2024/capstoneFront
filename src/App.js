import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './routes/Home';
import MyPage from './routes/Mypage';
import Edit from './routes/Edit';
import Login from './routes/Login';
import SignUp from './routes/Signup';
import User from './routes/User';

// 로그아웃 버튼을 처리하는 컴포넌트
function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate(); // 여기서 useNavigate 사용

  const handleLogout = () => {
    localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
    setIsLoggedIn(false);
    navigate('/Home'); // 로그아웃 후 Home으로 이동
  };

  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 mr-2 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M23.498 6.186a2.92 2.92 0 0 0-2.055-2.057C19.747 3.5 12 3.5 12 3.5s-7.747 0-9.443.629a2.92 2.92 0 0 0-2.055 2.057c-.586 3.303-.586 6.814-.586 6.814s0 3.511.586 6.814a2.92 2.92 0 0 0 2.055 2.057c1.696.629 9.443.629 9.443.629s7.747 0 9.443-.629a2.92 2.92 0 0 0 2.055-2.057c.586-3.303.586-6.814.586-6.814s0-3.511-.586-6.814ZM9.75 15.417V8.583L15.75 12 9.75 15.417Z" />
        </svg>
        <div className="flex items-center space-x-4">
          <Link to="/Home" className="text-xl font-bold hover:text-gray-300">
            YouTube SubHelper
          </Link>
          <Link to="/Mypage" className="text-gray-300 font-bold text-white px-4 py-2 rounded hover:bg-blue-600">
            마이페이지
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/User" className="text-gray-300 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
              회원정보 수정
            </Link>
            <button onClick={handleLogout} className="text-gray-300 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/Login" className="text-gray-300 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
              로그인
            </Link>
            <Link to="/Signup" className="text-gray-300 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 px-6">
      <div className="container mx-auto flex flex-col items-center space-y-8">
        <div className="flex items-center justify-center space-x-4" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="flex items-center cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 mr-2 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a2.92 2.92 0 0 0-2.055-2.057C19.747 3.5 12 3.5 12 3.5s-7.747 0-9.443.629a2.92 2.92 0 0 0-2.055 2.057c-.586 3.303-.586 6.814-.586 6.814s0 3.511.586 6.814a2.92 2.92 0 0 0 2.055 2.057c1.696.629 9.443.629 9.443.629s7.747 0 9.443-.629a2.92 2.92 0 0 0 2.055-2.057c.586-3.303.586-6.814.586-6.814s0-3.511-.586-6.814ZM9.75 15.417V8.583L15.75 12 9.75 15.417Z" />
            </svg>
            <span className="text-sm cursor-pointer font-bold">YouTube SubHelper</span>
          </div>
          <div className="flex items-center cursor-pointer">
            <a href="https://www.hongik.ac.kr" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <img
                src="/hongik.svg"
                alt="Hongik University Logo"
                className="w-8 h-8 mr-2"
              />
              <span className="text-sm font-bold">Hongik University</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-24">
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold">Developer</div>
            <div className="text-sm font-bold">정준석</div>
            <div className="text-sm">joonseok.chung@gmail.com</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold">Developer</div>
            <div className="text-sm font-bold">이재용</div>
            <div className="text-sm">tomasjy27@gmail.com</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold">Developer</div>
            <div className="text-sm font-bold">최원석</div>
            <div className="text-sm">dnjstjr0930@gmail.com</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold">Developer</div>
            <div className="text-sm font-bold">김범서</div>
            <div className="text-sm">toraonine9@gmail.com</div>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <div className="w-full border-b border-gray-600" />
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://www.youtube.com/@%EA%B9%80%EB%B2%94%EC%84%9C-k5b" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a2.92 2.92 0 0 0-2.055-2.057C19.747 3.5 12 3.5 12 3.5s-7.747 0-9.443.629a2.92 2.92 0 0 0-2.055 2.057c-.586 3.303-.586 6.814-.586 6.814s0 3.511.586 6.814a2.92 2.92 0 0 0 2.055 2.057c1.696.629 9.443.629 9.443.629s7.747 0 9.443-.629a2.92 2.92 0 0 0 2.055-2.057c.586-3.303.586-6.814.586-6.814s0-3.511-.586-6.814ZM9.75 15.417V8.583L15.75 12 9.75 15.417Z" />
            </svg>
          </a>
          <a href="https://github.com/captive-design-2024" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path fillRule="evenodd" d="M12 0C5.372 0 0 5.372 0 12c0 5.304 3.438 9.8 8.207 11.388.6.111.793-.26.793-.577 0-.285-.011-1.041-.017-2.042-3.338.724-4.043-1.612-4.043-1.612-.545-1.384-1.329-1.754-1.329-1.754-1.089-.743.083-.728.083-.728 1.205.085 1.838 1.237 1.838 1.237 1.067 1.829 2.8 1.298 3.482.992.108-.773.418-1.298.761-1.598-2.665-.302-5.465-1.333-5.465-5.933 0-1.314.471-2.392 1.242-3.237-.124-.302-.537-1.527.116-3.176 0 0 1.008-.322 3.299 1.228A11.549 11.549 0 0 1 12 5.847a11.54 11.54 0 0 1 3.006.403c2.291-1.55 3.299-1.228 3.299-1.228.653 1.649.241 2.874.118 3.176.772.845 1.242 1.923 1.242 3.237 0 4.608-2.803 5.628-5.469 5.93.43.37.814 1.098.814 2.224 0 1.607-.015 2.908-.015 3.302 0 .319.193.695.798.577C20.563 21.799 24 17.304 24 12c0-6.628-5.372-12-12-12z" clipRule="evenodd" />
            </svg>
          </a>
          
        </div>
      </div>
    </footer>
  );
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
    } 
    else {
      setIsLoggedIn(false); // 토큰이 없으면 로그인 상태 해제
    }
  }, []);

  return (
    <Router>
      {/* Header를 별도 컴포넌트로 분리하고 로그아웃 처리 */}
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/Home" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/Mypage" element={<MyPage />} />
        <Route path="/Edit/:projectId" element={<Edit />} />
        <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/User" element={<User />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;

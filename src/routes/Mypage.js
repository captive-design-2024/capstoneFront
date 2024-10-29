import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Components';
import axios from 'axios';


const baseAddress = "http://localhost:3000";

export const Mypage = () => {
  const navigate = useNavigate();
  const [subtitles, setSubtitles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false); // 모델 추가 모달
  const [title, setProjectName] = useState('');
  const [url, setProjectUrl] = useState('');
  const [userData, setUserData] = useState({ name: '', email: '' });
  

  
  const [modelName, setModelName] = useState('');
  const [modelUrl, setmodelUrl] = useState(['', '', '']);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`${baseAddress}/user/value`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setUserData({
          name: response.data[0].name,
          email: response.data[0].email,
        });
      } catch (error) {
        console.error('유저 데이터를 가져오는 중 에러 발생:', error);
      }
    };

    const fetchSubtitles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${baseAddress}/project/title`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        const fetchedSubtitles = response.data.projectNames.map((project, index) => ({
          id: response.data.projectIDs[index], // 프로젝트 ID를 추가
          title: `자막 ${index + 1}`,
          summary: project,
          date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
        }));

        setSubtitles(fetchedSubtitles);
      } catch (error) {
        console.error('프로젝트 제목을 가져오는 중 에러 발생:', error);
      }
    };

    fetchUserData();
    fetchSubtitles();
  }, []);

  // showModelModal이 true로 변경될 때마다 모델 입력 필드 초기화
  useEffect(() => {
    if (showModelModal) {
      setModelName('');
      setmodelUrl(['', '', '']);
    }
  }, [showModelModal]);


  const handleAddSubtitle = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      return;
    }
  
    try {
      const response = await axios.post(`${baseAddress}/project`, {
        project_title: title,
        project_url: url,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      const newSubtitle = {
        id: response.data.id,
        //title: `자막 ${subtitles.length + 1}`,
        summary: title,
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      };
  
      setSubtitles([...subtitles, newSubtitle]);
      setShowModal(false);
      setProjectName('');
      setProjectUrl('');

      window.location.reload();
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || '서버 오류가 발생했습니다.';
      console.error('에러 발생:', errorMessage);
      alert(errorMessage);
    }
  };
  

  const handleVideoUrlChange = (index, value) => {
    const newUrls = [...modelUrl];
    newUrls[index] = value;
    setmodelUrl(newUrls);
  };

  const handleAddModel = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      return;
    }
  
    // 모든 modelUrl이 비어있지 않은지 확인
    if (modelUrl.some(url => url.trim() === '') || modelName.trim() === '') {
      alert("모델 이름과 URL은 모두 입력해야 합니다.");
      return;
    }

    try {
      const dataToSend = {
        modelname: modelName,
        modelurl: modelUrl,
      };
    
       console.log("모델 추가:", dataToSend);

      const response = await axios.post('http://localhost:3000/work/generate-ljs', dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        console.log("모델 추가 성공:", response.data);
        setShowModelModal(false); // 모달 닫기
      } else {
        console.error("모델 추가 실패:", response.status);
        alert("모델 추가 실패");
      }
    } catch (error) {
      console.error("에러 발생:", error.response?.data || error.message);
      alert("서버와의 연결에 문제가 발생했습니다.");
    }
  };
  
  


  const handleDeleteSubtitle = async (index) => {
    const token = localStorage.getItem('token');
    const subtitleToDelete = subtitles[index];
  
    try {
      // 백엔드 API 호출
      await axios.delete(`${baseAddress}/project`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        data: {
          title: subtitleToDelete.summary, // 제목을 요청 본문으로 전송
        },
      });
  
      // UI에서 자막 삭제
      const updatedSubtitles = subtitles.filter((_, i) => i !== index);
      setSubtitles(updatedSubtitles);
    } catch (error) {
      const errorMessage = error.response?.data?.message || '서버 오류가 발생했습니다.';
      console.error('에러 발생:', errorMessage);
      alert(errorMessage);
    }
  };

  const handleEditClick = (projectId) => {
    navigate(`/Edit/${projectId}`);
  };
  

  return (
    <div className="w-full bg-white text-gray-900 min-h-screen flex flex-col">
      <header className="bg-white text-gray-900 py-4 px-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">마이페이지</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="hover:bg-gray-200" 
            onClick={() => setShowModelModal(true)}
          >
            + 모델 추가
          </Button>

          <Button 
            variant="outline" 
            className="hover:bg-gray-200" 
            onClick={() => setShowModal(true)}
          >
            + 자막 추가
          </Button>
        </div>
      </header>

      <div className="bg-white rounded-lg p-4 border border-gray-300 mb-4">
        <h2 className="text-xl font-bold">내 정보</h2>
        <p><span className="font-bold">이름: {userData.name}</span></p>
        <p><span className="font-bold">이메일: {userData.email}</span></p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          {subtitles.map((subtitle, index) => (
            <div key={subtitle.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-300">
              <h2 className="text-xl font-bold mb-2">{subtitle.summary}</h2>
              {/* <h3 className="text-sm text-gray-500 mb-2">ID: {subtitle.id}</h3> ID 출력 */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    {/* <h3 className="font-medium">{subtitle.summary}</h3>
                    <p className="text-sm text-gray-500">{subtitle.date}</p> */}
                    <h3 className="text-sm text-gray-500">{subtitle.date}</h3> 
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(subtitle.id)}
                    >
                      자막 기능
                    </Button>
                    <Button 
                      variant="solid" 
                      size="sm" 
                      onClick={() => handleDeleteSubtitle(index)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">영상 선택</h2>
            <input
              type="text"
              placeholder="영상 제목을 입력하세요.."
              value={title}
              onChange={(e) => setProjectName(e.target.value)}
              className="border bg-white p-2 w-full mb-4"
            />
            <input
              type="text"
              placeholder="영상 URL 입력하세요.."
              value={url}
              onChange={(e) => setProjectUrl(e.target.value)}
              className="border bg-white p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-gray-200"
                onClick={() => setShowModal(false)}
              >
                취소
              </Button>
              <Button
                variant="solid"
                size="sm"
                className="hover:bg-blue-600"
                onClick={handleAddSubtitle}
              >
                추가
              </Button>
            </div>
          </div>
        </div>
      )}
      {showModelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg" style={{ width: '400px' }}>
            <h2 className="text-xl font-bold mb-4">모델 추가</h2>

            {/* 모델 이름 입력 필드 */}
            <input
              type="text"
              placeholder="모델 이름 입력"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full mb-4 bg-white"
            />

            {/* 영상 주소 입력 필드 */}
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  placeholder={`영상 주소 ${index + 1}`}
                  value={modelUrl[index] || ''}
                  onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full bg-white"
                />
              </div>
            ))}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-gray-200"
                onClick={() => setShowModelModal(false)}
              >
                취소
              </Button>
              <Button
                variant="solid"
                size="sm"
                className="hover:bg-blue-600"
                onClick={() => {
                  handleAddModel(); // 모델 추가 함수 호출
                  setShowModelModal(false); // 모달 닫기
                }}
              >
                추가
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
    <footer className="bg-gray-900 text-white py-6 px-6">
      <div className="container mx-auto flex flex-col items-center space-y-8">
        <div className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a2.92 2.92 0 0 0-2.055-2.057C19.747 3.5 12 3.5 12 3.5s-7.747 0-9.443.629a2.92 2.92 0 0 0-2.055 2.057c-.586 3.303-.586 6.814-.586 6.814s0 3.511.586 6.814a2.92 2.92 0 0 0 2.055 2.057c1.696.629 9.443.629 9.443.629s7.747 0 9.443-.629a2.92 2.92 0 0 0 2.055-2.057c.586-3.303.586-6.814.586-6.814s0-3.511-.586-6.814ZM9.75 15.417V8.583L15.75 12 9.75 15.417Z" />
          </svg>
          <span className="text-sm cursor-pointer">YouTube SubHelper</span>
        </div>
        
        <div className="grid grid-cols-4 gap-24">
          {[
            { name: '정준석', email: 'junseok@gmail.com' },
            { name: '이재용', email: 'jaeyong@gmail.com' },
            { name: '최원석', email: 'wonseok@gmail.com' },
            { name: '김범서', email: 'beomseo@gmail.com' }
          ].map(dev => (
            <div key={dev.email} className="flex flex-col items-center">
              <div className="text-sm font-bold">Developer</div>
              <div className="text-sm font-bold">{dev.name}</div>
              <div className="text-sm">{dev.email}</div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="w-full border-b border-gray-600" />
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a2.92 2.92 0 0 0-2.055-2.057C19.747 3.5 12 3.5 12 3.5s-7.747 0-9.443.629a2.92 2.92 0 0 0-2.055 2.057c-.586 3.303-.586 6.814-.586 6.814s0 3.511.586 6.814a2.92 2.92 0 0 0 2.055 2.057c1.696.629 9.443.629 9.443.629s7.747 0 9.443-.629a2.92 2.92 0 0 0 2.055-2.057c.586-3.303.586-6.814.586-6.814s0-3.511-.586-6.814ZM9.75 15.417V8.583L15.75 12 9.75 15.417Z" />
            </svg>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.304 3.438 9.79 8.207 11.388.6.112.827-.259.827-.577v-2.168c-3.338.724-4.042-1.61-4.042-1.61-.546-1.39-1.334-1.762-1.334-1.762-1.091-.748.083-.733.083-.733 1.205.085 1.834 1.235 1.834 1.235 1.07 1.832 2.809 1.303 3.492.997.108-.775.418-1.303.763-1.602-2.664-.303-5.467-1.332-5.467-5.934 0-1.309.467-2.378 1.236-3.22-.124-.303-.536-1.526.117-3.177 0 0 1.003-.32 3.287 1.228a11.418 11.418 0 0 1 3.002-.404c1.02.005 2.048.137 3.002.404 2.287-1.549 3.287-1.228 3.287-1.228.653 1.651.242 2.874.118 3.177.77.842 1.236 1.91 1.236 3.22 0 4.612-2.806 5.632-5.478 5.927.43.371.818 1.105.818 2.23v3.293c0 .322.225.693.832.576C20.565 21.79 24 17.305 24 12 24 5.373 18.627 0 12 0z" />
            </svg>
          </a>
          
          </div>
      </div>
    </footer>


    </div>

    

  );
};

export default Mypage;

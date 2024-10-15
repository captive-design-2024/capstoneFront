import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom'; // useParams 임포트
import axios from 'axios';
import { Button, Label, Textarea, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Input, Select, Audio} from '../components/Components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Edit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [generatedData, setGeneratedData] = useState(""); // 생성된 데이터를 위한 상태 추가
  const [checkedData, setCheckedData] = useState(''); // 서버에서 받아온 데이터를 저장할 상태 추가
  const [recommendtitle, setrecommendTitle] = useState(''); //추천 제목
  const [recommendtag, setrecommendTag] = useState(''); //추천 태그
  const [translation, settranslation] = useState(''); //번역
  const [selectedLanguage, setSelectedLanguage] = useState(''); // 선택한 언어 저장
  const [getlink, setLink] = useState(''); //유튜브 링크
  const { projectId } = useParams(); // 유튜브 링크
  const [caption, setCaption] = useState(''); // 캡션 (자막)
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState(''); // 선택한 모델 저장
  const [modelName, setModelName] = useState(''); // 입력된 모델 이름 저장
  const [modelOptions, setModelOptions] = useState([ // 모델 선택 옵션 상태 추가
    { value: "", label: "모델 선택", disabled: true },
    { value: "en", label: "침착맨" },
    { value: "es", label: "슈카월드" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 JWT 토큰 가져오기

      try {
        const response = await axios.get(`http://localhost:3000/edit/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // 헤더에 JWT 토큰 추가
          },
        });
        
        console.log('받은 데이터:', response.data); // 받은 데이터 콘솔에 출력
        
        // 여기서 link와 caption을 개별적으로 상태에 설정합니다.
        setLink(response.data.link); // link를 상태에 저장
        setCaption(response.data.caption); // caption을 상태에 저장
        setGeneratedData(response.data.generatedData); // 생성된 데이터도 저장, 없으면 빈 문자열로 초기화
        
        
        
      } catch (error) {
        console.error('데이터 요청 에러 발생:', error.response?.data || error.message);
      }
    };

    fetchData(); // 데이터 가져오기 호출
  }, [projectId]);



  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };


  const languageOptions = [
    { value: "", label: "언어 선택", disabled: true },
    { value: "en", label: "영어" },
    { value: "es", label: "스페인어" },
    { value: "fr", label: "프랑스어" },
    { value: "de", label: "독일어" },
    { value: "ja", label: "일본어" },
    { value: "zh", label: "중국어" },
  ];
  const handleGenerate = async (event) => {
    event.preventDefault();
    const formData = { content_projectID: projectId };

    try {
      await axios.post(`http://localhost:3000/work/generateSub`, formData);
      const readSRTData = { content_projectID: projectId, content_language: "kr" };
      const responseReadSRT = await axios.post(`http://localhost:3000/files/readSRT`, readSRTData);
      setCaption(responseReadSRT.data);
      setGeneratedData(responseReadSRT.data);
    } catch (error) {
      console.error('에러 발생:', error.response?.data || error.message);
    }
  };

  const handleCheck = async () => {
    const contentToCheck = generatedData || caption; // generatedData가 없으면 caption 사용

    try {
      console.log('보내는 데이터:', contentToCheck);

      const response = await axios.post('http://localhost:4000/llm/check', { content: contentToCheck });

      console.log('서버 응답:', response.data);
      setCheckedData(response.data); // 서버 응답 데이터를 checkedData에 저장
    } catch (error) {
      console.error('에러 발생:', error.response?.data || error.message);
    }
  };

  const handleSave = async () => {
    const contentToSave = checkedData; // 저장할 데이터
    const id = projectId; // projectId로 변경
  
    if (!contentToSave) {
      console.log("저장할 데이터가 없습니다.");
      return;
    }
  
    try {
      console.log('저장할 데이터:', contentToSave);
      console.log("프로젝트 아이디 ", id);
  
      const response = await axios.post('http://localhost:3000/files/update', { 
        content: contentToSave,
        id: id 
      });
      const savedata = response.data;
      console.log("저장 데이터", savedata); 

      if (savedata === "success") {
        //alert('자막이 성공적으로 저장되었습니다.');
        window.location.reload(); // 페이지 새로고침
      } else {
        //alert('저장에 실패했습니다.'); // 다른 경우에 대한 피드백
      }
    } catch (error) {
      console.error('저장 중 에러 발생:', error.response?.data || error.message);
    }
  };  

  const handleUpload = async () => {
    const contentToUpload = caption; 
    const id = projectId; // URL 파라미터 또는 상태에서 프로젝트 ID 사용
    //const language = selectedLanguage; // 사용자 선택에 따라 설정된 언어
    const language = "kr"; 

    console.log("내용", contentToUpload);
    console.log("아이디", id);
    console.log("언어", language);
  
    if (!contentToUpload || !id || !language) {
      console.log("업로드할 데이터가 부족합니다.");
      return;
    }

  
    try {
      const response = await axios.post('http://localhost:3000/files/upload', {
        content: contentToUpload,
        id: id,
        language: language
      });
  
      console.log('업로드 완료:', response.data);
      alert('업로드가 성공적으로 완료되었습니다.');
    } catch (error) {
      console.error('업로드 중 에러 발생:', error.response?.data || error.message);
      alert('업로드에 실패했습니다.');
    }
  };

  const handlecancle = async () => {
      navigate('/home');
  };
  

  const handleRecommend = async () => {
    const contentToRecommend = generatedData || caption; // generatedData가 없으면 caption 사용

    try {
      const response = await axios.post('http://localhost:4000/llm/recommend', { content: contentToRecommend });
      const data = response.data;

      const title = data.제목 || ''; 
      const hashtags = Object.keys(data) 
        .filter(key => key.startsWith('해시태그')) 
        .map(key => data[key].trim()); 

      setrecommendTitle(title);
      setrecommendTag(hashtags);
  
      console.log('추천 제목:', title);
      console.log('추천 태그:', hashtags);
    } catch (error) {
      console.error('추천 요청 에러 발생:', error.response?.data || error.message);
    }
  };
  
  
  const handleTranslation = async () => {
    const contentToTranslate = generatedData || caption; // generatedData가 없으면 caption 사용

    try {
      const response = await axios.post('http://localhost:4000/llm/translate', {
        content: contentToTranslate,
        language: selectedLanguage, // 선택한 언어를 함께 전송
      });

      console.log('번역 결과:', response.data);
      settranslation(response.data);
    } catch (error) {
      console.error('번역 요청 에러 발생:', error.response?.data || error.message);
    }
  };

  const handleAddModel = () => { // 모델 추가 핸들러 추가
    if (modelName) {
      const newModelOption = { value: modelName, label: modelName };
      setModelOptions((prevOptions) => [...prevOptions, newModelOption]);
      setModelName(''); // 입력 필드 초기화
    }
  };


  
  return (
    <div className="w-full bg-white">
      {/* 상단 페이지: 자막 편집 */}
      <div className="bg-white">
        <header className="bg-white text-gray-900 py-4 px-6 text-xl font-bold flex justify-between items-center">
          자막 편집
        </header>
        <div className="flex bg-white">
          <div className="w-1/2 p-4">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-black">자막 수정</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleGenerate}>생성</Button>
                  <Button variant="solid" size="sm" onClick={handleCheck}>점검</Button>
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="content">영상 자막</Label>
                  <Textarea
                    id="content"
                    rows={5}
                    defaultValue={caption || generatedData} // caption이 존재하면 사용, 아니면 generatedData 사용
                  />
                </div>
                <div className="mt-1" />
                <div>
                  <Label htmlFor="content">수정된 자막</Label>
                  <div className="bg-gray-100 border border-gray-300 p-4 rounded-md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{checkedData}</ReactMarkdown>
                  </div>
                </div>
                <div className="mt-7" />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">취소</Button>
                  <Button variant="solid" size="sm">저장</Button>
                  <Button variant="solid" size="sm">업로드</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 p-4">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-300">
              <h2 className="text-xl font-bold text-black mb-4">영상 미리보기</h2>
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  src={getlink}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 하단 페이지: 자막 번역 */}
      <div className="bg-white mt-4">
        <div className="flex">
          <div className="w-1/2 p-4">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-black">자막 번역</h2>
                <div className="flex space-x-2">
                  <Select
                    id="translation-language"
                    options={languageOptions}
                    className="mr-2"
                    onChange={(e) => setSelectedLanguage(e.target.value)} // 선택한 언어 상태 업데이트
                    style={{ backgroundColor: '#808080', color: 'white' }}
                  />
                  <Button variant="outline" size="sm" onClick={handleTranslation}>번역</Button>
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="translation">번역 자막</Label>
                  <Textarea
                    id="translation"
                    rows={5}
                    defaultValue={translation}
                  />
                </div>
                <div className="mt-1" />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={handlecancle}>취소</Button>
                  <Button variant="solid" size="sm" onClick={handleSave}>저장</Button>
                  <Button variant="solid" size="sm" onClick={handleUpload}>업로드</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 p-4">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-black">제목 및 태그 추천</h2>
                <Button variant="outline" size="sm" onClick={handleRecommend}>추천받기</Button>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">추천 제목</Label>
                  <Input id="title" defaultValue={recommendtitle} />
                </div>
                <div>
                  <Label htmlFor="tags">추천 태그</Label>
                  <Input id="tags" defaultValue={recommendtag} />
                </div>
                <div className="mt-4" />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">취소</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 p-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-300">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-black">자막 더빙</h2>
            <div className="flex space-x-2">
              <Select
                id="model"
                options={modelOptions}
                value={selectedModel}
                className="mr-2"
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{ backgroundColor: '#808080', color: 'white' }}
              />
              <Button variant="outline" size="sm">생성</Button>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="video-input">모델 학습용 영상 (원하는 모델이 없을 때)</Label>
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <Input
                  placeholder="모델 이름 입력"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-1/3 bg-white"
                />
              </div>
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder={`영상 주소 ${index + 1}`}
                    className="border border-gray-300 rounded p-2 w-full bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4"></div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm">모델 학습</Button>
            <Button variant="solid" size="sm" onClick={handleAddModel}>모델 추가</Button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-black">생성된 mp3 파일</h3>
            <div className="flex items-center justify-between mt-2">
              <Audio src="generated-voice.mp3" />
              <Button variant="solid" size="sm">다운</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;


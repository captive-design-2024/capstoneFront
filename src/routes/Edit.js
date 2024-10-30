import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom'; // useParams 임포트
import axios from 'axios';
import { Button, Label, Textarea, Input, Select} from '../components/Components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Edit = () => {
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
  //const [modelName, setModelName] = useState(''); // 입력된 모델 이름 저장
  const [loading, setLoading] = useState(false); // 자막 생성 로딩 상태 추가
  const [loading2, setLoading2] = useState(false); // 자막 수정 로딩 상태 추가
  const [loading3, setLoading3] = useState(false); // 자막 번역 로딩 상태 추가
  const [audioUrl, setAudioUrl] = useState(null); // 오디오 파일 저장 상태 추가
  const [dubbingloading, setdubbingloading] = useState('없음');
  const [selectedLanguagetwo, setSelectedLanguagetwo] = useState(''); // 선택한 언어 저장 상태 추가

  const [modelOptions, ] = useState([ // 모델 선택 옵션 상태 추가
    { value: "", label: "모델 선택", disabled: true },
    { value: "ab", label: "기본"},
    { value: "en", label: "준석" },
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
        
        //console.log('받은 데이터:', response.data); // 받은 데이터 콘솔에 출력
        
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

  const languageOptions = [
    { value: "", label: "언어 선택"},
    { value: "en", label: "영어" },
    { value: "es", label: "스페인어" },
    { value: "fr", label: "프랑스어" },
    { value: "de", label: "독일어" },
    { value: "ja", label: "일본어" },
  ];

  const languageOptionstwo = [
    { value: "", label: "언어 선택"},
    { value: "ko", label: "한국어"},
    { value: "en", label: "영어" },
    { value: "es", label: "스페인어" },
    { value: "fr", label: "프랑스어" },
    { value: "de", label: "독일어" },
    { value: "ja", label: "일본어" },
  ];

  const handleGenerate = async (event) => {
    event.preventDefault();
    const formData = { content_projectID: projectId };

    console.log('생성 요청:', formData);
    try {
      setLoading(true); // '자막 생성 중...' 상태 설정
      await axios.post(`http://localhost:3000/work/generateSub`, formData);
      const readSRTData = { content_projectID: projectId, content_language: "kr" };
      const responseReadSRT = await axios.post(`http://localhost:3000/files/readSRT`, readSRTData);
      setCaption(responseReadSRT.data);
      setGeneratedData(responseReadSRT.data);
    } catch (error) {
      console.error('에러 발생:', error.response?.data || error.message);
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  const handleCheck = async () => {
    const contentToCheck = generatedData || caption; // generatedData가 없으면 caption 사용

    try {
      setLoading2(true); // '자막 수정 중...' 상태 설정
      console.log('보내는 데이터:', contentToCheck);

      await axios.post('http://localhost:3000/work/llm-check', {
         content: contentToCheck,
         content_language: "kr",
         content_projectID: projectId
        });

      const checkresponse = await axios.post(`http://localhost:3000/files/readSRT`, {
        content_projectID: projectId,
        content_language: "kr"
      });



      setCheckedData(checkresponse.data); // 서버 응답 데이터를 checkedData에 저장

      //console.log(checkresponse.data);

    } catch (error) {
      console.error('에러 발생:', error.response?.data || error.message);
    } finally {
      setLoading2(false); // 로딩 상태 해제
    }
  };

  // const handleSave = async () => {
  //   const contentToSave = checkedData; // 저장할 데이터
  //   const id = projectId; // projectId로 변경
  
  //   if (!contentToSave) {
  //     console.log("저장할 데이터가 없습니다.");
  //     return;
  //   }
  
  //   try {
  //     console.log('저장할 데이터:', contentToSave);
  //     console.log("프로젝트 아이디 ", id);
  
  //     const response = await axios.post('http://localhost:3000/files/update', { 
  //       content: contentToSave,
  //       id: id 
  //     });
  //     const savedata = response.data;
  //     console.log("저장 데이터", savedata); 

  //     if (savedata === "success") {
  //       //alert('자막이 성공적으로 저장되었습니다.');
  //       window.location.reload(); // 페이지 새로고침
  //     } else {
  //       //alert('저장에 실패했습니다.'); // 다른 경우에 대한 피드백
  //     }
  //   } catch (error) {
  //     console.error('저장 중 에러 발생:', error.response?.data || error.message);
  //   }
  // };  

  const handleUpload = async () => {
    // 새 창 열기
    window.open('http://localhost:3000/auth', '_blank');
  
    // 토큰 가져오기
    let accessToken = null;
    try {
      const tokenResponse = await fetch('http://localhost:3000/token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!tokenResponse.ok) {
        throw new Error('Failed to fetch token');
      }
  
      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access;
    } catch (error) {
      console.error('Error fetching token:', error);
      return; // 토큰 가져오기에 실패하면 업로드를 중단
    }
  
    // 유튜브 링크 가져오기
    let youtubelink = null;
    try {
      const linkResponse = await fetch('http://localhost:3000/project/purelink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: projectId, // 프로젝트 ID
        }),
      });
  
      if (!linkResponse.ok) {
        throw new Error('Failed to fetch youtubelink');
      }
  
      const linkData = await linkResponse.text();
      youtubelink = linkData;
  
    } catch (error) {
      console.error('Error fetching youtubelink:', error);
      return; // 링크 가져오기 실패 시 중단
    }
  
    // 업로드할 데이터 설정
    const captionFilePath = caption; 
    const language = selectedLanguage || "ko";
  
    if (!captionFilePath || !youtubelink || !language || !accessToken) {
      console.log("업로드할 데이터가 부족합니다.");
      return;
    }
  
    let captionList = null;
    let uploadedId = null;
  
    // 자막 업로드 시도
    try {
      const uploadResponse = await axios.post('http://localhost:3000/youtube', {
        captionFilePath: captionFilePath,
        videoId: youtubelink,
        language: language,
        access: accessToken
      });
  
      console.log('업로드 완료:', uploadResponse.data);
  
      // 업로드 완료된 데이터에서 id 추출
      uploadedId = uploadResponse.data.id;
      console.log('업로드된 자막 ID:', uploadedId);
  
      alert('업로드가 성공적으로 완료되었습니다.');
  
    } catch (error) {
      console.error('업로드 중 에러 발생:', error.response?.data || error.message);
  
      // 업로드 실패 시 자막 목록 다시 가져오기
      try {
        const listResponse = await fetch('http://localhost:3000/youtube/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,  // 인증을 위해 토큰 추가
          },
          body: JSON.stringify({
            videoId: youtubelink, // 서버로 보낼 videoId
          }),
        });
  
        if (!listResponse.ok) {
          throw new Error('Failed to fetch caption list');
        }
  
        captionList = await listResponse.json();  // 자막 목록 받아오기
        console.log('자막 목록:', captionList);
  
        // items 배열에서 가장 최근 자막 ID 추출
        if (captionList.items && Array.isArray(captionList.items)) {
          const lastItem = captionList.items[captionList.items.length - 1];
          const failedId = lastItem.id;
          console.log('업로드 실패 후 목록에서 가져온 자막 ID:', failedId);
  
          // 업로드 실패한 자막을 업데이트하는 요청
          try {
            const updateResponse = await fetch('http://localhost:3000/youtube/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                id: failedId,              // 실패한 자막 ID
                captionFilePath: captionFilePath,  // 기존의 captionFilePath
              }),
            });
  
            if (!updateResponse.ok) {
              throw new Error('Failed to update caption');
            }
  
            console.log('자막 업데이트 성공:', await updateResponse.json());
            alert('자막 업데이트가 성공적으로 완료되었습니다.');
  
          } catch (updateError) {
            console.error('Error updating caption:', updateError);
          }
  
        } else {
          console.log('items 배열이 없습니다.');
        }
  
      } catch (listError) {
        console.error('Error fetching caption list after upload failure:', listError);
      }
    }
  };
  

  const handlecancle = async () => {
      navigate('/Mypage');
  };
  

  const handleRecommend = async () => {
    const contentToRecommend = generatedData || caption; // generatedData가 없으면 caption 사용
  
    // 선택한 언어의 label 값을 찾기
    //const selectedLanguageLabel = languageOptionstwo.find(option => option.value === selectedLanguagetwo)?.label || '';
    
    const selectedLanguageLabel = selectedLanguagetwo;

    try {
      const response = await axios.post('http://localhost:3000/work/llm-recommend', { 
        content: contentToRecommend,
        language: selectedLanguageLabel, // 선택한 언어의 label 전송
      });
  
      const data = response.data;

      console.log(data);
  
      const title = data.title || ''; 
      const hashtags = Object.keys(data)
        .filter(key => key.startsWith('hashtag')) 
        .map(key => data[key].trim()); 
  
      setrecommendTitle(title);
      setrecommendTag(hashtags);
  
      console.log("보낸 언어:", selectedLanguageLabel);

    } catch (error) {
      console.error('추천 요청 에러 발생:', error.response?.data || error.message);
    }
  };

  
  
  const handleTranslation = async () => {
    const contentToTranslate = generatedData || caption; // generatedData가 없으면 caption 사용

    console.log('서버 요청:', contentToTranslate);

    console.log('llm_translate 호출:', {
      content_projectID: projectId,
      content_language: selectedLanguage,
      content: contentToTranslate
    });

    try {
      setLoading3(true); // '자막 수정 중...' 상태 설정
      await axios.post('http://localhost:3000/work/llm-translate', {
        content_projectID: projectId,
        //content_language: "en",
        content_language: selectedLanguage, // 선택한 언어를 함께 전송
        content: contentToTranslate
      });

      

      const transresponse = await axios.post(`http://localhost:3000/files/readSRT`, {
        content_projectID: projectId,
        content_language: selectedLanguage
      });



      settranslation(transresponse.data); // 서버 응답 데이터를 checkedData에 저장

    } catch (error) {
      console.error('번역 요청 에러 발생:', error.response?.data || error.message);
    } finally {
      setLoading3(false); // 로딩 상태 해제
    }
  };

  const handleLoad = async () => {
    const contentToTranslate = generatedData || caption; // generatedData가 없으면 caption 사용

    console.log('서버 요청:', contentToTranslate);

    console.log('llm_translate 호출:', {
      content_projectID: projectId,
      content_language: selectedLanguage,
      content: contentToTranslate
    });

    try {
      //setLoading3(true); // '자막 수정 중...' 상태 설정
      const transresponse = await axios.post(`http://localhost:3000/files/readSRT`, {
        content_projectID: projectId,
        content_language: selectedLanguage
      });
      settranslation(transresponse.data); // 서버 응답 데이터를 checkedData에 저장

    } catch (error) {
      console.error('번역 요청 에러 발생:', error.response?.data || error.message);
      alert("번역 파일이 없습니다!");
    } finally {
      //setLoading3(false); // 로딩 상태 해제
    }
  };



  //임시 미사용
  /*const handleAddModel = () => { // 모델 추가 핸들러 추가
    if (modelName) {
      const newModelOption = { value: modelName, label: modelName };
      setModelOptions((prevOptions) => [...prevOptions, newModelOption]);
      setModelName(''); // 입력 필드 초기화
    }
  };*/

  const handleDubbing = async () => {
    try {
      // 더빙 생성 요청을 보내기 전 상태를 '생성 중'으로 설정
      setdubbingloading('생성 중');
  
      const formData = {
        content_projectID: projectId,
      };
  
      // 모델 선택에 따라 다른 엔드포인트 설정
    let endpoint = '';
    if (selectedModel === 'ab') {
      endpoint = 'http://localhost:3000/work/generateDubbing';
    } else if (selectedModel === 'en') {
      endpoint = 'http://localhost:3000/work/generateVCDubbing';
    } else if (selectedModel === 'es') {
      endpoint = 'http://localhost:3000/work/generateOtherDubbing';
    } else {
      console.error('선택한 모델에 대한 엔드포인트가 없습니다.');
      setdubbingloading('없음');
      return;
    }


      console.log('요청을 보내는 주소:', endpoint);
     
  
      // 더빙 파일 생성 API 요청
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        console.log('파일 생성 완료');
        // 더빙 파일 생성이 완료되었을 때 상태를 '생성 완료'로 설정
        setdubbingloading('생성 완료');
      }
    } catch (error) {
      console.error('요청 중 에러 발생:', error.response?.data || error.message);
      // 에러 발생 시에도 상태를 '없음'으로 설정
      setdubbingloading('없음');
    }
  };
  
  
  

  const handleWAV = async () => {
    try {
      const formData = {
        content_projectID: projectId,
        content_format: "voice",
        content_language: "en"
      };
  
      console.log('다운 요청:', formData);
  
      const response = await axios.post('http://localhost:3000/files/downloadWAV', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      });
  
      if (response.status === 200 || response.status === 201) {
        const blob = new Blob([response.data], { type: 'audio/wav' });
        const url = window.URL.createObjectURL(blob);
  
        // 바로 audioUrl 상태에 설정
        setAudioUrl(url);
        
        console.log('Blob URL:', url);
  
        // 다운로드를 위한 URL 생성 및 다운로드 실행
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'generated.wav';
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        // 다운로드 URL 해제
        window.URL.revokeObjectURL(downloadUrl);
  
        console.log('파일이 성공적으로 저장되었습니다.', response.data);
        //alert("더빙 파일 저장 완료!");
      }
    } catch (error) {
      console.error('더빙 생성 오류:', error);
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
                    defaultValue={loading ? '자막 생성 중…' : (caption || generatedData)}
                  />
                </div>
                <div className="mt-1" />
                <div>
                    <Label htmlFor="content">수정된 자막</Label>
                    <div className="bg-gray-100 border border-gray-300 p-4 rounded-md">
                    {loading2 ? (
                      '자막 수정 중…' // 로딩 중일 때 표시할 메시지
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{checkedData}</ReactMarkdown>
                    )}
                  </div>
                </div>
                <div className="mt-7" />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={handlecancle}>취소</Button>
                  {/* <Button variant="solid" size="sm" onClick={handleSave}>저장</Button> */}
                  <Button variant="solid" size="sm" onClick={handleUpload}>업로드</Button>
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
                  title="Description of the content in the iframe"
                  className="absolute top-0 left-0 w-full h-full"
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
                    onChange={(e) => setSelectedLanguage(e.target.value)} // 선택한 언어 상태 업데이트
                    style={{ backgroundColor: '#808080', color: 'white' }}
                  />
                  <Button variant="outline" size="sm" onClick={handleTranslation}>번역</Button>
                  <Button variant="solid" size="sm" onClick={handleLoad}>불러오기</Button>
               
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="translation">번역 자막</Label>
                  <Textarea
                      id="translation"
                      rows={5}
                      defaultValue={loading3 ? '자막 번역 중…' : translation}
                      
                    />
                    {/* <Textarea
                      id="load"
                      rows={5}
                      defaultValue={loading4 ? '자막 불러오는 중…' : loadData}
                    /> */}
                </div>
                <div className="mt-1" />
                <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={handlecancle}>취소</Button>
                {/* <Button variant="solid" size="sm">저장</Button> */}
                  <Button variant="solid" size="sm" onClick={handleUpload}>업로드</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 p-4">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-black">제목 및 태그 추천</h2>
                <div className="flex space-x-2">
                <Select
                  id="translation-language"
                  options={languageOptionstwo}
                  onChange={(e) => setSelectedLanguagetwo(e.target.value)} // 선택한 언어 상태 업데이트
                  style={{ backgroundColor: '#808080', color: 'white' }}
                />
                <Button variant="outline" size="sm" onClick={handleRecommend}>추천받기</Button>
              </div>
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
                <Button variant="outline" size="sm" onClick={handlecancle}>취소</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 하단2 페이지: 자막 번역 */}
      <div className="bg-white mt-4">
        <div className="flex">
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
                  <Button variant="outline" size="sm" onClick={handleDubbing}>생성</Button>
                </div>
              </div>
              <div className="grid gap-4">
              <h3 className="text-lg font-semibold text-black">
          {dubbingloading === '없음'
            ? 'mp3 파일 없음'
            : dubbingloading === '생성 중'
            ? 'mp3 파일 생성 중'
            : 'mp3 파일 생성 완료'}
        </h3>
                <div className="flex items-center justify-between mt-2">
                <audio controls src={audioUrl || ''} style={{ width: '70%' }} />
                  <Button variant="solid" size="sm" onClick={handleWAV}>다운</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;



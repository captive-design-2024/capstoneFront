import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Components';

const Home = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    if (isLoggedIn) {
      navigate('/Mypage'); // 로그인이 되어 있으면 /Edit 페이지로 이동
    } else {
      alert('로그인이 필요합니다!'); // 로그인이 안 되어 있으면 경고 메시지
      navigate('/Login'); // 로그인 페이지로 이동
    }
  };

  // Feature 컴포넌트
  const Feature = ({ title, description, iconSrc }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <img src={iconSrc} alt={`${title} icon`} className="w-20 h-20 object-cover" />
      </div>
      <h3 className="text-xl font-bold mb-4 text-black">{title}</h3>
      <p className="text-base text-gray-700">{description}</p>
    </div>
  );  


  return (
    <div className="w-full">
      <div className="relative h-[92vh] overflow-hidden">
        <img src="/IMG_25351.jpg" alt="Main Content" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h2 className="text-4xl font-bold mb-4">YouTube 영상의 자막을 쉽게 관리하세요</h2>
          <p className="text-lg mb-6">영상의 자막을 생성 및 수정하고 번역과 더빙을 진행할 수 있습니다</p>
          <div className="flex justify-start">
            <Button
              variant="solid"
              className="bg-red-500 hover:bg-red-600 text-white px-12 py-3 text-lg font-bold"
              onClick={handleStartClick} // 클릭 시 페이지 이동 핸들러
            >
              시작하기
            </Button>
          </div>
        </div>
      </div>
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Why Youtube SubHelper?</h2>
          <div className="mt-20" />
          <p className="text-lg text-gray-900 text-center">
            Youtube SubHelper 서비스는 영상의 음성을 바탕으로 영상 자막을 자동으로 생성하고,<br /><br />
            생성한 자막을 바탕으로 다양한 언어로 번역하여 다국어 자막 및 더빙을 제공하는 것을 목표로 합니다.<br /><br />
            대본 없이 주제를 중심으로 자연스럽게 대화를 이어가는 1인 진행형 콘텐츠 크리에이터를 주 타겟으로 하여<br /><br />
            서비스를 이용할 크리에이터가 본인의 콘텐츠를 다양한 언어권의 시청자들에게 보다 쉽게 공유하고,<br /><br />
            콘텐츠를 소비하는 소비자의 범위를 크게 확대할 수 있도록 지원할 것입니다.

          </p>
        </div>
      </section>

      {/* 새로운 섹션 */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Key Features</h2>
          <div className="flex flex-wrap justify-center space-x-4">
            <Feature
              iconSrc="/Subtitle.png"
              title="Subtitle"
              description={
                <>
                  자막이 필요한 영상의<br /> 
                  유튜브 링크를 입력하면<br /> 
                  자동으로 자막이 생성됩니다.
                </>
              }
            />
            <Feature
              iconSrc="/Translation.png"
              title="Translation"
              description={
                <>
                  생성된 자막을 기반으로<br /> 
                  다양한 언어의 자막으로<br />
                  자연스럽게 번역됩니다.
                </>
              }
            />
            <Feature
              iconSrc="/Dubbing.jpg"
              title="Dubbing"
              description={
                <>
                  생성된 자막에 있는<br /> 
                  대사와 시간을 활용해<br /> 
                  더빙 파일을 생성합니다.
                </>
              }
            />
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;

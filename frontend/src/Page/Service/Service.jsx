import React from 'react'
import './Service.scss'
import serviceBg from '../../assets/about_1.jpg'
import { servicesList, whyUsList, processSteps } from '../../Util/service'
const Service = () => {
  return (
    <section className='service-container top-section'>
      <div className="inner">
        <div className="t-wrap">

          <h3>우리의 서비스</h3>
          <p>혁신적인 기술로 비즈니스의 성공을 지원합니다.</p>
        </div>
        <div className="services-grid">
          {servicesList.map((service) => (
            <div key={service.id} className='service-card'>
              <div className="icon">{service.icon}</div>
              <h5>
                {service.title}
              </h5>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
        <div className="services-why">
          <h3>왜 우리를 선택해야 할까요?</h3>
          <div className="why-grid">
            {whyUsList.map((item, idx) => (
              <div key={idx} className="why-item">
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="services-process">
          <h3>프로젝트 진행 프로세스</h3>
          <div className="process-grid">
            {processSteps.map((item, index) => (
              <div key={index} className="process-step">
                <div className="step">{item.step}</div>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
        <div className="services-cta"
          style={{
            backgroundImage: `url(${serviceBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h3>프로젝트를 시작할 준비가 되셨나요?</h3>
          <p>전문가와 상담하고 최적의 솔루션을 찾아보세요</p>
          <button>무료 상담 신청하기</button>
        </div>


    </section>
  )
}

export default Service
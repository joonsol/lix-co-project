import React, { useRef } from 'react'
import "@splidejs/react-splide/css";

import { heroContents,heroStats } from '../../Util/heroContents'
import { Splide, SplideSlide } from "@splidejs/react-splide";
import useGsapAnimation from "../../hooks/useGsapAnimation";
import { gsap } from "gsap";
import './Hero.scss'
const Hero = () => {

    const tWrapRef = useRef([])


    const setSlideRef =(el, idx)=>{
        if(el) {
            tWrapRef.current[idx]=el
        }
    }
    const slideChange = (splide) => {
        const activeIndex = splide.index
        tWrapRef.current.forEach((ref, index) => {
            // const bg = ref.querySelector(".bg");
            const elements = ref.querySelectorAll("h2, p,button");
            if (index === activeIndex) {

                if (elements) {
                    gsap.fromTo(
                        elements,
                        { opacity: 0, y: 50 },
                        { opacity: 1, y: 0, duration: .5, stagger: 0.2 },
                    )
                }
            }
            else {
        
                if (elements) {
                    gsap.set(elements, { opacity: 0, y: 50 }); // h2와 p 초기화
                }
            }

        })
    }


    return (
        <section className='hero'>
            <Splide
                options={{
                    type: "loop", // 무한 반복
                    autoplay: false, // 자동 재생
                    interval: 10000, // 슬라이드 전환 간격 (ms)
                    pagination: true, // 하단 점 네비게이션
                    arrows: true, // 이전/다음 화살표 표시
                }}
                onMoved={slideChange} // 슬라이드 이동 이벤트 핸들러
                onMounted={slideChange} // 초기 활성화 슬라이드 설정
            >
                {
                    heroContents.map((item, index) => (
                        <SplideSlide
                            key={index}
                            style={{ backgroundImage: `url('${item.image}')` }}
                        >
                            <div className={`inner sl0${index+1}`} ref={(el)=>setSlideRef(el, index)}>
                                <h2>{item.title}</h2>
                                <p>{item.description}</p>
                            </div>

                        </SplideSlide>
                    ))
                }
            </Splide>
            <div className="hero-stats-wrap">
                <div className="inner">
                    <ul className='hero-stats-list'>
                        {heroContents.map((content,i)=>(
                            <li
                            
                            key={i}>
                                <h4>{content.title}</h4>
                                <p>
                                    {content.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Hero
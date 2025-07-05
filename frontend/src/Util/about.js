import companyImage from "../assets/about_2.jpg";

export const aboutData = {
  hero: {
    image: companyImage,
    company: "Lix Co.",
    slogan: "아름다움을 넘어, 지속가능한 가치를 만듭니다.",
  },

  intro: {
    title: "회사 소개",
    paragraphs: [
      "Lix Co.는 2010년 설립된 글로벌 화장품 브랜드로, 천연 성분과 과학기술을 결합한 고기능성 뷰티 제품을 제공합니다.",
      "우리는 고객의 피부 건강과 아름다움을 최우선으로 생각하며, 윤리적이고 지속가능한 생산 방식을 기반으로 국내외 시장에서 꾸준히 성장하고 있습니다.",
    ],
  },

  values: [
    { title: "혁신", desc: "끊임없는 연구와 개발을 통해 새로운 뷰티 솔루션을 제시합니다." },
    { title: "신뢰", desc: "정직한 성분과 투명한 정보로 고객과의 신뢰를 구축합니다." },
    { title: "지속가능성", desc: "환경과 공존하는 지속가능한 브랜드가 되겠습니다." },
  ],

  vision: {
    title: "브랜드 비전",
    statement:
      "2030년까지 전 세계 50개국 이상에 뷰티 솔루션을 공급하는\n지속가능한 글로벌 뷰티 브랜드로 성장하겠습니다.",
  },

  history: {
    title: "브랜드 연혁",
    timeline: [
      { year: "2024", event: "동남아 및 중동 시장 진출" },
      { year: "2022", event: "프랑스 파리 뷰티 어워드 수상" },
      { year: "2021", event: "비건 화장품 인증 획득" },
      { year: "2010", event: "Lix Co. 브랜드 런칭" },
    ],
  },
};

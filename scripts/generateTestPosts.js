const fs = require('fs');
const path = require('path');

const categories = ['기술', '질문', '정보', '토론', '후기', '뉴스'];
const authors = [
  '김개발', '이프론트', '박백엔드', '최디자인', '정데이터',
  '강풀스택', '윤리액트', '장노드', '임파이썬', '한자바',
  '송타입', '오스크립트', '신코딩', '유프로그래머', '문개발자',
  '권엔지니어', '배테크', '서코더', '조알고리즘', '홍디버거'
];

const titleTemplates = [
  '에서의 효율적인 개발 방법',
  '초보자를 위한 가이드',
  '성능 최적화 팁',
  '에 대한 질문입니다',
  '프로젝트 경험 공유',
  '트러블슈팅 경험',
  '추천 부탁드립니다',
  'vs 비교',
  '학습 로드맵',
  '실무 적용 사례',
  '베스트 프랙티스',
  '최신 트렌드 정리',
  '구현 방법 문의',
  '에러 해결 방법',
  '아키텍처 설계',
  '코드 리뷰 요청',
  '라이브러리 추천',
  '버전 업데이트 정보',
  '성능 벤치마크',
  '디버깅 노하우'
];

const topics = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js',
  'Python', 'Django', 'FastAPI', 'Spring Boot', 'Java',
  'Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD',
  'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
  'TDD', '클린코드', '디자인패턴', '알고리즘', '자료구조',
  'Vue.js', 'Angular', 'Svelte', 'Tailwind CSS', 'CSS'
];

const contentTemplates = [
  '최근 프로젝트를 진행하면서 겪었던 경험을 공유합니다.\n\n여러분들의 의견이 궁금합니다.',
  '이 분야에 대해 공부하고 있는데, 좋은 자료나 팁이 있을까요?\n\n도움 부탁드립니다!',
  '실무에서 사용해보니 정말 유용했습니다.\n\n자세한 내용은 본문을 참고해주세요.',
  '다음과 같은 에러가 발생하는데 해결 방법을 아시는 분 계신가요?\n\n급합니다 ㅠㅠ',
  '튜토리얼을 따라하다가 막혔습니다.\n\n어떻게 해결해야 할까요?',
  '이 기술을 도입하려고 하는데, 장단점을 알고 싶습니다.\n\n사용해보신 분들의 후기 부탁드립니다.',
  '성능 개선을 위해 여러 방법을 시도해봤습니다.\n\n결과를 공유합니다.',
  '초보자 입장에서 정리한 내용입니다.\n\n피드백 환영합니다!',
  '실무에서 자주 사용하는 패턴들을 정리했습니다.\n\n도움이 되셨으면 좋겠습니다.',
  '최신 버전이 나왔는데 업데이트 하는게 좋을까요?\n\n호환성 이슈는 없는지 궁금합니다.'
];

function generatePosts(count) {
  const posts = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
    const title = `${topic} ${template}`;
    const content = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];

    // 최근 30일 내의 랜덤한 시간
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);

    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - randomDaysAgo);
    createdAt.setHours(createdAt.getHours() - randomHours);
    createdAt.setMinutes(createdAt.getMinutes() - randomMinutes);

    posts.push({
      id: `${Date.now()}_${i}`,
      title,
      content,
      author,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString()
    });
  }

  // 최신순 정렬
  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return posts;
}

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'posts.json');

// data 디렉토리가 없으면 생성
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const posts = generatePosts(2000);
fs.writeFileSync(dataFile, JSON.stringify(posts, null, 2));

console.log(`✅ ${posts.length}개의 테스트 게시물이 생성되었습니다!`);
console.log(`📁 파일 위치: ${dataFile}`);

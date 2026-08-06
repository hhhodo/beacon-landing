# BEACON — Marketing Platform Landing Page

Figma 레퍼런스(네이버 웨일 랜딩)의 그리드 구조(히어로 full-bleed / 인트로 4-8 / 기능 3-3-3-3 / 성과 6-6(내부 5-7) / CTA 5-7 / 푸터 full-bleed)를 재현한 마케팅 플랫폼 원페이지 랜딩페이지입니다.
이미지 영역은 전부 `--color-placeholder`(#d9d9d9) 플레이스홀더로 처리했으며, 레퍼런스의 캐러셀/페이지네이션 섹션은 정적 그리드로 재구성해 페이지 이동을 암시하는 요소를 모두 제거했습니다.

## Stack
- 순수 HTML/CSS, 빌드 도구 없음
- `css/styles.css` — 디자인 토큰 & 그리드 시스템 (수정 금지)
- `css/site.css` — BEACON 전용 컴포넌트 스타일

## 로컬 실행
```bash
python3 -m http.server 5500
```

## 배포
`main` 브랜치에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로 GitHub Pages에 배포합니다.

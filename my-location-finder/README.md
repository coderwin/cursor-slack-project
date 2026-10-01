# 나의 위치 찾기

브라우저 Geolocation으로 현재 위치를 확인하고, OpenStreetMap 지도와 주소(역지오코딩)를 보여 주는 정적 웹 페이지입니다.

## 실행 방법

Geolocation은 **HTTPS** 또는 **localhost**에서만 동작합니다.

```bash
cd my-location-finder
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080` 을 열고 **내 위치 찾기**를 누른 뒤 위치 권한을 허용하세요.

## 기능

- 위도·경도·정확도(m) 표시
- Leaflet + OpenStreetMap 지도 (API 키 불필요)
- Nominatim 역지오코딩 (한국어 주소 우선)
- 권한 거부, 위치 불가, 타임아웃, API 미지원 처리
- **다시 찾기** 버튼

## 테스트

- 데스크톱: Chrome / Firefox / Safari
- 모바일: 동일 origin으로 접속 후 권한 허용·거부 흐름 확인

역지오코딩은 [Nominatim 사용 정책](https://operations.osmfoundation.org/policies/nominatim/)을 준수하세요. 과도한 요청은 피하세요.

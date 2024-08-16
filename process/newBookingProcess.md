# 상세 예약 및 결제 프로세스 플로우

## 1. 사용자 예약 및 결제 프로세스

### 1.1 예약 폼 제출 및 초기 처리

사용자 액션: '결제하기' 버튼 클릭
시스템 처리:

1. `Booking` 테이블:
    - 새 레코드 생성
    - status: 'PENDING'
    - 기본 정보 (userId, roomDetailId, checkInDate, checkOutDate, basePrice 등) 저장

2. `BookingDetail` 테이블:
    - 새 레코드 생성
    - 추가 정보 (petCount, specialRequests 등) 저장
    - 요청된 추가 옵션 (requestedLateCheckout, requestedEarlyCheckin) 저장

3. `BookingStatusHistory` 테이블:
    - 새 레코드 생성
    - status: 'PENDING'

4. `Payment` 테이블 (기본 요금):
    - 새 레코드 생성
    - status: 'PENDING'
    - type: 'INITIAL'
    - amount: basePrice

5. `Payment` 테이블 (추가 옵션 - 있는 경우):
    - 새 레코드 생성
    - status: 'PENDING'
    - type: 'ADDITIONAL'
    - amount: 추가 옵션 가격 합계

### 1.2 예약 및 결제 정보 반환

시스템 응답:

- 생성된 `Booking`, `BookingDetail`, `Payment` 정보 클라이언트에 반환

### 1.3 결제 화면 오픈 및 결제 진행

사용자 액션: 결제 진행
시스템 처리: 결제 게이트웨이로 리다이렉트 또는 팝업 오픈

### 1.4 결제 완료 및 결과 처리

사용자 액션: 결제 완료
시스템 처리:

1. `Booking` 테이블:
    - status 업데이트: 'CONFIRMED'

2. `Payment` 테이블:
    - status 업데이트: 'COMPLETED'
    - transactionId 저장

3. `BookingStatusHistory` 테이블:
    - 새 레코드 생성
    - status: 'CONFIRMED'

4. `RoomAvailability` 테이블:
    - 해당 날짜의 availableCount 감소

## 2. 관리자 체크인/체크아웃 및 후불결제 프로세스

### 2.1 체크인 처리

관리자 액션: 체크인 처리
시스템 처리:

1. `Booking` 테이블:
    - status 업데이트: 'CHECKED_IN'

2. `BookingStatusHistory` 테이블:
    - 새 레코드 생성
    - status: 'CHECKED_IN'

3. `BookingDetail` 테이블:
    - actualEarlyCheckin 업데이트 (해당되는 경우)

### 2.2 체류 중 추가 요청 처리 (옵션)

관리자 액션: 추가 요청 사항 기록
시스템 처리:

1. `BookingDetail` 테이블:
    - 새로운 요청 사항 추가 또는 기존 요청 사항 업데이트

### 2.3 체크아웃 처리

관리자 액션: 체크아웃 처리 시작
시스템 처리:

1. `BookingDetail` 테이블:
    - actualLateCheckout 업데이트
    - 기타 실제 사용된 추가 서비스 정보 업데이트

2. `AdditionalFee` 테이블:
    - 실제 사용된 추가 서비스에 대한 요금 레코드 생성

### 2.4 후불 결제 처리

관리자 액션: 추가 요금 결제 처리
시스템 처리:

1. `Payment` 테이블:
    - 새 레코드 생성 (후불 결제용)
    - status: 'COMPLETED'
    - type: 'ADDITIONAL'
    - amount: 추가 요금 총액

### 2.5 체크아웃 완료

관리자 액션: 체크아웃 확정
시스템 처리:

1. `Booking` 테이블:
    - status 업데이트: 'CHECKED_OUT'

2. `BookingStatusHistory` 테이블:
    - 새 레코드 생성
    - status: 'CHECKED_OUT'

3. `Room` 테이블:
    - status 업데이트: 'CLEANING'

4. `RoomAvailability` 테이블:
    - 해당 날짜의 availableCount 증가 (다음 날부터)

### 2.6 객실 청소 완료 처리

관리자 액션: 청소 완료 표시
시스템 처리:

1. `Room` 테이블:
    - status 업데이트: 'AVAILABLE'

# 상세 예약 및 결제 프로세스 플로우

[기존 섹션 1과 2는 그대로 유지]

## 3. 예약 취소 프로세스

### 3.1 취소 요청

사용자 액션: 예약 취소 요청
시스템 처리:

1. 취소 가능 여부 확인:
    - 체크인 날짜와 현재 날짜를 비교하여 취소 정책 적용

2. `CancellationPolicy` 테이블:
    - 해당되는 취소 정책 조회

3. 취소 수수료 계산:
    - 조회된 정책에 따라 수수료 계산

### 3.2 취소 처리

시스템 처리:

1. `Booking` 테이블:
    - status 업데이트: 'CANCELLED'
    - cancellationDate 설정
    - cancellationFee 설정

2. `BookingStatusHistory` 테이블:
    - 새 레코드 생성
    - status: 'CANCELLED'
    - reason: 취소 사유 기록

3. `Refund` 테이블:
    - 새 레코드 생성
    - amount: 환불 금액 (총 결제액 - 취소 수수료)
    - status: 'PENDING'

4. `RoomAvailability` 테이블:
    - 해당 날짜의 availableCount 증가

### 3.3 환불 처리

관리자 액션: 환불 처리
시스템 처리:

1. `Refund` 테이블:
    - status 업데이트: 'PROCESSED'

초기 데이터
-- Room 테이블 데이터 삽입
INSERT INTO "ROOMS" (id, name, class, description, capacity, size, "imageUrls", "createdAt", "updatedAt")
VALUES
(1, '스탠다드 룸', 'STANDARD', '기본적인 편의시설을 갖춘 편안한 객실', 2, 20,
ARRAY['https://nhpcrfxpqzfcbuntraaa.supabase.co/storage/v1/object/public/resource/images/Premium_Suite.webp'], '
2024-08-07 12:08:53.912', '2024-08-07 12:08:53.912'),
(2, '디럭스 룸', 'DELUXE', '넓은 공간과 고급 시설을 갖춘 객실', 2, 30,
ARRAY['https://nhpcrfxpqzfcbuntraaa.supabase.co/storage/v1/object/public/resource/images/Deluxe_Suite.webp'], '
2024-08-07 12:08:53.912', '2024-08-07 12:08:53.912'),
(3, '스위트 룸', 'SUITE', '최고급 시설과 서비스를 제공하는 넓은 객실', 2, 50,
ARRAY['https://nhpcrfxpqzfcbuntraaa.supabase.co/storage/v1/object/public/resource/images/Standard_Room.webp'], '
2024-08-07 12:08:53.912', '2024-08-07 12:08:53.912');

-- RoomDetail 테이블 데이터 삽입
INSERT INTO "ROOM_DETAILS" (id, "roomId", "roomNumber", "currentCheckIn", "currentCheckOut", status, "lastCleaned", "
nextCleaning", "createdAt", "updatedAt")
VALUES
(1, 1, '101', NULL, NULL, 'AVAILABLE', '2024-08-07 12:10:45.048', '2024-08-08 12:10:45.048', '2024-08-07 12:10:
45.048', '2024-08-07 12:10:45.048'),
(2, 1, '102', NULL, NULL, 'AVAILABLE', '2024-08-07 12:10:45.048', '2024-08-08 12:10:45.048', '2024-08-07 12:10:
45.048', '2024-08-07 12:10:45.048'),
(3, 2, '201', NULL, NULL, 'AVAILABLE', '2024-08-07 12:10:45.048', '2024-08-08 12:10:45.048', '2024-08-07 12:10:
45.048', '2024-08-07 12:10:45.048'),
(4, 2, '202', NULL, NULL, 'AVAILABLE', '2024-08-07 12:10:45.048', '2024-08-08 12:10:45.048', '2024-08-07 12:10:
45.048', '2024-08-07 12:10:45.048'),
(5, 3, '301', NULL, NULL, 'AVAILABLE', '2024-08-07 12:10:45.048', '2024-08-08 12:10:45.048', '2024-08-07 12:10:
45.048', '2024-08-07 12:10:45.048');

-- RoomPrice 테이블 데이터 삽입
INSERT INTO "ROOM_PRICES" (id, "roomId", "startDate", "endDate", price, type)
VALUES
(1, 1, '2024-01-01 00:00:00.000', '2024-12-31 00:00:00.000', 1000, 'BASE'),
(2, 2, '2024-01-01 00:00:00.000', '2024-12-31 00:00:00.000', 1500, 'BASE'),
(3, 3, '2024-01-01 00:00:00.000', '2024-12-31 00:00:00.000', 2000, 'BASE'),
(4, 1, '2024-07-01 00:00:00.000', '2024-08-31 00:00:00.000', 2500, 'SEASONAL'),
(5, 2, '2024-07-01 00:00:00.000', '2024-08-31 00:00:00.000', 3000, 'SEASONAL'),
(6, 3, '2024-07-01 00:00:00.000', '2024-08-31 00:00:00.000', 3500, 'SEASONAL');

2. `Payment` 테이블:
    - 새 레코드 생성 (환불용)
    - type: 'REFUND'
    - amount: 환불 금액
    - status: 'COMPLETED'

## 4. 취소 정책 상세

### 4.1 정책 개요

- 체크인 14일 이전 취소: 전액 환불 (수수료 없음)
- 체크인 7-13일 전 취소: 총 요금의 10% 수수료
- 체크인 3-6일 전 취소: 총 요금의 30% 수수료
- 체크인 1-2일 전 취소: 총 요금의 50% 수수료
- 체크인 당일 취소 또는 노쇼: 환불 불가 (100% 수수료)

### 4.2 정책 적용 프로세스

1. `CancellationPolicy` 테이블:
    - 각 정책에 대한 레코드 저장
        - daysBeforeCheckin: [14, 7, 3, 1, 0]
        - feePercentage: [0, 10, 30, 50, 100]

2. 취소 요청 시:
    - 체크인 날짜와 취소 요청 날짜의 차이 계산
    - 해당되는 정책 레코드 조회
    - 수수료 계산 및 적용

3. `Booking` 테이블:
    - cancellationFee 필드에 계산된 수수료 저장

4. `Refund` 테이블:
    - amount 필드에 환불 금액 (총 결제액 - 취소 수수료) 저장

### 4.3 특별 케이스 처리

- 부분 취소 (다중 객실 예약의 경우):
    - 각 객실별로 취소 정책 적용
    - `Booking` 테이블의 totalPrice 및 관련 필드 업데이트
    - 부분 환불 처리

- 불가항력적 상황 (천재지변 등):
    - 관리자 재량으로 수수료 면제 가능
    - `BookingStatusHistory`에 특별 처리 사유 기록

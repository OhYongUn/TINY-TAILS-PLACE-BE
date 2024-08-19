--초기 데이터
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
INSERT INTO "ROOM_PRICES" (id, "room_id", "start_date", "end_date", price, type)
VALUES
    (1, 1, '2024-01-01 00:00:00.000', '2024-12-31 00:00:00.000', 1000, 'BASE'),
    (2, 2, '2024-01-01 00:00:00.000', '2024-12-31 00:00:00.000', 1500, 'BASE'),
    (3, 3, '2024-01-01 00:00:00.000', '2024-12-31 00:00:00.000', 2000, 'BASE'),
    (4, 1, '2024-07-01 00:00:00.000', '2024-08-31 00:00:00.000', 2500, 'SEASONAL'),
    (5, 2, '2024-07-01 00:00:00.000', '2024-08-31 00:00:00.000', 3000, 'SEASONAL'),
    (6, 3, '2024-07-01 00:00:00.000', '2024-08-31 00:00:00.000', 3500, 'SEASONAL');

-- 취소 정책 데이터 삽입
INSERT INTO "CANCELLATION_POLICIES" (days_before_checkin, fee_percentage,updated_at)
VALUES
    (14, 0 ,CURRENT_TIMESTAMP),   -- 14일 이전: 전액 환불
    (13, 1,CURRENT_TIMESTAMP ),  -- 7-13일 전: 10% 수수료
    (7, 10 ,CURRENT_TIMESTAMP),   -- 7-13일 전: 10% 수수료
    (6, 30 ,CURRENT_TIMESTAMP),   -- 3-6일 전: 30% 수수료
    (3, 30,CURRENT_TIMESTAMP),   -- 3-6일 전: 30% 수수료
    (2, 50 ,CURRENT_TIMESTAMP),   -- 1-2일 전: 50% 수수료
    (1, 50,CURRENT_TIMESTAMP),   -- 1-2일 전: 50% 수수료
    (0, 100,CURRENT_TIMESTAMP);  -- 당일 또는 노쇼: 100% 수수료
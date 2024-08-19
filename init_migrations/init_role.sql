-- Roles 삽입
INSERT INTO "ROLES" (name, description)
VALUES ('슈퍼관리자', '모든 권한을 가진 최고 관리자'),
       ('호텔 매니저', '일상적인 호텔 운영을 담당하는 관리자'),
       ('카운터 직원', '예약 및 고객 응대를 담당하는 직원'),
       ('청소부', '호텔 청소 및 유지보수 담당');

-- Permissions 삽입
INSERT INTO "PERMISSIONS" (name, description, resource, action)
VALUES ('전체 관리', '모든 시스템 기능에 대한 접근', 'system', 'all'),
       ('예약 조회', '예약 정보 조회', 'reservation', 'read'),
       ('예약 생성', '새로운 예약 생성', 'reservation', 'create'),
       ('예약 수정', '예약 정보 수정', 'reservation', 'update'),
       ('예약 삭제', '예약 정보 삭제', 'reservation', 'delete'),
       ('고객 조회', '고객 정보 조회', 'customer', 'read'),
       ('고객 생성', '새로운 고객 정보 생성', 'customer', 'create'),
       ('고객 수정', '고객 정보 수정', 'customer', 'update'),
       ('고객 삭제', '고객 정보 삭제', 'customer', 'delete'),
       ('직원 관리', '직원 정보 관리', 'employee', 'all'),
       ('청소 일정 조회', '청소 일정 조회', 'cleaning', 'read'),
       ('청소 일정 관리', '청소 일정 생성 및 수정', 'cleaning', 'write');

-- RolePermissions 설정
-- 슈퍼관리자 권한
INSERT INTO "ROLE_PERMISSIONS" (role_id, permission_id)
SELECT r.id, p.id
FROM "ROLES" r,
     "PERMISSIONS" p
WHERE r.name = '슈퍼관리자';

-- 호텔 매니저 권한
INSERT INTO "ROLE_PERMISSIONS" (role_id, permission_id)
SELECT r.id, p.id
FROM "ROLES" r,
     "PERMISSIONS" p
WHERE r.name = '호텔 매니저'
  AND p.name IN
      ('예약 조회', '예약 생성', '예약 수정', '예약 삭제', '고객 조회', '고객 생성', '고객 수정', '고객 삭제', '직원 관리', '청소 일정 조회', '청소 일정 관리');

-- 카운터 직원 권한
INSERT INTO "ROLE_PERMISSIONS" (role_id, permission_id)
SELECT r.id, p.id
FROM "ROLES" r,
     "PERMISSIONS" p
WHERE r.name = '카운터 직원'
  AND p.name IN ('예약 조회', '예약 생성', '예약 수정', '고객 조회', '고객 생성', '고객 수정');

-- 청소부 권한
INSERT INTO "ROLE_PERMISSIONS" (role_id, permission_id)
SELECT r.id, p.id
FROM "ROLES" r,
     "PERMISSIONS" p
WHERE r.name = '청소부'
  AND p.name IN ('청소 일정 조회');

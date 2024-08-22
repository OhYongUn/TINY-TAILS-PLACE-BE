-- Roles 삽입
INSERT INTO "ROLES" (name, description,updated_at)
VALUES ('슈퍼관리자', '모든 권한을 가진 최고 관리자',CURRENT_TIMESTAMP),
       ('호텔 매니저', '일상적인 호텔 운영을 담당하는 관리자',CURRENT_TIMESTAMP),
       ('카운터 직원', '예약 및 고객 응대를 담당하는 직원',CURRENT_TIMESTAMP),
       ('청소부', '호텔 청소 및 유지보수 담당',CURRENT_TIMESTAMP);
-- Permissions 삽입
INSERT INTO "PERMISSIONS" (name, description, resource, action,updated_at)
VALUES ('전체 관리', '모든 시스템 기능에 대한 접근', 'system', 'all',CURRENT_TIMESTAMP),
       ('예약 조회', '예약 정보 조회', 'reservation', 'read',CURRENT_TIMESTAMP),
       ('예약 생성', '새로운 예약 생성', 'reservation', 'create',CURRENT_TIMESTAMP),
       ('예약 수정', '예약 정보 수정', 'reservation', 'update',CURRENT_TIMESTAMP),
       ('예약 삭제', '예약 정보 삭제', 'reservation', 'delete',CURRENT_TIMESTAMP),
       ('고객 조회', '고객 정보 조회', 'customer', 'read',CURRENT_TIMESTAMP),
       ('고객 생성', '새로운 고객 정보 생성', 'customer', 'create',CURRENT_TIMESTAMP),
       ('고객 수정', '고객 정보 수정', 'customer', 'update',CURRENT_TIMESTAMP),
       ('고객 삭제', '고객 정보 삭제', 'customer', 'delete',CURRENT_TIMESTAMP),
       ('직원 관리', '직원 정보 관리', 'employee', 'all',CURRENT_TIMESTAMP),
       ('청소 일정 조회', '청소 일정 조회', 'cleaning', 'read',CURRENT_TIMESTAMP),
       ('청소 일정 관리', '청소 일정 생성 및 수정', 'cleaning', 'write',CURRENT_TIMESTAMP);

-- RolePermissions 설정
-- 슈퍼관리자 권한
INSERT INTO "ROLE_PERMISSIONS" (role_id, permission_id,updated_at)
SELECT r.id, p.id,CURRENT_TIMESTAMP
FROM "ROLES" r,
     "PERMISSIONS" p
WHERE r.name = '슈퍼관리자';

-- 호텔 매니저 권한
INSERT INTO "ROLE_PERMISSIONS" (role_id, permission_id,updated_at)
SELECT r.id, p.id,CURRENT_TIMESTAMP
FROM "ROLES" r,
     "PERMISSIONS" p
WHERE r.name = '호텔 매니저'
  AND p.name IN
      ('예약 조회', '예약 생성', '예약 수정', '예약 삭제', '고객 조회', '고객 생성', '고객 수정', '고객 삭제', '직원 관리', '청소 일정 조회', '청소 일정 관리');

-- 카운터 직원 권한
INSERT INTO "ROLE_PERMISSIONS" (role_id, permission_id,updated_at)
SELECT r.id, p.id,CURRENT_TIMESTAMP
FROM "ROLES" r,
     "PERMISSIONS" p
WHERE r.name = '카운터 직원'
  AND p.name IN ('예약 조회', '예약 생성', '예약 수정', '고객 조회', '고객 생성', '고객 수정');

-- 청소부 권한
INSERT INTO "ROLE_PERMISSIONS" (role_id, permission_id,updated_at)
SELECT r.id, p.id,CURRENT_TIMESTAMP
FROM "ROLES" r,
     "PERMISSIONS" p
WHERE r.name = '청소부'
  AND p.name IN ('청소 일정 조회');

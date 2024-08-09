예약 폼 제출:

클라이언트에서 필요한 모든 정보(체크인/아웃 날짜, 방 종류, 펫 수 등)를 포함하여 서버에 요청을 보냅니다.


Booking 임시 생성:

서버에서 Booking 엔티티를 생성하되, 상태를 'PENDING'으로 설정합니다.
이 시점에서 RoomAvailability를 확인하여 예약 가능한지 검증합니다.


Payment 임시 생성:

Payment 엔티티를 생성하고, 상태를 'PENDING'으로 설정합니다.
amount는 Booking의 totalPrice와 일치해야 합니다.


Booking 및 Payment 정보 반환:

클라이언트에 생성된 Booking과 Payment 정보를 반환합니다.


결제 화면 오픈:

클라이언트에서 결제 게이트웨이로 리다이렉트하거나 팝업을 엽니다.


결제 완료:

사용자가 결제 게이트웨이에서 결제를 완료합니다.


결제 완료 알림:

결제 게이트웨이에서 클라이언트로 결제 완료 정보를 전달합니다.
클라이언트는 이 정보를 서버로 전송합니다.


Booking 상태 업데이트:

서버에서 Booking 상태를 'CONFIRMED'로 업데이트합니다.


Payment 상태 업데이트:

Payment 상태를 'COMPLETED'로 업데이트하고, transactionId를 저장합니다.


RoomAvailability 업데이트:

예약된 날짜에 대해 RoomAvailability의 availableCount를 감소시킵니다.


예약 완료 확인:

클라이언트에 예약 완료 확인 메시지를 전송합니다.
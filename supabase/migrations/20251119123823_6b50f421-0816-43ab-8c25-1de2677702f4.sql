-- registrations 테이블에 누구나 자신의 신청 상태를 취소로 변경할 수 있도록 RLS 정책 추가
CREATE POLICY "Anyone can cancel their own registration"
ON public.registrations
FOR UPDATE
USING (true)
WITH CHECK (status = 'cancelled');
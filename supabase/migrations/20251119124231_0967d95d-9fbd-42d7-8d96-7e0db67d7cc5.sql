-- registrations 테이블에 부서와 직함 컬럼 추가
ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS position TEXT;
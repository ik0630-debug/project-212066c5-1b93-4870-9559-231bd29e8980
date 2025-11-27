
-- 프로젝트 테이블에 소셜 미디어 공유용 메타데이터 컬럼 추가
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS og_title TEXT,
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- 컬럼 설명 추가
COMMENT ON COLUMN projects.og_title IS '소셜 미디어 공유 제목 (Open Graph)';
COMMENT ON COLUMN projects.og_description IS '소셜 미디어 공유 설명 (Open Graph)';
COMMENT ON COLUMN projects.og_image IS '소셜 미디어 공유 이미지 URL (Open Graph)';

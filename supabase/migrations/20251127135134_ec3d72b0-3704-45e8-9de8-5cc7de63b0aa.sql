
-- site_settings의 잘못된 unique constraint 제거 및 올바른 제약조건 추가

-- 기존의 잘못된 unique constraints 제거
ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS site_settings_category_key_key;
ALTER TABLE site_settings DROP CONSTRAINT IF EXISTS site_settings_category_key_unique;

-- 프로젝트별로 (category, key)가 unique하도록 올바른 제약조건 추가
ALTER TABLE site_settings 
ADD CONSTRAINT site_settings_project_category_key_unique 
UNIQUE (project_id, category, key);

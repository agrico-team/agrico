CREATE TABLE IF NOT EXISTS media (
    media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_product_id UUID REFERENCES product ON DELETE CASCADE,
    parent_service_id UUID REFERENCES service ON DELETE CASCADE,
    parent_post_id UUID REFERENCES user_post ON DELETE CASCADE,
    media_path TEXT NOT NULL
);
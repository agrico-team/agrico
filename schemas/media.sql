\c agricodb
CREATE TABLE IF NOT EXISTS media (
    media_id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_product_id UUID NOT NULL REFERENCES product ON DELETE CASCADE,
    parent_service_id UUID NOT NULL REFERENCES service ON DELETE CASCADE,
    parent_post_id UUID NOT NULL REFERENCES post ON DELETE CASCADE,
    media_path TEXT NOT NULL
);
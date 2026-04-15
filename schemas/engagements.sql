\c agricodb

CREATE TABLE IF NOT EXISTS comment (
    comment_id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES account ON DELETE CASCADE,

    parent_product_id UUID REFERENCES product ON DELETE CASCADE,
    parent_service_id UUID REFERENCES service ON DELETE CASCADE,
    parent_profile_id UUID REFERENCES account ON DELETE CASCADE,
    parent_post_id UUID REFERENCES post ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comment ON DELETE CASCADE,

    comment_content TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

    CONSTRAINT comment_target_check CHECK (
        (parent_product_id IS NOT NULL)::integer + 
        (parent_service_id IS NOT NULL)::integer + 
        (parent_product_id IS NOT NULL)::integer +
        (parent_post_id IS NOT NULL)::integer +
        (parent_comment_id IS NOT NULL)::integer = 1
    )
);

CREATE TABLE IF NOT EXISTS impression (
    impression_id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES account ON DELETE CASCADE,

    parent_product_id UUID REFERENCES product ON DELETE CASCADE,
    parent_service_id UUID REFERENCES service ON DELETE CASCADE,
    parent_profile_id UUID REFERENCES account ON DELETE CASCADE,
    parent_post_id UUID REFERENCES post ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comment ON DELETE CASCADE,

    impression TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT impression_target_check CHECK (
        (parent_product_id IS NOT NULL)::integer + 
        (parent_service_id IS NOT NULL)::integer + 
        (parent_product_id IS NOT NULL)::integer +
        (parent_post_id IS NOT NULL)::integer +
        (parent_comment_id IS NOT NULL)::integer = 1
    )
);